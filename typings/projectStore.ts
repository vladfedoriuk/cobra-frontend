import { IDMixin } from '@typings/utils'

export type ProjectUser = IDMixin & {
  username: string
  fullName: string
}
export type Project = IDMixin & {
  title: string
  description: string
  slug: string
  isCreator: boolean
  membershipRole: string
  creator: ProjectUser
  members: Array<ProjectUser>
}
