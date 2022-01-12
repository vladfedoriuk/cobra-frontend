import {
  AcceptProjecInvitationRequestData,
  AcceptProjecInvitationResponseData,
  CreateIssueLoggedTimeRequestData,
  CreateIssueLoggedTimeResponseData,
  CreateProjectEpicRequestData,
  CreateProjectEpicResponseData,
  CreateProjectInvitationRequestData,
  CreateProjectInvitationResponseData,
  CreateProjectIssueRequestData,
  CreateProjectIssueResponseData,
  CreateProjectRequestData,
  CreateProjectResponseData,
  GetEpicDetailResponseData,
  GetEpicIssuesResponseData,
  GetIssueDetailResponseData,
  GetIssueSubIssuesResponseData,
  GetProjectEpicsResponseData,
  GetProjectInvitationResponseData,
  GetProjectIssuesResponseData,
  GetProjectMembershipsResponseData,
  GetProjectResponseData,
  GetProjectsResponseData,
  RejectProjecInvitationRequestData,
  RejectProjecInvitationResponseData,
} from '@typings/projectApi'
import { NextContext } from '@typings/utils'
import { AxiosResponse } from 'axios'
import BaseApi from './base'

export default class ProjectApi extends BaseApi {
  getProjects(
    ctx: NextContext['ctx'] = null
  ): Promise<AxiosResponse<GetProjectsResponseData>> {
    const expand_params = 'creator,members'
    const omit_params = 'created,modified'

    return this.get<GetProjectsResponseData>(
      `projects/?expand=${expand_params}&omit=${omit_params}`,
      {
        headers: { ...this.authenticationHeaders(ctx) },
      }
    )
  }

  getProject(
    username: string,
    slug: string,
    ctx: NextContext['ctx'] = null
  ): Promise<AxiosResponse<GetProjectResponseData>> {
    const expand_params = 'creator'
    const fields_params =
      'id,creator,title,description,is_creator,membership_role'

    return this.get<GetProjectResponseData>(
      `project/${username}/${slug}/?expand=${expand_params}&fields=${fields_params}`,
      {
        headers: { ...this.authenticationHeaders(ctx) },
      }
    )
  }

  createInvitation(
    id: number,
    createInvitationData: CreateProjectInvitationRequestData,
    ctx: NextContext['ctx'] = null
  ): Promise<AxiosResponse<CreateProjectInvitationResponseData>> {
    const expand_params = 'project,user,inviter'
    const omit_params = 'created,modified'
    return this.post<
      CreateProjectInvitationResponseData,
      CreateProjectInvitationRequestData
    >(
      `projects/${id}/invitations/?expand=${expand_params}&omit=${omit_params}`,
      createInvitationData,
      {
        headers: { ...this.authenticationHeaders(ctx) },
      }
    )
  }

  getProjectMemberships(
    id: number,
    ctx: NextContext['ctx'] = null
  ): Promise<AxiosResponse<GetProjectMembershipsResponseData>> {
    const fields_params = 'user,role,id'
    const expand_params = 'user'
    return this.get<GetProjectMembershipsResponseData>(
      `projects/${id}/memberships/?expand=${expand_params}&fields=${fields_params}`,
      {
        headers: { ...this.authenticationHeaders(ctx) },
      }
    )
  }

  createProject(
    createProjectData: CreateProjectRequestData,
    ctx: NextContext['ctx'] = null
  ): Promise<AxiosResponse<CreateProjectResponseData>> {
    const expand_params = 'creator,members'
    const omit_params = 'created,modified'
    return this.post<CreateProjectResponseData, CreateProjectRequestData>(
      `projects/?expand=${expand_params}&omit=${omit_params}`,
      createProjectData,
      {
        headers: { ...this.authenticationHeaders(ctx) },
      }
    )
  }

  acceptInvitation(
    id: string,
    acceptInvitationData: AcceptProjecInvitationRequestData,
    ctx: NextContext['ctx'] = null
  ): Promise<AxiosResponse<AcceptProjecInvitationResponseData>> {
    return this.post<
      AcceptProjecInvitationResponseData,
      AcceptProjecInvitationRequestData
    >(`invitation/${id}/accept/`, acceptInvitationData, {
      headers: { ...this.authenticationHeaders(ctx) },
    })
  }

  rejectInvitation(
    id: string,
    rejectInvitationData: RejectProjecInvitationRequestData,
    ctx: NextContext['ctx'] = null
  ): Promise<AxiosResponse<RejectProjecInvitationResponseData>> {
    return this.post<
      RejectProjecInvitationResponseData,
      RejectProjecInvitationRequestData
    >(`invitation/${id}/reject/`, rejectInvitationData, {
      headers: { ...this.authenticationHeaders(ctx) },
    })
  }

