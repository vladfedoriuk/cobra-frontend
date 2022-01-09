import Typography from '@mui/material/Typography'
import {
  ProjectInfo as ProjectInfoData,
  ProjectMemberships,
} from '@typings/projectStore'
import React from 'react'
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
import { FixedSizeList } from 'react-window'
import Box from '@mui/system/Box'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Chip from '@mui/material/Chip'

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
    project: { title, description, creator },
    memberships,
  } = props
  return (
    <Card sx={{ minWidth: 300, borderRadius: 2 }} elevation={6}>
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
          <IconButton aria-label="actions">
            <MoreVertIcon />
          </IconButton>
        }
      />
      <Divider light />
      <CardContent>
        <Typography variant="h4" component="div" sx={{ mb: 2 }}>
          {title}
        </Typography>
        <Divider sx={{ m: 1 }} light />
        <Typography variant="body1" color="text.secondary">
          {description}
        </Typography>
        <Divider sx={{ m: 1 }} light />
        {memberships && (
          <Box
            sx={{
              m: 1,
              width: '100%',
              height: 300,
              maxWidth: 'sm',
              bgcolor: 'background.paper',
            }}
          >
            <Typography variant="h6" component="div" sx={{ mb: 2 }}>
              Memberships
            </Typography>
            <FixedSizeList
              height={400}
              width={360}
              itemSize={50}
              itemCount={memberships?.length ?? 0}
              overscanCount={5}
              itemData={memberships}
            >
              {renderRow}
            </FixedSizeList>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default ProjectInfo
