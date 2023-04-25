import { useState, useEffect } from 'react';

import { 
  Card, 
  CardActions, 
  CardContent, 
  Button, 
  Typography 
} from '@mui/material';

import {
  useGeneralKeeperRegNumHash,
  useGeneralKeeperNameOfCompany,
  useGeneralKeeperSymbolOfCompany,
} from '../../../generated';

import { ContractProps } from '../../../interfaces';

export function GetCompId({ addr }:ContractProps ) {
  const [regNumHash, setRegNumHash] = useState<`0x${string}`>();
  const [nameOfComp, setNameOfComp] = useState<string>();
  const [symbolOfComp, setSymbolOfComp] = useState<string>();

  useGeneralKeeperRegNumHash({
    address: `0x${addr}`,
    onSuccess(data) {
      setRegNumHash(data);
    }
  });

  useGeneralKeeperNameOfCompany({
    address: `0x${addr}`,
    onSuccess(data) {
      setNameOfComp(data);
    }
  });

  useGeneralKeeperSymbolOfCompany({
    address: `0x${addr}`,
    onSuccess(data) {
      setSymbolOfComp(data);
    }
  });

  return (
    <>
        <Card sx={{ minWidth: 120, width: 300 }} variant='outlined'>
          <CardContent>

            <Typography variant="h6" component="div" >
              Company ID
            </Typography>
            <Typography variant="body1" component="div" >
              Name: {nameOfComp}
            </Typography>
            <Typography variant="body1" component="div" >
              Symbol: {symbolOfComp}
            </Typography>
            <Typography variant="body2" component="div" >
              RegNumHash: {regNumHash?.substring(0,6) + 
                '...' + regNumHash?.substring(62)}
            </Typography>

          </CardContent>
          
          <CardActions>
            <Button size="small" >Refresh</Button>
          </CardActions>
        
        </Card>
    </>
  )
}

