import { useMemo } from "react";
import { usePaginatedQuery } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";

const BATCH_SIZE = 20;

interface UseGetAssignmentsPublicProps {
  workspaceId: Id<"workspaces">
}

export type GetAssignmentsPublicReturnType = typeof api.assignments.getPublic._returnType["page"];

export const useUpcomingAssignmentsPublic = ({ workspaceId }: UseGetAssignmentsPublicProps) => {
  const now = useMemo(() => new Date().toISOString(), []);  
  const { results, status, loadMore } = usePaginatedQuery(
    api.assignments.getPublic,
    { workspaceId, now }, 
    { initialNumItems: BATCH_SIZE }
  );

  return {
    assignments: results,
    status,
    loadMore: () => loadMore(BATCH_SIZE),
  };
};
