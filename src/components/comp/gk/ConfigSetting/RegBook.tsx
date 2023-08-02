import { Button, FormControl, InputLabel, MenuItem, Paper, Select, Stack, TextField, Toolbar } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { Create, LockOpen, Update } from "@mui/icons-material";
import { useGeneralKeeperRegBook, useGeneralKeeperSetCompInfo } from "../../../../generated";
import { useComBooxContext } from "../../../../scripts/ComBooxContext";
import { ConfigSettingProps } from "./SetCompInfo";
import { AddrZero, HexType } from "../../../../interfaces";
import { nameOfBooks } from "../../../../queries/gk";
import { HexParser } from "../../../../scripts/toolsKit";

export interface RegBookProps{
  title: number;
  book: HexType;
  setTitle: Dispatch<SetStateAction<number>>;
  setBook: Dispatch<SetStateAction<HexType>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
}


export function RegBook({title, book, setTitle, setBook, setOpen}:RegBookProps) {
  const { gk } = useComBooxContext();

  // const [ title, setTitle ] = useState<number>(orgTitle);
  // const [ book, setBook ] = useState<HexType>(orgBook);

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