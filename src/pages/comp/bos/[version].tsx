import { BigNumber } from 'ethers';
import { useRouter } from 'next/router';

import { useState, useEffect } from 'react';

import { readContract } from '@wagmi/core';

import { 
  generalKeeperABI
} from '../../../generated';

import { GeneralInfo } from '../../../components/comp/GeneralInfo';

function BookOfSharesPage() {
  const [keepers, setKeepers] = useState<string[]>();
  const [books, setBooks] = useState<string[]>();

  const { query } = useRouter();

  const addrOfBOS : `0x${string}` = `0x${query?.body}`;

  console.log("BOS: ", addrOfBOS);
  
  return (
    <>
      <h1>General Keeper</h1>
      <hr />
        {books && ( 
          <GeneralInfo 
            gk={ addrOfBOS.substring(2) } 
            books={ books } 
          /> 
        )}
      <hr/>
      
    </>    
  )
}

export default GeneralKeeperPage