import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { User as UserType } from '@typings/userStore'
import React from 'react'

type ProfileHeaderProps = {
  user: UserType
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  const { username, lastName, firstName, email } = user
  return (
    <Stack
      direction="row"
      divider={<Divider orientation="vertical" flexItem />}
      spacing={2}
    >
      <Avatar
        sx={{
          bgcolor: 'success.main',
          width: (theme) => theme.spacing(12),
          height: (theme) => theme.spacing(12),
        }}
      >
        <Typography
          component="div"
          variant="h5"
        >{`${firstName[0]}${lastName[0]}`}</Typography>
      </Avatar>
      <Stack divider={<Divider flexItem />} spacing={0.5}>
        <Typography component="div" variant="h5">
          {username}
        </Typography>
        <Typography component="div" variant="subtitle2">
          {`${firstName} ${lastName}`}
        </Typography>
        <Typography component="div" variant="body2">
          {email}
        </Typography>
      </Stack>
    </Stack>
  )
}

export default ProfileHeader
