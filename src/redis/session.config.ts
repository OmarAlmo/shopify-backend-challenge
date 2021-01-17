import redis from "redis";
import session, { SessionOptions } from "express-session";
import connecRedis from "connect-redis";
import { COOKIE_NAME, __prod__ } from "../constants";
require('dotenv').config()


const RedisStore = connecRedis(session);
const redisClient = redis.createClient({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: 6379
});


export const sessionConfig : SessionOptions = {
    name: COOKIE_NAME,
    store: new RedisStore({ 
        client: redisClient,
        disableTouch: true,
    }),
    cookie:{
        maxAge: 1000 * 60 * 24, // 1 day
        httpOnly: true,
        sameSite: 'lax', 
        secure: __prod__ // https only
    },
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET || 'super-secret-key',
    resave: false,
}