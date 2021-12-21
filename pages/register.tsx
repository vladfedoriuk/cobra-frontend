import Container from '@mui/material/Container'
import Box from '@mui/system/Box'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import React from 'react'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import useMobXStores from '@hooks/stores'
import { RegisterErrorsData, RegisterRequestData } from '@typings/userApi'
import { Controller, useForm } from 'react-hook-form'
import Router from 'next/router'
import UserApi from '@api/user'
import { GetServerSideProps } from 'next'

const schema = yup.object({
  username: yup.string().required(),
  first_name: yup.string().required('first name is a required field.'),
  last_name: yup.string().required('last name is a required field.'),
  email: yup.string().required(),
  password: yup.string().required(),
  re_password: yup
    .string()
    .required('repeat password is a required field.')
    .test('passwords-match', 'passwords must match', function (value) {
      return this.parent.password === value
    }),
})

const Register: React.FC = (): React.ReactElement => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm<RegisterRequestData>({
    resolver: yupResolver(schema),
  })
  const onSubmit = async (data: RegisterRequestData) => {
    await userStore?.register(
      data,
      () => {
        Router.push('/')
      },
      (errorsData: RegisterErrorsData) => {
        const fields = new Array<keyof RegisterRequestData>(
          'username',
          'email',
          'first_name',
          'last_name',
          'password',
          're_password'
        )
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
      }
    )
  }
  const { user: userStore } = useMobXStores()
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
            bgcolor: 'success.main',
            m: 1,
          }}
        >
          <AddCircleOutlineOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" noValidate sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="first_name"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    error={Boolean(errors.first_name)}
                    helperText={errors.first_name?.message}
                    autoComplete="given-name"
                    name="first_name"
                    required
                    fullWidth
                    id="first_name"
                    label="First Name"
                    autoFocus
                    color="success"
                    onChange={onChange}
                    value={value ?? ''}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="last_name"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    error={Boolean(errors.last_name)}
                    helperText={errors.last_name?.message}
                    autoComplete="family-name"
                    name="last_name"
                    required
                    fullWidth
                    id="last_name"
                    label="Last Name"
                    autoFocus
                    color="success"
                    onChange={onChange}
                    value={value ?? ''}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="username"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    error={Boolean(errors.username)}
                    helperText={errors.username?.message}
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    color="success"
                    onChange={onChange}
                    value={value ?? ''}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
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
                    color="success"
                    onChange={onChange}
                    value={value ?? ''}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="password"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    error={Boolean(errors.password)}
                    helperText={errors.password?.message}
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    color="success"
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
                name="re_password"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    error={Boolean(errors.re_password)}
                    helperText={errors.re_password?.message}
                    required
                    fullWidth
                    name="re_password"
                    label="Repeat password"
                    type="password"
                    id="re_password"
                    color="success"
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
            color="success"
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSubmit(onSubmit)}
          >
            Sign up
          </Button>
          <Grid container justifyContent="flex-end" sx={{ mb: 2 }}>
            <Grid item>
              <Link
                href="/login"
                variant="body2"
                sx={{ color: 'success.main' }}
              >
                Already have an account? Sign in
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

export default Register
