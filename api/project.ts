import {
  CreateProjectRequestData,
  CreateProjectResponseData,
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
      `project/?expand=${expand_params}&omit=${omit_params}`,
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
      `project/?expand=${expand_params}&omit=${omit_params}`,
      createProjectData,
      {
        headers: { ...this.authenticationHeaders(ctx) },
      }
    )
  }
}
