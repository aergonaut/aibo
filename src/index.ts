import ApolloClient from "apollo-boost";
import gql from "graphql-tag";
import fetch from "node-fetch";

require("dotenv").config();

const client = new ApolloClient({
  uri: "https://api.github.com/graphql",
  headers: {
    Authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}`
  },
  fetch
});

const query = gql`
  query {
    viewer {
      pullRequests(states: [OPEN], first: 50) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          repository {
            nameWithOwner
          }
          headRef {
            target {
              ... on Commit {
                status {
                  state
                  contexts {
                    context
                    state
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

client.query({ query }).then(result => console.log(result.data));
