import {
  ProjectUserData,
  GetProjectsResponseData,
  ProjectData,
  GetProjectResponseData,
  GetProjectMembershipsResponseData,
} from '@typings/projectApi'
import {
  ProjectUser as ProjectUserType,
  Project as ProjectType,
  ProjectInfo,
  ProjectMemberships,
} from '@typings/projectStore'

export const transformProjectUser = (
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
    creator: transformProjectUser(creator),
    members: members.map((member) => {
      return transformProjectUser(member)
    }),
  }
}

export const transformProjectInfoData = (
  projectInfoData: GetProjectResponseData
): ProjectInfo => {
  const { id, title, description, is_creator, membership_role, creator } =
    projectInfoData
  return {
    id,
    title,
    description,
    creator: transformProjectUser(creator),
    isCreator: is_creator,
    membershipRole: membership_role,
  }
}

export const transformProjectMembershipsData = (
  projectIMembershipsData: GetProjectMembershipsResponseData
): ProjectMemberships => {
  return projectIMembershipsData.map((projectMembership) => {
    const { id, role, user } = projectMembership
    return {
      id,
      role,
      user: transformProjectUser(user),
    }
  })
}
