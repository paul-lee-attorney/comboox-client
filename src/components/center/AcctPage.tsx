import { AccountCircle, BorderColor } from "@mui/icons-material";
import { Button } from "@mui/material";

import Link from "next/link";
import { longSnParser } from "../../scripts/common/toolsKit";
import { useContractRead, useWalletClient } from "wagmi";
import { AddrOfRegCenter } from "../../scripts/common";
import { regCenterABI, useRegCenterRegUser } from "../../generated";
import { useComBooxContext } from "../../scripts/common/ComBooxContext";

interface AcctPageProps {
  flag: boolean;
}

export function AcctPage({ flag }:AcctPageProps) {

  const { data: signer } = useWalletClient();

  const { userNo, setUserNo } = useComBooxContext();

  const {
    refetch: getMyUserNo
  } = useContractRead({
    address: AddrOfRegCenter,
    abi: regCenterABI,
    functionName: 'getMyUserNo',
    account: signer?.account ,
    onSuccess(data) {
      if (signer) setUserNo(data);
      else setUserNo(undefined);
    },
  })

  const {
    isLoading: regUserLoading,
    write: regUser
  } = useRegCenterRegUser({
    address: AddrOfRegCenter,
    onSuccess() {
      getMyUserNo();
    }
  })

  return (
    <>
    {userNo && (
      <Link    
        href={{
          pathname: flag ? `/center/UserInfo` : '/' ,
        }}
        as={`/center/UserInfo`}
      >

        <Button
          variant='contained'
          color='info'
          startIcon={<AccountCircle />}
          sx={{ minWidth:218  }}
        >
          {longSnParser(userNo?.toString() ?? '0')}
        </Button>
      
      </Link>
    )}

    {!userNo && (
      <Button 
        size="small"
        disabled={ !signer || regUserLoading } 
        onClick={() => {
          regUser?.()
        }}
        variant={flag ? 'contained' : 'outlined' }
        color={ flag ? 'info' : 'primary' }
        sx={{ minWidth:218 }} 
        endIcon={<BorderColor />}       
      >
        Register
      </Button>

    )}
  </>
  );
}