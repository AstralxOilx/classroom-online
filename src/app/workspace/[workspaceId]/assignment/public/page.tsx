"use client";

import { useRouter } from "next/navigation";

import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { AssignmentList } from "../assignment-list";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { AlertTriangle, LoaderCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUpcomingAssignmentsPublic } from "@/features/assignments/api/use-get-assignments-public";

const PublicAssignment = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const { assignments, status, loadMore } = useUpcomingAssignmentsPublic({ workspaceId });

  const { data: currentMember, isLoading: isLoadingCurrentMember } = useCurrentMember({
    workspaceId
  });

  if (isLoadingCurrentMember || status === "LoadingFirstPage") {
    return (
      <div className="h-full flex-1 flex justify-center items-center flex-col gap-2 ">
        <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  if (!currentMember) {
    return (
      <div className="flex flex-col gap-y-2 h-full items-center justify-center">
        <AlertTriangle className="size-8 text-red-700" />
        <p className="text-red-700 text-sm">
          ไม่พบข้อมูล ลองใหม่อีกครั้ง!
        </p>
        <Button
          variant={"outline"}
          onClick={() => router.replace("/")}
          className="cursor-pointer"
        >
          <RefreshCcw />
          Refresh Data
        </Button>
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

export default PublicAssignment;
