import React from 'react'
import SnackBar from '@components/SnackBar'

export const SnackBarProvider: React.FC = ({
  children,
}): React.ReactElement => {
  return (
    <>
      <SnackBar />
      {children}
    </>
  )
}
