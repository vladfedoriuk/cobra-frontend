import React from 'react'
import Snackbar from '@mui/material/Snackbar'
import useMobXStores from '@hooks/stores'
import Alert from '@mui/material/Alert'
import { observer } from 'mobx-react-lite'

const SnackBar: React.FC = (): React.ReactElement => {
  const { snackbars: snackbarStore } = useMobXStores()
  const currentSnackbar = snackbarStore.current
  const closeSnackbarAction = (): void => {
    snackbarStore.hide()
    snackbarStore.prune()
  }

  if (currentSnackbar) {
    return (
      <Snackbar
        anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
        open={currentSnackbar.display}
        onClose={closeSnackbarAction}
        autoHideDuration={6000}
      >
        <Alert onClose={closeSnackbarAction} severity={currentSnackbar.kind}>
          {currentSnackbar.message}
        </Alert>
      </Snackbar>
    )
  }
  return null
}

export default observer(SnackBar)
