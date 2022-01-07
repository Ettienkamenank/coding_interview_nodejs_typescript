import express, { Application, Request, Response, NextFunction } from 'express';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import RestController from '@/utils/interfaces/rest.controller.interface';
import ErrorMiddleware from '@/application/middleware/error.middleware';
import helmet from 'helmet';

interface NamedParameters {
    restControllers: RestController[];
    port: number;
}

class App {
    constructor({ restControllers, port }: NamedParameters) {
        this.app = express();
        this.port = port;

        // this.initializeDatabaseConnection();
        this.initializeMiddleware();
        this.initializeRestControllers(restControllers);
        this.initializeErrorHandling();
    }

    public app: Application;
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
        this.app.use(helmet());
        this.app.use(cors());
        this.app.use(morgan('dev'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(compression());
    }

    private initializeRestControllers(restControllers: RestController[]): void {
        restControllers.forEach((restController: RestController) => {
            this.app.use('/api/v1', restController.router);
        });
    }

    private initializeErrorHandling(): void {
        this.app.use(ErrorMiddleware);
    }

    /**
     * listen
     */
    public listen(): void {
        this.app.listen(this.port, () => {
            console.log(`App listening on port ${this.port}`);
        });
    }
}

export default App;
