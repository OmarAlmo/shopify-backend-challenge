import "reflect-metadata"
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { resolvers } from "./graphql/ResolverInjection";
import session from"express-session";
import { sessionConfig } from "./redis/session.config";
import cors from 'cors';
require('dotenv').config()

const PORT = process.env.PORT || 3000;

const main = async () => {
    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up();

    const app = express();  
    
    app.use(cors({
        origin: 'http://localhost:3001',
        credentials: true
    }))

    app.use(session(sessionConfig));

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: resolvers,
            validate: false
        }),
        context: ({req, res}) => ({ em: orm.em, req, res})

    })
    apolloServer.applyMiddleware({ 
        app,
        cors: false
    });

    app.get('/', ((_, res) => { res.end()}))
    
    app.listen(PORT, () => {
        console.log(`Server started on localhost:${PORT}`)
    })
};

main().catch((err) => {
    console.log("ERROR---\n")
    console.log(err)
})