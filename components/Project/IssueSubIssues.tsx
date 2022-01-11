import { Issue as IssueType } from '@typings/projectStore'
import React, { useEffect, useState } from 'react'
import Divider from '@mui/material/Divider'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import { observer } from 'mobx-react-lite'
import useMobXStores from '@hooks/stores'
import { snackbar } from '@typings/snackbarStore'
import { transformProjectIssues } from '@utils/project'
import { ProjectIssues as ProjectIssuesType } from '@typings/projectStore'
import List from './List'
import { renderIssue } from './ProjectIssues'
import Typography from '@mui/material/Typography'

type IssueSubIssuesProps = {
  issue: IssueType
}

const IssueSubIssues: React.FC<IssueSubIssuesProps> = (
  props
): React.ReactElement => {
  const {
    issue: { id },
  } = props
  const { projects: projectsStore, snackbars: snackbarStore } = useMobXStores()

  const [issuesData, setIssuesData] = useState<ProjectIssuesType>([])

  const commonOnBadRequest = () => {
    snackbarStore.push(
      snackbar(
        'Cannot conect to the server. Please, verify your connection.',
        'error'
      )
    )
  }

  useEffect(() => {
    projectsStore?.getIssueSubIssues(
      id,
      (data) => {
        setIssuesData(transformProjectIssues(data))
      },
      () => {
        snackbarStore.push(
          snackbar(
            'Cannot fetch the issue sub-issues. Try again later.',
            'error'
          )
        )
      },
      commonOnBadRequest
    )
  }, [id])

  return (
    <Card sx={{ minWidth: '400px', borderRadius: 2 }} elevation={6}>
      <CardContent>
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          divider={<Divider flexItem />}
          spacing={2}
        >
          <Typography component="div" variant="h6">
            Issues
          </Typography>
          <List
            height={300}
            width={600}
            itemSize={80}
            itemCount={issuesData?.length ?? 0}
            overscanCount={5}
            renderRow={renderIssue}
            itemData={issuesData}
            boxSx={{
              width: 'auto',
            }}
          />
        </Stack>
      </CardContent>
    </Card>
  )
}

export default observer(IssueSubIssues)
