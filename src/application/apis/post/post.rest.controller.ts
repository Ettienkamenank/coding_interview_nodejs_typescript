import { Router, Request, Response, NextFunction } from 'express';
import RestController from '@/utils/interfaces/rest.controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/application/middleware/validation.middleware';
import { authenticatedMiddleware } from '@/application/middleware/authentication.middleware';
import PostWorker from '@/domain/post/worker/post.worker';
import validate from './post.validation';

class PostRestController implements RestController {
    constructor() {
        this.initializeRoutes();
    }

    public path = '/posts';
    public router = Router();
    private postWorker = new PostWorker();

    private initializeRoutes(): void {
        this.router.post(
            `${this.path}/create`,
            validationMiddleware(validate.create),
            authenticatedMiddleware,
            this.create
        );

        this.router.get(
            `${this.path}/get/:id`,
            authenticatedMiddleware,
            this.getPostById
        );

        this.router.get(
            `${this.path}/get-all`,
            authenticatedMiddleware,
            this.getAllPosts
        );

        this.router.get(
            `${this.path}/get-all-published`,
            authenticatedMiddleware,
            this.getPublishedPosts
        );
    }

    private create = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        if (req.user) {
            try {
                const { title, content, published } = req.body;

                const post = await this.postWorker.create(
                    title,
                    content,
                    published,
                    req.user.id
                );

                res.status(201).json({ post });
            } catch (err: any) {
                next(new HttpException(400, err.message));
            }
        } else {
            return next(new HttpException(404, 'No logged user'));
        }
    };

    private getPostById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        if (req.user) {
            try {
                const id = req.params.id;

                const post = await this.postWorker.findOneById(Number(id));

                res.status(200).json({ post });
            } catch (err: any) {
                next(new HttpException(400, err.message));
            }
        } else {
            return next(new HttpException(404, 'No logged user'));
        }
    };

    private getAllPosts = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        if (req.user) {
            try {
                const posts = await this.postWorker.findAll();

                res.status(200).json({ posts });
            } catch (err: any) {
                next(new HttpException(400, err.message));
            }
        } else {
            return next(new HttpException(404, 'No logged user'));
        }
    };

    private getPublishedPosts = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        if (req.user) {
            try {
                const posts = await this.postWorker.findAllPublishedPosts(true);

                res.status(200).json({ posts });
            } catch (err: any) {
                next(new HttpException(400, err.message));
            }
        } else {
            return next(new HttpException(404, 'No logged user'));
        }
    };
}

export default PostRestController;
