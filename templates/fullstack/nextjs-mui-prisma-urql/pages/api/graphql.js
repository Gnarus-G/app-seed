import "reflect-metadata";
import { resolvers } from "@generated/type-graphql";
import { buildSchemaSync } from "type-graphql";
import prisma from "../../prisma";
import microCors from "micro-cors";
import { graphqlHTTP } from "express-graphql";

const schema = buildSchemaSync({ resolvers });

const cors = microCors();

module.exports = cors((req, res) =>
  req.method === "OPTIONS"
    ? res.send("ok")
    : graphqlHTTP({ schema, context: { prisma }, graphiql: true })(req, res)
);

export const config = { api: { bodyParser: false } };
