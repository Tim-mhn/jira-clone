import { ProjectMembers } from '../../../../../core/models';

export function filterMembersByNameOrEmail(
  allMembers: ProjectMembers,
  searchText: string
): ProjectMembers {
  if (!searchText) return allMembers;
  const lowerSearchText = searchText.toLowerCase();
  return allMembers?.filter(
    (member) =>
      member.Name?.toLowerCase().includes(lowerSearchText) ||
      member.Email?.toLowerCase().includes(lowerSearchText)
  );
}
