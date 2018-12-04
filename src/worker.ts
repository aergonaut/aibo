import ApolloClient from "apollo-boost";
import gql from "graphql-tag";
import {
  PullRequestsQuery,
  PullRequestsQuery_viewer_pullRequests_nodes_headRef_target as GitObject,
  PullRequestsQuery_viewer_pullRequests_nodes_headRef_target_Commit as Commit
} from "./__generated__/PullRequestsQuery";
import { StatusState } from "./__generated__/globalTypes";

class Worker<T> {
  client: ApolloClient<T>;

  constructor(client: ApolloClient<T>) {
    this.client = client;
  }

  async work() {
    let result = await this.client.query<PullRequestsQuery>({ query });
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
                        RETRYABLE_STATES.includes(context.state) &&
                        context.context &&
                        RETRYABLE_CONTEXTS.includes(context.context)
                    )
                    .map(context => this.retry(id, context.context));
                  Promise.all(ops);
                }
              }
            }
          }
        }
      });
    }
  }

  async retry(id: string, context: string) {
    switch (context) {
      case "ci/jenkins-unit":
        console.log(`jenkins test --> ${id}`);
        break;
      case "ci/teamcity":
        console.log(`teamcity test --> ${id}`);
        break;
    }
    Promise.resolve(true);
  }
}

const RETRYABLE_STATES = [StatusState.FAILURE, StatusState.ERROR];
const RETRYABLE_CONTEXTS = ["ci/jenkins-unit", "ci/teamcity"];

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

const mutation = gql`
  mutation AddComment($input: AddCommentInput!) {
    addComment(input: $input) {
      commentEdge {
        node {
          url
        }
      }
    }
  }
`;

export default Worker;

function isCommit(target: GitObject): target is Commit {
  return (<Commit>target).status !== undefined;
}
