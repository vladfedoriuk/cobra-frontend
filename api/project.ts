import {
  CreateProjectRequestData,
  CreateProjectResponseData,
  GetProjectResponseData,
  GetProjectsResponseData,
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
}
