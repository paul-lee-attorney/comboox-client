
import { Button, Paper, Stack, TextField } from '@mui/material';

import { 
  useRegCenterSetFeedRegistry,
} from '../../../generated';

import { AddrOfRegCenter, AddrZero, HexType } from '../../../scripts/common';
import { BorderColor } from '@mui/icons-material';
import { useState } from 'react';
import { FormResults, HexParser, defFormResults, hasError, onlyHex, refreshAfterTx } from '../../../scripts/common/toolsKit';
import { ActionsOfOwnerProps } from '../ActionsOfOwner';


export function SetFeedRegistry({refresh}:ActionsOfOwnerProps) {

  const [ newFeed, setNewFeed ] = useState<HexType>(AddrZero);
  const [ valid, setValid ] = useState<FormResults>(defFormResults);

  const {
    isLoading: setFeedRegLoading,
    write: setFeedReg
  } = useRegCenterSetFeedRegistry({
    address: AddrOfRegCenter,
    args: hasError(valid) ? undefined : [newFeed],
    onSuccess(data) {
      let hash: HexType = data.hash;
      refreshAfterTx(hash, refresh);
    }
  })

  return (
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }}  >
      <Stack direction='row' sx={{alignItems:'start', justifyContent:'start'}} >

        <TextField 
          size="small"
          variant='outlined'
          label='FeedRegistry'
          error={ valid['FeedRegistry']?.error }
          helperText={ valid['FeedRegistry']?.helpTx }          
          sx={{
            m:1,
            minWidth: 456,
          }}
          value={ newFeed }
          onChange={e => {
            let input = HexParser( e.target.value );
            onlyHex('FeedRegistry', input, 40, setValid);
            setNewFeed(input);          
          }}
        />

        <Button 
          disabled={ setFeedRegLoading || hasError(valid) } 
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
