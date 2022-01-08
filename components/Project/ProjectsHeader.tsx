import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import React, { useState } from 'react'

import ProjectForm from './ProjectForm'
import { observer } from 'mobx-react-lite'
import useMobXStores from '@hooks/stores'
import { snackbar } from '@typings/snackbarStore'
import Modal from '@components/Modal'

const ProjectsHeader: React.FC = (): React.ReactElement => {
  const { projects: projectsStore, snackbars: snackbarStore } = useMobXStores()
  const [openProjectModal, setOpenProjectModal] = useState(false)

  const handleOpenProjectModal = () => {
    setOpenProjectModal(true)
  }

  const handleCloseProjectModal = () => {
    setOpenProjectModal(false)
  }

  const onSuccessfulCreate = () => {
    handleCloseProjectModal()
    projectsStore.getProjects(
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      () => {},
      () => {
        snackbarStore.push(
          snackbar(
            'Failed to reload the projects. Please, try once again later.',
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
  }

  return (
    <>
      <Stack direction="row">
        <Typography component="div" variant="h4">
          Projects
        </Typography>
        <IconButton
          sx={{ color: 'success.main' }}
          aria-label="add a project"
          component="span"
          onClick={handleOpenProjectModal}
        >
          <AddCircleOutlineIcon
            sx={{
              width: (theme) => theme.spacing(3.75),
              height: (theme) => theme.spacing(3.75),
            }}
          />
        </IconButton>
      </Stack>
      <Modal
        title="Add a project"
        open={openProjectModal}
        onClose={handleCloseProjectModal}
      >
        <ProjectForm onSuccess={onSuccessfulCreate} />
      </Modal>
    </>
  )
}

export default observer(ProjectsHeader)
