import ApolloClient from "apollo-boost";
import gql from "graphql-tag";
import fetch from "node-fetch";
import {
  PullRequestsQuery,
  PullRequestsQuery_viewer_pullRequests_nodes_headRef_target as GitObject,
  PullRequestsQuery_viewer_pullRequests_nodes_headRef_target_Commit as Commit
} from "./__generated__/PullRequestsQuery";
import { StatusState } from "./__generated__/globalTypes";
import Worker from "./worker";

require("dotenv").config();

const client = new ApolloClient({
  uri: "https://api.github.com/graphql",
  headers: {
    Authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}`
  },
  fetch
});

const worker = new Worker(client);

const query = gql`
  query PullRequestsQuery {
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

const RETRYABLE_STATUSES = ["ci/jenkins", "ci/teamcity"];

async function work() {
  let result = await client.query<PullRequestsQuery>({ query });
  const nodes = result.data.viewer.pullRequests.nodes;
  if (nodes !== null) {
    nodes.forEach(node => {
      if (node !== null) {
        const {
          id,
          repository: { nameWithOwner: repo },
          headRef
        } = node;
        if (headRef !== null) {
          const target = headRef.target;
          if (isCommit(target)) {
            const { status } = target;
            if (status !== null) {
              const { state, contexts } = status;
              if (state === StatusState.FAILURE) {
                let ops = contexts
                  .filter(
                    context =>
                      context.state === StatusState.FAILURE &&
                      context.context &&
                      RETRYABLE_STATUSES.includes(context.context)
                  )
                  .map(context => retry(id, context.context));
                Promise.all(ops);
              }
            }
          }
        }
      }
    });
  }
}

async function retry(id: string, context: string) {
  switch (context) {
    case "ci/jenkins":
    // "jenkins test"
    case "ci/teamcity":
    // "teamcity test"
  }
  Promise.resolve(true);
}
