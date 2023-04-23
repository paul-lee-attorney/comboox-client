import { useAccount, useContract, useSigner } from 'wagmi';
import { useState } from 'react';
import { regCenterABI } from '../../generated';
import { AddrOfRegCenter } from '../../interfaces';

export function GetMyUserInfo() {
  const {isConnected} = useAccount();

  const [userInfo, setUserInfo] = useState<{[key: string]:any}>();
  const {data: signer} = useSigner();

  const rc = useContract({
    address: AddrOfRegCenter,
    abi: regCenterABI,
    signerOrProvider: signer,
  });

  const handleClick = async () => {
    const res = await rc?.getUser();
    // console.log("userInfo: ", res);
    res && setUserInfo(res);
  }

  return (
    <>
      {isConnected && (
        <div>
          <button onClick={handleClick}>
            getUserInfo
          </button>
          {userInfo && (
            <div>
              IsCOA: {userInfo.isCOA ? 'Yes' : 'No'} <br/>
              CounterOfVerify: {userInfo.counterOfV} <br/>
              CreditBalance: {userInfo.balance?.toNumber()} <br/>
              PrimeKey: {userInfo.primeKey?.pubKey} <br/>
              BackupKey: {userInfo.backupKey?.pubKey} <br/>
            </div>
          )}
        </div>
      )}
    </>
  )
}
