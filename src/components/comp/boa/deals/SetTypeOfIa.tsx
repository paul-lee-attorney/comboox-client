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

export const strTypeOfIa = ['ZeroPoint', 'CI', 'EXT', 'INT', 'CI & INT', 'EXT & INT', 'CI & EXT & INT'];

interface SetTypeOfIaProps{
  ia: HexType,
  finalized: boolean,
}

export function SetTypeOfIa({ia, finalized}: SetTypeOfIaProps) {

  const [ type, setType ] = useState<string>();
  const [ newType, setNewType ] = useState<number>(0);

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
        value={ strTypeOfIa[newType] }
      />

      <FormControl variant="filled" sx={{ m: 1, minWidth: 218 }}>
        <InputLabel id="typeOfIa-label">TypeOfIA</InputLabel>
        <Select
          labelId="typeOfIA-label"
          id="typeOfIA-select"
          value={ type }
          onChange={(e) => setType(e.target.value)}
        >
          {
            strTypeOfIa.map((v, i) => (
              <MenuItem key={i} value={i.toString()}>{v}</MenuItem>
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
        Set_Type_Of_IA
      </Button>

    </Stack>
  );
}



