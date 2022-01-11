import ProjectApi from '@api/project'
import UserApi from '@api/user'
import { GetIssueDetailResponseData } from '@typings/projectApi'
import { Issue as IssueType } from '@typings/projectStore'
import { snackbar } from '@typings/snackbarStore'
import { transformIssue } from '@utils/project'
import { validateResponse } from '@utils/response'
import axios, { AxiosResponse } from 'axios'
import { observer } from 'mobx-react-lite'
import { GetServerSideProps } from 'next'
import DefaultErrorPage from 'next/error'
import React from 'react'
import { Grid } from '@mui/material'
import IssueInfo from '@components/Project/IssueInfo'
import IssueSubIssues from '@components/Project/IssueSubIssues'

type IssueProps = {
  data: IssueType | null
  status: number
  success: boolean
}

const Issue: React.FC<IssueProps> = ({
  status,
  success,
  data,
}): React.ReactElement => {
  if (!success) {
    return <DefaultErrorPage statusCode={Number(status ?? 500)} />
  }
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={8}>
        <IssueSubIssues issue={data} />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <IssueInfo issue={data} />
      </Grid>
    </Grid>
  )
  return
}

export default observer(Issue)

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params

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

  let response: AxiosResponse<GetIssueDetailResponseData> = null
  const snackbars = []
  try {
    response = await projectApi.getIssueDetails(
      id as unknown as number,
      context
    )
  } catch (e) {
    if (axios.isAxiosError(e)) {
      response = e.response
      if (e?.response) {
        snackbars.push(
          snackbar(
            'Failed to load an issue. ' +
              'Please check the link and your access rights to the project the issue belongs to.',
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
  let data: IssueType = null
  if (response?.data && 'id' in response?.data) {
    data = transformIssue(response?.data)
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
