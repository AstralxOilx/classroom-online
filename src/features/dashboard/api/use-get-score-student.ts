import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
 

interface UseGetScoreStudentProps{
    workspaceId: Id<"workspaces">;
};


export const useGetScoreStudent = ({workspaceId}:UseGetScoreStudentProps) => {

    const data = useQuery(api.dashboard.getScore,{workspaceId});
    const isLoading = data === undefined;

    return {data , isLoading}
};



