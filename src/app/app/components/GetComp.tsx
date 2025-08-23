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
import { getCompInfo } from '../comp/gk';
import { getOldCompInfo } from '../compV1/gk';

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
          if (head.typeOfDoc == 20 || head.typeOfDoc == 40 || 
            (head.typeOfDoc > 46 && head.typeOfDoc < 54)
          ) {
            if (head.typeOfDoc == 20 && head.version == 1) {
              getOldCompInfo(body).then(
                info => {
                  if (info.regNum > 0) {
                    setRegNum(info.regNum.toString());
                    setOpen(false);
                    setGK(body);
                    setDoc({head: head, body: body});
                  }
                }
              )
            } else {
              getCompInfo(body).then(
                info => {
                  if (info.regNum > 0) {
                    setRegNum(info.regNum.toString());
                    setOpen(false);
                    setGK(body);
                    setDoc({head: head, body: body});
                  }
                }
              );
            }
          } else {
            setDoc(undefined);
            setOpen(true);
          }
        }
      )
    } else {
      getDocByUserNo(BigInt(regNum)).then(
        (doc:Doc) => {
          if (doc.body != AddrZero) {
            setGK(doc.body);
            setDoc({head:doc.head, body:doc.body});
            setOpen(false);
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
            pathname: regNum == '8' ? `/app/compV1` : '/app/comp',
          }}
        >
          <Button variant='outlined' sx={{m:1, width: 488, height:40}} endIcon={<DriveFileMove />} >
            SN: { '0x' +
                  doc?.head.typeOfDoc.toString(16).padStart(4, '0') +
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
