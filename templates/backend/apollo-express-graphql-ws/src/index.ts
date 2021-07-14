import express from 'express';
import useAppollo from './useApollo';

const typeDefs = `
  type Query {
    hello: String
  }
  type Subscription {
    greetings: String
  }
`
async function* sayHiIn5Languages() {
    for (const hi of ['Hi', 'Bonjour', 'Hola', 'Ciao', 'Zdravo']) {
        await new Promise(res => setTimeout(res, 1000));
        yield { greetings: hi };
    }
}

const roots = {
    Query: {
        hello: () => 'Hello World!',
    },
    Subscription: {
        greetings: {
            subscribe: () => sayHiIn5Languages()
        },
    },
};

const PORT = 4000;

useAppollo({ app: express(), typeDefs, resolvers: roots }).listen(PORT, () => {
    console.log("Server listening on http://localhost:" + PORT);
})