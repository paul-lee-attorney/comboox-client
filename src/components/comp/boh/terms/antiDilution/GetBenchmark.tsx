
import { useState } from 'react';

import { 
  Stack,
  TextField,
  Paper,
} from '@mui/material';


import { HexType } from '../../../../../interfaces';
import { BigNumber } from 'ethers';
import { 
  useAntiDilutionGetFloorPriceOfClass, 
  useAntiDilutionGetObligorsOfAd 
} from '../../../../../generated';

interface GetBenchmarkProps {
  ad: HexType,
  classOfShare: number,
}

export function GetBenchmark({ ad, classOfShare }: GetBenchmarkProps) {
  const [ price, setPrice ] = useState<string>();

  useAntiDilutionGetFloorPriceOfClass({
    address: ad,
    args: [BigNumber.from(classOfShare)],
    onSuccess(data) {
      setPrice(data.toString());
    }
  });

  const [ obligors, setObligors ] = useState<string>();

  useAntiDilutionGetObligorsOfAd({
    address: ad,
    args: [BigNumber.from(classOfShare)],
    onSuccess(data) {
      let obligors: string = '';

      data.map(v => {
        obligors += v.toString() + `${<br/>}`;
       }); 
      
      setObligors(obligors);
    }
  });

  return (
    <>
      <Paper sx={{
        alignContent:'center', 
        justifyContent:'center', 
        p:1, m:1,
        border: 1,
        borderColor:'divider' 
        }} 
      >
        <Stack direction={'row'} sx={{ alignItems: 'center' }} >

          <TextField 
            variant='filled'
            label='ClassOfShare'
            inputProps={{readOnly: true}}
            sx={{
              m:1,
              minWidth: 240,
            }}
            value={ classOfShare.toString() }
          />

          {price && (
            <TextField 
              variant='filled'
              label='FloorPrice'
              inputProps={{readOnly: true}}
              sx={{
                m:1,
                minWidth: 240,
              }}
              value={ price }
            />
          )}

          {obligors && (
            <TextField 
              variant='filled'
              label='Obligors'
              inputProps={{readOnly: true}}
              sx={{
                m:1,
                minWidth: 240,
              }}
              multiline
              rows={1}
              value={ obligors }
            />
          )}

        </Stack>
      </Paper>
    </> 
  )
}
