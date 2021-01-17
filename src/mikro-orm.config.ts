import { __prod__ } from "./constants";
import { MikroORM } from "@mikro-orm/core";
import { entities } from "./models/EntityInjection";
import path from "path";
require('dotenv').config()

export default {
    dbName: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    user: process.env.DB_USER,
    host: process.env.DB_HOST || 'localhost',
    type: "postgresql",
    entities: entities,
    debug: !__prod__,
    migrations: {
        path: path.join(__dirname, './migrations'),
        pattern: /^[\w-]+\d+\.[tj]s$/,
    }
} as Parameters<typeof MikroORM.init>[0];