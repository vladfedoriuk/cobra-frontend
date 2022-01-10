import Typography from '@mui/material/Typography'
import {
  ProjectInfo as ProjectInfoData,
  ProjectMemberships,
} from '@typings/projectStore'
import React, { useState } from 'react'
import Divider from '@mui/material/Divider'
import Avatar from '@mui/material/Avatar'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import { fullNameToInitials } from '@utils/common'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Box from '@mui/system/Box'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Chip from '@mui/material/Chip'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import ListItemIcon from '@mui/material/ListItemIcon'
import { isProjectCreatorOrMaintainer } from '@utils/project'
import useMobXStores from '@hooks/stores'
import { snackbar } from '@typings/snackbarStore'
import { observer } from 'mobx-react-lite'
import Modal from '@components/Modal'
import InvitationForm from './InvitationForm'
import { CreateProjectInvitationResponseData } from '@typings/projectApi'
import List from './List'

type ProjectInfoProps = {
  project: ProjectInfoData
  memberships: ProjectMemberships | null
}

const renderRow = (props): React.ReactElement => {
  const { index, style, data } = props
  const {
    role,
    user: { fullName, username },
  } = data[index]
  return (
    <ListItem key={index} style={style} component="div" disablePadding>
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'success.main' }} aria-label="memners">
          {fullNameToInitials(fullName)}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <React.Fragment>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Typography component="div" variant="body1">
                {fullName}
                <Typography
                  component="div"
                  variant="body2"
                  color="text.secondary"
                >
                  {username}
                </Typography>
              </Typography>

              <Chip
                label={role}
                color={role == 'maintainer' ? 'success' : 'info'}
                variant="outlined"
                sx={{
                  mt: 1,
                  width: '100px',
                }}
              />
            </Box>
          </React.Fragment>
        }
      />
    </ListItem>
  )
}

const ProjectInfo: React.FC<ProjectInfoProps> = (props): React.ReactElement => {
  const {
    project: { id, title, description, creator, isCreator, membershipRole },
    memberships,
  } = props

  const { snackbars: snackbarStore } = useMobXStores()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  const [openSendInvitationModal, setOpenSendInvitationModal] = useState(false)

  const handleOpenSendInvitationModal = () => {
    setOpenSendInvitationModal(true)
  }

  const handleCloseSendInvitationModal = () => {
    setOpenSendInvitationModal(false)
  }

  const onSuccessfulSend = (data: CreateProjectInvitationResponseData) => {
    const {
      user: { full_name },
      project: { title },
    } = data
    handleCloseSendInvitationModal()
    snackbarStore.push(
      snackbar(
        `The invitation email has been sent to a user ${full_name} to join ${title}`,
        'success'
      )
    )
  }

  return (
    <>
      <Card sx={{ minWidth: '400px', borderRadius: 2 }} elevation={6}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: 'success.main' }} aria-label="creator">
              {fullNameToInitials(creator?.fullName)}
            </Avatar>
          }
          title={creator?.fullName}
          subheader={creator?.username}
          titleTypographyProps={{
            variant: 'subtitle1',
            component: 'div',
            color: 'text.secondary',
          }}
          action={
            isProjectCreatorOrMaintainer(isCreator, membershipRole) ? (
              <Box sx={{ flexGrow: 0 }}>
                <IconButton aria-label="actions" onClick={handleMenu}>
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem
                    onClick={() => {
                      handleClose()
                      handleOpenSendInvitationModal()
                    }}
                  >
                    <ListItemIcon>
                      <AddCircleOutlineIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Invite a user</ListItemText>
                  </MenuItem>
                </Menu>
              </Box>
            ) : null
          }
        />
        <Divider light />
        <CardContent>
          <Typography variant="h4" component="div" sx={{ mb: 2 }}>
            {title}
          </Typography>
          {description && (
            <>
              <Divider sx={{ m: 1 }} light />
              <Typography variant="body1" color="text.secondary">
                {description}
              </Typography>
            </>
          )}
          {memberships?.length !== 0 && (
            <>
              <Divider sx={{ m: 1 }} light />
              <Typography variant="h6" component="div" sx={{ mb: 2 }}>
                Memberships
              </Typography>
              <List
                height={300}
                width={360}
                itemSize={50}
                itemCount={memberships?.length ?? 0}
                overscanCount={5}
                itemData={memberships}
                boxSx={{ maxWidth: 'sm' }}
                renderRow={renderRow}
              />
            </>
          )}
        </CardContent>
      </Card>
      <Modal
        title="Invite a user"
        open={openSendInvitationModal}
        onClose={handleCloseSendInvitationModal}
      >
        <InvitationForm onSuccess={onSuccessfulSend} projectId={id} />
      </Modal>
    </>
  )
}

export default observer(ProjectInfo)
