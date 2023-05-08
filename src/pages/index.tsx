import { useState } from 'react';

import { Box, TextField, Button, Grid } from '@mui/material';

import { Search } from '@mui/icons-material';

import { CreateComp, GetDoc } from '../components'
import { HexType } from '../interfaces';

function FrontPage() {
  const [snOfComp, setSnOfComp] = useState<string>();
  const [snOfDoc, setSnOfDoc] = useState<HexType>();

  const handleClick = () => {
    const sn:HexType = `0x${'0014' + snOfComp + '0'.padEnd(40, '0')}`;
    setSnOfDoc(sn); 
  }

  return (
    <div>
      <Grid 
        container 
        spacing={2}
        direction='column'
        sx={{
          height: 580,
          alignContent: 'center',
          justifyContent: 'center',
        }}
      >

        <Grid item sx={{alignContent:'center', justifyContent:'center', }} >
          <h1>ComBoox</h1>
          <h3>A Blockchain-Based Company Statutory Books Keeping System</h3>
        </Grid>
        
        <Grid item sx={{alignContent:'center', justifyContent:'center', }} >

          <Box >
            
            <CreateComp />

            <br />

            <TextField 
              sx={{ m: 1, minWidth: 280 }} 
              id="txSnOfComp" 
              label="SnOfComp" 
              variant="outlined"
              helperText="Hex (20 digits)"
              onChange={(e) => setSnOfComp(e.target.value)}
              value = {snOfComp}
              size='small'
            />

            <Button 
              sx={{ m: 1, minWidth: 120, height: 40 }} 
              variant="contained" 
              endIcon={ <Search /> }
              onClick={ handleClick }
              size='small'
            >
              Search
            </Button>

          </Box>

        </Grid>

        {snOfDoc && (
          <Grid item sx={{alignContent:'center', justifyContent:'center', }} >
            <GetDoc sn={snOfDoc} />
          </Grid>
        )}

      </Grid>
    </div>
  )
}

export default FrontPage
