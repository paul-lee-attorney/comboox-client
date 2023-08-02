import { useState } from "react";

import { 
  Button, 
  Paper, 
  Toolbar,
  TextField,
  Stack,
} from "@mui/material";

import { useComBooxContext } from "../../../scripts/ComBooxContext";

import { Search, Send } from "@mui/icons-material";

import { 
  useBookOfSharesGetShare,
  useBookOfMembersSharesList,
} from "../../../generated";
import { LoadingButton } from "@mui/lab";
import { SharesList } from "../../../components/comp/bos/SharesList";
import { CertificateOfContribution } from "../../../components/comp/bos/CertificateOfContribution";
import { Share, codifyHeadOfShare, getSharesList } from "../../../queries/bos";
import { CopyLongStrSpan } from "../../../components/common/utils/CopyLongStr";


function BookOfShares() {
  const { boox } = useComBooxContext();

  const [ loading, setLoading ] = useState<boolean>();

  const [ sharesList, setSharesList ] = useState<Share[]>();

  const {
    refetch: obtainSharesList,
  } = useBookOfMembersSharesList ({
    address: boox ? boox[4] : undefined,
    onSuccess(data) {
      if (boox && data.length > 0) {
        getSharesList(boox[10], data).then(list => {
          setSharesList(list);
        });
      }
    }
  })

  const [ seqOfShare, setSeqOfShare ] = useState<string>();
  const [ bnSeqOfShare, setBnSeqOfShare ] = useState<bigint>();

  const [ open, setOpen ] = useState<boolean>(false);
  const [ share, setShare ] = useState<Share>();

  const { 
    refetch: getShareFunc, 
  } = useBookOfSharesGetShare({
    address: boox ? boox[10]: undefined,
    args: bnSeqOfShare ? [bnSeqOfShare] : undefined,
    onSuccess(data) {
      let share:Share = {
        sn: codifyHeadOfShare(data.head),
        head: data.head,
        body: data.body,        
      }
      setShare(share);
      setOpen(true);
    }
  });


  const searchShare = () => {
    if (seqOfShare) {
      setBnSeqOfShare(BigInt(seqOfShare));
      getShareFunc();
    }
  }

  return (
    <>
      <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >

        <Stack direction="row" >

          <Toolbar sx={{ textDecoration:'underline' }} >
            <h3>BOS - Book Of Shares</h3>
          </Toolbar>

          {boox && (
            <CopyLongStrSpan title="Addr" size="body1" src={ boox[10].toLowerCase() } />
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
                    onChange={(e) => 
                      setSeqOfShare(e.target.value)
                    }
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

                  {loading && (
                    <LoadingButton 
                      loading={ loading } 
                      loadingPosition='end' 
                      endIcon={<Send/>} 
                      sx={{p:1, m:1, ml:5}} 
                    >
                      <span>Loading</span>
                    </LoadingButton>
                  )}

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
          <CertificateOfContribution open={open} share={share} setOpen={setOpen} obtainSharesList={obtainSharesList} />
        )}

      </Paper>
    </>
  );
} 

export default BookOfShares;