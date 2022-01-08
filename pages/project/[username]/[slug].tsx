import ProjectApi from '@api/project'
import UserApi from '@api/user'
import { GetProjectResponseData } from '@typings/projectApi'
import { snackbar } from '@typings/snackbarStore'
import { validateResponse } from '@utils/response'
import axios, { AxiosResponse } from 'axios'
import { observer } from 'mobx-react-lite'
import { GetServerSideProps } from 'next'
import DefaultErrorPage from 'next/error'
import React from 'react'

type ProjectProps = {
  data: GetProjectResponseData | null
  status: number
  success: boolean
}

const Project: React.FC<ProjectProps> = ({
  status,
  success,
}): React.ReactElement => {
  if (!success) {
    return <DefaultErrorPage statusCode={Number(status ?? 500)} />
  }
  return <> </>
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
        destination: '/',
        permanent: false,
      },
    }
  }

  let response: AxiosResponse<GetProjectResponseData> = null
  const snackbars = []
  if (isAuthenticated) {
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
                'Please check the link is correct and you have the needed rights to access the project',
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
  }
  return {
    props: {
      success: validateResponse(response),
      data: response?.data ?? null,
      status: response?.status ?? null,
      hydrationData: {
        snackbars: {
          snackbars: snackbars,
        },
      },
    },
  }
}
