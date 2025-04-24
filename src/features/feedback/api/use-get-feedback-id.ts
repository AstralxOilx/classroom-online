import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
 

interface UseGetFeedbackByIdProps{
    submitAssignmentId: Id<"submitAssignments">; 
};


export const useGetFeedbackById = ({submitAssignmentId}:UseGetFeedbackByIdProps) => {

    const data = useQuery(api.feedback.getFeedbackById,{submitAssignmentId});
    const isLoading = data === undefined;

    return {data , isLoading}
};



