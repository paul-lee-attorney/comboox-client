import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Paper, Select, Stack, TextField } from "@mui/material";
import { Dispatch, SetStateAction, useState, } from "react";
import { Create, } from "@mui/icons-material";
import { useGeneralKeeperRegBook } from "../../../../generated";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { HexType } from "../../../../scripts/common";
import { nameOfBooks } from "../../../../scripts/comp/gk";
import { FormResults, HexParser, defFormResults, hasError, onlyHex, refreshAfterTx } from "../../../../scripts/common/toolsKit";
import { LoadingButton } from "@mui/lab";

export interface RegBookProps{
  title: number;
  book: HexType;
  setTitle: Dispatch<SetStateAction<number>>;
  setBook: Dispatch<SetStateAction<HexType>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
}


export function RegBook({title, book, setTitle, setBook, setOpen}:RegBookProps) {
  const { gk } = useComBooxContext();

  const [ valid, setValid ] = useState<FormResults>(defFormResults);
  const [ loading, setLoading ] = useState(false);

  const updateResults = ()=>{
    setOpen(false);
    setLoading(false);
  }

  const {
    isLoading: regBookLoading,
    write: regBook,
  } = useGeneralKeeperRegBook({
    address: gk,
    args: !hasError(valid) ? [BigInt(title), book] : undefined,
    onSuccess(data) {
      setLoading(true);
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
              {nameOfBooks.map((v, i) => (
                <MenuItem key={v} value={i} > {v} </MenuItem>
              ))}
            </Select>
            <FormHelperText>{' '}</FormHelperText>
          </FormControl>

          <TextField 
            variant='outlined'
            label='Book'
            size="small"
            error={ valid['Book']?.error }
            helperText={ valid['Book']?.helpTx ?? ' ' }
            sx={{
              m:1,
              minWidth: 480,
            }}
            value={ book }
            onChange={(e)=>{
              let input = HexParser( e.target.value );
              onlyHex('Book', input, 40, setValid); 
              setBook(input);
            }}
          />

          <LoadingButton 
            disabled = {regBookLoading || hasError(valid)}
            loading={loading}
            loadingPosition="end"
            sx={{ m: 1, minWidth: 218, height: 40 }} 
            variant="contained" 
            endIcon={<Create />}
            onClick={()=> regBook?.()}
            size='small'
          >
            Register Book
          </LoadingButton>

        </Stack>

    </Paper>

  );  


}