import { 
  useState, 
  useEffect, 
  ChangeEvent,
} from 'react';

import { 
  Box, 
  Toolbar,
  Typography,
  IconButton,
  Switch,
  FormControlLabel,
  FormGroup,
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

import Link from '../../scripts/Link';

import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';

const drawerWidth = 180;

import { 
  AccountCircle, 
  AssuredWorkload, 
  ListAlt, 
  ContentCopyOutlined, 
  GroupOutlined,
  CollectionsBookmarkOutlined,
  LibraryBooksOutlined,
  BadgeOutlined,
  PaymentsOutlined,
  HomeOutlined,
  Diversity1Outlined,
  QuizOutlined,
  ChevronLeft
}  from '@mui/icons-material';

import MenuIcon from '@mui/icons-material/Menu';

import { useAccount, useConnect, useDisconnect, } from 'wagmi';

import { useComBooxContext } from '../../scripts/ComBooxContext';

import { getBoox, regNumOfCompany, symbolOfCompany } from '../../queries/gk';
import { longSnParser } from '../../scripts/toolsKit';
import { AcctPage } from './AcctPage';
import { useRouter } from 'next/router';
import { CopyLongStrSpan } from '../common/utils/CopyLongStr';

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
  children: any
}


export function ComBooxAppBar({ children }: ComBooxAppBarType) {
  const { setUserNo, gk, setGK, setBoox } = useComBooxContext();
  const [ regNum, setRegNum ] = useState<number>();
  const [ symbol, setSymbol ] = useState<string>();

  const router = useRouter();
  const { pathname } = router;

  const { isConnected, isDisconnected } = useAccount();

  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (gk) {
      getBoox(gk).then(
        (res) => setBoox(res.map(v=>(v.addr)))
      );
      regNumOfCompany(gk).then(
        res => setRegNum(Number(res))
      );
      symbolOfCompany(gk).then(
        res => setSymbol(res)
      );
    } else {
      setBoox(undefined);
    }
  }, [gk, setBoox]);


  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if ( isConnected ) {
      setUserNo(undefined);
      disconnect();
      if (pathname == '/my/UserInfo') router.push('/');
    } else {
      connect({ connector: connectors[0] });
    }
  };

    
  const [appBarOpen, setAppBarOpen] = useState(false);
  const handleDrawerOpen = () => {
    setAppBarOpen(true);
  }
  const handleDrawerClose = () => {
    setAppBarOpen(false);
  }

  const theme = useTheme();

  const items = [
    {href: '/comp/HomePage', label: 'Home', tip: 'Homepage of Target Company', icon: <HomeOutlined />, divider: false},
    {href: '/comp/boc/BookOfConstitution', label: 'BOC', tip: 'Book of Constitution', icon: <ListAlt />, divider: false},
    {href: '/comp/boi/BookOfIA', label: 'BOI', tip:'Book of Investment Agreements', icon: <ContentCopyOutlined />, divider: true},
    {href: '/comp/bod/BookOfDirectors', label: 'BOD', tip:'Book of Directors', icon: <BadgeOutlined />, divider: false},  
    {href: '/comp/bod/BoardMeetingMinutes', label: 'BMM', tip:'Board Meeting Minutes', icon: <LibraryBooksOutlined />, divider: true},  
    // {href: '/comp/bod/BookOfOfficers', label: 'BOO', tip:'Book of Officers', icon: <BadgeOutlined />, divider: true},  
    {href: '/comp/bom/BookOfMembers', label: 'BOM', tip:'Book of Members', icon: <Diversity1Outlined />, divider: false},  
    {href: '/comp/bom/GeneralMeetingMinutes', label: 'GMM', tip:'General Meeting Minutes', icon: <LibraryBooksOutlined />, divider: true},  
    {href: '/comp/bos/BookOfShares', label: 'BOS', tip:'Book of Shares', icon: <PaymentsOutlined />, divider: false},
    {href: '/comp/bop/BookOfPledges', label: 'BOP', tip:'Book of Pledges', icon: <CollectionsBookmarkOutlined />, divider: false},
    {href: '/comp/boo/BookOfOptions', label: 'BOO', tip:'Book of Options', icon: <QuizOutlined />, divider: false},
  ]

  const backToCenter = () => {
    setGK(undefined);
    setBoox(undefined);
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={ appBarOpen }>
        <Toolbar >
          <Box sx={{ width:'100%' }} >

            <Stack direction="row" sx={{ alignItems:'center', justifyContent:'center', alignContent:'space-between' }} >
              <IconButton
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

              <Stack direction='row' sx={{ alignItems:'center', justifyContent:'center', flexGrow:5 }} >

                {gk && symbol && (
                  <Typography variant="h6" component="div" sx={{ mx:1 }} >
                    { symbol } 
                  </Typography>
                )}

                {gk && regNum && (
                  <Typography variant="h6" component="div" sx={{ mx:1 }} >
                    ( { longSnParser(regNum.toString()) } )
                  </Typography>
                )}

                {gk && (
                  <CopyLongStrSpan size='h6' title='Addr' src={gk.toLowerCase()} />                       
                )}
              </Stack>

              <Stack direction='row' sx={{ alignItems:'center', justifyContent:'center', flexGrow:1 }} >

                <FormGroup sx={{
                  ml:5,
                  width: 120,
                }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isConnected}
                        onChange={ handleChange }
                        aria-label="login switch"
                        color='default'
                      />
                    }
                    label={isConnected ? 'Logout' : 'Login'}
                  />
                </FormGroup>

                <AcctPage flag={ isConnected } />

              </Stack>

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
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeft />
          </IconButton>
        </DrawerHeader>

        <Divider />

        <List>

          <ListItem disablePadding >
            <Tooltip title={"Registration Center"} placement='right' arrow >
              <ListItemButton 
                LinkComponent={ Link }
                href={"/"}
                onClick={ backToCenter }
              >
                <ListItemIcon>
                  {<AssuredWorkload />}
                </ListItemIcon>
                <ListItemText primary={"RegCenter"} />
              </ListItemButton>
            </Tooltip>
          </ListItem>

          <Divider />

          {items.map((v, i)=>(
            <div key={i}>
              <ListItem disablePadding >
                <Tooltip title={v.tip} placement='right' arrow >
                  <ListItemButton 
                    LinkComponent={Link}
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
      </Main>

    </Box>
  );
}