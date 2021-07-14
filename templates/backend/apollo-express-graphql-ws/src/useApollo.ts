import { ApolloServer, buildSchemaFromTypeDefinitions, ExpressContext, IResolvers } from "apollo-server-express";
import e from "express";
import { GRAPHQL_TRANSPORT_WS_PROTOCOL } from "graphql-ws";
import { useServer } from "graphql-ws/lib/use/ws";
import http, { Server } from "http";
import { GraphQLSchema } from "graphql";
import { GRAPHQL_WS } from "subscriptions-transport-ws";
import WebSocket from "ws";

interface GraphqlContext extends ApplicationContext {
    req: e.Request
    res: e.Response
}

type Config = {
    app: e.Application,
    path?: string,
    appContext?: ApplicationContext
}

type SchemaFirstConfig = {
    typeDefs: string,
    resolvers: IResolvers | IResolvers[]
} & Config

type CodeFirstConfig = {
    schema: GraphQLSchema,
} & Config

/**
 * @returns an http server configured with graphql-ws and, for backwards compatibility
 * with the apollo playground or some other frontend, subscriptions-transport-ws.
 */
export default function useAppollo(config: SchemaFirstConfig): Server;
export default function useAppollo(config: CodeFirstConfig): Server;
export default function useAppollo(config: any) {
    const { app, path = "/graphql", appContext, typeDefs, resolvers } = config;

    const schema = getOrBuildSchemaFrom(config);

    const context: (c: ExpressContext) => object =
        ({ req, res }): GraphqlContext => ({ ...appContext, req, res });

    const apollo = new ApolloServer({
        schema: isSchemaFirst(config) ? undefined : schema,
        typeDefs,
        resolvers,
        tracing: process.env.NODE_ENV !== "production",
        context
    });

    apollo.applyMiddleware({
        app, path, cors: {
            credentials: true,
            origin: process.env.WEB_ORIGIN
        }
    })

    const graphqlWs = new WebSocket.Server({ noServer: true });
    useServer({ schema, roots: resolvers, context }, graphqlWs);

    const subTransWs = new WebSocket.Server({ noServer: true });
    apollo.installSubscriptionHandlers(subTransWs)

    const server = http.createServer(app);

    // listen for upgrades and delegate requests according to the WS subprotocol
    server.on('upgrade', (req, socket, head) => {
        // extract websocket subprotocol from header
        const protocol = req.headers['sec-websocket-protocol'];
        const protocols = Array.isArray(protocol)
            ? protocol
            : protocol?.split(',').map((p: string) => p.trim());

        // decide which websocket server to use
        const wss =
            protocols?.includes(GRAPHQL_WS) && // subscriptions-transport-ws subprotocol
                !protocols.includes(GRAPHQL_TRANSPORT_WS_PROTOCOL) // graphql-ws subprotocol
                ? subTransWs
                : // graphql-ws will welcome its own subprotocol and
                // gracefully reject invalid ones. if the client supports
                // both transports, graphql-ws will prevail
                graphqlWs;
        wss.handleUpgrade(req, socket, head, (ws) => {
            wss.emit('connection', ws, req);
        });
    });

    return server;
}

function getOrBuildSchemaFrom(config: SchemaFirstConfig | CodeFirstConfig) {
    if (isSchemaFirst(config))
        return buildSchemaFromTypeDefinitions(config.typeDefs);
    return config.schema;
}

function isSchemaFirst(config: any): config is SchemaFirstConfig {
    return "typeDefs" in config;
}