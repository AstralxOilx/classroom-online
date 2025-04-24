

import { format } from "date-fns";
import { th } from "date-fns/locale";
import { LoaderCircle } from "lucide-react";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { usePanel } from "@/hooks/use-panel";
import { GetAssignmentsUpcomingReturnType } from "@/features/assignments/api/use-get-assignments-upcoming";


interface  AssignmentListProps { 
    status?: string; 
    assignments: GetAssignmentsUpcomingReturnType | undefined;
    loadMore: () => void; 
};




export const AssignmentList = ({status,assignments,loadMore}:AssignmentListProps) => {
    // const workspaceId = useWorkspaceId();
    // const { assignments, status, loadMore } = useUpcomingAssignments({ workspaceId });
    // const loaderRef = useRef<HTMLDivElement | null>(null);


    const {onAssignment} = usePanel();

    const groupedAssignments = assignments?.reduce((groups, assignment) => {
        const date = new Date(assignment.dueDate);
        const dateKey = format(date, "yyyy-MM-dd");

        if (!groups[dateKey]) {
            groups[dateKey] = [];
        }
        groups[dateKey].push(assignment);
        return groups;
    }, {} as Record<string, typeof assignments>);


    // console.log(assignments)

    if (status === "LoadingFirstPage") {
        return (
            <div className="h-full flex-1 flex justify-center items-center flex-col gap-2">
                <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col p-4 overflow-y-auto messages-scrollbar">
            {Object.entries(groupedAssignments || {}).map(([dateKey, assignments]) => (
                <div key={dateKey}>
                    {assignments.map((assignment) => (
                        <div key={assignment._id}
                            className="p-2 rounded-sm border mb-2 cursor-pointer hover:bg-accent"
                            onClick={() => onAssignment(assignment._id)}
                        >
                            <p className="text-sm font-medium">{assignment.name}</p>
                            <div className="flex gap-2">
                                <p className="text-xs text-muted-foreground">
                                    แผยแพร่: {format(new Date(assignment.publishDate), "d MMM yyyy", { locale: th })}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    ส่งภายใน: {format(new Date(assignment.dueDate), "d MMM yyyy", { locale: th })}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ))}

            <div
                className="h-1 "
                ref={(el) => {
                    if (el) {
                        const observer = new IntersectionObserver(
                            ([entry]) => {
                                if (entry.isIntersecting) {
                                    loadMore();
                                }
                            },
                            { threshold: 1.0 }
                        );

                        observer.observe(el);
                        return () => observer.disconnect();
                    }
                }}
            />
        </div>
    );
};
