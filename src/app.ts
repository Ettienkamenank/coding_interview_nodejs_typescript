import express, { Application, Request, Response, NextFunction } from 'express';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import Controller from '@/utils/interfaces/controller.interface';
import ErrorMiddleware from '@/application/middleware/error.middleware';
import helmet from 'helmet';

class App {
    constructor(controllers: Controller[], port: number) {
        this.express = express();
        this.port = port;

        // this.initializeDatabaseConnection();
        this.initializeMiddleware();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    }

    public express: Application;
    public port: number;

    // private initializeDatabaseConnection(): void {
    //     this.express.use(
    //         async (req: Request, res: Response, next: NextFunction) => {
    //             await TryDBConnect(() => {
    //                 res.json({
    //                     error: 'Database connection error, please try again later',
    //                 });
    //             }, next);
    //         }
    //     );
    // }

    private initializeMiddleware(): void {
        this.express.use(helmet());
        this.express.use(cors());
        this.express.use(morgan('dev'));
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
        this.express.use(compression());
    }

    private initializeControllers(controllers: Controller[]): void {
        controllers.forEach((controller: Controller) => {
            this.express.use('/api/v1', controller.router);
        });
    }

    private initializeErrorHandling(): void {
        this.express.use(ErrorMiddleware);
    }

    /**
     * listen
     */
    public listen(): void {
        this.express.listen(this.port, () => {
            console.log(`App listening on port ${this.port}`);
        });
    }
}

export default App;
