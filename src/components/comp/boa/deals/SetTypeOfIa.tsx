import { BigNumber } from "ethers";
import { Bytes32Zero, HexType } from "../../../../interfaces";
import { readContract, waitForTransaction } from "@wagmi/core";
import { investmentAgreementABI, useInvestmentAgreementAddDeal, useInvestmentAgreementDelDeal, useInvestmentAgreementGetDeal, useInvestmentAgreementGetTypeOfIa, useInvestmentAgreementSetTypeOfIa, usePrepareInvestmentAgreementAddDeal, usePrepareInvestmentAgreementDelDeal, usePrepareInvestmentAgreementSetTypeOfIa } from "../../../../generated";
import { useEffect, useState } from "react";
import { Box, Button, Checkbox, Collapse, FormControl, FormControlLabel, InputLabel, MenuItem, Paper, Select, Stack, TextField, Toolbar } from "@mui/material";
import { AddCircle, EditNote, LockClock, RemoveCircle, Update } from "@mui/icons-material";
import { ExecDeal } from "./ExecDeal";

import dayjs, { Dayjs } from 'dayjs';
import { DateTimeField } from "@mui/x-date-pickers";

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

  const {
    config
  } = usePrepareInvestmentAgreementSetTypeOfIa({
    address: ia,
    args: type ? [BigNumber.from(type)] : undefined,
  })

  const {
    isLoading: setTypeOfIaLoading,
    write: setTypeOfIa,
  } = useInvestmentAgreementSetTypeOfIa({
    ...config,
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



