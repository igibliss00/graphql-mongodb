const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
// when we build our schema as string, graphqlHttp does the heavylifting
// of converting it to JavaScript
// it will generate graphql schema object based on our written schema
const mongoose = require('mongoose');

const graphqlSchema = require('./graphql/schema/index');
const graphqlResolvers = require('./graphql/resolvers/index');

const app = express();

app.use(bodyParser.json());


app.use(
  '/graphql',
  graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true
  })
);

mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-ukwqx.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`, { useNewUrlParser: true }
)
.then(() => {
    app.listen(3000, console.log("now listening for requests on port 3000"));
})
.catch(err => {
    console.log("Error occurred during Mongoose connect", err);
});

