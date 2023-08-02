import { Button, FormControl, InputLabel, MenuItem, Paper, Select, Stack, TextField, Toolbar } from "@mui/material";
import { useState } from "react";
import { Create } from "@mui/icons-material";
import { useGeneralKeeperRegKeeper } from "../../../../generated";
import { useComBooxContext } from "../../../../scripts/ComBooxContext";
import { HexType } from "../../../../interfaces";
import { RegBookProps } from "./RegBook";
import { titleOfKeepers } from "../../../../queries/gk";
import { HexParser } from "../../../../scripts/toolsKit";

export function RegKeeper({title, book, setTitle, setBook, setOpen}:RegBookProps) {
  const { gk } = useComBooxContext();

  // const [ title, setTitle ] = useState<number>(orgTitle);
  // const [ keeper, setKeeper ] = useState<HexType>(orgBook);

  const {
    isLoading: regKeeperLoading,
    write: regKeeper,
  } = useGeneralKeeperRegKeeper({
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
            {titleOfKeepers.map((v, i) => (
              <MenuItem key={v} value={i} > {v} </MenuItem>
            ))}
          </Select>
        </FormControl>

          <TextField 
            variant='outlined'
            label='Keeper'
            size="small"
            sx={{
              m:1,
              minWidth: 480,
            }}
            value={ book }
            onChange={(e)=>setBook(HexParser( e.target.value ))}
          />

          <Button 
            disabled = {regKeeperLoading }
            sx={{ m: 1, minWidth: 218, height: 40 }} 
            variant="contained" 
            endIcon={<Create />}
            onClick={()=> regKeeper?.()}
            size='small'
          >
            Register Keeper
          </Button>

        </Stack>

    </Paper>

  );  


}