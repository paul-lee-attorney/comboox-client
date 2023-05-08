import { BigNumber } from 'ethers';
import { useRouter } from 'next/router';

import { useState, useEffect } from 'react';

import { readContract } from '@wagmi/core';

import Link from '../../../scripts/Link';

import { 
  generalKeeperABI
} from '../../../generated';

import { GeneralInfo } from '../../../components/comp/GeneralInfo';
import { HexType } from '../../../interfaces';


async function getKeepers(addrOfGK: `0x${string}`) {
  let keepers = [];

  for (let i = 0; i<10; i++) {
    let temp = await readContract({
      address: addrOfGK,
      abi: generalKeeperABI,
      functionName: 'getKeeper',
      args: [BigNumber.from(i+1)],
    });
    keepers[i] = temp.substring(2);
  }
  return keepers;
} 

async function getBooks(addrOfGK: `0x${string}`) {
  let books = [];

  for (let i = 0; i<9; i++) {
    let temp = await readContract({
      address: addrOfGK,
      abi: generalKeeperABI,
      functionName: 'getBook',
      args: [BigNumber.from(i+1)],
    });
    books[i] = temp.substring(2);
  }
  return books;
} 

function GeneralKeeperPage() {
  const [keepers, setKeepers] = useState<string[]>();
  const [books, setBooks] = useState<string[]>();

  const { query } = useRouter();

  const addrOfGK : HexType = `0x${query?.body}`;

  console.log("GK: ", addrOfGK);

  useEffect(() => {
    if (addrOfGK) {
      getKeepers(addrOfGK).then((keepers)=>setKeepers(keepers));
      getBooks(addrOfGK).then((books)=>setBooks(books));
    } 
  }, [addrOfGK]);
  
  return (
    <>
      <h1>General Keeper</h1>
      <hr />
        {/* {books && ( 
          <GeneralInfo 
            gk={ addrOfGK.substring(2) } 
            books={ books } 
          /> 
        )} */}
      <hr/>
      {books && (<Link
        href={{
          pathname: './setMaxQtyOfMembers',
          query: {
            body: books[7],
          }
        }}

        as = './setMaxQtyOfMembers'
        
        variant='h5'

        underline='hover'
      >
        SetMaxQtyOfMembers
      </Link>)}

    </>    
  )
}

export default GeneralKeeperPage