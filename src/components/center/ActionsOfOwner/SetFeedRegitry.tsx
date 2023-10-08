
import { Button, Paper, Stack, TextField } from '@mui/material';

import { 
  useRegCenterSetFeedRegistry,
} from '../../../generated';

import { AddrOfRegCenter, HexType } from '../../../scripts/common';
import { BorderColor } from '@mui/icons-material';
import { useState } from 'react';
import { HexParser } from '../../../scripts/common/toolsKit';
import { ActionsOfOwnerProps } from '../ActionsOfOwner';


export function SetFeedRegistry({setTime}:ActionsOfOwnerProps) {

  const [ newFeed, setNewFeed ] = useState<HexType>();

  const {
    isLoading: setFeedRegLoading,
    write: setFeedReg
  } = useRegCenterSetFeedRegistry({
    address: AddrOfRegCenter,
    args: newFeed ? [newFeed] : undefined,
    onSuccess() {
      setTime(Date.now());
    }
  })

  return (
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }}  >
      <Stack direction='row' sx={{alignItems:'stretch', justifyContent:'start'}} >

        <TextField 
          size="small"
          variant='outlined'
          label='FeedRegistry'
          sx={{
            m:1,
            minWidth: 456,
          }}
          value={ newFeed }
          onChange={e => setNewFeed( HexParser( e.target.value ))}
        />

        <Button 
          disabled={ setFeedRegLoading } 
          onClick={() => {
            setFeedReg?.()
          }}
          variant='contained'
          sx={{ m:1, ml:2, minWidth:128 }} 
          endIcon={<BorderColor />}       
        >
          Set
        </Button>

      </Stack>
    </Paper>
  )
}
