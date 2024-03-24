"use client"

import { useState } from 'react';

import { Alert, Button, IconButton, Stack, TextField } from '@mui/material';
import { Close, DriveFileMove, Search } from '@mui/icons-material';

import { AddrZero, MaxUserNo } from '../common';
import { FormResults, defFormResults, hasError, onlyInt } from '../common/toolsKit';
import Link from 'next/link';
import { Doc, getDocByUserNo } from '../rc';

import { useComBooxContext } from '../../_providers/ComBooxContextProvider';

import { CenterInfo } from './center_info/CenterInfo';

export function GetComp() {

  const { setGK } = useComBooxContext();

  const [ regNum, setRegNum ] = useState<string>();
  const [ valid, setValid ] = useState<FormResults>(defFormResults);

  const [ doc, setDoc ] = useState<Doc>();

  const [ open, setOpen ] = useState(false);

  const handleClick = async () => {
    if ( regNum ) {
      getDocByUserNo(BigInt(regNum)).then(
        (doc:Doc) => {
          if (doc.body != AddrZero) {
            setOpen(false);
            setGK(doc.body);
            setDoc(doc);
          } else {
            setGK(undefined);
            setDoc(undefined);
            setOpen(true);
          }
        }
      )
    }
  }

  return (
    <Stack direction={'column'} sx={{ width:'100%', alignItems:'center' }} >

      <Stack direction={'row'} sx={{justifyContent:'center'}}>
        <TextField 
          id="txRegNumOfComp" 
          label="RegNumOfComp" 
          variant="outlined"
          size='small'
          error={ valid['RegNum']?.error }
          helperText={ valid['RegNum']?.helpTx ?? ' ' }                                  
          sx={{ m:1, mr:3, width: 218 }}           
          onChange={(e) => {
            let input = e.target.value;
            onlyInt('RegNum', input, MaxUserNo, setValid);
            setRegNum( input );
          }}
          value = { regNum }
        />

        <Button 
          disabled={ hasError(valid) }
          sx={{ m:1, ml:3, width: 218, height: 40 }} 
          variant="outlined" 
          endIcon={ <Search /> }
          onClick={ handleClick }
          size='small'
        >
          Search
        </Button>
      </Stack>

      {!open && doc && (
        
        <Link
          
          href={{
            pathname: `/app/comp`,
            // query: {
            //   typeOfDoc: doc?.head.typeOfDoc.toString(),
            //   version: doc?.head.version.toString(),
            //   seqOfDoc: doc?.head.seqOfDoc.toString(16),
            //   body: doc?.body.substring(2),
            //   creator: doc?.head.creator.toString(16),
            //   createDate: doc?.head.createDate.toString(),
            // }
          }}
          
          // as={`/app/comp`}

          // variant='body1'

          // underline='hover'
        >
          <Button variant='outlined' sx={{m:1, width: 488, height:40}} endIcon={<DriveFileMove />} >
            SN: { '0x' +
                  doc?.head.version.toString(16).padStart(4, '0') +
                  doc?.head.seqOfDoc.toString(16).padStart(16, '0')
                }
          </Button>
        </Link>
        
      )}

      {open && !doc && (
        <Alert 
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <Close fontSize="inherit" />
            </IconButton>
          }

          variant='outlined' 
          severity='info' 
          sx={{ m:1, height: 40, width:488, p:0.25, px:1, }} 
        >
          No Records. 
        </Alert>
      )}

      {!open && !doc && (
        <CenterInfo />
      )}
        
    </Stack>
  )
}
