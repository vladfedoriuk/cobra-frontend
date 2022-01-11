import {
  ProjectEpics,
  ProjectInfo as ProjectInfoData,
  ProjectIssues as ProjectIssuesType,
} from '@typings/projectStore'
import { IssueStatusType } from '@typings/utils'
import React, { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { observer } from 'mobx-react-lite'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import {
  Chip,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material'
import List from './List'
import useMobXStores from '@hooks/stores'
import { snackbar } from '@typings/snackbarStore'
import {
  filterIssuesByType,
  transformProjectEpics,
  transformProjectIssues,
} from '@utils/project'
import CircleIcon from '@mui/icons-material/Circle'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { IssueType } from '@typings/utils'
import Router from 'next/router'
import { ListChildComponentProps } from 'react-window'

type ProjectInfoProps = {
  project: ProjectInfoData
}

export type ColorType =
  | 'secondary'
  | 'primary'
  | 'success'
  | 'error'
  | 'inherit'
  | 'disabled'
  | 'action'
  | 'info'
  | 'warning'

export type ChipColorType =
  | 'secondary'
  | 'primary'
  | 'success'
  | 'error'
  | 'info'
  | 'warning'
  | 'default'

type TabOptions = IssueType | 'epic'

export const bulletColorMap = new Map<TabOptions, ColorType>([
  ['epic', 'secondary'],
  ['task', 'primary'],
  ['user-story', 'success'],
  ['bug', 'error'],
])

export const statusChipColorMap = new Map<IssueStatusType, ChipColorType>([
  ['new', 'secondary'],
  ['in-progress', 'primary'],
  ['closed', 'info'],
  ['release-ready', 'success'],
])

export const renderEpic = (
  props: ListChildComponentProps
): React.ReactElement => {
  const { index, style, data } = props
  const {
    id,
    title,
    creator: { fullName, username },
  } = data[index]
  return (
    <ListItem
      key={index}
      style={style}
      component="div"
      disablePadding
      secondaryAction={
        <IconButton
          edge="end"
          aria-label="see"
          onClick={() => {
            Router.push(`/epic/${id}`)
          }}
        >
          <VisibilityIcon />
        </IconButton>
      }
    >
      <ListItemIcon>
        <CircleIcon color={bulletColorMap.get('epic')} />
      </ListItemIcon>
      <ListItemText
        primary={title}
        secondary={
          <React.Fragment>
            <Typography component="div" variant="body2">
              {fullName}
              <Typography
                component="div"
                variant="caption"
                color="text.secondary"
              >
                {username}
              </Typography>
            </Typography>
          </React.Fragment>
        }
      />
    </ListItem>
  )
}

export const renderIssue = (
  props: ListChildComponentProps
): React.ReactElement => {
  const { index, style, data } = props
  const {
    id,
    title,
    status,
    type,
    assignee,
    creator: { fullName, username },
  } = data[index]
  return (
    <ListItem
      key={index}
      style={style}
      component="div"
      disablePadding
      secondaryAction={
        <IconButton
          edge="end"
          aria-label="see"
          onClick={() => {
            Router.push(`/issue/${id}`)
          }}
        >
          <VisibilityIcon />
        </IconButton>
      }
    >
      <ListItemIcon>
        <CircleIcon color={bulletColorMap.get(type)} />
      </ListItemIcon>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        divider={<Divider flexItem orientation="vertical" />}
        spacing={1}
      >
        <Typography component="div" variant="body2" sx={{ width: '175px' }}>
          {title}
          <Typography component="div" variant="body2">
            {fullName}
            <Typography
              component="div"
              variant="caption"
              color="text.secondary"
            >
              {username}
            </Typography>
          </Typography>
        </Typography>

        <Chip
          sx={{ width: '100px' }}
          label={status}
          color={statusChipColorMap.get(status)}
          variant="outlined"
        />
        <Typography component="div" variant="body2" sx={{ width: '175px' }}>
          Assignee
          {assignee ? (
            <Typography component="div" variant="body2">
              {assignee?.fullName}
              <Typography
                component="div"
                variant="caption"
                color="text.secondary"
              >
                {assignee?.username}
              </Typography>
            </Typography>
          ) : (
            <Typography component="div" variant="caption">
              no assignee yet
            </Typography>
          )}
        </Typography>
      </Stack>
    </ListItem>
  )
}

const ProjectIssues: React.FC<ProjectInfoProps> = (
  props
): React.ReactElement => {
  const {
    project: { id },
  } = props
  const { projects: projectsStore, snackbars: snackbarStore } = useMobXStores()
  const [value, setValue] = useState<TabOptions>('epic')
  const [epicsData, setEpicsData] = useState<ProjectEpics>([])
  const [tasksData, setTasksData] = useState<ProjectIssuesType>([])
  const [bugsData, setBugsData] = useState<ProjectIssuesType>([])
  const [userStoriesData, setUserStoriesData] = useState<ProjectIssuesType>([])

  const commonOnBadRequest = () => {
    snackbarStore.push(
      snackbar(
        'Cannot conect to the server. Please, verify your connection.',
        'error'
      )
    )
  }

  useEffect(() => {
    projectsStore?.getProjectEpics(
      id,
      (data) => {
        setEpicsData(transformProjectEpics(data))
      },
      () => {
        snackbarStore.push(
          snackbar('Cannot fetch the project epics. Try again later.', 'error')
        )
      },
      commonOnBadRequest
    )
  }, [])
  useEffect(() => {
    projectsStore?.getProjectIssues(
      id,
      (data) => {
        const issues = transformProjectIssues(data)
        setTasksData(filterIssuesByType(issues, 'task'))
        setBugsData(filterIssuesByType(issues, 'bug'))
        setUserStoriesData(filterIssuesByType(issues, 'user-story'))
      },
      () => {
        snackbarStore.push(
          snackbar('Cannot fetch the project issues. Try again later.', 'error')
        )
      },
      commonOnBadRequest
    )
  }, [])

  const handleChange = (event: React.SyntheticEvent, newValue) => {
    setValue(newValue)
  }

  const getListData = (
    option: TabOptions
  ): ProjectEpics | ProjectIssuesType => {
    if (option === 'epic') {
      return epicsData
    }
    if (option === 'task') {
      return tasksData
    }
    if (option === 'bug') {
      return bugsData
    }
    if (option === 'user-story') {
      return userStoriesData
    }
    return []
  }

  const getRenderFunction = (option: TabOptions) => {
    if (option === 'epic') {
      return renderEpic
    }
    return renderIssue
  }

  const listData = getListData(value)

  const addButtonText = value === 'epic' ? 'Add an epic' : 'Add an issue'

  return (
    <>
      <Card sx={{ minWidth: '400px', borderRadius: 2 }} elevation={6}>
        <CardContent>
          <Tabs
            value={value}
            onChange={handleChange}
            centered
            variant="fullWidth"
          >
            <Tab value="epic" label="Epics" />
            <Tab value="task" label="Tasks" />
            <Tab value="bug" label="Bugs" />
            <Tab value="user-story" label="User Stories" />
          </Tabs>
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            divider={<Divider flexItem />}
            spacing={2}
            sx={{ mt: 4 }}
          >
            <Button variant="contained" color="success">
              {addButtonText}
            </Button>
            <List
              height={300}
              width={600}
              itemSize={80}
              itemCount={listData?.length ?? 0}
              overscanCount={5}
              renderRow={getRenderFunction(value)}
              itemData={listData}
              boxSx={{
                width: 'auto',
              }}
            />
          </Stack>
        </CardContent>
      </Card>
    </>
  )
}

export default observer(ProjectIssues)
