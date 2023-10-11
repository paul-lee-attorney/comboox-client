import { Button, FormControl, InputLabel, MenuItem, Paper, Select, Stack, TextField, } from "@mui/material";
import { Create } from "@mui/icons-material";
import { useGeneralKeeperRegKeeper } from "../../../../generated";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { RegBookProps } from "./RegBook";
import { titleOfKeepers } from "../../../../scripts/comp/gk";
import { HexParser, refreshAfterTx } from "../../../../scripts/common/toolsKit";
import { HexType } from "../../../../scripts/common";

export function RegKeeper({title, book, setTitle, setBook, setOpen}:RegBookProps) {
  const { gk } = useComBooxContext();
  
  const updateResults = ()=>{
    setOpen(false);
  }

  const {
    isLoading: regKeeperLoading,
    write: regKeeper,
  } = useGeneralKeeperRegKeeper({
    address: gk,
    args: [BigInt(title), book],
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