  getInvitation(
    id: string,
    ctx: NextContext['ctx'] = null
  ): Promise<AxiosResponse<GetProjectInvitationResponseData>> {
    const expand_params = 'project,user,inviter'
    const omit_params = 'created,modified'
    return this.get<GetProjectInvitationResponseData>(
      `invitation/${id}/?expand=${expand_params}&omit=${omit_params}`,
      {
        headers: { ...this.authenticationHeaders(ctx) },
      }
    )
  }

  getProjectEpics(
    id: number,
    ctx: NextContext['ctx'] = null
  ): Promise<AxiosResponse<GetProjectEpicsResponseData>> {
    const fields_params = 'id,title,creator'
    const expand_params = 'creator'
    return this.get<GetProjectEpicsResponseData>(
      `projects/${id}/epics/?expand=${expand_params}&fields=${fields_params}`,
      {
        headers: { ...this.authenticationHeaders(ctx) },
      }
    )
  }

  getProjectIssues(
    id: number,
    ctx: NextContext['ctx'] = null
  ): Promise<AxiosResponse<GetProjectIssuesResponseData>> {
    const fields_params = 'id,title,creator,status,type,assignee,parent,epic'
    const expand_params = 'creator,assignee,parent,epic'
    return this.get<GetProjectIssuesResponseData>(
      `projects/${id}/issues/?expand=${expand_params}&fields=${fields_params}`,
      {
        headers: { ...this.authenticationHeaders(ctx) },
      }
    )
  }

  getEpicIssues(
    id: number,
    ctx: NextContext['ctx'] = null
  ): Promise<AxiosResponse<GetEpicIssuesResponseData>> {
    const fields_params = 'id,title,creator,status,type,assignee,parent,epic'
    const expand_params = 'creator,assignee,parent,epic'
    return this.get<GetEpicIssuesResponseData>(
      `issue/?epic=${id}&expand=${expand_params}&fields=${fields_params}`,
      {
        headers: { ...this.authenticationHeaders(ctx) },
      }
    )
  }

  getIssueSubIssues(
    id: number,
    ctx: NextContext['ctx'] = null
  ): Promise<AxiosResponse<GetIssueSubIssuesResponseData>> {
    const fields_params = 'id,title,creator,status,type,assignee,parent,epic'
    const expand_params = 'creator,assignee,parent,epic'
    return this.get<GetIssueSubIssuesResponseData>(
      `issue/${id}/sub_issues/?expand=${expand_params}&fields=${fields_params}`,
      {
        headers: { ...this.authenticationHeaders(ctx) },
      }
    )
  }

  getEpicDetails(
    id: number,
    ctx: NextContext['ctx'] = null
  ): Promise<AxiosResponse<GetEpicDetailResponseData>> {
    const omit_params = 'created,modified'
    const expand_params = 'project.creator,creator'
    return this.get<GetEpicDetailResponseData>(
      `epic/${id}/?expand=${expand_params}&omit=${omit_params}`,
      {
        headers: { ...this.authenticationHeaders(ctx) },
      }
    )
  }

  getIssueDetails(
    id: number,
    ctx: NextContext['ctx'] = null
  ): Promise<AxiosResponse<GetIssueDetailResponseData>> {
    const omit_params = 'created,modified'
    const expand_params = 'creator,assignee,parent,epic,project.creator'
    return this.get<GetIssueDetailResponseData>(
      `issue/${id}/?expand=${expand_params}&omit=${omit_params}`,
      {
        headers: { ...this.authenticationHeaders(ctx) },
      }
    )
  }

  createProjectEpic(
    id: number,
    createProjectEpicData: CreateProjectEpicRequestData,
    ctx: NextContext['ctx'] = null
  ): Promise<AxiosResponse<CreateProjectEpicResponseData>> {
    return this.post<
      CreateProjectEpicResponseData,
      CreateProjectEpicRequestData
    >(`projects/${id}/epics/`, createProjectEpicData, {
      headers: { ...this.authenticationHeaders(ctx) },
    })
  }

  createProjectIssue(
    id: number,
    createProjectIssueData: CreateProjectIssueRequestData,
    ctx: NextContext['ctx'] = null
  ): Promise<AxiosResponse<CreateProjectIssueResponseData>> {
    return this.post<
      CreateProjectIssueResponseData,
      CreateProjectIssueRequestData
    >(`projects/${id}/issues/`, createProjectIssueData, {
      headers: { ...this.authenticationHeaders(ctx) },
    })
  }

  createIssueLoggedTime(
    id: number,
    createIssueLoggedTimeData: CreateIssueLoggedTimeRequestData,
    ctx: NextContext['ctx'] = null
  ): Promise<AxiosResponse<CreateIssueLoggedTimeResponseData>> {
    return this.post<
      CreateIssueLoggedTimeResponseData,
      CreateIssueLoggedTimeRequestData
    >(`issue/${id}/logged_time/`, createIssueLoggedTimeData, {
      headers: { ...this.authenticationHeaders(ctx) },
    })
  }
}
