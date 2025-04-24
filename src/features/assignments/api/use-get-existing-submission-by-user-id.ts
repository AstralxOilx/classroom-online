import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";


interface UseGetAssignmentProps {
    assignmentId: Id<"assignments">;
    workspaceId: Id<"workspaces">;
};


export const useGetExistingSubmissionByUserId = ({ assignmentId,workspaceId }: UseGetAssignmentProps) => {

    const data = useQuery(api.submitAssignment.getExistingSubmissionByUserId, { assignmentId,workspaceId });
    const isLoading = data === undefined;

    return { data, isLoading }
};



