
import { useState } from 'react';

import { 
  Box, 
  Toolbar,
  Typography,
  IconButton,
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
  Tooltip,
  Stack,
} from '@mui/material';

import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';

const drawerWidth = 180;

import { 
  AssuredWorkload, 
  ListAlt, 
  ContentCopyOutlined, 
  CollectionsBookmarkOutlined,
  LibraryBooksOutlined,
  BadgeOutlined,
  PaymentsOutlined,
  HomeOutlined,
  Diversity1Outlined,
  QuizOutlined,
  ChevronLeft,
  CurrencyExchange,
  LocalGasStationOutlined,
  Hub,
  HubOutlined,
  AutoModeOutlined,
  CurrencyBitcoinOutlined,
  CurrencyExchangeOutlined,
  ReduceCapacityOutlined,
  PublishedWithChangesOutlined
}  from '@mui/icons-material';

// import Image from 'next/image';
// import Logo from '/public/assets/Symbol_white_xs.png';

import MenuIcon from '@mui/icons-material/Menu';
import { GetTimestamp } from './components/GetTimestamp';
import { CompSymbol } from './components/CompSymbol';
import { LogIn } from './components/LogIn';
import { ErrMsg } from './components/ErrMsg';
import Link from 'next/link';
import { DocsSetting } from '../docs_setting/DocsSetting';

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
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

type ComBooxAppBarType = {
  children: React.ReactNode
}

export function ComBooxAppBar({ children }: ComBooxAppBarType) {
    
  const [appBarOpen, setAppBarOpen] = useState(false);

  const handleDrawerOpen = () => {
    setAppBarOpen(true);
  }
  const handleDrawerClose = () => {
    setAppBarOpen(false);
  }

  const theme = useTheme();

  const items = [
    {href: '/app', label: 'RegCenter', tip: 'Registration Center', icon: <AssuredWorkload />, divider: false},
    {href: '/app/fuel_tank', label: 'GasStation', tip: 'Gas Station', icon: <LocalGasStationOutlined />, divider: true},
    {href: '/app/comp', label: 'Home', tip: 'Homepage of Target Company', icon: <HomeOutlined />, divider: true},
    {href: '/app/comp/roc', label: 'ROC', tip: 'Register of Constitution', icon: <ListAlt />, divider: false},
    {href: '/app/comp/roa', label: 'ROA', tip:'Rigister of Agreements', icon: <ContentCopyOutlined />, divider: true},
    {href: '/app/comp/rod', label: 'ROD', tip:'Register of Directors', icon: <BadgeOutlined />, divider: false},  
    {href: '/app/comp/bmm', label: 'BMM', tip:'Board Meeting Minutes', icon: <LibraryBooksOutlined />, divider: true},  
    {href: '/app/comp/rom', label: 'ROM', tip:'Register of Members', icon: <Diversity1Outlined />, divider: false},  
    {href: '/app/comp/gmm', label: 'GMM', tip:'General Meeting Minutes', icon: <LibraryBooksOutlined />, divider: true},  
    {href: '/app/comp/ros', label: 'ROS', tip:'Register of Shares', icon: <PaymentsOutlined />, divider: false},
    {href: '/app/comp/rop', label: 'ROP', tip:'Register of Pledges', icon: <CollectionsBookmarkOutlined />, divider: false},
    {href: '/app/comp/roo', label: 'ROO', tip:'Register of Options', icon: <QuizOutlined />, divider: true},
    {href: '/app/comp/roi', label: 'ROI', tip:'Register of Investors', icon: <ReduceCapacityOutlined />, divider: false},
    {href: '/app/comp/loe', label: 'LOE', tip:'List of Orders (ETH)', icon: <PublishedWithChangesOutlined />, divider: false},
    {href: '/app/comp/lou', label: 'LOU', tip:'List of Orders (USD)', icon: <CurrencyExchangeOutlined />, divider: true},
    {href: '/app/comp/lop', label: 'LOP', tip:'List of Projects', icon: <HubOutlined />, divider: false},
  ]

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={ appBarOpen }>
        <Toolbar >
          <Box sx={{ width:'100%' }} >

            <Stack direction="row" sx={{ alignItems:'center', justifyContent:'center', alignContent:'space-between' }} >

              <Stack direction='row' sx={{ alignItems:'center', justifyContent:'center'}} >
                
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={ handleDrawerOpen }
                  edge="start"
                  sx={{ mr: 2, ...(appBarOpen && { display: 'none' }) }}
                >
                  <MenuIcon />
                </IconButton>
              
                {/* <Image src={Logo} alt='ComBoox Symbol' /> */}

                <DocsSetting />

                <Typography variant="h6" component="div" sx={{ flexGrow: 1, ml:2}}>
                  ComBoox
                </Typography>

                <GetTimestamp />


              </Stack>

              <CompSymbol />

              <LogIn />

            </Stack>

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
        <DrawerHeader sx={{ height: 72 }}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeft />
          </IconButton>
        </DrawerHeader>

        <Divider />

        <List>

          {items.map((v, i)=>(
            <div key={i}>
              <ListItem disablePadding >
                <Tooltip title={v.tip} placement='right' arrow >
                  <ListItemButton 
                    LinkComponent={ Link }
                    href={v.href}
                  >
                    <ListItemIcon>
                      {v.icon}
                    </ListItemIcon>
                    <ListItemText primary={v.label} />
                  </ListItemButton>
                </Tooltip>
              </ListItem>
              {v.divider && (
                <Divider flexItem />
              )}
            </div>
          ))}

        </List>

      </Drawer>

      <Main open={ appBarOpen } >
        <DrawerHeader />
        { children }
        <ErrMsg />
      </Main>

    </Box>
  );
}