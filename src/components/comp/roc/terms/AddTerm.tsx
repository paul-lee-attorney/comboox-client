import { Dispatch, SetStateAction, useState } from "react";
import { AddrZero, HexType } from "../../../../interfaces";

import { 
  useShareholdersAgreementCreateTerm, 
  useShareholdersAgreementRemoveTerm 
} from "../../../../generated";

import { getDocAddr } from "../../../../queries/rc";
import { Button, Stack, TextField } from "@mui/material";
import { Delete, PlaylistAdd } from "@mui/icons-material";


interface AddTermProps {
  sha: HexType;
  title: number;
  setTerms: Dispatch<SetStateAction<HexType[]>>;
  isCreated: boolean;
}

export function AddTerm({sha, title, setTerms, isCreated}: AddTermProps) {

  const [ version, setVersion ] = useState<string>('1');

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
            sx={{
              m:1,
              ml:3,
              minWidth: 218,
            }}
            onChange={(e) => setVersion(e.target.value)}
            value={ version }              
          />

          <Button
            disabled={ !version || createTermLoading }
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