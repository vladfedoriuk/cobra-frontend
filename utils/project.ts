import {
  ProjectUserData,
  GetProjectsResponseData,
  ProjectData,
  GetProjectResponseData,
  GetProjectMembershipsResponseData,
  GetProjectInvitationResponseData,
  GetProjectEpicsResponseData,
  GetEpicDetailResponseData,
  IssueDetailData,
  ProjectIssueData,
} from '@typings/projectApi'
import {
  ProjectUser as ProjectUserType,
  Project as ProjectType,
  ProjectInfo,
  ProjectMemberships,
  ProjectInvitation as ProjectInvitationType,
  ProjectEpics,
  ProjectIssues,
  ProjectIssue,
  Epic,
  Issue,
} from '@typings/projectStore'

export const transformProjectEpics = (
  projectEpicsData: GetProjectEpicsResponseData
): ProjectEpics => {
  return projectEpicsData.map((projectEpicData) => {
    const { id, title, creator } = projectEpicData
    return { id, title, creator: transformProjectUser(creator) }
  })
}

export const transformEpic = (epicData: GetEpicDetailResponseData): Epic => {
  const {
    id,
    title,
    description,
    project: {
      id: projectId,
      title: projectTitle,
      slug,
      creator: projectCreator,
    },
    creator,
  } = epicData
  return {
    id,
    title,
    description,
    project: {
      id: projectId,
      title: projectTitle,
      slug,
      creator: transformProjectUser(projectCreator),
    },
    creator: transformProjectUser(creator),
  }
}

export const transformProjectIssue = (
  projectIssueData: ProjectIssueData
): ProjectIssue => {
  const { id, title, status, type, assignee, parent, epic, creator } =
    projectIssueData
  return {
    id,
    title,
    status,
    type,
    assignee: assignee !== null ? transformProjectUser(assignee) : null,
    parent:
      parent !== null
        ? { id: parent?.id, title: parent?.title, type: parent?.type }
        : null,
    epic: epic !== null ? { id: epic?.id, title: epic?.title } : null,
    creator: transformProjectUser(creator),
  }
}

export const transformIssue = (issueData: IssueDetailData): Issue => {
  const preprocessedIssueData = transformProjectIssue(issueData)
  const { project, description } = issueData
  return {
    ...preprocessedIssueData,
    project: {
      id: project.id,
      title: project.title,
      slug: project.slug,
      creator: transformProjectUser(project.creator),
    },
    description,
  }
}

export const filterIssuesByType = (
  issues: ProjectIssues,
  expectedType: string
): ProjectIssues => {
  return issues.filter(({ type }) => expectedType === type)
}

export const transformProjectIssues = (
  projectIssuesData: Array<ProjectIssueData>
): ProjectIssues => {
  return projectIssuesData.map((projectIssueData) =>
    transformProjectIssue(projectIssueData)
  )
}

export const transformProjectUser = (
  userData: ProjectUserData
): ProjectUserType => {
  const { id, username, full_name } = userData
  return { id, username, fullName: full_name }
}

export const transformProjectInvitation = (
  invitationData: GetProjectInvitationResponseData
): ProjectInvitationType => {
  const { id, is_active, status, project, user, inviter } = invitationData
  return {
    id,
    isActive: is_active,
    status,
    project,
    user: transformProjectUser(user),
    inviter: transformProjectUser(inviter),
  }
}

export const transformProjectUsers = (
  usersData: Array<ProjectUserData>
): Array<ProjectUserType> => {
  return usersData.map((userData) => transformProjectUser(userData))
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

export const isProjectCreatorOrMaintainer = (
  isCreator: boolean,
  membershipRole: string
): boolean => isCreator || membershipRole === 'maintainer'
