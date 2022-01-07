import MyDrawer from '@components/Drawer'
import React from 'react'

export const DashboardProvider: React.FC = ({
  children,
}): React.ReactElement => {
  return <MyDrawer>{children}</MyDrawer>
}
