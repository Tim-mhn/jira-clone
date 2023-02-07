import {
  Project,
  ProjectMember,
  ProjectMembers,
} from '../../../../../core/models';
import { filterMembersByNameOrEmail } from './filter-members-by-search.util';

describe('filterMembersByNameOrEmail', () => {
  let allMembers: ProjectMembers = [];

  beforeEach(() => {
    allMembers = [
      buildMember('Tim', 'tim@email.com'),
      buildMember('Bob', 'booo@email.com'),
      buildMember('Alex', 'alexxxxxx789@email.com'),
      buildMember('Clara', 'cla_ra@email.com'),
      buildMember('ana', 'ana777@email.com'),
      buildMember('chARlie', 'ch@email.com'),
    ];
  });

  it('should return members that include the text in their names', () => {
    const filteredMembers = filterMembersByNameOrEmail(allMembers, 'Ti');
    expect(filteredMembers.length).toEqual(1);
    expect(filteredMembers[0]).toEqual(allMembers[0]);
  });

  it('should return members that include the text in their names even if it"s not at the start', () => {
    const filteredMembers = filterMembersByNameOrEmail(allMembers, 'lara');
    expect(filteredMembers.length).toEqual(1);
    expect(filteredMembers[0]).toEqual(allMembers[3]);
  });

  it('should be case insensitive', () => {
    const filteredMembers = filterMembersByNameOrEmail(allMembers, 'BOB');
    expect(filteredMembers.length).toEqual(1);
    expect(filteredMembers[0]).toEqual(allMembers[1]);
  });

  it('should match members using their emails', () => {
    const filteredMembers = filterMembersByNameOrEmail(allMembers, 'LEXXX');
    expect(filteredMembers.length).toEqual(1);
    expect(filteredMembers[0]).toEqual(allMembers[2]);
  });
});

function buildMember(name: string, email: string): ProjectMember {
  return {
    Name: name,
    Email: email,
    Id: '',
    Icon: '',
    JoinedOn: null,
  };
}
