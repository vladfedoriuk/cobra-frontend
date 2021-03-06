import ProfileHeader from '@components/Profile/ProfileHeader'
import useMobXStores from '@hooks/stores'
import React, { useEffect, useState } from 'react'
import EditIcon from '@mui/icons-material/Edit'
import Box from '@mui/system/Box'
import IconButton from '@mui/material/IconButton'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  PatchProfileErrorData,
  PatchProfileRequestData,
} from '@typings/userApi'
import { Controller, useForm } from 'react-hook-form'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { snackbar } from '@typings/snackbarStore'
import { handleFieldsErrors, handleDetailError } from '@utils/errors'
import Alert from '@mui/material/Alert'
import { observer } from 'mobx-react-lite'
import UserApi from '@api/user'
import { GetServerSideProps } from 'next'

const schema = yup
  .object({
    username: yup.string(),
    email: yup.string().email(),
    first_name: yup.string(),
    last_name: yup.string(),
  })
  .required()

const Profile: React.FC = (): React.ReactElement => {
  const { user: userStore, snackbars: snackbarStore } = useMobXStores()

  useEffect(() => {
    userStore?.getProfile(
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      () => {},
      () => {
        snackbarStore.push(
          snackbar(
            'Failed to reload the profile. Please, try once again later.',
            'error'
          )
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
  }, [])

  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm<PatchProfileRequestData>({
    resolver: yupResolver(schema),
  })
  const [formOpen, setFormOpen] = useState(false)
  const onSubmit = async (data: PatchProfileRequestData) => {
    await userStore?.patchProfile(
      data,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      () => {},
      (errorsData: PatchProfileErrorData) => {
        handleFieldsErrors(
          errorsData as Record<keyof PatchProfileRequestData, unknown>,
          (fieldName: keyof PatchProfileRequestData, fieldError: string) =>
            setError(fieldName, {
              message: fieldError,
              type: 'manual',
            }),
          'username',
          'email',
          'first_name',
          'last_name'
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

  if (userStore.isUserEmpty) {
    return null
  }
  return (
    <Stack>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
        }}
      >
        <ProfileHeader user={userStore.user} />
        <Box>
          <IconButton
            aria-label="edit profile"
            component="span"
            onClick={() => setFormOpen((prevValue) => !prevValue)}
            sx={{ ...(formOpen && { color: 'success.main' }) }}
          >
            <EditIcon />
          </IconButton>
        </Box>
      </Box>
      {formOpen && (
        <Box
          component="form"
          noValidate
          sx={{
            mt: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            maxWidth: '14rem',
            '& .MuiTextField-root': { mt: 1 },
          }}
        >
          <Typography component="h3" variant="h5">
            Change your data
          </Typography>
          <Alert severity="warning">
            Changing email will require activating the account once again
          </Alert>
          <Controller
            name="username"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField
                variant="standard"
                error={Boolean(errors.username)}
                helperText={errors.username?.message}
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                onChange={onChange}
                value={value ?? userStore?.user?.username ?? ''}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField
                variant="standard"
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={onChange}
                value={value ?? userStore?.user?.email ?? ''}
              />
            )}
          />
          <Controller
            name="first_name"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField
                variant="standard"
                error={Boolean(errors.first_name)}
                helperText={errors.first_name?.message}
                autoComplete="given-name"
                name="first_name"
                fullWidth
                id="first_name"
                label="First Name"
                onChange={onChange}
                value={value ?? userStore?.user?.firstName ?? ''}
              />
            )}
          />
          <Controller
            name="last_name"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField
                variant="standard"
                error={Boolean(errors.last_name)}
                helperText={errors.last_name?.message}
                autoComplete="family-name"
                name="last_name"
                fullWidth
                id="last_name"
                label="Last Name"
                onChange={onChange}
                value={value ?? userStore?.user?.lastName ?? ''}
              />
            )}
          />
          <Button
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              mb: 2,
            }}
            onClick={handleSubmit(onSubmit)}
          >
            Save
          </Button>
        </Box>
      )}
    </Stack>
  )
}

export default observer(Profile)

export const getServerSideProps: GetServerSideProps = async (context) => {
  const api = new UserApi()
  const isAuthenticated = await api.isAuthenticated(context)
  if (!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }
  return {
    props: {},
  }
}
