import { Button, FormControl, InputLabel, MenuItem, Paper, Select, Stack, TextField, Toolbar } from "@mui/material";
import { Dispatch, SetStateAction, } from "react";
import { Create, } from "@mui/icons-material";
import { useGeneralKeeperRegBook } from "../../../../generated";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { HexType } from "../../../../scripts/common";
import { nameOfBooks } from "../../../../scripts/comp/gk";
import { HexParser } from "../../../../scripts/common/toolsKit";

export interface RegBookProps{
  title: number;
  book: HexType;
  setTitle: Dispatch<SetStateAction<number>>;
  setBook: Dispatch<SetStateAction<HexType>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
}


export function RegBook({title, book, setTitle, setBook, setOpen}:RegBookProps) {
  const { gk } = useComBooxContext();

  const {
    isLoading: regBookLoading,
    write: regBook,
  } = useGeneralKeeperRegBook({
    address: gk,
    args: [BigInt(title), book],
    onSuccess() {
      setOpen(false)
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
          </FormControl>

          <TextField 
            variant='outlined'
            label='Book'
            size="small"
            sx={{
              m:1,
              minWidth: 480,
            }}
            value={ book }
            onChange={(e)=>setBook(HexParser( e.target.value ))}
          />

          <Button 
            disabled = {regBookLoading }
            sx={{ m: 1, minWidth: 218, height: 40 }} 
            variant="contained" 
            endIcon={<Create />}
            onClick={()=> regBook?.()}
            size='small'
          >
            Register Book
          </Button>

        </Stack>

    </Paper>

  );  


}