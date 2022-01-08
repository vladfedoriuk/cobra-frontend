import {
  ProjectUser as ProjectUserType,
  Project as ProjectType,
} from '@typings/projectStore'
import BaseStore from '@stores/base'
import ProjectApi from '@api/project'
import { RootStore } from './root'
import { action, computed, makeObservable, observable, runInAction } from 'mobx'
import {
  GetProjectsResponseData,
  GetProjectsErrorsData,
  ProjectUserData,
  CreateProjectErrorsData,
  CreateProjectRequestData,
  CreateProjectResponseData,
} from '@typings/projectApi'
import { AxiosRequestConfig, AxiosResponse } from 'axios'

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
      setProjectsData: action.bound,
      areProjectsEmpty: computed,
    })
  }

  get areProjectsEmpty(): boolean {
    return Boolean(this.projects.length === 0)
  }

  transformtUser(userData: ProjectUserData): ProjectUserType {
    const { id, username, full_name } = userData
    return { id, username, fullName: full_name }
  }

  setProjectsData(projectsData: GetProjectsResponseData): void {
    this.projects = projectsData.map((project) => {
      const {
        id,
        title,
        description,
        slug,
        is_creator,
        membership_role,
        creator,
        members,
      } = project
      return {
        id,
        title,
        description,
        slug,
        isCreator: is_creator,
        membershipRole: membership_role,
        creator: this.transformtUser(creator),
        members: members.map((member) => {
          return this.transformtUser(member)
        }),
      }
    })
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
