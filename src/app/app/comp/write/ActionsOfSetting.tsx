
import { Dispatch, SetStateAction, useState } from "react";

import { Collapse, FormControl, InputLabel, MenuItem, Paper, Select, Stack, Toolbar } from "@mui/material";

import { HexType } from "../../read";

import { SetCompInfo } from "./ConfigSetting/SetCompInfo";
import { SetOwner } from "./ConfigSetting/SetOwner";
import { SetDK } from "./ConfigSetting/SetDK";
import { RegKeeper } from "./ConfigSetting/RegKeeper";
import { RegBook } from "./ConfigSetting/RegBook";
import { TakeBackKeys } from "./ConfigSetting/TakeBackKeys";

export interface ActionsOfSettingProps{
  title: number;
  addr: HexType;
  setTitle: Dispatch<SetStateAction<number>>;
  setAddr: Dispatch<SetStateAction<HexType>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function ActionsOfSetting({ title, addr, setTitle, setAddr, setOpen }: ActionsOfSettingProps) {

  const [ typeOfAction, setTypeOfAction ] = useState<string>('0');

  const actionsOfSetting = [
    'SetCompInfo', 'SetOwner', 'SetDK', 'TakeBackKeys', 'RegKeeper', 'RegBook' 
  ]

  const compsOfSetting = [
    <SetCompInfo key={0} setOpen={setOpen} />,
    <SetOwner key={1} docAddr={addr} setDocAddr={setAddr} setOpen={setOpen} />,
    <SetDK key={2} docAddr={addr} setDocAddr={setAddr} setOpen={setOpen} />,
    <TakeBackKeys key={3} docAddr={addr} setDocAddr={setAddr} setOpen={setOpen} />,
    <RegKeeper key={4} title={title} book={addr} setTitle={setTitle} setBook={setAddr} setOpen={setOpen} />,
    <RegBook key={5} title={title} book={addr} setTitle={setTitle} setBook={setAddr} setOpen={setOpen} />
  ]

  return(
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }} >
      <Stack direction={'row'} sx={{ alignItems:'center', color:'black' }} >

        <Toolbar sx={{ textDecoration:'underline' }}>
          <h4>Type Of Action:</h4>
        </Toolbar>

        <FormControl variant="outlined" size="small" sx={{ m: 1, minWidth: 168 }}>
          <InputLabel id="typeOfAction-label">TypeOfAction</InputLabel>
          <Select
            labelId="typeOfAction-label"
            id="typeOfAction-select"
            label="TypeOfAction"
            value={ typeOfAction }
            onChange={(e) => setTypeOfAction(e.target.value)}
          >
            {actionsOfSetting.map((v, i) => (
              <MenuItem key={v} value={i} > <b>{v}</b> </MenuItem>
            ))}
          </Select>
        </FormControl>

      </Stack>

      {compsOfSetting.map((v,i)=>(
        <Collapse key={i} in={ typeOfAction == i.toString() } >
          {v}
        </Collapse>
      ))}

    </Paper>
  );
}

