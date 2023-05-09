import { 
  useState, 
  useEffect, 
  ChangeEvent,
  MouseEvent,
} from 'react';

import { 
  Box, 
  Toolbar,
  Typography,
  IconButton,
  Switch,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Menu,
  CssBaseline,
  Drawer,
  styled,
  useTheme,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';

const drawerWidth = 240;

import { AccountCircle, ChevronLeft, Inbox, Mail }  from '@mui/icons-material';

import MenuIcon from '@mui/icons-material/Menu';

import { DialogPrimeKey } from '../common/DialogPrimeKey';
import { DialogMyUserNo } from '../common/DialogMyUserNo';

import { useConnect, useDisconnect } from 'wagmi';

import { readContract } from '@wagmi/core';
import { generalKeeperABI } from '../../generated';
import { BigNumber } from 'ethers';

import { AddrZero, GKInfo, HexType } from '../../interfaces';
import { useComBooxContext } from '../../scripts/ComBooxContext';

import { CompSymbol, CompAddr } from '../comp/gk/CompBrief';

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

async function getBoox(addrOfGK: HexType): Promise<HexType[]> {
  let books: HexType[] = [];
  books[0] = addrOfGK;

  for (let i = 1; i<10; i++) {
    let temp: HexType = await readContract({
      address: addrOfGK,
      abi: generalKeeperABI,
      functionName: 'getBook',
      args: [BigNumber.from(i)],
    });
    books[i] = temp;
  }
  return books;
} 

type ComBooxAppBarType = {
  children: any
}

export function ComBooxAppBar({ children }: ComBooxAppBarType) {
  const { gk, boox, setBoox } = useComBooxContext();
  
  useEffect(() => {
    if (gk != AddrZero)
      getBoox(gk).then((boox) => setBoox(boox));
  });

  const [auth, setAuth] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    auth ? disconnect() : connect({ connector: connectors[0] });
    setAuth(e.target.checked);
  };

  const handleMenu = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [acctOpen, setAcctOpen] = useState(false);
  const handleAcctOpen = () => {
    setAcctOpen(true);
  }
  const handleAcctClose = () => {
    setAcctOpen(false);
  }

  const [myUserNoOpen, setMyUserNoOpen] = useState(false);
  const handleMyUserNoOpen = () => {
    setMyUserNoOpen(true);
  }
  const handleMyUserNoClose = () => {
    setMyUserNoOpen(false);
  }
    
  const [appBarOpen, setAppBarOpen] = useState(false);
  const handleDrawerOpen = () => {
    setAppBarOpen(true);
  }
  const handleDrawerClose = () => {
    setAppBarOpen(false);
  }

  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={ appBarOpen }>
        <Toolbar>
          <IconButton
            disabled={ gk === AddrZero }
            color="inherit"
            aria-label="open drawer"
            onClick={ handleDrawerOpen }
            edge="start"
            sx={{ mr: 2, ...(appBarOpen && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ComBoox
          </Typography>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            { gk !== AddrZero && (
              <>
                <CompSymbol addr={ gk } /> 
                <> : </>
                <CompAddr addr={ gk } />
              </>
            )} 
          </Typography>

          <FormGroup sx={{
            width: 120,
          }}>
            <FormControlLabel
              control={
                <Switch
                  checked={auth}
                  onChange={handleChange}
                  aria-label="login switch"
                  color='default'
                />
              }
              label={auth ? 'Logout' : 'Login'}
            />
          </FormGroup>

          <Box sx={{
            width: 120,
          }} >
            {auth && (
              <div>
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
                  <MenuItem onClick={handleAcctOpen}>PrimeKey</MenuItem>
                    <DialogPrimeKey flag={acctOpen} closeDialog={handleAcctClose} />
                  <MenuItem onClick={handleMyUserNoOpen}>UserNo</MenuItem>
                    <DialogMyUserNo flag={myUserNoOpen} closeDialog={handleMyUserNoClose} />
                </Menu>
              </div>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={ appBarOpen }
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeft />
          </IconButton>
        </DrawerHeader>

        <Divider />

        <List>
          {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <Inbox /> : <Mail />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider />
        
        <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <Inbox /> : <Mail />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Main open={ appBarOpen } >
        <DrawerHeader />
        { children }
      </Main>

    </Box>
  );
}