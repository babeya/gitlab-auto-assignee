import { get, getRandomElementFromArray } from '../../utils';

import { Member, AccessLevel } from '../types';

type GroupsPathParams = {
  groupId: number;
};

// TODO: rules
const MASTER_MIN_LEVEL = 40;
const MIN_LEVEL = 30;

const getGroupsPath = ({ groupId }: GroupsPathParams) => `/groups/${groupId}`;

const getGroupMembersPath = (params: GroupsPathParams) =>
  `${getGroupsPath(params)}/members`;

export const getGroupMembers = (
  params: GroupsPathParams,
  callback: (body?: Member[]) => void
) => {
  get(getGroupMembersPath(params), callback);
};

const filterGroupMembers = (members: Member[], minLevel: AccessLevel) =>
  members.filter(({ access_level }) => access_level >= minLevel);

export const getRandomMembers = (
  members: Member[],
  minLevel: AccessLevel,
  nbMember: number
): Member[] =>
  getRandomElementFromArray(filterGroupMembers(members, minLevel), nbMember);
