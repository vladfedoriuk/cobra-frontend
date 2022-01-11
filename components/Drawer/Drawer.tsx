import React, { useState } from 'react'
import { styled, useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { AppBar, Drawer } from './AppBar'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import SourceIcon from '@mui/icons-material/Source'
import AccountCircle from '@mui/icons-material/AccountCircle'
import useMobXStores from '@hooks/stores'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import Router from 'next/router'
import { observer } from 'mobx-react-lite'
import Container from '@mui/material/Container'

export const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}))
const MyDrawer: React.FC = ({ children }) => {
  const theme = useTheme()
  const [drawerOpen, setDrowerOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleDrawerOpen = () => {
    setDrowerOpen(true)
  }

  const handleDrawerClose = () => {
    setDrowerOpen(false)
  }

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const { user: userStore } = useMobXStores()

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" open={drawerOpen}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: '36px',
              ...(drawerOpen && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Cobra
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {userStore?.isLoggedIn && (
            <Box sx={{ flexGrow: 0 }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem
                  onClick={() => {
                    handleClose()
                    Router.push('/profile')
                  }}
                >
                  Profile
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={drawerOpen}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem
            button
            onClick={() => {
              if (!userStore?.isLoggedIn) {
                Router.push('/login')
              }
              Router.push('/projects')
            }}
          >
            <ListItemIcon>
              <SourceIcon />
            </ListItemIcon>
            <ListItemText primary="Projects" />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem
            button
            onClick={() => {
              if (userStore?.isLoggedIn) {
                userStore?.logout()
              }
              Router.push('/login')
            }}
          >
            <ListItemIcon>
              {!userStore.isLoggedIn ? <LoginIcon /> : <LogoutIcon />}
            </ListItemIcon>
            <ListItemText
              primary={!userStore?.isLoggedIn ? 'Login' : 'Logout'}
            />
          </ListItem>
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <DrawerHeader />
        <Container maxWidth="lg" sx={{ mb: 4 }}>
          {children}
        </Container>
      </Box>
    </Box>
  )
}

export default observer(MyDrawer)
