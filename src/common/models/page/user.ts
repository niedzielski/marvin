export enum PageUserGender {
  UNKNOWN = "unknown",
  FEMALE = "female",
  MALE = "male"
}

export interface PageUser {
  anonymous: boolean;
  user: string;
  gender: PageUserGender;
}

// https://www.mediawiki.org/wiki/Manual:$wgRestrictionLevels
export type PageUserGroup = string;

export enum PageAction {
  CREATE = "create",
  EDIT = "edit",
  MOVE = "move",
  UPLOAD = "upload",
  DELETE = "delete",
  PROTECT = "protect"
}

// https://www.mediawiki.org/wiki/Manual:$wgRestrictionTypes
// The default restriction user groups from the server are
// `["", "autoconfirmed", "sysop"]`.
export interface PagePermissionMap {
  // todo: use Action in TypeScript v2.6.
  // https://github.com/Microsoft/TypeScript/issues/13042
  // https://github.com/Microsoft/TypeScript/issues/2491#issuecomment-312132303
  [action: string]: PageUserGroup[];
}
