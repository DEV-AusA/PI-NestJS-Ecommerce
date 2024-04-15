import { registerAs } from '@nestjs/config';
import {config as dotenvConfig} from '../node_modules/dotenv/lib/main';
import { DataSource, DataSourceOptions } from '../node_modules/typeorm';

dotenvConfig({ path: '.development.env' });

const config = {
    type: "postgres",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME_TEST,
    dropSchema: true,
    synchronize: true,
    // logging: true, // ["error"], <= solo muestre errores de la DB
    subscribers: [],
    entities: ['./src/**/*.entity{.ts,.js}'],
    // entities: [Products, Orders, OrderDetails, User],
    migrations: ['dist/migrations/*{.ts,.js}'],
    timestamp: "timestamp-z",
}
// para el load: [typeormConfig] del module main
export default registerAs('typeormTest', () => config);

export const connectionSource = new DataSource(config as DataSourceOptions);