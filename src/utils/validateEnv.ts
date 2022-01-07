import { cleanEnv, str, port } from 'envalid';

function validateEnv(): void {
    cleanEnv(process.env, {
        NODE_ENV: str({
            choices: ['development', 'production'],
        }),
        PORT: port({ default: 3000 }),
        DB_USER: str(),
        DB_PASSWORD: str(),
        DB_HOST: str({ default: 'localhost' }),
        DB_PORT: port({ default: 5432 }),
        DB_NAME: str({ default: 'prismadb' }),
        APP_SECRET: str(),
        JWT_SECRET: str(),
    });
}

export default validateEnv;
