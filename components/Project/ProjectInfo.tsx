import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { Project as ProjectData } from '@typings/projectStore'
import React from 'react'
import Divider from '@mui/material/Divider'

type ProjectInfoProps = {
  project: ProjectData
}

const ProjectInfo: React.FC<ProjectInfoProps> = (props): React.ReactElement => {
  const {
    project: {
      title,
      description,
      creator: { fullName },
    },
  } = props
  return (
    <Container maxWidth="sm">
      <Typography component="div" variant="h3">
        {title}
      </Typography>
      <Typography component="div" variant="body2">
        `Created by ${fullName}
      </Typography>
      <Divider />
      <Typography component="div" variant="body1">
        {description}
      </Typography>
    </Container>
  )
}

export default ProjectInfo
