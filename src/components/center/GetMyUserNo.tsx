import { useAccount, useContract, useSigner } from 'wagmi';
import { useState } from 'react';
import { regCenterABI } from '../../generated';
import { AddrOfRegCenter } from '../../interfaces';

export function GetMyUserNo() {
  const {isConnected} = useAccount();

  const [userNo, setUserNo] = useState('');
  const {data: signer} = useSigner();

  const rc = useContract({
    address: AddrOfRegCenter,
    abi: regCenterABI,
    signerOrProvider: signer,
  });

  const handleClick = async () => {
    const res = await rc?.getMyUserNo();
    res && setUserNo(res.toString());
    console.log(res);
  }

  return (
    <>
      {isConnected && (
        <div>
          <button onClick={handleClick}>
            getUserNo.
          </button>
          {userNo && (
            <div>
              {userNo}
            </div>
          )}
          {!userNo && (
            <div>
              You are not registered yet. <br/>
              Welcome to regist user with us!
            </div>
          )}
        </div>
      )}
    </>
  )
}
