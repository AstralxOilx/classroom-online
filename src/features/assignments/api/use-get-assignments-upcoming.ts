import { useMemo } from "react";
import { usePaginatedQuery } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";

const BATCH_SIZE = 20;

interface UseGetAssignmentsUpcomingProps {
  workspaceId: Id<"workspaces">
}

export type GetAssignmentsUpcomingReturnType = typeof api.assignments.getUpcoming._returnType["page"];

export const useUpcomingAssignmentsUpcoming = ({ workspaceId }: UseGetAssignmentsUpcomingProps) => {
  const now = useMemo(() => new Date().toISOString(), []);  
  const { results, status, loadMore } = usePaginatedQuery(
    api.assignments.getUpcoming,
    { workspaceId, now }, 
    { initialNumItems: BATCH_SIZE }
  );

  return {
    assignments: results,
    status,
    loadMore: () => loadMore(BATCH_SIZE),
  };
};
