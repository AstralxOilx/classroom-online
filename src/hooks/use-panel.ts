import { useParentMessageId } from "@/features/messages/store/use-parent-message-id";
import { useProfileMemberId } from "@/features/members/store/use-profile-member-id";
import { useAssignmentId } from "@/features/assignments/store/use-assignment-id";  
import { useSubmitAssignmentId } from "@/features/submitAssignment/store/use-submit-assignment-id";

export const usePanel = () => {
    const [parentMessageId, setParentMessageId] = useParentMessageId();
    const [profileMemberId, setProfileMemberId] = useProfileMemberId();
    const [assignmentId, setAssignmentId] = useAssignmentId(); 
    const [submitAssignmentId, setSubmitAssignmentId] = useSubmitAssignmentId(); 

    const onOpenProfile = (memberId: string) => {
        setProfileMemberId(memberId);
        setParentMessageId(null); 
        setAssignmentId(null); 
        setSubmitAssignmentId(null);
    }

    const onOpenMessage = (MessageId: string) => {
        setParentMessageId(MessageId); 
        setProfileMemberId(null);
        setAssignmentId(null); 
        setSubmitAssignmentId(null);
    }

    const onAssignment = (assignmentId: string) => {
        setAssignmentId(assignmentId);
        setProfileMemberId(null); 
        setParentMessageId(null); 
        setSubmitAssignmentId(null);
    }

    const onSubmitAssignment = (assignmentId: string) => {
        setSubmitAssignmentId(assignmentId);
        setProfileMemberId(null); 
        setParentMessageId(null); 
        setAssignmentId(null);
    }


    

    const onClose = () => {
        setParentMessageId(null);
        setProfileMemberId(null);
        setAssignmentId(null); 
        setSubmitAssignmentId(null);
    }

    return {
        parentMessageId,
        profileMemberId,
        assignmentId, 
        submitAssignmentId,
        onSubmitAssignment,
        onAssignment,
        onOpenProfile,
        onOpenMessage,
        onClose,
    }
}