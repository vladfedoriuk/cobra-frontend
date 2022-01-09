import { IDMixin, UserRole } from '@typings/utils'

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
