import prisma from '@/infrastructure/config/prisma.config';
import { Post } from '@prisma/client';
import PostDomain from '@/domain/post/port/post.domain';

class PostWorker implements PostDomain {
    /**
     * Create a new post
     */
    public async create(
        title: string,
        content: string,
        published: boolean,
        authorId: number
    ): Promise<Post | Error> {
        try {
            const post = await prisma.post.create({
                data: { title, content, published, authorId },
            });

            return post;
        } catch (error) {
            throw new Error('Unable to create post');
        }
    }

    /**
     * Find a post by is id
     */
    public async findOneById(id: number): Promise<Post | Error> {
        try {
            const post = await prisma.post.findUnique({
                where: { id: Number(id) },
            });

            if (post) {
                return post;
            } else {
                throw new Error('Unable to find post with this id');
            }
        } catch (err: any) {
            throw new Error(err);
        }
    }

    /**
     * Find all posts
     */
    public async findAll(): Promise<Post[] | Error> {
        try {
            const posts = await prisma.post.findMany();

            if (posts) {
                return posts;
            } else {
                throw new Error('Unable to fetch posts');
            }
        } catch (err: any) {
            throw new Error(err);
        }
    }

    /**
     * Find all published posts
     */
    public async findAllPublishedPosts(
        published: boolean
    ): Promise<Post[] | Error> {
        try {
            const posts = await prisma.post.findMany({
                where: { published: true },
            });

            if (posts.length > 0) {
                return posts;
            } else {
                throw new Error('Unable to fetch posts');
            }
        } catch (err: any) {
            throw new Error(err);
        }
    }
}

export default PostWorker;
