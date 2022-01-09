import { yupResolver } from '@hookform/resolvers/yup'
import useMobXStores from '@hooks/stores'
import { Autocomplete, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import TextField from '@mui/material/TextField'
import Box from '@mui/system/Box'
import {
  CreateProjectInvitationErrorsData,
  CreateProjectInvitationResponseData,
  CreateProjectInvitationRequestData,
} from '@typings/projectApi'
import { snackbar } from '@typings/snackbarStore'
import { UserProfile } from '@typings/userStore'
import {
  handleFieldsErrors,
  handleDetailError,
  handleListErrors,
  handleProjectInvitationErrors,
} from '@utils/errors'
import { transformUsersData } from '@utils/user'
import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'

const schema = yup
  .object({
    email: yup.string().required(),
  })
  .required()

type InvitationFormProps = {
  onSuccess: (data: CreateProjectInvitationResponseData) => void
  projectId: number
}

const InvitationForm: React.FC<InvitationFormProps> = ({
  projectId,
  onSuccess,
}): React.ReactElement => {
  const {
    projects: projectsStore,
    snackbars: snackbarStore,
    user: userStore,
  } = useMobXStores()
  const [userOptions, setUserOptions] = useState<Array<UserProfile>>([])

  useEffect(() => {
    userStore.getUsers((usersData) =>
      setUserOptions(transformUsersData(usersData))
    )
  }, [])
  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm<CreateProjectInvitationRequestData>({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data: CreateProjectInvitationRequestData) => {
    await projectsStore?.createInvitation(
      projectId,
      data,
      (data: CreateProjectInvitationResponseData) => {
        onSuccess(data)
      },
      (errorsData: CreateProjectInvitationErrorsData) => {
        handleListErrors(errorsData, (message) =>
          snackbarStore.push(snackbar(message, 'error'))
        )
        handleFieldsErrors(
          errorsData as Record<
            keyof CreateProjectInvitationRequestData,
            unknown
          >,
          (
            fieldName: keyof CreateProjectInvitationRequestData,
            fieldError: string
          ) =>
            setError(fieldName, {
              message: fieldError,
              type: 'manual',
            }),
          'email'
        )
        handleDetailError(errorsData, (detail) =>
          snackbarStore.push(snackbar(detail, 'error'))
        )
        handleProjectInvitationErrors(errorsData, (detail) =>
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
        component="form"
        noValidate
        autoComplete="off"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          '& .MuiTextField-root': { mt: 1 },
          m: 1,
        }}
      >
        <Controller
          name="email"
          control={control}
          render={(props) => (
            <Autocomplete
              {...props}
              options={userOptions}
              getOptionLabel={({ email }) => email}
              renderOption={(props, option) => (
                <Typography {...props}>
                  {`${option.fullName} (${option.username})`}
                </Typography>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Choose a user"
                  variant="outlined"
                  helperText={errors?.email?.message}
                  error={Boolean(errors.email)}
                />
              )}
              onChange={(_, data) =>
                props.field.onChange((data as UserProfile)?.email)
              }
            />
          )}
        />
        <Button
          variant="contained"
          sx={{
            mt: 3,
            mb: 2,
          }}
          color="success"
          fullWidth
          onClick={handleSubmit(onSubmit)}
        >
          Send
        </Button>
      </Box>
    </Container>
  )
}

export default observer(InvitationForm)
