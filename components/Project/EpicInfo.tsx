import Typography from '@mui/material/Typography'
import { Epic } from '@typings/projectStore'
import React, { useState } from 'react'
import Divider from '@mui/material/Divider'
import Avatar from '@mui/material/Avatar'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import { fullNameToInitials } from '@utils/common'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/system/Box'
import EditIcon from '@mui/icons-material/Edit'
import Stack from '@mui/material/Stack'
import Link from '@mui/material/Link'
import Menu from '@mui/material/Menu'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import MenuItem from '@mui/material/MenuItem'
import CircleIcon from '@mui/icons-material/Circle'
import { bulletColorMap } from './ProjectIssues'

type EpicInfoProps = {
  epic: Epic
}

const EpicInfo: React.FC<EpicInfoProps> = (props): React.ReactElement => {
  const {
    epic: {
      title,
      description,
      creator: { fullName, username },
      project: {
        title: projectTitle,
        slug,
        creator: { username: projectCreatorUsername },
      },
    },
  } = props

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Card sx={{ minWidth: '400px', borderRadius: 2 }} elevation={6}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: 'success.main' }} aria-label="creator">
            {fullNameToInitials(fullName)}
          </Avatar>
        }
        title={fullName}
        subheader={username}
        titleTypographyProps={{
          variant: 'subtitle1',
          component: 'div',
          color: 'text.secondary',
        }}
        action={
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
                }}
              >
                <ListItemIcon>
                  <EditIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Edit an epic</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        }
      />
      <Divider light />
      <CardContent>
        <Stack direction="row" justifyContent="space-between">
          <Stack
            direction="row"
            spacing={1}
            justifyContent="flex-start"
            sx={{ flexWrap: 'wrap' }}
          >
            <CircleIcon color={bulletColorMap.get('epic')} />
            <Typography variant="body1" component="div" color="text.secondary">
              Epic
              <Typography variant="h6" component="div" color="text.primary">
                {title}
              </Typography>
            </Typography>
          </Stack>

          <Typography variant="body1" component="div" color="text.secondary">
            Project:{` `}
            <Link
              href={`/project/${projectCreatorUsername}/${slug}`}
              variant="body1"
            >
              {projectTitle}
            </Link>
          </Typography>
        </Stack>
        {description && (
          <>
            <Divider sx={{ m: 1 }} light />
            <Typography variant="body1" color="text.secondary">
              {description}
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default EpicInfo
