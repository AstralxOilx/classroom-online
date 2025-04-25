import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
 

interface UseGetAttendanceStudentProps{
    workspaceId: Id<"workspaces">;
};


export const useGetAttendanceStudentProps = ({workspaceId}:UseGetAttendanceStudentProps) => {

    const data = useQuery(api.dashboard.getAttendanceStatus,{workspaceId});
    const isLoading = data === undefined;

    return {data , isLoading}
};



