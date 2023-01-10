export const UNASSIGNED_TASK_ID_DTO = '';

export function handleNullAssigneeId<T extends { assigneeId?: string }>(
  dto: T
): T {
  return { ...dto, assigneeId: dto.assigneeId || UNASSIGNED_TASK_ID_DTO };
}
