import { useState, useEffect } from 'react';

import { 
  Card, 
  CardActions, 
  CardContent, 
  Button, 
  Typography,
  TextField,
} from '@mui/material';

import {
  useGeneralKeeperRegNumHash,
  useGeneralKeeperNameOfCompany,
  useGeneralKeeperSymbolOfCompany,
} from '../../../generated';

import { Bytes32Zero, ContractProps, HexType } from '../../../interfaces';


export function CompSymbol({ addr }:ContractProps) {
  const [symbol, setSymbol] = useState('');

  const { data } = useGeneralKeeperSymbolOfCompany({
    address: addr,
  });

  useEffect(() => {
    if (data)
      setSymbol(data);
  }, [data]);

  return (
    <>
      {addr && (
        <>
          { symbol !== '' ? symbol : 'Symbol' }
        </>
      )}
    </>
  )

}

export function CompSymbolTf({ addr }:ContractProps) {
  const [ symbol, setSymbol ] = useState<string>();

  const { data } = useGeneralKeeperSymbolOfCompany({
    address: addr,
  });

  useEffect(() => {
    if ( data ) 
      setSymbol(data);
  }, [ data ]);

  return (
    <>
      {symbol && (
        <TextField 
          value={symbol} 
          variant='filled' 
          label="SymbolOfCompany" 
          inputProps={{readOnly: true}}
          sx={{
            m:1,
          }}
          fullWidth
        />
      )}
    </>
  )
}


export function CompAddr({ addr }:ContractProps) {
  return (
    <>
      {addr && (
        <>
          { addr.substring(0, 6) + '...' + addr.substring(38) }
        </>
      )}
    </>
  )
}

export function CompAddrTf({ addr }:ContractProps) {
  return (
    <>
      {addr && (
        <TextField 
          value={addr} 
          variant='filled' 
          label="AddressOfCompany" 
          inputProps={{readOnly: true}}
          sx={{
            m:1,
          }}
          fullWidth
        />
      )}
    </>
  )
}

export function CompName({ addr }:ContractProps ) {
  const [nameOfComp, setNameOfComp] = useState<string>();

  const { data } = useGeneralKeeperNameOfCompany({
    address: addr
  });

  useEffect(() => {
    if ( data ) 
      setNameOfComp(data);
  }, [data]);

  return (
    <>
      {nameOfComp && (
        <TextField 
          value={nameOfComp} 
          variant='filled' 
          label="NameOfCompany" 
          inputProps={{readOnly: true}}
          sx={{
            m:1,
          }}
          fullWidth
        />
      )}
    </>
  )
}

export function RegNumHash({ addr }:ContractProps ) {
  const [regNumHash, setRegNumHash] = useState<HexType>();

  const { data } = useGeneralKeeperRegNumHash({
    address: addr,
  });

  useEffect(() => {
    if (data)
      setRegNumHash(data);
  }, [data]);

  return (
    <>
      {regNumHash && (
        <TextField 
          value={regNumHash} 
          variant='filled' 
          label="RegNumberHash" 
          inputProps={{readOnly: true}}
          sx={{
            minWidth: 120,
            m:1,
          }}
          fullWidth
        />
      )}
    </>
  )
}

export function CompId({ addr }:ContractProps ) {
  const [regNumHash, setRegNumHash] = useState<`0x${string}`>();
  const [nameOfComp, setNameOfComp] = useState<string>();
  const [symbolOfComp, setSymbolOfComp] = useState<string>();

  const { data:dataOfRegNumHash } = useGeneralKeeperRegNumHash({
    address: addr,
  });

  useEffect(() => {
    if (dataOfRegNumHash)
      setRegNumHash(dataOfRegNumHash);
  }, [dataOfRegNumHash]);

  const { data: dataOfNameOfComp } =  useGeneralKeeperNameOfCompany({
    address: addr,
  });

  useEffect(() => {
    if ( dataOfNameOfComp )
      setNameOfComp(dataOfNameOfComp);
  }, [dataOfNameOfComp]);

  const { data: dataOfSymbolOfCompany } = useGeneralKeeperSymbolOfCompany({
    address: addr,
  });

  useEffect(() => {
    if (dataOfSymbolOfCompany) 
      setSymbolOfComp(dataOfSymbolOfCompany);
  }, [ dataOfSymbolOfCompany ]);

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

