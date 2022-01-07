import 'reflect-metadata';
import 'dotenv/config';
import 'module-alias/register';
import * as util from 'util';
import validateEnv from './utils/validateEnv';
import App from './app';
import UserRestController from '@/application/apis/user/user.rest.controller';
import PostRestController from '@/application/apis/post/post.rest.controller';
import prisma from '@/infrastructure/config/prisma.config';

validateEnv();

const app = new App({
    restControllers: [new UserRestController(), new PostRestController()],
    port: Number(process.env.PORT),
});

app.listen();

/**
 * Handling exceptions
 */
process.on('uncaughtException', function (err) {
    console.error(`I've crashed!!! - ${err.stack || err}`);
});

process.on('unhandledRejection', (reason, p) => {
    console.error(
        `Unhandled Rejection at: ${util.inspect(p)} reason: ${reason}`
    );
});

async function catchProcessDeath() {
    await prisma
        .$disconnect()
        .then(() => console.log('Prisma disconnected from database ...'))
        .catch((err) => console.log(err));
    process.exit(0);
}

process.on('SIGTERM', catchProcessDeath);
process.on('SIGINT', catchProcessDeath);
process.on('SIGHUP', catchProcessDeath);
process.on('exit', () => {
    console.log('Exiting...');
});
