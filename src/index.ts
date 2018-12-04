import ApolloClient from "apollo-boost";
import fetch from "node-fetch";
import Worker from "./worker";

require("dotenv").config();

const client = new ApolloClient({
  uri: "https://api.github.com/graphql",
  headers: {
    Authorization: `token ${process.env.AIBO_GITHUB_ACCESS_TOKEN}`
  },
  fetch
});

const worker = new Worker(client);
worker
  .work()
  .then(() => console.log("done"))
  .catch(error => console.log(error));
