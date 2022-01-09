import { GenericErrorsData, IDMixin, UserRole } from '@typings/utils'

export type ProjectUserData = IDMixin & {
  username: string
  full_name: string
}
export type ProjectData = IDMixin & {
  title: string
  description: string
  slug: string
  is_creator: boolean
  membership_role: string
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
