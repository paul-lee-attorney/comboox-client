import { regCenterABI, useRegCenterGetDocByUserNo } from '../../generated';
import { AddrOfRegCenter, AddrZero, HexType } from '../../interfaces';
import Link from '../../scripts/Link';

import { useComBooxContext } from '../../scripts/ComBooxContext';
import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import { Button, Stack, TextField } from '@mui/material';
import { Search } from '@mui/icons-material';
import { readContract } from '@wagmi/core';

type GetCompType = {
  regNum: string
}

export interface Head {
  typeOfDoc: number,
  version: number,
  seqOfDoc: BigNumber,
  creator: number,
  createDate: number,
  para: number,
  argu: number,
  data: number,
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
    args: [BigNumber.from(regNum)],
  })

  return data;
}


export function GetComp() {

  const { setGK } = useComBooxContext();

  const [ regNum, setRegNum ] = useState<string>();

  const [ doc, setDoc ] = useState<Doc>();

  const handleClick = async () => {
    if (regNum) {
      let doc = await getDocByUserNo(regNum);
      if (doc.body != AddrZero) {
        setGK(doc.body);
        setDoc(doc);
      }
    }
  }

  return (
    <Stack direction={'column'} sx={{ width:'100%', alignItems:'center' }} >

      <Stack direction={'row'} sx={{m:1, p:1, justifyContent:'center'}}>
        <TextField 
          sx={{ m: 1, minWidth: 280 }} 
          id="txRegNumOfComp" 
          label="RegNumOfComp" 
          variant="outlined"
          helperText="Integer < 2^40 "
          onChange={(e) => setRegNum(e.target.value)}
          value = { regNum }
          size='small'
        />

        <Button 
          sx={{ m: 1, minWidth: 120, height: 40 }} 
          variant="contained" 
          endIcon={ <Search /> }
          onClick={ handleClick }
          size='small'
        >
          Search
        </Button>
      </Stack>

      {doc && (
        
        <Link
          
          href={{
            pathname: `/comp/mainPage`,
            query: {
              typeOfDoc: doc?.head.typeOfDoc.toString(),
              version: doc?.head.version.toString(),
              seqOfDoc: doc?.head.seqOfDoc.toHexString(),
              body: doc?.body.substring(2),
              creator: doc?.head.creator.toString(16),
              createDate: doc?.head.createDate.toString(),
            }
          }}
          
          as={`/comp/mainPage`}

          variant='body1'

          underline='hover'
        >
          <Button>
          SN: { '0x' +
                doc?.head.version.toString(16).padStart(4, '0') +
                doc?.head.seqOfDoc.toHexString().substring(2).padStart(16, '0')
              }
          </Button>
        </Link>
        
      )}
        
    </Stack>
  )
}