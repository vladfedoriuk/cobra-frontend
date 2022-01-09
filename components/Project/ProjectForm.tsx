import { yupResolver } from '@hookform/resolvers/yup'
import useMobXStores from '@hooks/stores'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import TextField from '@mui/material/TextField'
import Box from '@mui/system/Box'
import {
  CreateProjectErrorsData,
  CreateProjectRequestData,
  CreateProjectResponseData,
} from '@typings/projectApi'
import { snackbar } from '@typings/snackbarStore'
import {
  handleFieldsErrors,
  handleDetailError,
  handleListErrors,
} from '@utils/errors'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'

const schema = yup
  .object({
    title: yup.string().required(),
    description: yup.string(),
  })
  .required()

type ProjectFormProps = {
  onSuccess: (data: CreateProjectResponseData) => void
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  onSuccess,
}): React.ReactElement => {
  const { projects: projectsStore, snackbars: snackbarStore } = useMobXStores()
  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm<CreateProjectRequestData>({
    resolver: yupResolver(schema),
  })
  const onSubmit = async (data: CreateProjectRequestData) => {
    await projectsStore?.createProject(
      data,
      (data: CreateProjectResponseData) => {
        onSuccess(data)
      },
      (errorsData: CreateProjectErrorsData) => {
        handleListErrors(errorsData, (message) =>
          snackbarStore.push(snackbar(message, 'error'))
        )
        handleFieldsErrors(
          errorsData as Record<keyof CreateProjectRequestData, unknown>,
          (fieldName: keyof CreateProjectRequestData, fieldError: string) =>
            setError(fieldName, {
              message: fieldError,
              type: 'manual',
            }),
          'title',
          'description'
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
          name="title"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextField
              error={Boolean(errors.title)}
              helperText={errors.title?.message}
              required
              fullWidth
              id="title"
              label="Title"
              name="title"
              autoFocus
              onChange={onChange}
              value={value ?? ''}
            />
          )}
        />
        <Controller
          name="description"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextField
              variant="standard"
              error={Boolean(errors.description)}
              helperText={errors.description?.message}
              fullWidth
              multiline
              id="description"
              label="Description"
              name="description"
              onChange={onChange}
              value={value ?? ''}
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
          Save
        </Button>
      </Box>
    </Container>
  )
}

export default observer(ProjectForm)
