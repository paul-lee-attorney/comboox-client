import { Checkbox, Collapse, FormControl, FormControlLabel, InputLabel, 
  MenuItem, Paper, Select, Stack, Toolbar } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { SetBackupKey } from "./ActionsOfUser/SetBackupKey";
import { LockConsideration } from "./ActionsOfUser/LockConsideration";
import { MintPoints } from "./ActionsOfUser/Mint";
import { LockPoints } from "./ActionsOfUser/LockPoints";
import { TransferPoints } from "./ActionsOfUser/TransferPoints";
import { MintAndLockPoints } from "./ActionsOfUser/MintAndLockPoints";
import { SetRoyaltyRule } from "./ActionsOfUser/SetRoyaltyRule";
import { User } from "../../read/rc";
import { AddrZero } from "../../../read";
import { TransferIPR } from "./ActionsOfUser/TransferIPR";

export interface ActionsOfUserProps{
  refreshList: ()=>void;
  getUser: ()=>void;
  getBalanceOf: ()=>void;
}

interface ActionsOfUserPanelProps extends ActionsOfUserProps {
  user: User | undefined;
  isOwner: boolean;
  showList: boolean;
  setShowList: Dispatch<SetStateAction<boolean>>;
}

export function ActionsOfUser({ user, isOwner, showList, setShowList, refreshList, getUser, getBalanceOf}: ActionsOfUserPanelProps) {

  const [ typeOfAction, setTypeOfAction ] = useState<string>('1');
  
  const actionsOfUser = [
    'Set Backup Key', 'Set Royalty Rule', 'Mint Points', 
    'Mint & Lock Points', 'Transfer Points', 'Lock Points', 'Lock Consideration', 'Transfer IPR' 
  ]

  const compsOfAction = [
    <SetBackupKey key={0} refreshList={refreshList} getUser={ getUser } getBalanceOf={getBalanceOf} />,
    <SetRoyaltyRule key={1} refreshList={refreshList} getUser={ getUser } getBalanceOf={getBalanceOf} />,
    <MintPoints key={2} refreshList={refreshList} getUser={ getUser } getBalanceOf={getBalanceOf} />,
    <MintAndLockPoints key={3} refreshList={refreshList} getUser={ getUser } getBalanceOf={getBalanceOf} />,
    <TransferPoints key={4} refreshList={refreshList} getUser={ getUser } getBalanceOf={getBalanceOf} />,
    <LockPoints key={5} refreshList={refreshList} getUser={ getUser } getBalanceOf={getBalanceOf} />,       
    <LockConsideration key={6} refreshList={refreshList} getUser={ getUser } getBalanceOf={getBalanceOf} />,
    <TransferIPR key={7} />,
  ]

  return( 
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }} >
      <Stack direction={'row'} sx={{ alignItems:'center', color:'black', }} >

        <Toolbar  sx={{ textDecoration:'underline' }} >
          <h4>Actions of User:</h4>
        </Toolbar>

        <FormControl variant="outlined" size="small" sx={{ m:1, mr:5, minWidth: 218 }}>
          <InputLabel id="typeOfAction-label">TypeOfAction</InputLabel>
          <Select
            labelId="typeOfAction-label"
            id="typeOfAction-select"
            label="TypeOfAction"
            value={ typeOfAction }
            onChange={(e) => setTypeOfAction(e.target.value)}
          >
            {actionsOfUser.map((v, i) => {
              if (i==0 && user?.backupKey.pubKey != AddrZero) return null;
              if ((i==2 || i==3) && !isOwner ) return null;
              

              return (<MenuItem key={v} value={ i } > <b>{v}</b> </MenuItem>);
            })}
          </Select>
        </FormControl>

        <FormControlLabel 
          label='Show Lockers List'
          sx={{
            m:1,
            ml:50,
          }}
          control={
            <Checkbox 
              sx={{
                m: 1,
                height: 64,
              }}
              onChange={e => setShowList(e.target.checked)}
              checked={ showList }
            />
          }
        />

      </Stack>

      { compsOfAction.map((v,i)=>{
        if (i==0 && user?.backupKey.pubKey != AddrZero) return null;
        if ((i==2 || i==3) && !isOwner ) return null;

        return (
          <Collapse key={i} in={ typeOfAction == i.toString() } >
            {v}
          </Collapse>
        );
      }) }

    </Paper>
  );
}

