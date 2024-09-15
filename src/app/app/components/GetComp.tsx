"use client"

import { useState } from 'react';

import { Alert, Button, IconButton, Stack, TextField } from '@mui/material';
import { Close, DriveFileMove, Search } from '@mui/icons-material';

import { AddrZero, MaxUserNo } from '../common';
import { FormResults, HexParser, defFormResults, hasError, onlyHex, onlyInt } from '../common/toolsKit';
import Link from 'next/link';
import { Doc, getDocByUserNo, getHeadByBody, HeadOfDoc } from '../rc';

import { useComBooxContext } from '../../_providers/ComBooxContextProvider';

import { CenterInfo } from './center_info/CenterInfo';

export function GetComp() {

  const { setGK, setBoox, setOnPar, setCompInfo } = useComBooxContext();

  const [ regNum, setRegNum ] = useState<string>();
  const [ valid, setValid ] = useState<FormResults>(defFormResults);

  const [ doc, setDoc ] = useState<Doc>();

  const [ open, setOpen ] = useState(false);

  const handleClick = async () => {

    setGK(undefined);
    setBoox(undefined);
    setOnPar(undefined);
    setCompInfo(undefined);

    if (!regNum) return;

    if (regNum.substring(0,2) == '0x' ) {
      let body = HexParser(regNum);
      getHeadByBody(body).then(
        (head: HeadOfDoc) => {
          console.log("head: ", head);
          console.log("body: ", body);
          if (head.typeOfDoc != 20) {
            setDoc(undefined);
            setOpen(true);
          } else {
            setOpen(false);
            setGK(body);
            setDoc({head: head, body: body});            
          }
        }
      )
    } else {
      getDocByUserNo(BigInt(regNum)).then(
        (doc:Doc) => {
          if (doc.body != AddrZero) {
            setOpen(false);
            setGK(doc.body);
            setDoc(doc);
          } else {
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
          label="RegNum / Address" 
          variant="outlined"
          size='small'
          error={ valid['RegNum']?.error }
          helperText={ valid['RegNum']?.helpTx ?? ' ' }                                  
          sx={{ m:1, mr:3, width: 218 }}
          onChange={(e) => {
            let input = e.target.value;
            if (input.substring(0,2) == '0x') {
              onlyHex('RegNum', input, 40, setValid);
            } else {
              onlyInt('RegNum', input, MaxUserNo, setValid);
            }
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
          }}
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
