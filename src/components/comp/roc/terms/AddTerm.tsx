import { Dispatch, SetStateAction, useState } from "react";
import { AddrZero, HexType, MaxPrice } from "../../../../scripts/common";

import { 
  useShareholdersAgreementCreateTerm, 
  useShareholdersAgreementRemoveTerm 
} from "../../../../generated";

import { getDocAddr } from "../../../../scripts/center/rc";
import { Button, Stack, TextField } from "@mui/material";
import { Delete, PlaylistAdd } from "@mui/icons-material";
import { FormResults, defFormResults, hasError, onlyNum } from "../../../../scripts/common/toolsKit";


interface AddTermProps {
  sha: HexType;
  title: number;
  setTerms: Dispatch<SetStateAction<HexType[]>>;
  isCreated: boolean;
}

export function AddTerm({sha, title, setTerms, isCreated}: AddTermProps) {

  const [ version, setVersion ] = useState<string>('1');
  const [ valid, setValid ] = useState<FormResults>(defFormResults);

  const {
    isLoading: createTermLoading,
    write: createTerm,
  } = useShareholdersAgreementCreateTerm({
    address: sha,
    args: version 
      ? [BigInt(title), BigInt(version)]
      : undefined,
    onSuccess(data:any) {
      getDocAddr(data.hash).
        then(addrOfTerm => setTerms(v => {
          let out = [...v];
          out[title-1] = addrOfTerm;
          return out;
        }));      
    }
  });

  const {
    isLoading: removeTermLoading,
    write: removeTerm,
  } = useShareholdersAgreementRemoveTerm({
    address: sha,
    args: [BigInt(title)],
    onSuccess() {
      setTerms(v=>{
        let out = [...v];
        out[title-1] = AddrZero;
        return out;
      });
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
            error={ valid['Version'].error }
            helperText={ valid['Version'].helpTx }
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

          <Button
            disabled={ !version || createTermLoading || hasError(valid) }
            variant="contained"
            sx={{
              mr: 5,
              height: 40,
            }}
            endIcon={ <PlaylistAdd /> }
            onClick={() => createTerm?.()}
          >
            Create
          </Button>

        </Stack>
      )}

      {isCreated && (
        <Button
          disabled={ removeTermLoading }
          variant="contained"
          sx={{
            height: 40,
            mr: 5,
          }}
          endIcon={ <Delete /> }
          onClick={() => removeTerm?.()}
        >
          Remove
        </Button>
      )}    
    </>
  );
}