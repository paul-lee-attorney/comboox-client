import { useState } from 'react';

import { Box, TextField, Button, Grid, Paper, Stack } from '@mui/material';

import { Search } from '@mui/icons-material';

import { CreateComp, GetComp } from '../components'
import { AddrOfRegCenter, HexType } from '../interfaces';
import { useRegCenterGetDocByUserNo } from '../generated';
import { BigNumber } from 'ethers';
import { useComBooxContext } from '../scripts/ComBooxContext';

function FrontPage() {


  return (
    <Stack 
      direction={'column'} 
      sx={{
        m:1, p:1, 
        alignItems:'center', 
        width:'100%',
      }} 
    >
      <h1>ComBoox</h1>
      <h3>A Blockchain-Based Company Statutory Books Keeping System</h3>            
      <CreateComp />
      <GetComp />
    </Stack>
  )
}

export default FrontPage
