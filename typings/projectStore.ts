import {
  ArrayElement,
  IDMixin,
  IssueStatusType,
  IssueType,
  UserRole,
} from '@typings/utils'

export type ProjectUser = IDMixin & {
  username: string
  fullName: string
}
export type Project = IDMixin & {
  title: string
  description: string
  slug: string
  isCreator: boolean
  membershipRole: UserRole
  creator: ProjectUser
  members: Array<ProjectUser>
}

export type ProjectInfo = Pick<
  Project,
  'title' | 'description' | 'creator' | 'id' | 'isCreator' | 'membershipRole'
>

export type ProjectMemberships = Array<
  IDMixin & {
    role: UserRole
    user: ProjectUser
  }
>

export type ProjectInvitation = {
  id: string
  isActive: boolean
  status: string
  project: IDMixin & {
    title: string
  }
  user: ProjectUser
  inviter: ProjectUser
}

export type ProjectEpics = Array<
  IDMixin & {
    title: string
    creator: ProjectUser
  }
>

export type ProjectIssue = IDMixin & {
  status: IssueStatusType
  type: IssueType
  title: string
  creator: ProjectUser
  assignee: ProjectUser | null
  parent: Pick<ProjectIssue, 'title' | 'id'> | null
  epic: Pick<ArrayElement<ProjectEpics>, 'title' | 'id'> | null
}

export type ProjectIssues = Array<ProjectIssue>
