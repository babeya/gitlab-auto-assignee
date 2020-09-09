export { getGroupMembers, getRandomMembers } from "./groups";
export {
  getEligibleApproversFromRules,
  getMrApprovalRules,
  setMergeRequestAssignee,
} from "./mergeRequests";

const MR_EVENT = ["merge_request"];
const MR_OPEN_ACTION = "open";

export const isEventAnMrOpening = (evt: any) =>
  MR_EVENT.includes(evt.event_type) &&
  evt.object_attributes &&
  evt.object_attributes.action === MR_OPEN_ACTION;
