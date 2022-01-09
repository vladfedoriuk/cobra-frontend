import { Project as ProjectType } from '@typings/projectStore'
import BaseStore from '@stores/base'
import ProjectApi from '@api/project'
import { RootStore } from './root'
import { action, computed, makeObservable, observable, runInAction } from 'mobx'
import {
  GetProjectsResponseData,
  GetProjectsErrorsData,
  CreateProjectErrorsData,
  CreateProjectRequestData,
  CreateProjectResponseData,
  GetProjectErrorsData,
  GetProjectResponseData,
  GetProjectMembershipsErrorsData,
  GetProjectMembershipsResponseData,
} from '@typings/projectApi'
import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { transformProjectsData } from '@utils/project'

export default class ProjectStore extends BaseStore<ProjectType> {
  projects: Array<ProjectType> = new Array<ProjectType>()
  api: ProjectApi = null

  constructor(rootStore: Readonly<RootStore>) {
    super(rootStore)
    this.api = new ProjectApi()
    makeObservable(this, {
      hydrate: action.bound,
      projects: observable,
      getProjects: action.bound,
      areProjectsEmpty: computed,
      setProjectsData: action.bound,
    })
  }

  get areProjectsEmpty(): boolean {
    return Boolean(this.projects.length === 0)
  }

  setProjectsData(projectData: GetProjectsResponseData): void {
    this.projects = transformProjectsData(projectData)
  }

  async getProjectMemberships(
    id: number,
    onSuccess: (data: GetProjectMembershipsResponseData) => void = null,
    onBadResponse: (data: GetProjectMembershipsErrorsData) => void = null,
    onBadRequest: (requestConfig: AxiosRequestConfig) => void = null
  ): Promise<GetProjectMembershipsResponseData | void> {
    return await ProjectApi.withErrorsHandling(
      this.api
        .getProjectMemberships(id)
        .then((response: AxiosResponse<GetProjectMembershipsResponseData>) => {
          if (onSuccess !== null) {
            onSuccess(response.data)
          }
          return response.data
        }),
      onBadResponse,
      onBadRequest
    )
  }

  async getProjects(
    onSuccess: (data: GetProjectsResponseData) => void = null,
    onBadResponse: (data: GetProjectsErrorsData) => void = null,
    onBadRequest: (requestConfig: AxiosRequestConfig) => void = null
  ): Promise<GetProjectsResponseData | void> {
    return await ProjectApi.withErrorsHandling(
      this.api
        .getProjects()
        .then((response: AxiosResponse<GetProjectsResponseData>) => {
          if (onSuccess !== null) {
            onSuccess(response.data)
          }
          runInAction(() => {
            this.setProjectsData(response.data)
          })
          return response.data
        }),
      onBadResponse,
      onBadRequest
    )
  }

  async getProject(
    username: string,
    slug: string,
    onSuccess: (data: GetProjectResponseData) => void = null,
    onBadResponse: (data: GetProjectErrorsData) => void = null,
    onBadRequest: (requestConfig: AxiosRequestConfig) => void = null
  ): Promise<GetProjectResponseData | void> {
    return await ProjectApi.withErrorsHandling(
      this.api
        .getProject(username, slug)
        .then((response: AxiosResponse<GetProjectResponseData>) => {
          if (onSuccess !== null) {
            onSuccess(response.data)
          }
          return response.data
        }),
      onBadResponse,
      onBadRequest
    )
  }

  async createProject(
    createProjectData: CreateProjectRequestData,
    onSuccess: (data: CreateProjectResponseData) => void = null,
    onBadResponse: (data: CreateProjectErrorsData) => void = null,
    onBadRequest: (
      requestConfig: AxiosRequestConfig<CreateProjectRequestData>
    ) => void = null
  ): Promise<CreateProjectResponseData | void> {
    return await ProjectApi.withErrorsHandling(
      this.api
        .createProject(createProjectData)
        .then((response: AxiosResponse<CreateProjectResponseData>) => {
          if (onSuccess !== null) {
            onSuccess(response.data)
          }
          return response.data
        }),
      onBadResponse,
      onBadRequest
    )
  }
}
