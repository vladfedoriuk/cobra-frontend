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
  CreateProjectInvitationErrorsData,
  CreateProjectInvitationRequestData,
  CreateProjectInvitationResponseData,
  AcceptProjecInvitationRequestData,
  AcceptProjecInvitationResponseData,
  AcceptProjectInvitationErrorsData,
  RejectProjecInvitationRequestData,
  RejectProjecInvitationResponseData,
  RejectProjectInvitationErrorsData,
  GetProjectInvitationErrorsData,
  GetProjectInvitationResponseData,
  GetProjectEpicsErrorsData,
  GetProjectEpicsResponseData,
  GetProjectIssuesErrorsData,
  GetProjectIssuesResponseData,
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
      getProjectMemberships: action.bound,
      getProject: action.bound,
      createProject: action.bound,
      acceptInvitation: action.bound,
      rejectInvitation: action.bound,
      createInvitation: action.bound,
      getInvitation: action.bound,
      getProjectEpics: action.bound,
    })
  }

  get areProjectsEmpty(): boolean {
    return Boolean(this.projects.length === 0)
  }

  setProjectsData(projectData: GetProjectsResponseData): void {
    runInAction(() => {
      this.projects = transformProjectsData(projectData)
    })
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
          this.setProjectsData(response.data)
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

  async createInvitation(
    id: number,
    createInvitationData: CreateProjectInvitationRequestData,
    onSuccess: (data: CreateProjectInvitationResponseData) => void = null,
    onBadResponse: (data: CreateProjectInvitationErrorsData) => void = null,
    onBadRequest: (
      requestConfig: AxiosRequestConfig<CreateProjectInvitationRequestData>
    ) => void = null
  ): Promise<CreateProjectInvitationResponseData | void> {
    return await ProjectApi.withErrorsHandling(
      this.api
        .createInvitation(id, createInvitationData)
        .then(
          (response: AxiosResponse<CreateProjectInvitationResponseData>) => {
            if (onSuccess !== null) {
              onSuccess(response.data)
            }
            return response.data
          }
        ),
      onBadResponse,
      onBadRequest
    )
  }

  async acceptInvitation(
    id: string,
    acceptInvitationData: AcceptProjecInvitationRequestData,
    onSuccess: (data: AcceptProjecInvitationResponseData) => void = null,
    onBadResponse: (data: AcceptProjectInvitationErrorsData) => void = null,
    onBadRequest: (
      requestConfig: AxiosRequestConfig<AcceptProjecInvitationRequestData>
    ) => void = null
  ): Promise<AcceptProjecInvitationResponseData | void> {
    return await ProjectApi.withErrorsHandling(
      this.api
        .acceptInvitation(id, acceptInvitationData)
        .then((response: AxiosResponse<AcceptProjecInvitationResponseData>) => {
          if (onSuccess !== null) {
            onSuccess(response.data)
          }
          return response.data
        }),
      onBadResponse,
      onBadRequest
    )
  }

  async rejectInvitation(
    id: string,
    rejectInvitationData: RejectProjecInvitationRequestData,
    onSuccess: (data: RejectProjecInvitationResponseData) => void = null,
    onBadResponse: (data: RejectProjectInvitationErrorsData) => void = null,
    onBadRequest: (
      requestConfig: AxiosRequestConfig<RejectProjecInvitationRequestData>
    ) => void = null
  ): Promise<RejectProjecInvitationResponseData | void> {
    return await ProjectApi.withErrorsHandling(
      this.api
        .rejectInvitation(id, rejectInvitationData)
        .then((response: AxiosResponse<RejectProjecInvitationResponseData>) => {
          if (onSuccess !== null) {
            onSuccess(response.data)
          }
          return response.data
        }),
      onBadResponse,
      onBadRequest
    )
  }

  async getInvitation(
    id: string,
    onSuccess: (data: GetProjectInvitationResponseData) => void = null,
    onBadResponse: (data: GetProjectInvitationErrorsData) => void = null,
    onBadRequest: (requestConfig: AxiosRequestConfig) => void = null
  ): Promise<GetProjectInvitationResponseData | void> {
    return await ProjectApi.withErrorsHandling(
      this.api
        .getInvitation(id)
        .then((response: AxiosResponse<GetProjectInvitationResponseData>) => {
          if (onSuccess !== null) {
            onSuccess(response.data)
          }
          return response.data
        }),
      onBadResponse,
      onBadRequest
    )
  }

  async getProjectEpics(
    id: number,
    onSuccess: (data: GetProjectEpicsResponseData) => void = null,
    onBadResponse: (data: GetProjectEpicsErrorsData) => void = null,
    onBadRequest: (requestConfig: AxiosRequestConfig) => void = null
  ): Promise<GetProjectEpicsResponseData | void> {
    return await ProjectApi.withErrorsHandling(
      this.api
        .getProjectEpics(id)
        .then((response: AxiosResponse<GetProjectEpicsResponseData>) => {
          if (onSuccess !== null) {
            onSuccess(response.data)
          }
          return response.data
        }),
      onBadResponse,
      onBadRequest
    )
  }
  async getProjectIssues(
    id: number,
    onSuccess: (data: GetProjectIssuesResponseData) => void = null,
    onBadResponse: (data: GetProjectIssuesErrorsData) => void = null,
    onBadRequest: (requestConfig: AxiosRequestConfig) => void = null
  ): Promise<GetProjectIssuesResponseData | void> {
    return await ProjectApi.withErrorsHandling(
      this.api
        .getProjectIssues(id)
        .then((response: AxiosResponse<GetProjectIssuesResponseData>) => {
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
