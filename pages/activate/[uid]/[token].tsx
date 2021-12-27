import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { ActivateRequestData, ActivateResponseData } from '@typings/userApi'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import React from 'react'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import CoPresentIcon from '@mui/icons-material/CoPresent'
import Link from '@mui/material/Link'
import UserApi from '@api/user'
import axios, { AxiosResponse } from 'axios'
import DefaultErrorPage from 'next/error'
import { ActivationPageProps } from '@typings/pages'
import { validateResponse } from '@utils/response'

const ActivationPage: React.FC<ActivationPageProps> = ({
  success,
  status,
  data,
}): React.ReactElement => {
  if (data === null) {
    return <DefaultErrorPage statusCode={status} />
  }
  return (
    <Container sx={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
      <Grid container sx={{ m: 1 }} gap={2}>
        <Grid item>
          <CoPresentIcon sx={{ fontSize: 28 }} />
        </Grid>
        <Grid item>
          <Typography component="h1" variant="h5">
            User activation
          </Typography>
        </Grid>
      </Grid>
      {success ? (
        <Alert severity="success">
          The user has been activated successfully. Tou can now login{' '}
          <Link href="/login" color="inherit">
            here
          </Link>
        </Alert>
      ) : (
        <Alert severity="error">
          The activation link has expired or is broken.
        </Alert>
      )}
    </Container>
  )
}

export default ActivationPage

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const params = context.params
  const userApi = new UserApi()
  let response: AxiosResponse<ActivateResponseData>
  try {
    response = await userApi.activate(params as ActivateRequestData)
  } catch (e) {
    if (axios.isAxiosError(e)) {
      response = e.response
    }
  }
  return {
    props: {
      success: validateResponse(response),
      status: Number(response?.status ?? 500),
      data: response?.data ?? null,
    },
  }
}
