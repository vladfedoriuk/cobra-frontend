import React, { useState } from 'react'
import useMobXStores from '@hooks/stores'
import Router from 'next/router'
import { GetServerSideProps } from 'next'
import UserApi from '@api/user'

const LoginPage: React.FC = (): React.ReactElement => {
  const [username, setUsername] = useState<string>()
  const [password, setPassword] = useState<string>()
  const { user: userStore } = useMobXStores()
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        userStore.login({ username, password }, () => {
          Router.push('/')
        })
      }}
    >
      <input type="text" onChange={(e) => setUsername(e.target.value)} />
      <input type="password" onChange={(e) => setPassword(e.target.value)} />
      <input type="submit"></input>
    </form>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const api = new UserApi()
  const isAuthenticated = await api.isAuthenticated(context)
  if (isAuthenticated) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  return {
    props: {},
  }
}

export default LoginPage
