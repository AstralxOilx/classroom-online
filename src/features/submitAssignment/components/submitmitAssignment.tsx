import { AlertCircle, LoaderCircle, Paperclip, XIcon } from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useChannelId } from "@/hooks/use-channel-Id";
import { toast } from "sonner";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import { th } from 'date-fns/locale';
import { useGetSubmitMemberAssignmentById } from "../api/use-get-submit-assignment-id";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useConfirm } from "@/hooks/use-confirm";
import { useCreateFeedback } from "@/features/feedback/api/use-crate-feedback";
import { useGetFeedbackById } from "@/features/feedback/api/use-get-feedback-id";
import { useUpdateFeedback } from "@/features/feedback/api/use-update-feedback";
import { useAllowResubmission } from "@/features/feedback/api/use-update-allow-resubmission";

interface ThreadProps {
    submitAssignmentId: Id<"submitAssignments">;
    onClose: () => void;
}


const TIME_THRESHOLD = 5;


export const SubmitAssignmentById = ({
    submitAssignmentId,
    onClose,
}: ThreadProps) => {

    const router = useRouter();
    const channelId = useChannelId();
    const workspaceId = useWorkspaceId();

    const [FeedbackDialog, confirmFeedback] = useConfirm(
        "ส่งผลการตรวจ?",
        "การกระทำนี้ไม่สามารถย้อนกลับได้!"
    );

    const [UpdateFeedbackDialog, confirmUpdateFeedback] = useConfirm(
        "อัปเดต ข้อเสนอแนะ?",
        "การกระทำนี้ไม่สามารถย้อนกลับได้!"
    );

    const [scoreInspectionResults, setScoreInspectionResults] = useState(10);
    const [feedbackInspectionResults, setFeedbackInspectionResults] = useState('');

    const [updateScoreResults, setUpdateScoreResults] = useState(0);
    const [updateFeedbackResults, setUpdateFeedbackResults] = useState('');

    const { data: currentMember, isLoading: isLoadingCurrentMember } = useCurrentMember({
        workspaceId
    });


    const { mutate: updateFeedback, isPending: isUpdateFeedback } = useUpdateFeedback();
    const { mutate: allowResubmission, isPending: isAllowResubmission } = useAllowResubmission();

    const { mutate: createFeedback, isSuccess, isPending } = useCreateFeedback();

    const { data: feedbackData, isLoading: isLoadingFeedbackByUserId } = useGetFeedbackById({
        submitAssignmentId,
    });


    const { data: submitAssignmentData, isLoading: isLoadingSubmissionByUserId } = useGetSubmitMemberAssignmentById({
        submitAssignmentId,
    });

    useEffect(() => {
        if (!isLoadingCurrentMember && currentMember && currentMember.role !== "teacher") {
            onClose();
        }

    }, [currentMember, isLoadingCurrentMember, onClose]);


    useEffect(() => {
        if (!submitAssignmentData?.feedback) return;

        setUpdateScoreResults(submitAssignmentData.feedback.score);
        setUpdateFeedbackResults(submitAssignmentData.feedback.description);
    }, [submitAssignmentData?.feedback]);



    const downloadFile = async (file: { url: string; name: string }) => {
        const response = await fetch(file.url);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.name;
        a.click();
        window.URL.revokeObjectURL(url);
    };


    const handleSubmitInspectionResults = async () => {
        const ok = await confirmFeedback();
        if (!ok) return;

        // if (!scoreInspectionResults) {
        //     toast.error("เกิดข้อผิดพลาด กรุณาระบุคะแนน!");
        //     return;
        // }

        try {
            createFeedback({
                submitAssignmentId: submitAssignmentId as Id<"submitAssignments">,
                score: scoreInspectionResults,
                description: feedbackInspectionResults,
            });

            toast.success("ส่งผลการตรวจสำเร็จ!");

        } catch (error) {
            toast.error("ส่งผลการตรวจไม่สำเร็จ!");
        }

    }

    const onUpdateFeedback = async () => {

        const ok = await confirmUpdateFeedback();
        if (!ok) return;

        updateFeedback({
            feedbackId: submitAssignmentData?.feedback?._id as Id<"feedback">,
            score: updateScoreResults,
            description: updateFeedbackResults,
        })

    }

    const handleAllowResubmission = async () => {

        const ok = await confirmUpdateFeedback();
        if (!ok) return;

        allowResubmission({
            submitAssignmentId: submitAssignmentId as Id<"submitAssignments">,
        })

    }



    if (isLoadingSubmissionByUserId || isLoadingCurrentMember || isLoadingFeedbackByUserId) {
        return (
            <div className="h-full w-full flex-col">
                <div className="flex justify-between items-center bg-secondary/50 h-[45px] overflow-hidden px-4">
                    <p className="text-lg font-bold">งานที่หมอบหมาย</p>
                    <Button className="cursor-pointer" onClick={onClose} size={"sm"} variant={"ghost"}>
                        <XIcon className="size-5 stroke-[1.5]" />
                    </Button>
                </div>
                <div className="h-full flex justify-center items-center flex-col gap-2 ">
                    <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
                </div>
            </div>
        )
    }




    return (
        <>
            <FeedbackDialog />
            <UpdateFeedbackDialog />
            <div className="flex flex-col h-full">
                <div className="flex justify-between items-center bg-secondary/50 h-[45px] overflow-hidden px-4">
                    <div className="flex gap-1 items-center rounded-sm">
                        <p className="text-md font-semibold p-2 rounded-sm">งานที่หมอบหมาย</p>
                        <div className="p-2">
                            <p>{submitAssignmentData?.assignment?.name}</p>
                        </div>
                    </div>
                    <Button className="cursor-pointer" onClick={onClose} size={"sm"} variant={"ghost"}>
                        <XIcon className="size-5 stroke-[1.5]" />
                    </Button>
                </div>
                <div className="space-y-2 p-2 overflow-y-auto messages-scrollbar">
                    <div className="border p-2 rounded-sm">
                        <p className="text-md font-semibold bg-accent p-2 rounded-sm">ผู้ส่ง</p>
                        <div className="p-2">
                            <p>ชื่อ:{submitAssignmentData?.submitUser?.name}</p>
                            <p>รหัสประจำตัวนักเรียน:{submitAssignmentData?.submitUser?.identificationCode}</p>
                        </div>
                    </div>

                    <div className="border p-2 rounded-sm">
                        <p className="text-md font-semibold bg-accent p-2 rounded-sm">ส่งเมื่อ</p>
                        <div className="p-2">
                            <p>
                                {submitAssignmentData?.submitAssignment?._creationTime
                                    ? format(new Date(submitAssignmentData.submitAssignment._creationTime), "d MMMM yyyy 'เวลา' HH:mm 'น.'", { locale: th })
                                    : "ยังไม่มีข้อมูล"}
                            </p>
                            <p className="text-md text-muted-foreground">
                                สถานะ {
                                    submitAssignmentData?.submitAssignment?.status === "late"
                                        ? "ส่งล่าช้า"
                                        : submitAssignmentData?.submitAssignment?.status === "submitted"
                                            ? "ส่งตรงเวลา"
                                            : submitAssignmentData?.submitAssignment?.status === "canResubmit"
                                                ? "ส่งใหม่"
                                                : "-"
                                }
                            </p>
                        </div>
                    </div>

                    <div className="w-full border p-2 rounded-sm">
                        <div className="flex flex-col space-y-2">
                            <p className="text-md font-semibold bg-accent p-2 rounded-sm">ไฟล์แนบประกอบงานที่หมอบหมาย</p>
                            {submitAssignmentData?.submitFiles.some(f => f.file) ? (
                                submitAssignmentData.submitFiles
                                    .filter(f => f.file)
                                    .map((file) => (
                                        <div key={file.file} className="w-full flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                onClick={() => downloadFile({ url: file.file!, name: file.name })}
                                                className="cursor-pointer flex-1 flex justify-start items-center gap-2"
                                            >
                                                <Paperclip className="size-4" />
                                                {file.name}
                                            </Button>
                                        </div>
                                    ))
                            ) : (
                                <p className="text-sm text-muted-foreground px-2">ไม่มีไฟล์แนบ</p>
                            )}
                        </div>
                    </div>

                    {
                        submitAssignmentData?.feedback ? (
                            <div className="border p-2 rounded-sm">
                                <div className="grid gap-1">
                                    <p>คะแนน</p>
                                    <Input
                                        id="scoreInspectionResults"
                                        name="scoreInspectionResults"
                                        disabled={isUpdateFeedback}
                                        placeholder={feedbackData?.score.toString()}
                                        type="number"
                                        value={updateScoreResults}
                                        onChange={(e) => setUpdateScoreResults(Number(e.target.value))}
                                    />
                                </div>
                                <div className="grid gap-1">
                                    <p>ข้อเสนอแนะ</p>
                                    <textarea
                                        id="feedbackInspectionResults"
                                        name="feedbackInspectionResults"
                                        disabled={isUpdateFeedback}
                                        placeholder={feedbackData?.description}
                                        className="p-2 border rounded-md"
                                        maxLength={255}
                                        value={updateFeedbackResults}
                                        onChange={(e) => setUpdateFeedbackResults(e.target.value)}
                                    />
                                </div>
                                <Button disabled={isUpdateFeedback} className="w-full cursor-pointer mt-2" onClick={onUpdateFeedback}>อัปเดตผลการตรวจ</Button>
                            </div>
                        ) : (
                            <div className="border p-2 rounded-sm">
                                <p className="text-md font-semibold bg-accent p-2 rounded-sm">ความคิดเห็น</p>
                                <div className="w-full p-2 grid gap-1">
                                    <div className="grid gap-1">
                                        <p>คะแนน</p>
                                        <Input
                                            id="scoreInspectionResults"
                                            name="scoreInspectionResults"
                                            disabled={isPending}
                                            placeholder="คะแนน"
                                            type="number"
                                            value={scoreInspectionResults}
                                            onChange={(e) => setScoreInspectionResults(Number(e.target.value))}
                                        />
                                    </div>
                                    <div className="grid gap-1">
                                        <p>ข้อเสนอแนะ</p>
                                        <textarea
                                            id="feedbackInspectionResults"
                                            name="feedbackInspectionResults"
                                            disabled={isPending}
                                            placeholder="ข้อเสนอแนะ"
                                            className="p-2 border rounded-md"
                                            maxLength={255}
                                            value={feedbackInspectionResults}
                                            onChange={(e) => setFeedbackInspectionResults(e.target.value)}
                                        />
                                    </div>
                                    <Button disabled={isPending} className="cursor-pointer mt-2" onClick={handleSubmitInspectionResults}>ส่งผลการตรวจ</Button>
                                </div>
                            </div>
                        )
                    }

                    <div className="w-full border p-2 rounded-sm">
                        <Button
                            onClick={handleAllowResubmission}
                            variant={"outline"}
                            className="w-full cursor-pointer"
                        >ให้นักเรียนส่งใหม่</Button>
                    </div>
                </div>
            </div>
        </>
    )
}