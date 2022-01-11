import {
  ArrayElement,
  GenericErrorsData,
  IDMixin,
  IssueStatusType,
  IssueType,
  UserRole,
} from '@typings/utils'

export type ProjectUserData = IDMixin & {
  username: string
  full_name: string
}
export type ProjectData = IDMixin & {
  title: string
  description: string
  slug: string
  is_creator: boolean
  membership_role: UserRole | ''
  creator: ProjectUserData
  members: Array<ProjectUserData>
}
export type GetProjectsResponseData = Array<ProjectData>

export type GetProjectsErrorsData = GenericErrorsData

export type CreateProjectRequestData = Pick<
  ProjectData,
  'title' | 'description'
>

export type CreateProjectResponseData = ProjectData

export type CreateProjectErrorsData = GenericErrorsData

export type GetProjectResponseData = Pick<
  ProjectData,
  'title' | 'description' | 'creator' | 'id' | 'is_creator' | 'membership_role'
>

export type GetProjectErrorsData = GenericErrorsData

export type GetProjectMembershipsResponseData = Array<
  IDMixin & {
    role: UserRole
    user: ProjectUserData
  }
>

export type GetProjectMembershipsErrorsData = GenericErrorsData

export type CreateProjectInvitationRequestData = {
  email: string
}

export type CreateProjectInvitationResponseData = {
  id: string
  is_active: boolean
  status: string
  project: IDMixin & {
    title: string
  }
  user: ProjectUserData
  inviter: ProjectUserData
}

export type CreateProjectInvitationErrorsData = GenericErrorsData

export type AcceptProjecInvitationRequestData = Record<string, unknown>

export type AcceptProjecInvitationResponseData = Record<string, unknown>

export type AcceptProjectInvitationErrorsData = GenericErrorsData

export type RejectProjecInvitationRequestData = Record<string, unknown>

export type RejectProjecInvitationResponseData = Record<string, unknown>

export type RejectProjectInvitationErrorsData = GenericErrorsData

export type GetProjectInvitationResponseData =
  CreateProjectInvitationResponseData

export type GetProjectInvitationErrorsData = GenericErrorsData

export type GetProjectEpicsResponseData = Array<
  IDMixin & {
    title: string
    creator: ProjectUserData
  }
>

export type GetProjectEpicsErrorsData = GenericErrorsData

export type ProjectIssueData = IDMixin & {
  status: IssueStatusType
  type: IssueType
  title: string
  creator: ProjectUserData
  assignee: ProjectUserData | null
  parent: Pick<ProjectIssueData, 'title' | 'id' | 'type'> | null
  epic: Pick<ArrayElement<GetProjectEpicsResponseData>, 'title' | 'id'> | null
}

export type GetProjectIssuesResponseData = Array<ProjectIssueData>

export type GetProjectIssuesErrorsData = GenericErrorsData

export type GetEpicDetailResponseData = IDMixin & {
  title: string
  description: string
  project: Pick<ProjectData, 'id' | 'title' | 'slug' | 'creator'>
  creator: ProjectUserData
}

export type GetEpicDetailErrorsData = GenericErrorsData

export type GetEpicIssuesResponseData = Array<ProjectIssueData>

export type GetEpicIssuesErrorsData = GenericErrorsData

export type IssueDetailData = ProjectIssueData & {
  project: Pick<ProjectData, 'id' | 'title' | 'slug' | 'creator'>
  description: string
}

export type GetIssueDetailResponseData = IssueDetailData

export type GetIssueDetailErrorsData = GenericErrorsData

export type GetIssueSubIssuesResponseData = Array<ProjectIssueData>

export type GetIssueSubIssuesErrorsData = GenericErrorsData

export type CreateProjectEpicRequestData = {
  title: string
  description: string
}

export type CreateProjectEpicResponseData = GetEpicDetailResponseData

export type CreateProjectEpicErrorsData = GenericErrorsData

export type CreateProjectIssueRequestData = {
  title: string
  type: IssueType
  description?: string
  estimate: number
  assignee?: number
  parent?: number
  epic?: number
}

export type CreateProjectIssueResponseData = IssueDetailData

export type CreateProjectIssueErrorsData = GenericErrorsData
