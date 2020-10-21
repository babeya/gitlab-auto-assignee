import { gitlabApiGet, getRandomElementFromArray } from '../../utils';

import { Member, AccessLevel } from '../../types';

type GroupsPathParams = {
  groupId: number;
};

const getGroupsPath = ({ groupId }: GroupsPathParams) => `/groups/${groupId}`;

const getGroupMembersPath = (params: GroupsPathParams) =>
  `${getGroupsPath(params)}/members`;

export const getGroupMembers = (params: GroupsPathParams) =>
  gitlabApiGet<Member[]>(getGroupMembersPath(params));

const filterGroupMembers = (members: Member[], minLevel: AccessLevel) =>
  members.filter(({ access_level }) => access_level >= minLevel);

export const getRandomMembers = (
  members: Member[],
  minLevel: AccessLevel,
  nbMember: number
): Member[] =>
  getRandomElementFromArray(filterGroupMembers(members, minLevel), nbMember);
