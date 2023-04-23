import { useState } from 'react';

import { useAccount } from 'wagmi';

import { 
  usePrepareRegCenterCreateComp, 
  useRegCenterCreateComp,
  useRegCenterCreateCompEvent
} from '../../generated';

import { 
  AddrOfRegCenter, 
  SeqZero,
  AcctZero,
  DateZero,
  DataZero,
  AddrZero
} from '../../interfaces';

export function CreateComp() {

  type LogOfCreateComp = {
    versionOfGK: string
    seqOfGK: string
    creator: string
    addrOfGK: string
  }

  const [primeKeyOfKeeper, setPrimeKeyOfKeeper] = useState(AddrZero);

  const [log, setLog] = useState<{[key: string]: any}>({});

  // const [versionOfGK, setVersionOfGK] = useState(SeqZero);
  // const [seqOfGK, setSeqOfGK] = useState(SeqZero);
  // const [creator, setCreator] = useState(AcctZero);
  // const [addrOfGK, setAddrOfGK] = useState(AddrZero);

  // const { address: owner } = useAccount();

  useRegCenterCreateCompEvent({
    address: AddrOfRegCenter,
    listener( versionOfGK, seqOfGK, creator, addrOfGK) {
      console.log(versionOfGK, seqOfGK, creator, addrOfGK);

      let log : LogOfCreateComp  = {
        versionOfGK : versionOfGK.toHexString(),
        seqOfGK : seqOfGK.toHexString(),
        creator : creator.toHexString(),
        addrOfGK : addrOfGK
      };

      setLog(log);
    }
  });

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareRegCenterCreateComp({
    address: AddrOfRegCenter,
    args: [ AddrZero ],
  })  

  const { 
    error, 
    isError, 
    isLoading, 
    isSuccess, 
    write 
  } = useRegCenterCreateComp(config)

  return (
    <div>
      <input disabled={ isLoading }
        onChange={(e) => setPrimeKeyOfKeeper(`0x${e.target.value}`)}
        // onBlur={(e) => setPrimeKeyOfKeeper(`0x${e.target.value}`)}
        placeholder={ AddrZero }
        value={ primeKeyOfKeeper.substring(2) }
        size={50}
      />

      <br/>

      <button disabled={ !write || isLoading} onClick={() => write?.()}>
        {isLoading ? 'Loading...' : 'CreateComp'}
      </button>
      {isSuccess && log && (
        <div>
          Successfully created new Company ! <br/>
          VersionOfGK : { log.versionOfGK } <br/>
          SeqOfGK : { log.seqOfGK } <br/>
          Creator : { log.creator } <br/>
          AddressOfGK : { log.addrOfGK } 
        </div>
      )}
      {(isPrepareError || isError) && (
        <div>Error: {(prepareError || error)?.message}</div>
      )}
    </div>
  )
}
