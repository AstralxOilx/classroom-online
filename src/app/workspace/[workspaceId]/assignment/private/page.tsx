"use client";

import { useRouter } from "next/navigation";

import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { AssignmentList } from "../assignment-list";
import { useUpcomingAssignmentsUpcoming } from "@/features/assignments/api/use-get-assignments-upcoming";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { AlertTriangle, LoaderCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const PrivateAssignment = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const { assignments, status, loadMore } = useUpcomingAssignmentsUpcoming({ workspaceId });

  const { data: currentMember, isLoading: isLoadingCurrentMember } = useCurrentMember({
    workspaceId
  });
  
  useEffect(() => {
    if (!currentMember || !workspaceId) return; // รอให้ข้อมูลโหลดก่อน
  
    if (currentMember.role !== "teacher") {
      router.replace(`/workspace/${workspaceId}`);
    }
  }, [currentMember, workspaceId]);
  
  if (!currentMember || !workspaceId || isLoadingCurrentMember || status === "LoadingFirstPage") {
    return (
      <div className="h-full flex-1 flex justify-center items-center flex-col gap-2 ">
        <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  


  return (
    <>

      <div className="flex flex-col h-full py-4">
        <AssignmentList
          assignments={assignments}
          status={status}
          loadMore={loadMore}
        />
      </div>
    </>
  );
};

export default PrivateAssignment;
