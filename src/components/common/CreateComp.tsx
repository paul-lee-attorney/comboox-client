import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'

import { waitForTransaction } from '@wagmi/core'


import { 
  usePrepareRegCenterCreateComp, 
  useRegCenterCreateComp,
} from '../../generated';

import { 
  AddrOfRegCenter,
  HexType
} from '../../interfaces';

type Log = {
  sn: string,
  creator: string,
  addrOfGK: string,
}

async function getReceipt(hash: HexType) {
  const receipt = await waitForTransaction({
    hash: hash
  });

  let log!:Log;

  if (receipt) {
    log = {
      sn: receipt.logs[0].topics[1].substring(6, 26),
      creator: receipt.logs[0].topics[1].substring(26, 36),
      addrOfGK: '0x' + receipt.logs[0].topics[2].substring(26),
    };  
  }

  return log;  
}

export function CreateCompPage() {

  const [log, setLog] = useState<Log>();

  const { query } = useRouter();

  useEffect(() => {
    if (query.addrOfGK) {
      const logOfQuery:Log = {
        sn: query.sn?.toString() ?? '',
        creator: query.creator?.toString() ?? '',
        addrOfGK: query.addrOfGK?.toString() ?? ''
      };
      setLog(logOfQuery);
      // console.log('logOfQuery: ', logOfQuery);
    }
  }, [query]);

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareRegCenterCreateComp({
    address: AddrOfRegCenter
  });

  const {
    data, 
    error, 
    isError, 
    isLoading, 
    write 
  } = useRegCenterCreateComp(config)

  useEffect(() => {
    if (data) {
      getReceipt(data.hash).then((log)=>setLog(log));
    }
  }, [data]);

  return (
    <div>
      <button disabled={ !write || isLoading} onClick={() => write?.()}>
        {isLoading ? 'Loading...' : 'CreateComp'}
      </button>

      <hr />

      {log && (
        <div>
          Successfully Created Booking System For Your Company ! <br/>
          RegNum : { log.sn } <br/>
          Creator : { log.creator } <br/>
          AddrOfGK : { log.addrOfGK } 
        </div>
      )}

      <hr />
      
    </div>
  )
}