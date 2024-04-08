import { registerAs } from '@nestjs/config';
import {config as dotenvConfig} from 'dotenv'
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.development.env' });

const config = {
    type: "postgres",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dropSchema: true, // <= esta propiedad borra toda la DB si esta activado
    synchronize: true,
    logging: true, // ["error"], <= solo muestre errores de la DB
    subscribers: [],
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/migrations/*{.ts,.js}'],
    timestamp: "timestamp-z",
}
// para el load: [typeormConfig] del module main
export default registerAs('typeorm', () => config);

export const  connectionSource = new DataSource(config as DataSourceOptions);