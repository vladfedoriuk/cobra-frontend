import UserApi from '@api/user'
import ProjectsList from '@components/Project'
import ProjectsHeader from '@components/Project/ProjectsHeader'
import useMobXStores from '@hooks/stores'
import { observer } from 'mobx-react-lite'
import { GetServerSideProps } from 'next'
import React, { useEffect } from 'react'

const Projects: React.FC = (): React.ReactElement => {
  const { projects: projectsStore } = useMobXStores()

  useEffect(() => {
    projectsStore?.getProjects()
  }, [])

  return (
    <>
      <ProjectsHeader />
      <ProjectsList projects={projectsStore?.projects} />
    </>
  )
}

export default observer(Projects)

export const getServerSideProps: GetServerSideProps = async (context) => {
  const api = new UserApi()
  const isAuthenticated = await api.isAuthenticated(context)
  if (!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }
  return {
    props: {},
  }
}
