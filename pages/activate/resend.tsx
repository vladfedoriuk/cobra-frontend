import React from 'react'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  ResendActivationErrorsData,
  ResendActivationRequestData,
} from '@typings/userApi'
import useMobXStores from '@hooks/stores'
import { snackbar } from '@typings/snackbarStore'
import { GetServerSideProps } from 'next'
import UserApi from '@api/user'
import EmailIcon from '@mui/icons-material/Email'
import { Controller, useForm } from 'react-hook-form'
import {
  Container,
  Box,
  Avatar,
  Typography,
  Grid,
  TextField,
  Button,
} from '@mui/material'
import {
  handleFieldsErrors,
  handleDetailError,
  handleListErrors,
} from '@utils/errors'

const schema = yup
  .object({
    email: yup.string().email().required(),
  })
  .required()

const ResendActivation: React.FC = (): React.ReactElement => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm<ResendActivationRequestData>({
    resolver: yupResolver(schema),
  })
  const { user: userStore, snackbars: snackbarStore } = useMobXStores()

  const onSubmit = async (data: ResendActivationRequestData) => {
    await userStore?.resendActivation(
      data,
      () => {
        snackbarStore.push(
          snackbar('The activation email has been resend.', 'success')
        )
      },
      (errorsData: ResendActivationErrorsData) => {
        handleListErrors(errorsData, (message) =>
          snackbarStore.push(snackbar(message, 'error'))
        )
        handleFieldsErrors(
          errorsData as Record<keyof ResendActivationErrorsData, unknown>,
          (fieldName: keyof ResendActivationRequestData, fieldError: string) =>
            setError(fieldName, {
              message: fieldError,
              type: 'manual',
            }),
          'email'
        )
        handleDetailError(errorsData, (detail) =>
          snackbarStore.push(snackbar(detail, 'error'))
        )
      },
      () => {
        snackbarStore.push(
          snackbar(
            'Cannot connect to the server. Please, check your connection.',
            'error'
          )
        )
      }
    )
  }
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar
          sx={{
            bgcolor: 'primary.main',
            m: 1,
          }}
        >
          <EmailIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Resend Activation
        </Typography>
        <Box component="form" noValidate sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item>
              <Controller
                name="email"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    error={Boolean(errors.email)}
                    helperText={errors.email?.message}
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    onChange={onChange}
                    value={value ?? ''}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSubmit(onSubmit)}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const api = new UserApi()
  const isAuthenticated = await api.isAuthenticated(context)
  if (isAuthenticated) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  return {
    props: {},
  }
}

export default ResendActivation
