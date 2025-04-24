import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
 

interface UseGetAttendanceSessionProps{
    workspaceId: Id<"workspaces">;
};


export const useGetAttendanceSession = ({workspaceId}:UseGetAttendanceSessionProps) => {

    const data = useQuery(api.attendance.getAttendanceSession,{workspaceId});
    const isLoading = data === undefined;

    return {data , isLoading}
};



