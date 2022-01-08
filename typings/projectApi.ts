import { GenericErrorsData, IDMixin } from '@typings/utils'

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
