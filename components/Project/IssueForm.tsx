import { yupResolver } from '@hookform/resolvers/yup'
import useMobXStores from '@hooks/stores'
import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Box from '@mui/system/Box'
import {
  CreateProjectIssueErrorsData,
  CreateProjectIssueRequestData,
  CreateProjectIssueResponseData,
} from '@typings/projectApi'
import {
  ProjectEpics,
  ProjectIssue,
  ProjectIssues,
  ProjectUser,
} from '@typings/projectStore'
import { snackbar } from '@typings/snackbarStore'
import { ArrayElement } from '@typings/utils'
import {
  handleFieldsErrors,
  handleDetailError,
  handleListErrors,
} from '@utils/errors'
import {
  transformProjectEpics,
  transformProjectIssues,
  transformProjectMembershipsData,
} from '@utils/project'
import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'

const schema = yup
  .object({
    title: yup.string().required(),
    description: yup.string(),
    type: yup.string().oneOf(['task', 'bug', 'user-story']).defined(),
    assignee: yup.number(),
    parent: yup.number(),
    epic: yup.number(),
    estimate: yup.number().typeError('Must be a number').positive().required(),
  })
  .required()

type IssueFormProps = {
  projectId: number
  onSuccess: (data: CreateProjectIssueResponseData) => void
}

const IssueForm: React.FC<IssueFormProps> = ({
  projectId,
  onSuccess,
}): React.ReactElement => {
  const { projects: projectsStore, snackbars: snackbarStore } = useMobXStores()
  const [users, setUsers] = useState<Array<ProjectUser>>([])
  const [epics, setEpics] = useState<ProjectEpics>([])
  const [issues, setIssues] = useState<ProjectIssues>([])

  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm<CreateProjectIssueRequestData>({
    resolver: yupResolver(schema),
  })
  const commonOnBadRequest = () => {
    snackbarStore.push(
      snackbar(
        'Cannot conect to the server. Please, verify your connection.',
        'error'
      )
    )
  }

  const onSubmit = async (data: CreateProjectIssueRequestData) => {
    await projectsStore?.createProjectIssue(
      projectId,
      data,
      (data: CreateProjectIssueResponseData) => {
        onSuccess(data)
      },
      (errorsData: CreateProjectIssueErrorsData) => {
        handleListErrors(errorsData, (message) =>
          snackbarStore.push(snackbar(message, 'error'))
        )
        handleFieldsErrors(
          errorsData as Record<keyof CreateProjectIssueRequestData, unknown>,
          (
            fieldName: keyof CreateProjectIssueRequestData,
            fieldError: string
          ) =>
            setError(fieldName, {
              message: fieldError,
              type: 'manual',
            }),
          'title',
          'description',
          'type',
          'assignee',
          'parent',
          'epic',
          'estimate'
        )
        handleDetailError(errorsData, (detail) =>
          snackbarStore.push(snackbar(detail, 'error'))
        )
      },
      commonOnBadRequest
    )
  }

  useEffect(() => {
    projectsStore.getProjectMemberships(
      projectId,
      (data) => {
        setUsers(transformProjectMembershipsData(data).map(({ user }) => user))
      },
      () => {
        snackbarStore.push(
          snackbar(
            'Cannot fetch the project members. Try again later.',
            'error'
          )
        )
      },
      commonOnBadRequest
    )
  }, [projectId])

  useEffect(() => {
    projectsStore?.getProjectEpics(
      projectId,
      (data) => {
        setEpics(transformProjectEpics(data))
      },
      () => {
        snackbarStore.push(
          snackbar('Cannot fetch the project epics. Try again later.', 'error')
        )
      },
      commonOnBadRequest
    )
  }, [projectId])

  useEffect(() => {
    projectsStore?.getProjectIssues(
      projectId,
      (data) => {
        setIssues(transformProjectIssues(data))
      },
      () => {
        snackbarStore.push(
          snackbar('Cannot fetch the project issues. Try again later.', 'error')
        )
      },
      commonOnBadRequest
    )
  }, [projectId])

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
          name="type"
          control={control}
          render={({ field: { onChange, value } }) => (
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={value}
                label="Type"
                onChange={onChange}
                error={Boolean(errors.type)}
              >
                <MenuItem value="bug">Bug</MenuItem>
                <MenuItem value="task">Task</MenuItem>
                <MenuItem value="user-story">User Story</MenuItem>
              </Select>
            </FormControl>
          )}
        />
        <Controller
          name="estimate"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextField
              error={Boolean(errors.estimate)}
              helperText={errors.estimate?.message}
              inputProps={{
                inputMode: 'numeric',
                pattern: '[0-9]{3}.[0-9]{2}',
              }}
              required
              fullWidth
              id="estimate"
              label="Time estimate"
              name="estimate"
              autoFocus
              onChange={onChange}
              value={value ?? ''}
            />
          )}
        />
        <Controller
          name="assignee"
          control={control}
          render={(props) => (
            <Autocomplete
              {...props}
              options={users}
              getOptionLabel={({ fullName }) => fullName}
              renderOption={(props, option) => (
                <Typography {...props}>
                  {`${option.fullName} (${option.username})`}
                </Typography>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Assignee"
                  variant="outlined"
                  helperText={errors?.assignee?.message}
                  error={Boolean(errors.assignee)}
                />
              )}
              onChange={(_, data) =>
                props.field.onChange((data as ProjectUser)?.id)
              }
            />
          )}
        />
        <Controller
          name="parent"
          control={control}
          render={(props) => (
            <Autocomplete
              {...props}
              options={issues}
              getOptionLabel={({ title }) => title}
              renderOption={(props, option) => (
                <Typography {...props}>{`${option.title}`}</Typography>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Parent issues"
                  variant="outlined"
                  helperText={errors?.parent?.message}
                  error={Boolean(errors.parent)}
                />
              )}
              onChange={(_, data) =>
                props.field.onChange((data as ProjectIssue)?.id)
              }
            />
          )}
        />
        <Controller
          name="epic"
          control={control}
          render={(props) => (
            <Autocomplete
              {...props}
              options={epics}
              getOptionLabel={({ title }) => title}
              renderOption={(props, option) => (
                <Typography {...props}>{`${option.title}`}</Typography>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Epic"
                  variant="outlined"
                  helperText={errors?.epic?.message}
                  error={Boolean(errors.epic)}
                />
              )}
              onChange={(_, data) =>
                props.field.onChange((data as ArrayElement<ProjectEpics>)?.id)
              }
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

export default observer(IssueForm)
