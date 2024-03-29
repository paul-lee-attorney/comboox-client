import { FormControl, InputLabel, MenuItem, Paper, Select, Stack, TextField, } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { Update } from "@mui/icons-material";
import { useGeneralKeeperSetCompInfo } from "../../../../generated";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { CompInfo } from "../../../../scripts/comp/gk";
import { defaultInfo } from "../SetCompInfo";
import { refreshAfterTx, toAscii } from "../../../../scripts/common/toolsKit";
import { currencies } from "../GeneralInfo";
import { HexType } from "../../../../scripts/common";
import { LoadingButton } from "@mui/lab";

export interface ConfigSettingProps{
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function SetCompInfo({setOpen}:ConfigSettingProps) {
  const { gk, setErrMsg } = useComBooxContext();

  const [compInfo, setCompInfo] = useState<CompInfo>(defaultInfo);  
  const [ loading, setLoading ] = useState(false);
  
  const updateResults = ()=>{
    setOpen(false);
    setLoading(false);
  }

  const {
    isLoading: setInfoLoading,
    write: setInfo, 
   } = useGeneralKeeperSetCompInfo({
    address: gk,
    onError(err) {
      setErrMsg(err.message);
    },
    onSuccess(data) {
      setLoading(true);
      let hash: HexType = data.hash;
      refreshAfterTx(hash, updateResults);
    }
  });

  const handleClick = ()=>{
    setInfo({
      args: [
        compInfo.currency, 
        `0x${toAscii(compInfo.symbol).padEnd(40,'0')}`, 
        compInfo.name 
      ],
    });
  };

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

        <LoadingButton 
          disabled = { setInfoLoading }
          loading={loading}
          loadingPosition="end"
          sx={{ m: 1, minWidth: 120, height: 40 }} 
          variant="contained" 
          endIcon={<Update />}
          onClick={ handleClick }
          size='small'
        >
          Update
        </LoadingButton>

      </Stack>

    </Paper>

  );  


}