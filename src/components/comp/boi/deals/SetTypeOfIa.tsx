import { HexType } from "../../../../interfaces";
import { 
  useInvestmentAgreementGetTypeOfIa, 
  useInvestmentAgreementSetTypeOfIa,  
} from "../../../../generated";

import { useState } from "react";
import { Button, Chip, Divider, FormControl, InputLabel, MenuItem, Select, Stack, TextField, } from "@mui/material";
import { EditNote } from "@mui/icons-material";
import { TypeOfIa } from "./CreateDeal";

interface SetTypeOfIaProps{
  ia: HexType;
  isFinalized: boolean;
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
    <Stack direction={'row'} sx={{ mx:7.6, alignItems:'center'}} >

      {newType > 0 && (
        <Chip 
          variant="outlined"
          color="primary"
          sx={{ m:1, height:40, minWidth:218, }}
          label={ TypeOfIa[ newType ] }
        />
      )}

      {!isFinalized && (
        <Stack direction="row" sx={{ alignItems:'center' }} >
          <FormControl variant="outlined" size="small" sx={{ m: 1, minWidth: 218 }}>
            <InputLabel id="typeOfIa-label">TypeOfIA</InputLabel>
            <Select
              labelId="typeOfIA-label"
              id="typeOfIA-select"
              label="TypeOfIA"
              value={ type }
              onChange={(e) => setType(parseInt(e.target.value.toString()))}
            >
              {TypeOfIa.slice(1, 7).map((v, i) => (
                  <MenuItem key={v} value={i+1}>{v}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Divider orientation="vertical" sx={{ m:1 }} flexItem />

          <Button 
            disabled = {!setTypeOfIa || setTypeOfIaLoading}
            sx={{ m:1, mr:7, p:1, minWidth: 120, height: 40 }} 
            variant="contained" 
            endIcon={<EditNote />}
            onClick={()=> setTypeOfIa?.()}
            size='small'
          >
            Set Type
          </Button>

        </Stack>
      )}



    </Stack>
  );
}



