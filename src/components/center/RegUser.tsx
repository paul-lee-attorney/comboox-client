import { useAccount } from 'wagmi';

import { 
  usePrepareRegCenterRegUser, 
  useRegCenterRegUser
} from '../../generated';

import { AddrOfRegCenter, Bytes32Zero } from '../../interfaces';

export function RegUser() {
  const { address } = useAccount();
  
  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareRegCenterRegUser({
    address: AddrOfRegCenter,
    args: [ `0x${Bytes32Zero}` ],
  })  

  const { 
    error, 
    isError, 
    isLoading, 
    isSuccess, 
    write 
  } = useRegCenterRegUser(config)

  return (
    <div>
      <button disabled={!write || isLoading} onClick={() => write?.()}>
        {isLoading ? 'Loading...' : 'RegUser'}
      </button>
      {isSuccess && (
        <div>
          Successfully registered User! <br/>
          Account: {address} <br/>
        </div>
      )}
      {(isPrepareError || isError) && (
        <div>Error: {(prepareError || error)?.data?.data?.reason}</div>
      )}
    </div>
  )
}
