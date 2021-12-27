import React from 'react'
import useMobXStores from '@hooks/stores'
import Router from 'next/router'
import { GetServerSideProps } from 'next'
import UserApi from '@api/user'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Box from '@mui/system/Box'
import Avatar from '@mui/material/Avatar'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import { Controller, useForm } from 'react-hook-form'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { PasswordResetConfirmRequestData } from '@typings/userApi'
import { snackbar } from '@typings/snackbarStore'
import {
  handleDetailError,
  handleFieldsErrors,
  handleListErrors,
} from '@utils/errors'

const schema = yup
  .object({
    new_password: yup.string().required(),
    re_new_password: yup
      .string()
      .required('repeat password is a required field.')
      .test('passwords-match', 'passwords must match', function (value) {
        return this.parent.password === value
      }),
  })
  .required()

const PasswordResetConfirmPage: React.FC<
  Pick<PasswordResetConfirmRequestData, 'uid' | 'token'>
> = (props): React.ReactElement => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm<
    Pick<PasswordResetConfirmRequestData, 'new_password' | 're_new_password'>
  >({
    resolver: yupResolver(schema),
  })
  const { user: userStore, snackbars: snackbarStore } = useMobXStores()
  const onSubmit = async (
    data: Pick<
      PasswordResetConfirmRequestData,
      'new_password' | 're_new_password'
    >
  ) => {
    await userStore?.passwordResetConfirm(
      { ...data, ...props },
      () => {
        Router.push('/login')
        snackbarStore.push(
          snackbar('The password has been reset successfully.', 'success')
        )
      },
      (errorsData: PasswordResetConfirmRequestData) => {
        handleListErrors(errorsData, (message) =>
          snackbarStore.push(snackbar(message, 'error'))
        )
        handleFieldsErrors(
          errorsData as Record<
            keyof Pick<
              PasswordResetConfirmRequestData,
              'new_password' | 're_new_password'
            >,
            unknown
          >,
          (
            fieldName: keyof Pick<
              PasswordResetConfirmRequestData,
              'new_password' | 're_new_password'
            >,
            fieldError: string
          ) =>
            setError(fieldName, {
              message: fieldError,
              type: 'manual',
            }),
          'new_password',
          're_new_password'
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
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar
          sx={{
            backgroundColor: 'primary.main',
            m: 1,
          }}
        >
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" sx={{ mt: 1 }} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="new_password"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    error={Boolean(errors.new_password)}
                    helperText={errors.new_password?.message}
                    required
                    fullWidth
                    name="new_password"
                    label="Password"
                    type="password"
                    id="new_password"
                    autoFocus
                    autoComplete="new-password"
                    onChange={onChange}
                    value={value ?? ''}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="re_new_password"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    error={Boolean(errors.re_new_password)}
                    helperText={errors.re_new_password?.message}
                    required
                    fullWidth
                    name="re_new_password"
                    label="Repeat password"
                    type="password"
                    id="re_new_password"
                    autoFocus
                    autoComplete="new-password"
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
            Submit
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const params = context.params
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
    props: { ...params },
  }
}

export default PasswordResetConfirmPage
