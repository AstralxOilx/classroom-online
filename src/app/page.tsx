"use client"

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";
import { useGetWorkspaces } from "@/features/workspaces/api/user-get-workspaces";
import { UserButton } from "@/features/auth/components/user-button";
import { LoaderCircle } from "lucide-react";

export default function Home() {

  const router = useRouter();

  const [open, setOpen] = useCreateWorkspaceModal();

  const { data, isLoading } = useGetWorkspaces();

  const workspacesId = useMemo(() => data?.[0]?._id, [data]);



  useEffect(() => {
    if (isLoading) return;

    if (workspacesId) {
      router.replace(`/workspace/${workspacesId}`)
    } else if (!open) {
      setOpen(true);
    }

  }, [workspacesId, isLoading, setOpen])

  return (
    <div className="h-full flex-1 flex justify-center items-center flex-col gap-2">
      <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
}
