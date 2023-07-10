import { AccountCircle } from "@mui/icons-material";
import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import { DialogPrimeKey } from "../common/DialogPrimeKey";
import { DialogMyUserNo } from "../common/DialogMyUserNo";
import { MouseEvent, useState } from "react";

export function AcctMenue() {

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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


  return (
    <Box sx={{
      width: 120,
    }} >
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
    </Box>
  );
}
