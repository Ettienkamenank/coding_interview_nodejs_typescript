import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/application/middleware/validation.middleware';
import authenticatedMiddleware from '@/application/middleware/authenticated.middleware';
import UserWorker from '@/domain/user/worker/user.worker';
import RoleWorker from '@/domain/user/worker/role.worker';
import { User } from '@/domain/user/model/user.model';
import validate from './user.validation';
import { Role, RoleType } from '@/domain/user/model/role.model';

class UserController implements Controller {
    constructor() {
        this.initializeRoutes();
    }

    public path = '/users';
    public router = Router();
    private userWorker = new UserWorker();
    private roleWorker = new RoleWorker();

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
            let role: Role | Error;
            let user: User = req.body;

            role = await this.roleWorker.findRoleByName(RoleType.USER);

            if (role instanceof Error) {
                next(new HttpException(400, role.message));
            } else {
                user.roleId = role.id;

                const token = await this.userWorker.createUser(user);

                res.status(201).json({ token });
            }
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

            const token = await this.userWorker.authenticateUser(
                email,
                password
            );

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
