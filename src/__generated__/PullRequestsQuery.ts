/* tslint:disable */
// This file was automatically generated and should not be edited.

import { StatusState } from "./globalTypes";

// ====================================================
// GraphQL query operation: PullRequestsQuery
// ====================================================

export interface PullRequestsQuery_viewer_pullRequests_pageInfo {
  /**
   * When paginating forwards, are there more items?
   */
  hasNextPage: boolean;
  /**
   * When paginating forwards, the cursor to continue.
   */
  endCursor: string | null;
}

export interface PullRequestsQuery_viewer_pullRequests_nodes_repository {
  /**
   * The repository's name with owner.
   */
  nameWithOwner: string;
}

export interface PullRequestsQuery_viewer_pullRequests_nodes_headRef_target_Tree {}

export interface PullRequestsQuery_viewer_pullRequests_nodes_headRef_target_Commit_status_contexts {
  /**
   * The name of this status context.
   */
  context: string;
  /**
   * The state of this status context.
   */
  state: StatusState;
}

export interface PullRequestsQuery_viewer_pullRequests_nodes_headRef_target_Commit_status {
  /**
   * The combined commit status.
   */
  state: StatusState;
  /**
   * The individual status contexts for this commit.
   */
  contexts: PullRequestsQuery_viewer_pullRequests_nodes_headRef_target_Commit_status_contexts[];
}

export interface PullRequestsQuery_viewer_pullRequests_nodes_headRef_target_Commit {
  /**
   * Status information for this commit
   */
  status: PullRequestsQuery_viewer_pullRequests_nodes_headRef_target_Commit_status | null;
}

export type PullRequestsQuery_viewer_pullRequests_nodes_headRef_target = PullRequestsQuery_viewer_pullRequests_nodes_headRef_target_Tree | PullRequestsQuery_viewer_pullRequests_nodes_headRef_target_Commit;

export interface PullRequestsQuery_viewer_pullRequests_nodes_headRef {
  /**
   * The object the ref points to.
   */
  target: PullRequestsQuery_viewer_pullRequests_nodes_headRef_target;
}

export interface PullRequestsQuery_viewer_pullRequests_nodes {
  id: string;
  /**
   * The repository associated with this node.
   */
  repository: PullRequestsQuery_viewer_pullRequests_nodes_repository;
  /**
   * Identifies the head Ref associated with the pull request.
   */
  headRef: PullRequestsQuery_viewer_pullRequests_nodes_headRef | null;
}

export interface PullRequestsQuery_viewer_pullRequests {
  /**
   * Information to aid in pagination.
   */
  pageInfo: PullRequestsQuery_viewer_pullRequests_pageInfo;
  /**
   * A list of nodes.
   */
  nodes: (PullRequestsQuery_viewer_pullRequests_nodes | null)[] | null;
}

export interface PullRequestsQuery_viewer {
  /**
   * A list of pull requests associated with this user.
   */
  pullRequests: PullRequestsQuery_viewer_pullRequests;
}

export interface PullRequestsQuery {
  /**
   * The currently authenticated user.
   */
  viewer: PullRequestsQuery_viewer;
}
