import { BigNumber } from 'ethers';
import { useRouter } from 'next/router';

import { useState, useEffect } from 'react';

import { readContract } from '@wagmi/core';

import { 
  generalKeeperABI
} from '../../../generated';
import { GetCompGenInfo } from '../../../components/comp/GetCompGenInfo';


async function getKeepers(addrOfGK: `0x${string}`) {
  let keepers = [];

  for (let i = 0; i<10; i++) {
    keepers[i] = await readContract({
      address: addrOfGK,
      abi: generalKeeperABI,
      functionName: 'getKeeper',
      args: [BigNumber.from(i+1)],
    });
  }
  // console.log('keepers: ', keepers);
  return keepers;
} 

async function getBooks(addrOfGK: `0x${string}`) {
  let books = [];

  for (let i = 0; i<9; i++) {
    books[i] = await readContract({
      address: addrOfGK,
      abi: generalKeeperABI,
      functionName: 'getBook',
      args: [BigNumber.from(i+1)],
    });
    // books[i] = books[i].substring(2);
  }

  // console.log('books: ', books);

  return books;
} 

function GeneralKeeperPage() {
  const [keepers, setKeepers] = useState<string[]>();
  const [books, setBooks] = useState<string[]>();

  const { query } = useRouter();

  const addrOfGK : `0x${string}` = `0x${query?.body}`;

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
        {books &&  
          <GetCompGenInfo 
            gk={ addrOfGK.substring(2) } 
            books={ books } 
        /> }
      <hr/>
    </>    
  )
}

export default GeneralKeeperPage