import "reflect-metadata"
import { ApolloServer } from "apollo-server-micro";
import { resolvers } from "@generated/type-graphql";
import { buildSchemaSync } from "type-graphql";
import prisma from "../../prisma"

const schema = buildSchemaSync({
  resolvers,
});

export const config = {
  api: {
    bodyParser: false,
  }
}

export default new ApolloServer({ schema, context: () => ({ prisma }) }).createHandler({
  path: "/api/graphql",
});
