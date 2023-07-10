import { AccountCircle } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import Link from "next/link";

interface AcctPageProps {
  flag: boolean;
}

export function AcctPage({ flag }:AcctPageProps) {
  return (
    <Link    
      href={{
        pathname: flag ? `/my/UserInfo` : '/' ,
      }}
      as={`/my/UserInfo`}
    >
      <IconButton disabled={!flag} sx={{width: 50, height:50, color: flag ? 'white' : 'prime', }}  >
        <AccountCircle />
      </IconButton>
    </Link>
  );
}