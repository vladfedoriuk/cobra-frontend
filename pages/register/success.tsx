import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import SendIcon from '@mui/icons-material/Send'
import React from 'react'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import Link from '@mui/material/Link'

const RegisterSuccessPage: React.FC = (): React.ReactElement => {
  return (
    <Container sx={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
      <Grid container sx={{ m: 1 }} gap={2}>
        <Grid item>
          <SendIcon sx={{ fontSize: 28 }} />
        </Grid>
        <Grid item>
          <Typography component="h1" variant="h5">
            Finalize registration
          </Typography>
        </Grid>
      </Grid>
      <Alert severity="success">
        Please, check out the provided email to finalize your registration. If
        in a couple of minutes, there is no mail with activation information,
        follow the{' '}
        <Link href="/activate/resend" color="inherit">
          link
        </Link>
      </Alert>
    </Container>
  )
}

export default RegisterSuccessPage
