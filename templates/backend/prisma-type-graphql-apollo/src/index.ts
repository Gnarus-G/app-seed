import "reflect-metadata"
import { resolvers } from "@generated/type-graphql";
import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";
import { PrismaClient } from ".prisma/client";

const prisma = new PrismaClient();

(async () => {

    const schema = await buildSchema({
        resolvers,
        validate: false,
    });
    
    new ApolloServer({ schema, context: () => ({prisma})})
        .listen({ port: 4000 }, () =>
            console.log('🚀 Server ready at: http://localhost:4000'));
})()