import { Box, Collapse, Paper, Stack, Switch, Toolbar, Typography } from "@mui/material";
import { useState } from "react";
import { MintAndLockPoints } from "./MintAndLockPoints";
import { MintPoints } from "./MintPoints";

interface MintToolsProps{
  refreshList: ()=>void;
}

export function MintTools({ refreshList }:MintToolsProps) {

  const [ useLock, setUseLock ] = useState<boolean>();

  return (

  <Paper elevation={3} sx={{
    m:1,
    p:1, 
    border: 1, 
    borderColor:'divider' 
    }} 
  >
    <Stack direction={'row'} sx={{ alignItems:'center'}} >

      <Box sx={{ minWidth:300 }} >
        <Toolbar>
          <h4>Mint Points</h4>
        </Toolbar>
      </Box>

      <Typography>
        Directly Mint  
      </Typography>

      <Switch 
        color="primary" 
        onChange={(e) => setUseLock( e.target.checked )} 
      />

      <Typography>
        Via Hash Locker
      </Typography>

    </Stack>

    {useLock && (
      <MintAndLockPoints refreshList={ refreshList } />
    )}

    {!useLock && (
      <MintPoints />
    )}

  </Paper>

  );
}


