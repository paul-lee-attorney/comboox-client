import { Button, FormControl, InputLabel, MenuItem, Paper, Select, Stack, TextField, } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { Update } from "@mui/icons-material";
import { useGeneralKeeperSetCompInfo } from "../../../../generated";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { CompInfo } from "../../../../scripts/comp/gk";
import { defaultInfo } from "../SetCompInfo";
import { refreshAfterTx, toAscii } from "../../../../scripts/common/toolsKit";
import { currencies } from "../GeneralInfo";
import { HexType } from "../../../../scripts/common";


export interface ConfigSettingProps{
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function SetCompInfo({setOpen}:ConfigSettingProps) {
  const { gk } = useComBooxContext();

  const [compInfo, setCompInfo] = useState<CompInfo>(defaultInfo);  
  
  const updateResults = ()=>{
    setOpen(false);
  }

  const {
    isLoading: setInfoLoading,
    write: setInfo, 
   } = useGeneralKeeperSetCompInfo({
    address: gk,
    args: [ compInfo.currency, `0x${toAscii(compInfo.symbol).padEnd(40,'0')}`, compInfo.name ],
    onSuccess(data) {
      let hash: HexType = data.hash;
      refreshAfterTx(hash, updateResults);
    }
  });

  return (

    <Paper elevation={3} sx={{
      m:1, p:1, 
      border: 1, 
      borderColor:'divider' 
      }} 
    >

      <Stack direction='row' sx={{alignItems:'center', justifyContent:'start'}} >
        <TextField 
          sx={{ m: 1, minWidth: 218 }} 
          id="tfNameOfComp" 
          label="CompanyName" 
          variant="outlined"
          onChange={(e) => {
            setCompInfo((v) => ({
              ...v,
              name: (e.target.value ?? ''),
            }))
          }}
          value = { compInfo.name }
          size='small'
        />

        <TextField 
          sx={{ m: 1, minWidth: 120 }} 
          id="tfSymbolOfComp" 
          label="SymbolOfCompany" 
          variant="outlined"
          onChange={(e) => {
            setCompInfo((v) => ({
              ...v,
              symbol: (e.target.value ?? ''),
            }))
          }}

          value = { compInfo.symbol }
          size='small'
        />

        <FormControl variant="outlined" size="small" sx={{ m: 1, minWidth: 218 }}>
          <InputLabel id="bookingCurrency-label">BookingCurrency</InputLabel>
          <Select
            labelId="bookingCurrency-label"
            id="bookingCurrency-select"
            label="BookingCurrency"
            value={ compInfo.currency.toString() }
            onChange={(e) => setCompInfo((v) => ({
              ...v,
              currency: Number(e.target.value) ,
            }))}
          >
            {currencies.map((v, i) => (
              <MenuItem key={i} value={i.toString()}>{v}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button 
          disabled = { setInfoLoading }

          sx={{ m: 1, minWidth: 120, height: 40 }} 
          variant="contained" 
          endIcon={<Update />}
          onClick={()=> setInfo?.()}
          size='small'
        >
          Update
        </Button>

      </Stack>

    </Paper>

  );  


}