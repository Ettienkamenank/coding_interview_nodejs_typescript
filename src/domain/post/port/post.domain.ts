import { Post } from '@prisma/client';

export default interface PostDomain extends IManagePost {}

interface IManagePost {
    create(
        title: string,
        content: string,
        published: boolean,
        authorId: number
    ): Promise<Post | Error>;

    findOneById(id: number): Promise<Post | Error>;

    findAll(): Promise<Post[] | Error>;

    findAllPublishedPosts(published: boolean): Promise<Post[] | Error>;
}
