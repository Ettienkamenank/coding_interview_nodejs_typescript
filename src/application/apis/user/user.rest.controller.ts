import { Router, Request, Response, NextFunction } from 'express';
import RestController from '@/utils/interfaces/rest.controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/application/middleware/validation.middleware';
import {
    authenticatedMiddleware,
    unauthenticatedMiddleware,
} from '@/application/middleware/authentication.middleware';
import UserWorker from '@/domain/user/worker/user.worker';
import RoleWorker from '@/domain/user/worker/role.worker';
import { User } from '@/domain/user/model/user.model';
import { Role, RoleType } from '@/domain/user/model/role.model';
import validate from './user.validation';

class UserRestController implements RestController {
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
            unauthenticatedMiddleware,
            this.register
        );

        this.router.post(
            `${this.path}/login`,
            validationMiddleware(validate.login),
            unauthenticatedMiddleware,
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
            let user: User = req.body;

            /**
             * Check email uniqueness
             */
            let isEmailTaken: Boolean | Error =
                await this.userWorker.isEmailAlreadyTaken(user.email);

            if (isEmailTaken instanceof Error) {
                return next(new HttpException(400, isEmailTaken.message));
            } else {
                if (isEmailTaken) {
                    return next(
                        new HttpException(400, 'Email address already used')
                    );
                }
            }

            /**
             * Check username uniqueness
             */
            let isUsernameTaken: Boolean | Error =
                await this.userWorker.isUsernameAlreadyTaken(user.username);

            if (isUsernameTaken instanceof Error) {
                return next(new HttpException(400, isUsernameTaken.message));
            } else {
                if (isUsernameTaken) {
                    return next(
                        new HttpException(400, 'Username already used')
                    );
                }
            }

            /**
             * Try to save user
             */
            let role: Role | Error;
            role = await this.roleWorker.findRoleByName(RoleType.USER);

            if (role instanceof Error) {
                return next(new HttpException(400, role.message));
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
            const { username, password } = req.body;

            const token = await this.userWorker.authenticateUser(
                username,
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

export default UserRestController;
