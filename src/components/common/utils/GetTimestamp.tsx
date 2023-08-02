import { QueryBuilderOutlined } from "@mui/icons-material";
import { IconButton, Snackbar, Stack } from "@mui/material";
import { useState } from "react";
import { usePublicClient } from "wagmi";
import { dateParser } from "../../../scripts/toolsKit";

export function GetTimestamp() {

  const provider = usePublicClient();

  const [ timestamp, setTimestamp ] = useState<bigint>();
  const [ open, setOpen ] = useState<boolean>(false);
  
  const getTimestamp = async ()=>{
    let block = await provider.getBlock();
    setTimestamp( block.timestamp );
    setOpen(true);
    console.log('date: ',  dateParser(Number(timestamp)));
  }

  return (

    <Stack direction="row"  sx={{ m:1, p:1 }} >
      <IconButton
        color="inherit" 
        onClick={getTimestamp}
      >
       <QueryBuilderOutlined /> 
      </IconButton>

      {timestamp != undefined && (
        <Snackbar
          open={open}
          anchorOrigin={{ vertical:'top', horizontal:'right' }}
          autoHideDuration={3000}
          onClose={()=>setOpen(false)}
          message={ dateParser( Number(timestamp) ) }
        />
      )}

    </Stack>
  );

}