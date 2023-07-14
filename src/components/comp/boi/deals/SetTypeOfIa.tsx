import { HexType } from "../../../../interfaces";
import { 
  useInvestmentAgreementGetTypeOfIa, 
  useInvestmentAgreementSetTypeOfIa,  
  usePrepareInvestmentAgreementSetTypeOfIa 
} from "../../../../generated";

import { useState } from "react";
import { Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField, } from "@mui/material";
import { EditNote } from "@mui/icons-material";

export const strTypeOfIa = ['CI', 'EXT', 'INT', 'CI & INT', 'EXT & INT', 'CI & EXT & INT'];

interface SetTypeOfIaProps{
  ia: HexType,
  isFinalized: boolean,
}

export function SetTypeOfIa({ia, isFinalized}: SetTypeOfIaProps) {

  const [ type, setType ] = useState<number>(2);
  const [ newType, setNewType ] = useState<number>(2);

  const {
    refetch: getTypeOfIa,
  } = useInvestmentAgreementGetTypeOfIa({
    address: ia,
    onSuccess(data) {
      setNewType(data);
    }
  })

  // const {
  //   config
  // } = usePrepareInvestmentAgreementSetTypeOfIa({
  //   address: ia,
  //   args: type ? [BigInt(type)] : undefined,
  // })

  const {
    isLoading: setTypeOfIaLoading,
    write: setTypeOfIa,
  } = useInvestmentAgreementSetTypeOfIa({
    address: ia,
    args: type ? [BigInt(type)] : undefined,
    onSuccess() {
      getTypeOfIa();
    }
  })

  return (
    <Stack direction={'row'} sx={{ alignItems:'center'}} >

      <TextField 
        variant='filled'
        label='UpdatedTypeOfIA'
        inputProps={{ readOnly: true }}
        sx={{
          m:1,
          minWidth: 218,
        }}
        value={ strTypeOfIa[newType-1] }
      />

      <FormControl variant="filled" sx={{ m: 1, minWidth: 218 }}>
        <InputLabel id="typeOfIa-label">TypeOfIA</InputLabel>
        <Select
          labelId="typeOfIA-label"
          id="typeOfIA-select"
          value={ type }
          onChange={(e) => setType(parseInt(e.target.value.toString()))}
        >
          {
            strTypeOfIa.map((v, i) => (
              <MenuItem key={v} value={i+1}>{v}</MenuItem>
            ))
          }
        </Select>
      </FormControl>

      <Button 
        disabled = {!setTypeOfIa || setTypeOfIaLoading}

        sx={{ m:1, mr:5, p:1, minWidth: 120, height: 40 }} 
        variant="contained" 
        startIcon={<EditNote />}
        onClick={()=> setTypeOfIa?.()}
        size='small'
      >
        Set
      </Button>

    </Stack>
  );
}



