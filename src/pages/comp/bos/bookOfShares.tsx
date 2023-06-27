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
  bookOfSharesABI,
  useBookOfSharesGetShare,
  useRegisterOfMembersSharesList,
} from "../../../generated";
import { BigNumber } from "ethers";
import { LoadingButton } from "@mui/lab";
import { SharesList } from "../../../components/comp/bos/SharesList";
import { CertificateOfContribution } from "../../../components/comp/bos/CertificateOfContribution";
import { Share, codifyHeadOfShare, getSharesList } from "../../../queries/bos";


function BookOfShares() {
  const { boox } = useComBooxContext();

  const [ loading, setLoading ] = useState<boolean>();

  const [ sharesList, setSharesList ] = useState<Share[]>();

  const {
    refetch: obtainSharesList,
  } = useRegisterOfMembersSharesList ({
    address: boox[8],
    onSuccess(data) {
      if (data.length > 0) {
        setLoading(true);
        getSharesList(boox[7], data).then(list => {
          setLoading(false);
          setSharesList(list);
        });
      }
    }
  })

  const [ seqOfShare, setSeqOfShare ] = useState<string>();
  const [ bnSeqOfShare, setBnSeqOfShare ] = useState<BigNumber>();

  const [ open, setOpen ] = useState<boolean>(false);
  const [ share, setShare ] = useState<Share>();

  const { 
    refetch: getShareFunc, 
  } = useBookOfSharesGetShare({
    address: boox[7],
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
      setBnSeqOfShare(BigNumber.from(seqOfShare));
      getShareFunc();
    }
  }

  return (
    <>
      <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >
        <Toolbar>
          <h3>BOS - Book Of Shares</h3>
        </Toolbar>

        <table width={1680} >
          <thead />
          
          <tbody>

            <tr>        
              <td colSpan={2}>
                <Stack 
                    direction={'row'}
                  >
                    <TextField 
                      sx={{ m: 1, minWidth: 120 }} 
                      id="tfSeqOfShare" 
                      label="seqOfShare" 
                      variant="outlined"
                      helperText="Number <= 2^32 (e.g. '123')"
                      onChange={(e) => 
                        setSeqOfShare(e.target.value)
                      }
                      value = { seqOfShare }
                      size='small'
                    />

                    <Button 
                      disabled={ !seqOfShare }
                      sx={{ m: 1, minWidth: 120, height: 40 }} 
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