"use client";
 
import { usePanel } from "@/hooks/use-panel"; 
import dynamic from "next/dynamic"; 
import { CreateAssignMent } from "./create-assignment";



const Toolbar = dynamic(() =>
    import("@/app/workspace/[workspaceId]/toolbar").then((mod) => mod.Toolbar),
    { ssr: false }
);

interface WorkspaceIdLayoutProps {
    children: React.ReactNode;
}

const WorkspaceIdLayout = ({ children }: WorkspaceIdLayoutProps) => {

    const { parentMessageId, profileMemberId, assignmentId, onClose } = usePanel();

    const showPanel = !!parentMessageId || !!profileMemberId || !!assignmentId;

    return (

        <> 
            {children}
        </>

    );
}

export default WorkspaceIdLayout;