import ProjectApi from '@api/project'
import UserApi from '@api/user'
import ProjectInfo from '@components/Project/ProjectInfo'
import ProjectIssues from '@components/Project/ProjectIssues'
import useMobXStores from '@hooks/stores'
import Grid from '@mui/material/Grid'
import { GetProjectResponseData } from '@typings/projectApi'
import {
  ProjectInfo as ProjectInfoData,
  ProjectMemberships,
} from '@typings/projectStore'
import { snackbar } from '@typings/snackbarStore'
import {
  transformProjectInfoData,
  transformProjectMembershipsData,
} from '@utils/project'
import { validateResponse } from '@utils/response'
import axios, { AxiosResponse } from 'axios'
import { observer } from 'mobx-react-lite'
import { GetServerSideProps } from 'next'
import DefaultErrorPage from 'next/error'
import React, { useEffect, useState } from 'react'

type ProjectProps = {
  data: ProjectInfoData | null
  status: number
  success: boolean
}

const Project: React.FC<ProjectProps> = ({
  data,
  status,
  success,
}): React.ReactElement => {
  if (!success) {
    return <DefaultErrorPage statusCode={Number(status ?? 500)} />
  }
  const { id } = data
  const { projects: projectsStore, snackbars: snackbarStore } = useMobXStores()
  const [projectMemberships, setProjectMemberships] =
    useState<ProjectMemberships>(null)

  useEffect(() => {
    projectsStore.getProjectMemberships(
      id,
      (data) => {
        setProjectMemberships(transformProjectMembershipsData(data))
      },
      () => {
        snackbarStore.push(
          snackbar(
            'Cannot fetch the project members. Try again later.',
            'error'
          )
        )
      },
      () => {
        snackbarStore.push(
          snackbar(
            'Cannot conect to the server. Please, verify your connection.',
            'error'
          )
        )
      }
    )
  }, [])
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={8}>
        <ProjectIssues project={data} />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <ProjectInfo project={data} memberships={projectMemberships} />
      </Grid>
    </Grid>
  )
}

export default observer(Project)

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { username, slug } = context.params

  const userApi = new UserApi()
  const projectApi = new ProjectApi()
  const isAuthenticated = await userApi.isAuthenticated(context)
  if (!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  let response: AxiosResponse<GetProjectResponseData> = null
  const snackbars = []
  try {
    response = await projectApi.getProject(
      username as string,
      slug as string,
      context
    )
  } catch (e) {
    if (axios.isAxiosError(e)) {
      response = e.response
      if (e?.response) {
        snackbars.push(
          snackbar(
            'Failed to load a project. ' +
              'Please check the link and your access rights to the project',
            'error'
          )
        )
      } else {
        snackbars.push(
          snackbar(
            'Cannot conect to the server. Please, verify your connection.',
            'error'
          )
        )
      }
    }
  }
  let data: ProjectInfoData = null
  if (response?.data && 'id' in response?.data) {
    data = transformProjectInfoData(response?.data)
  }
  return {
    props: {
      success: validateResponse(response),
      data: data ?? null,
      status: response?.status ?? null,
      hydrationData: {
        snackbars: {
          snackbars: snackbars,
        },
      },
    },
  }
}
