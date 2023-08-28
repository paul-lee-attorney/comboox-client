import { regCenterABI } from '../../generated';
import { AddrOfRegCenter, AddrZero, HexType } from '../../scripts/common';
import Link from '../../scripts/common/Link';

import { useComBooxContext } from '../../scripts/common/ComBooxContext';
import { useState } from 'react';
import { Alert, Button, Collapse, IconButton, Stack, TextField } from '@mui/material';
import { Close, DriveFileMove, Search } from '@mui/icons-material';
import { readContract } from '@wagmi/core';
import { CenterInfo } from './CenterInfo';

export interface Head {
  typeOfDoc: number,
  version: number,
  seqOfDoc: bigint,
  creator: number,
  createDate: number,
  para: number,
  argu: number,
  state: number,
}

export interface Doc {
  head: Head,
  body: HexType,
}

async function getDocByUserNo(regNum: string): Promise<Doc>{

  let data:Doc = await readContract({
    address: AddrOfRegCenter,
    abi: regCenterABI,
    functionName: 'getDocByUserNo',
    args: [BigInt(regNum)],
  })

  return data;
}

export function GetComp() {

  const { setGK } = useComBooxContext();

  const [ regNum, setRegNum ] = useState<string>();

  const [ doc, setDoc ] = useState<Doc>();

  const [ open, setOpen ] = useState(false);

  const handleClick = async () => {
    if ( regNum ) {
      getDocByUserNo(regNum).then(
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

      <Stack direction={'row'} sx={{mt:2, mb:0, p:1, justifyContent:'center'}}>
        <TextField 
          sx={{ m:1, mr:3, width: 218 }} 
          id="txRegNumOfComp" 
          label="RegNumOfComp" 
          variant="outlined"
          onChange={(e) => setRegNum( e.target.value )}
          // value = { regNum }
          size='small'
        />

        <Button 
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
            pathname: `/comp/HomePage`,
            query: {
              typeOfDoc: doc?.head.typeOfDoc.toString(),
              version: doc?.head.version.toString(),
              seqOfDoc: doc?.head.seqOfDoc.toString(16),
              body: doc?.body.substring(2),
              creator: doc?.head.creator.toString(16),
              createDate: doc?.head.createDate.toString(),
            }
          }}
          
          as={`/comp/HomePage`}

          variant='body1'

          underline='hover'
        >
          <Button variant='outlined' sx={{m:3, width: 488, height:40}} endIcon={<DriveFileMove />} >
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
          sx={{ m:3, height: 40, width:488, p:0.25, px:1, }} 
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
