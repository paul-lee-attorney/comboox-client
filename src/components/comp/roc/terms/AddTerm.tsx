import { Dispatch, SetStateAction, useState } from "react";
import { AddrZero, HexType, MaxPrice } from "../../../../scripts/common";

import { 
  useShareholdersAgreementCreateTerm, 
  useShareholdersAgreementRemoveTerm 
} from "../../../../generated";

import { getDocAddr } from "../../../../scripts/center/rc";
import { Stack, TextField } from "@mui/material";
import { Delete, PlaylistAdd } from "@mui/icons-material";
import { FormResults, defFormResults, hasError, onlyNum, refreshAfterTx } from "../../../../scripts/common/toolsKit";
import { LoadingButton } from "@mui/lab";


interface AddTermProps {
  sha: HexType;
  title: number;
  setTerms: Dispatch<SetStateAction<HexType[]>>;
  isCreated: boolean;
}

export function AddTerm({sha, title, setTerms, isCreated}: AddTermProps) {

  const [ version, setVersion ] = useState<string>('1');
  const [ valid, setValid ] = useState<FormResults>(defFormResults);
  const [ loading, setLoading ] = useState(false);

  const {
    isLoading: createTermLoading,
    write: createTerm,
  } = useShareholdersAgreementCreateTerm({
    address: sha,
    args: version && !hasError(valid)
      ? [BigInt(title), BigInt(version)]
      : undefined,
    onSuccess(data) {
      setLoading(true);
      let hash:HexType = data.hash;
      getDocAddr(hash).
        then(addrOfTerm => {
          setLoading(false);
          setTerms(v => {
            let out = [...v];
            out[title-1] = addrOfTerm;
            return out;
          });
        });      
    }
  });

  const refresh = ()=> {
    setLoading(false);
    setTerms(v=>{
      let out = [...v];
      out[title-1] = AddrZero;
      return out;
    });

  }

  const {
    isLoading: removeTermLoading,
    write: removeTerm,
  } = useShareholdersAgreementRemoveTerm({
    address: sha,
    args: !hasError(valid) ? [BigInt(title)] : undefined,
    onSuccess(data) {
      setLoading(true);
      let hash:HexType = data.hash;
      refreshAfterTx(hash, refresh);
    }
  });

  return (
    <>
      { !isCreated && (
        <Stack direction={'row'} sx={{ alignItems:'center' }}>
          <TextField 
            variant='outlined'
            label='Version'
            size='small'
            error={ valid['Version']?.error }
            helperText={ valid['Version']?.helpTx }
            sx={{
              m:1,
              ml:3,
              minWidth: 218,
            }}
            onChange={(e) => {
              let input = e.target.value;
              onlyNum('Version', input, MaxPrice, setValid);
              setVersion(input);
            }}
            value={ version }              
          />

          <LoadingButton
            disabled={ !version || createTermLoading || hasError(valid) }
            loading={loading}
            loadingPosition="end"
            variant="contained"
            sx={{
              mr: 5,
              height: 40,
            }}
            endIcon={ <PlaylistAdd /> }
            onClick={() => createTerm?.()}
          >
            Create
          </LoadingButton>

        </Stack>
      )}

      {isCreated && (
        <LoadingButton
          disabled={ removeTermLoading }
          loading = {loading}
          loadingPosition="end"
          variant="contained"
          sx={{
            height: 40,
            mr: 5,
          }}
          endIcon={ <Delete /> }
          onClick={() => removeTerm?.()}
        >
          Remove
        </LoadingButton>
      )}    
    </>
  );
}