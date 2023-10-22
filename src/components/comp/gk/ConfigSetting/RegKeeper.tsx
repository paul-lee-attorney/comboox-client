import { FormControl, FormHelperText, InputLabel, MenuItem, Paper, Select, Stack, TextField, } from "@mui/material";
import { Create } from "@mui/icons-material";
import { useGeneralKeeperRegKeeper } from "../../../../generated";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { RegBookProps } from "./RegBook";
import { titleOfKeepers } from "../../../../scripts/comp/gk";
import { FormResults, HexParser, defFormResults, hasError, onlyHex, refreshAfterTx } from "../../../../scripts/common/toolsKit";
import { HexType } from "../../../../scripts/common";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";

export function RegKeeper({title, book, setTitle, setBook, setOpen}:RegBookProps) {
  const { gk } = useComBooxContext();

  const [ valid, setValid ] = useState<FormResults>(defFormResults);
  const [ loading, setLoading ] = useState(false);
  
  const updateResults = ()=>{
    setOpen(false);
    setLoading(false);
  }

  const {
    isLoading: regKeeperLoading,
    write: regKeeper,
  } = useGeneralKeeperRegKeeper({
    address: gk,
    onSuccess(data) {
      setLoading(true);
      let hash: HexType = data.hash;
      refreshAfterTx(hash, updateResults);
    }
  });

  const handleClick = ()=>{
    regKeeper({
      args: [
        BigInt(title), 
        book
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
        <Stack direction={'row'} sx={{ alignItems:'center'}} >

        <FormControl variant="outlined" size="small" sx={{ m: 1, minWidth: 168 }}>
          <InputLabel id="typeOfAction-label">Title</InputLabel>
          <Select
            labelId="typeOfAction-label"
            id="typeOfAction-select"
            label="Title"
            value={ title }
            onChange={(e) => setTitle(Number(e.target.value))}
          >
            {titleOfKeepers.map((v, i) => (
              <MenuItem key={v} value={i} > {v} </MenuItem>
            ))}
          </Select>
          <FormHelperText>{' '}</FormHelperText>
        </FormControl>

          <TextField 
            variant='outlined'
            label='Keeper'
            size="small"
            error={ valid['Keeper']?.error }
            helperText={ valid['Keeper']?.helpTx ?? ' ' }
            sx={{
              m:1,
              minWidth: 480,
            }}
            value={ book }
            onChange={(e)=>{
              let input = HexParser( e.target.value );
              onlyHex('Keeper', input, 40, setValid);
              setBook(input);
            }}
          />

          <LoadingButton 
            disabled = {regKeeperLoading || hasError(valid)}
            loading={loading}
            loadingPosition="end"
            sx={{ m: 1, minWidth: 218, height: 40 }} 
            variant="contained" 
            endIcon={<Create />}
            onClick={ handleClick }
            size='small'
          >
            Register Keeper
          </LoadingButton>

        </Stack>

    </Paper>

  );  


}