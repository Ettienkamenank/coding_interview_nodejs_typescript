import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/application/middleware/validation.middleware';
import authenticatedMiddleware from '@/application/middleware/authenticated.middleware';
import UserWorker from '@/domain/user/worker/user.worker';
import validate from './user.validation';

class UserController implements Controller {
    constructor() {
        this.initializeRoutes();
    }

    public path = '/users';
    public router = Router();
    private userWorker = new UserWorker();

    private initializeRoutes(): void {
        this.router.post(
            `${this.path}/register`,
            validationMiddleware(validate.register),
            this.register
        );

        this.router.post(
            `${this.path}/login`,
            validationMiddleware(validate.login),
            this.login
        );

        this.router.get(`${this.path}`, authenticatedMiddleware, this.getUser);
    }

    private register = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { name, email, username, password } = req.body;

            const token = await this.userWorker.register(
                name,
                email,
                username,
                password
            );

            res.status(201).json({ token });
        } catch (err: any) {
            next(new HttpException(400, err.message));
        }
    };

    private login = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { email, password } = req.body;

            const token = await this.userWorker.login(email, password);

            res.status(200).json({ token });
        } catch (err: any) {
            next(new HttpException(400, err.message));
        }
    };

    private getUser = (
        req: Request,
        res: Response,
        next: NextFunction
    ): Response | void => {
        if (!req.user) {
            return next(new HttpException(404, 'No logged user'));
        }

        res.status(200).json({ user: req.user });
    };
}

export default UserController;
