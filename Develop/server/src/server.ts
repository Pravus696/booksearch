import express from 'express';
import path from 'node:path';
import { ApolloServer } from 'apollo-server';
import { typeDefs, resolvers } from './schema/index';
import db from './config/connection';
import routes from './routes';
import { authenticateGraphQL } from './services/auth';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ user: authenticateGraphQL({ req }), req }),
});

server.start().then(() => {
  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });

  db.once('open', () => {
    app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}${server.graphqlPath}`));
  });
});