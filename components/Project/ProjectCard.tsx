import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { Project as ProjectData } from '@typings/projectStore'
import { fullNameToInitials } from '@utils/common'
import React from 'react'

type ProjectCardProps = {
  project: ProjectData
}

const ProjectCard: React.FC<ProjectCardProps> = (props): React.ReactElement => {
  const {
    project: { title, isCreator, membershipRole, creator, members },
  } = props
  return (
    <Card sx={{ minWidth: 300, borderRadius: 4 }} elevation={8}>
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
      />
      <Divider light />
      <CardContent>
        <Typography variant="h4" component="div" sx={{ mb: 2 }}>
          {title}
        </Typography>
        <Typography variant="h6" component="div" sx={{ mb: 1 }}>
          Roles:
        </Typography>
        {isCreator || membershipRole !== '' ? (
          <Stack direction="row" spacing={1}>
            {isCreator && <Chip label="creator" color="success" />}
            {membershipRole !== '' && (
              <Chip
                label={membershipRole}
                color={membershipRole == 'maintainer' ? 'success' : 'info'}
                variant="outlined"
              />
            )}
          </Stack>
        ) : (
          <Chip label="no role" color="error" variant="outlined" />
        )}
        <Typography sx={{ mb: 1.5, mt: 1 }} variant="h6" component="div">
          Members:
        </Typography>
        {members?.length === 0 ? (
          <Typography
            component="div"
            variant="body1"
            color="text.secondary"
            sx={{ m: 2, textAlign: 'center' }}
          >
            No members yet.
          </Typography>
        ) : (
          <AvatarGroup max={4} sx={{ flexDirection: 'row' }}>
            {members.map(({ fullName, id }) => (
              <Avatar sx={{ bgcolor: 'info' }} aria-label="members" key={id}>
                {fullNameToInitials(fullName)}
              </Avatar>
            ))}
          </AvatarGroup>
        )}
      </CardContent>
      <CardActions disableSpacing>
        <Button fullWidth variant="contained" color="success">
          Open
        </Button>
      </CardActions>
    </Card>
  )
}

export default ProjectCard
