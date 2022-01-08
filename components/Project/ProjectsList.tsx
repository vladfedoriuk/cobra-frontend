import React from 'react'
import { Project as ProjectData } from '@typings/projectStore'
import ProjectCard from './ProjectCard'
import Box from '@mui/system/Box'

type ProjectsListProps = {
  projects: Array<ProjectData>
}

const ProjectsList: React.FC<ProjectsListProps> = (
  props
): React.ReactElement => {
  const { projects } = props
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        p: 1,
        m: 1,
        bgcolor: 'background.paper',
        '& .MuiCard-root': { m: 2 },
      }}
    >
      {projects.map((project) => (
        <ProjectCard project={project} key={project.id} />
      ))}
    </Box>
  )
}

export default ProjectsList
