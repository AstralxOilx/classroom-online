import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
 

interface UseGetTeacherDashboardDataProps{
    workspaceId: Id<"workspaces">;
};


export const useGetTeacherDashboardData  = ({workspaceId}:UseGetTeacherDashboardDataProps) => {

    const data = useQuery(api.dashboard.getClassroomOverviewForTeacher,{workspaceId});
    const isLoading = data === undefined;

    return {data , isLoading}
};



