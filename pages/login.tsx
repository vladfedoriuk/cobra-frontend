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
import Link from '@mui/material/Link'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoginErrorsData, LoginRequestData } from '@typings/userApi'
import { snackbar } from '@typings/snackbarStore'

const schema = yup
  .object({
    username: yup.string().required(),
    password: yup.string().required(),
  })
  .required()

const LoginPage: React.FC = (): React.ReactElement => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm<LoginRequestData>({
    resolver: yupResolver(schema),
  })
  const { user: userStore, snackbars: snackbarStore } = useMobXStores()
  const onSubmit = async (data: LoginRequestData) => {
    await userStore?.login(
      data,
      () => {
        Router.push('/')
      },
      (errorsData: LoginErrorsData) => {
        const fields = new Array<keyof LoginRequestData>('username', 'password')
        fields.forEach((value, _) => {
          if (value in errorsData) {
            let message = null
            if (typeof errorsData[value] == 'string') {
              message = errorsData[value]
            } else if (Array.isArray(errorsData[value])) {
              message = errorsData[value][0]
            }
            if (message) {
              setError(value, {
                message,
                type: 'manual',
              })
            }
          }
        })
        if ('detail' in errorsData) {
          if (typeof errorsData.detail === 'string') {
            snackbarStore.push(snackbar(errorsData.detail, 'error'))
          }
        }
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
          <Controller
            name="username"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField
                error={Boolean(errors.username)}
                helperText={errors.username?.message}
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                onChange={onChange}
                value={value ?? ''}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
                margin="normal"
                required
                fullWidth
                id="password"
                label="Password"
                name="password"
                autoComplete="current-password"
                type="password"
                onChange={onChange}
                value={value ?? ''}
              />
            )}
          />
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSubmit(onSubmit)}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
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

export default LoginPage
