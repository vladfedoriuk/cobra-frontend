import ProjectApi from '@api/project'
import UserApi from '@api/user'
import useMobXStores from '@hooks/stores'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Box from '@mui/system/Box'
import { GetProjectInvitationResponseData } from '@typings/projectApi'
import { ProjectInvitation } from '@typings/projectStore'
import { snackbar } from '@typings/snackbarStore'
import { handleDetailError } from '@utils/errors'
import { transformProjectInvitation } from '@utils/project'
import { validateResponse } from '@utils/response'
import axios, { AxiosResponse } from 'axios'
import { observer } from 'mobx-react-lite'
import { GetServerSideProps } from 'next'
import DefaultErrorPage from 'next/error'
import React from 'react'
import Router from 'next/router'

type InvitationProps = {
  data: ProjectInvitation | null
  status: number
  success: boolean
}

const Invitation: React.FC<InvitationProps> = ({
  status,
  success,
  data,
}): React.ReactElement => {
  if (!success) {
    return <DefaultErrorPage statusCode={Number(status ?? 500)} />
  }
  const {
    id,
    project: { title },
    inviter: { fullName },
  } = data
  const { projects: projectsStore, snackbars: snackbarStore } = useMobXStores()

  const responseErrorsHandler = (errorsData) => {
    Router.push('/projects')
    handleDetailError(errorsData, (detail) => {
      snackbarStore.push(snackbar(detail, 'error'))
    })
  }

  const requestErrorsHandler = () => {
    Router.push('/projects')
    snackbarStore.push(
      snackbar(
        'Cannot conect to the server. Please, verify your connection.',
        'error'
      )
    )
  }

  const onAccept = () => {
    projectsStore.acceptInvitation(
      id,
      {},
      () => {
        Router.push('/projects')
        snackbarStore.push(
          snackbar('The invitation has been accepted', 'success')
        )
      },
      responseErrorsHandler,
      requestErrorsHandler
    )
  }

  const onReject = () => {
    projectsStore.rejectInvitation(
      id,
      {},
      () => {
        Router.push('/projects')
        snackbarStore.push(
          snackbar('The invitation has been rejected', 'success')
        )
      },
      responseErrorsHandler,
      requestErrorsHandler
    )
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="div" variant="h4">
          Invitation to join{' '}
          <Typography
            component="div"
            variant="h4"
            sx={{ fontWeight: 'bold', display: 'inline-block' }}
          >
            {title}
          </Typography>
        </Typography>
        <Typography
          component="div"
          variant="body1"
          color="text.secondary"
          sx={{ mt: 2 }}
        >
          {`${fullName} invites you to join a project.`}
        </Typography>
        <Stack
          direction="row"
          spacing={4}
          divider={<Divider orientation="vertical" flexItem />}
          justifyContent="center"
          alignItems="center"
          sx={{ mt: 3 }}
        >
          <Button
            variant="contained"
            size="large"
            color="error"
            onClick={onReject}
          >
            Reject
          </Button>
          <Button
            variant="contained"
            size="large"
            color="success"
            onClick={onAccept}
          >
            Accept
          </Button>
        </Stack>
      </Box>
    </Container>
  )
}

export default observer(Invitation)

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

  let response: AxiosResponse<GetProjectInvitationResponseData> = null
  const snackbars = []
  try {
    response = await projectApi.getInvitation(id as string, context)
  } catch (e) {
    if (axios.isAxiosError(e)) {
      response = e.response
      if (e?.response) {
        handleDetailError(e.response?.data ?? {}, (detail) => {
          snackbars.push(snackbar(detail, 'error'))
        })
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
  let data: ProjectInvitation = null
  if (response?.data && 'id' in response?.data) {
    data = transformProjectInvitation(response?.data)
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
