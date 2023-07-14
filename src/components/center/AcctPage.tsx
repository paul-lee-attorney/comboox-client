import { AccountCircle } from "@mui/icons-material";
import { Button } from "@mui/material";

import Link from "next/link";
import { longSnParser } from "../../scripts/toolsKit";
import { useAccount, useContractRead } from "wagmi";
import { AddrOfRegCenter, HexType } from "../../interfaces";
import { regCenterABI } from "../../generated";
import { useComBooxContext } from "../../scripts/ComBooxContext";

interface AcctPageProps {
  flag: boolean;
}

export function AcctPage({ flag }:AcctPageProps) {

  const { address: acct } = useAccount();

  const { userNo, setUserNo } = useComBooxContext();

  useContractRead({
    address: AddrOfRegCenter,
    abi: regCenterABI,
    functionName: 'getMyUserNo',
    account: acct,
    onSuccess(data) {
      setUserNo(data);
    }
  })

  return (
    <Link    
      href={{
        pathname: flag ? `/my/UserInfo` : '/' ,
      }}
      as={`/my/UserInfo`}
    >

      <Button
        variant={flag ? 'contained' : 'outlined' }
        color={ flag ? 'info' : 'primary' }
        startIcon={<AccountCircle />}
        sx={{ minWidth:218  }}
      >
        {longSnParser(userNo?.toString() ?? '0')}
      </Button>

    </Link>
  );
}