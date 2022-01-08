import {
  ProjectUserData,
  GetProjectsResponseData,
  ProjectData,
} from '@typings/projectApi'
import {
  ProjectUser as ProjectUserType,
  Project as ProjectType,
} from '@typings/projectStore'

export const transformrProjectUser = (
  userData: ProjectUserData
): ProjectUserType => {
  const { id, username, full_name } = userData
  return { id, username, fullName: full_name }
}

export const transformProjectsData = (
  projectsData: GetProjectsResponseData
): Array<ProjectType> => {
  return projectsData.map((project) => transformProjectData(project))
}

export const transformProjectData = (projectData: ProjectData): ProjectType => {
  const {
    id,
    title,
    description,
    slug,
    is_creator,
    membership_role,
    creator,
    members,
  } = projectData
  return {
    id,
    title,
    description,
    slug,
    isCreator: is_creator,
    membershipRole: membership_role,
    creator: transformrProjectUser(creator),
    members: members.map((member) => {
      return transformrProjectUser(member)
    }),
  }
}
