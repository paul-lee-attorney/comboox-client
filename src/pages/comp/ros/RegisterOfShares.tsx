import { useEffect, useState } from "react";

import { 
  Button, 
  Paper, 
  Toolbar,
  TextField,
  Stack,
} from "@mui/material";

import { useComBooxContext } from "../../../scripts/common/ComBooxContext";

import { Search } from "@mui/icons-material";

import { SharesList } from "../../../components/comp/ros/SharesList";
import { CertificateOfContribution } from "../../../components/comp/ros/CertificateOfContribution";
import { Share, getShare, getSharesList } from "../../../scripts/comp/ros";
import { CopyLongStrSpan } from "../../../components/common/utils/CopyLongStr";
import { booxMap } from "../../../scripts/common";


function RegisterOfShares() {
  const { boox } = useComBooxContext();

  const [ sharesList, setSharesList ] = useState<readonly Share[]>();
  const [ time, setTime ] = useState<number>(0);  

  const refresh = ()=>{
    setTime(Date.now());
  }

  useEffect(()=>{
    if (boox) {
      getSharesList(boox[booxMap.ROS]).then(
        res => setSharesList(res)
      );
    }
  }, [boox, time]);

  const [ seqOfShare, setSeqOfShare ] = useState<number>();
  const [ open, setOpen ] = useState<boolean>(false);
  const [ share, setShare ] = useState<Share>();
  
  const searchShare = () => {
    if (boox && seqOfShare) {
      getShare(boox[booxMap.ROS], seqOfShare).then(
        res => {
          setShare(res);
          setOpen(true);
        }
      );
    }
  }

  return (
    <>
      <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >

        <Stack direction="row" >

          <Toolbar sx={{ textDecoration:'underline' }} >
            <h3>ROS - Register Of Shares</h3>
          </Toolbar>

          {boox && (
            <CopyLongStrSpan title="Addr"  src={ boox[booxMap.ROS].toLowerCase() } />
          )}

        </Stack>

        <table width={1680} >
          <thead />
          
          <tbody>

            <tr>        
              <td colSpan={2}>
                <Stack direction='row' sx={{ alignItems:'center' }} >

                  <TextField 
                    sx={{ m: 1, minWidth: 218 }} 
                    id="tfSeqOfShare" 
                    label="seqOfShare" 
                    variant="outlined"
                    onChange={(e) => setSeqOfShare(parseInt(e.target.value ?? '0')) }
                    value = { seqOfShare }
                    size='small'
                  />

                  <Button 
                    disabled={ !seqOfShare }
                    sx={{ m: 1, minWidth: 168, height: 40 }} 
                    variant="contained" 
                    endIcon={ <Search /> }
                    onClick={ searchShare }
                    size='small'
                  >
                    Search
                  </Button>

                </Stack>
              </td>
              <td colSpan={2} >
              </td>
            </tr>

            <tr>
              <td colSpan={4}>

                {sharesList && (
                  <SharesList 
                    list={ sharesList }  
                    setShare={ setShare }
                    setOpen={ setOpen }
                  />
                )}

              </td>
            </tr>
          </tbody>

        </table>
        
        {share && (
          <CertificateOfContribution open={open} share={share} setOpen={setOpen} refresh={refresh} />
        )}

      </Paper>
    </>
  );
} 

export default RegisterOfShares;