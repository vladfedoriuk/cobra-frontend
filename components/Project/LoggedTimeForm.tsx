import { yupResolver } from '@hookform/resolvers/yup'
import useMobXStores from '@hooks/stores'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import TextField from '@mui/material/TextField'
import Box from '@mui/system/Box'
import {
  CreateIssueLoggedTimeErrorsData,
  CreateIssueLoggedTimeRequestData,
  CreateIssueLoggedTimeResponseData,
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
    time: yup.number().typeError('Must be a number').positive().required(),
    comment: yup.string(),
  })
  .required()

type LoggedTimeFormProps = {
  issueId: number
  onSuccess: (data: CreateIssueLoggedTimeResponseData) => void
}

const LoggedTimeForm: React.FC<LoggedTimeFormProps> = ({
  issueId,
  onSuccess,
}): React.ReactElement => {
  const { projects: projectsStore, snackbars: snackbarStore } = useMobXStores()
  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm<CreateIssueLoggedTimeRequestData>({
    resolver: yupResolver(schema),
  })
  const onSubmit = async (data: CreateIssueLoggedTimeRequestData) => {
    await projectsStore?.createIssueLoggedTime(
      issueId,
      data,
      (data: CreateIssueLoggedTimeResponseData) => {
        onSuccess(data)
      },
      (errorsData: CreateIssueLoggedTimeErrorsData) => {
        handleListErrors(errorsData, (message) =>
          snackbarStore.push(snackbar(message, 'error'))
        )
        handleFieldsErrors(
          errorsData as Record<keyof CreateIssueLoggedTimeRequestData, unknown>,
          (
            fieldName: keyof CreateIssueLoggedTimeRequestData,
            fieldError: string
          ) =>
            setError(fieldName, {
              message: fieldError,
              type: 'manual',
            }),
          'time',
          'comment'
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
          '& .MuiTextField-root, .MuiFormControl-root': { mt: 1 },
          m: 1,
        }}
      >
        <Controller
          name="time"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextField
              error={Boolean(errors.time)}
              helperText={errors.time?.message}
              inputProps={{
                inputMode: 'numeric',
                pattern: '[0-9]{3}.[0-9]{2}',
              }}
              required
              fullWidth
              id="time"
              label="Spent time"
              name="time"
              autoFocus
              onChange={onChange}
              value={value ?? ''}
            />
          )}
        />
        <Controller
          name="comment"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextField
              variant="standard"
              error={Boolean(errors.comment)}
              helperText={errors.comment?.message}
              fullWidth
              multiline
              id="comment"
              label="Comment"
              name="comment"
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

export default observer(LoggedTimeForm)
