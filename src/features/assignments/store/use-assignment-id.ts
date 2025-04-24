import { useQueryState } from 'nuqs';

export const useAssignmentId = () => {
  return useQueryState('assignmentId');
}
