"use client";

import { Sidebar } from "./sidebar";

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { WorkspaceSidebar } from "./workspace-sidebar";
import { usePanel } from "@/hooks/use-panel";
import { LoaderCircle } from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";
import { Thread } from "@/features/messages/components/thread";
import { Profile } from "@/features/members/components/profile";
import dynamic from "next/dynamic";
import { Assignment } from "@/features/assignments/components/assignment";
import { SubmitAssignmentById } from "@/features/submitAssignment/components/submitmitAssignment";



const Toolbar = dynamic(() =>
    import("@/app/workspace/[workspaceId]/toolbar").then((mod) => mod.Toolbar),
    { ssr: false }
);

interface WorkspaceIdLayoutProps {
    children: React.ReactNode;
}

const WorkspaceIdLayout = ({ children }: WorkspaceIdLayoutProps) => {

    const { parentMessageId, profileMemberId, assignmentId, submitAssignmentId, onClose } = usePanel();

    const showPanel = !!parentMessageId || !!profileMemberId || !!assignmentId || !!submitAssignmentId;

    return (

        <>
            <div className="h-full">
                <Toolbar />
                <div className="flex h-[calc(100vh-40px)]">
                    <Sidebar />
                    <ResizablePanelGroup
                        direction="horizontal"
                        autoSaveId={"ca-workspace-layout"}
                    >
                        <ResizablePanel
                            defaultSize={20}
                            minSize={1}
                            className="bg-secondary/30"
                        >
                            <WorkspaceSidebar />
                        </ResizablePanel>
                        <ResizableHandle withHandle />
                        <ResizablePanel
                            minSize={5} defaultSize={80}
                        >
                            {children}
                        </ResizablePanel>
                        {
                            showPanel && (
                                <>
                                    <ResizableHandle withHandle />
                                    <ResizablePanel
                                        minSize={1}
                                        defaultSize={29}
                                    >
                                        {
                                            parentMessageId ? (
                                                <div className="h-full w-full">
                                                    <Thread
                                                        messageId={parentMessageId as Id<"messages">}
                                                        onClose={onClose}
                                                    />
                                                </div>
                                            ) : profileMemberId ? (
                                                <Profile
                                                    memberId={profileMemberId as Id<"members">}
                                                    onClose={onClose}
                                                />
                                            ) : assignmentId ? (
                                                <Assignment
                                                    assignmentId={assignmentId as Id<"assignments">}
                                                    onClose={onClose}
                                                />
                                            ) : submitAssignmentId ? (
                                                <SubmitAssignmentById
                                                    submitAssignmentId ={submitAssignmentId as Id<"submitAssignments">}
                                                    onClose={onClose}
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center">
                                                    <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
                                                </div>
                                            )
                                        }
                                    </ResizablePanel>
                                </>
                            )
                        }
                    </ResizablePanelGroup>

                </div>
            </div>
        </>

    );
}

export default WorkspaceIdLayout;