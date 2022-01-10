import ProjectApi from '@api/project'
import UserApi from '@api/user'
import { GetEpicDetailResponseData } from '@typings/projectApi'
import { Epic as EpicType } from '@typings/projectStore'
import { snackbar } from '@typings/snackbarStore'
import { transformEpic } from '@utils/project'
import { validateResponse } from '@utils/response'
import axios, { AxiosResponse } from 'axios'
import { observer } from 'mobx-react-lite'
import { GetServerSideProps } from 'next'
import DefaultErrorPage from 'next/error'
import React from 'react'
import Grid from '@mui/material/Grid'
import EpicInfo from '@components/Project/EpicInfo'
import EpicIssues from '@components/Project/EpicIssues'

type EpicProps = {
  data: EpicType | null
  status: number
  success: boolean
}

const Epic: React.FC<EpicProps> = ({
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
        <EpicIssues epic={data} />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <EpicInfo epic={data} />
      </Grid>
    </Grid>
  )
}

export default observer(Epic)

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

  let response: AxiosResponse<GetEpicDetailResponseData> = null
  const snackbars = []
  try {
    response = await projectApi.getEpicDetails(id as unknown as number, context)
  } catch (e) {
    if (axios.isAxiosError(e)) {
      response = e.response
      if (e?.response) {
        snackbars.push(
          snackbar(
            'Failed to load an epic. ' +
              'Please check the link and your access rights to the project epic belongs to.',
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
  let data: EpicType = null
  if (response?.data && 'id' in response?.data) {
    data = transformEpic(response?.data)
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
