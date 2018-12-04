import ApolloClient from "apollo-boost";
import {
  PullRequestsQuery,
  PullRequestsQuery_viewer_pullRequests_nodes_headRef_target as GitObject,
  PullRequestsQuery_viewer_pullRequests_nodes_headRef_target_Commit as Commit
} from "./__generated__/PullRequestsQuery";

class Worker<T> {
  client: ApolloClient<T>;

  constructor(client: ApolloClient<T>) {
    this.client = client;
  }
}

export default Worker;

function isCommit(target: GitObject): target is Commit {
  return (<Commit>target).status !== undefined;
}
