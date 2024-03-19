import { useEffect, useState } from "react";
import { useComBooxContext } from "../../../_providers/ComBooxContextProvider";
import { CompInfo, getBoox, getCompInfo } from "../../../comp/read/gk";
import { Stack, Typography } from "@mui/material";
import { longSnParser } from "../../../read/toolsKit";
import { CopyLongStrSpan } from "../../../read/CopyLongStr";

export function CompSymbol() {

  const { gk, setBoox } = useComBooxContext();

  const [ compInfo, setCompInfo ] = useState<CompInfo>();

  useEffect(() => {
    if (gk) {
      getBoox(gk).then(
        (res) => setBoox(res.map(v=>(v.addr)))
      );
      getCompInfo(gk).then(
        res => setCompInfo(res)
      );
    } else {
      setBoox(undefined);
    }
  }, [gk, setBoox]);

  return (
    <Stack direction='row' sx={{ alignItems:'center', justifyContent:'center', flexGrow:5 }} >

      {gk && compInfo && (
        <Typography variant="h6" component="div" sx={{ mx:1 }} >
          {compInfo.symbol}
        </Typography>
      )}

      {gk && compInfo && (
        <Typography variant="h6" component="div" sx={{ mx:1 }} >
          ({longSnParser(compInfo.regNum.toString())})
        </Typography>
      )}

      {gk && (
        <CopyLongStrSpan title='Addr' src={gk.toLowerCase()} />
      )}
    </Stack>

  );
}




