import { useState } from "react";

import { 
  useGeneralKeeperCastVoteOfGm,
  useGeneralKeeperEntrustDelegateOfMember, 
  useGeneralKeeperProposeMotionOfGm, 
  usePrepareGeneralKeeperCastVoteOfGm, 
  usePrepareGeneralKeeperEntrustDelegateOfMember, 
  usePrepareGeneralKeeperProposeMotionOfGm 
} from "../../../generated";

import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { BigNumber } from "ethers";
import { Box, Button, Collapse, FormControl, InputLabel, MenuItem, Paper, Select, Stack, Switch, TextField, Toolbar, Typography } from "@mui/material";
import { EmojiPeople, Handshake, HowToVote, } from "@mui/icons-material";
import { Bytes32Zero, HexType } from "../../../interfaces";
import { EntrustDelegaterOfMember } from "./EntrustDelegaterOfMember";
import { VoteResult } from "../../common/meetingMinutes/VoteResult";

interface ProposeMotionProps {
  seqOfMotion: string,
  setOpen: (flag: boolean) => void,
  getMotionsList: () => any,
}

export function CastVoteOfGm({ seqOfMotion, setOpen, getMotionsList }: ProposeMotionProps) {

  const { gk, boox } = useComBooxContext();

  const [ attitude, setAttitude ] = useState<string>('3');
  const [ sigHash, setSigHash ] = useState<HexType>(Bytes32Zero);

  const {config} = usePrepareGeneralKeeperCastVoteOfGm({
    address: gk,
    args: attitude 
        ? [BigNumber.from(seqOfMotion), BigNumber.from(attitude), sigHash]
        : undefined,
  });

  const {
    isLoading: castVoteLoading,
    write: castVote,
  } = useGeneralKeeperCastVoteOfGm({
    ...config,
    onSuccess() {
      getMotionsList();
      setOpen(false);
    }
  });

  const [ appear, setAppear ] = useState(false);

  return (
    <Paper sx={{m:1, p:1, color:'divider', border:1 }} >
      <Stack direction={'row'} sx={{ alignItems:'center', color:'black' }} >

        <Box sx={{ minWidth:200 }} >
          <Toolbar >
            <h4>Cast Vote: </h4>
          </Toolbar>
        </Box>

        <Typography>
          Vote Directly
        </Typography>

        <Switch 
          color="primary" 
          onChange={(e) => setAppear( e.target.checked )} 
          checked={ appear } 
        />

        <Typography>
          Entrust Delegate
        </Typography>

      </Stack>

      <Collapse in={ !appear } >

        <VoteResult seqOfMotion={seqOfMotion} addrOfBook={boox[3]} />

        <Stack direction="row" sx={{ alignItems:'center' }} >

          <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="attitude-lable">Attitude</InputLabel>
            <Select
              labelId="attitude-lable"
              id="attitude-select"
              value={ attitude }
              onChange={(e) => setAttitude(e.target.value)}
              size="small"
              label="Attitude"
            >
              <MenuItem value={'1'}>Support</MenuItem>
              <MenuItem value={'2'}>Against</MenuItem>
              <MenuItem value={'3'}>Abstain</MenuItem>
            </Select>
          </FormControl>

          <TextField 
            sx={{ m: 1, minWidth: 650 }} 
            id="tfHashOfAction" 
            label="SigHash / CID in IPFS" 
            variant="outlined"
            onChange={e => setSigHash(`0x${e.target.value}`)}
            value = { sigHash.substring(2) }
            size='small'
          />                                            

          <Button
            disabled={ !castVote || castVoteLoading }
            variant="contained"
            endIcon={<HowToVote />}
            sx={{ m:1, minWidth:118 }}
            onClick={()=>castVote?.()}
          >
            Vote
          </Button>
      </Stack>
      </Collapse>

      <Collapse in={ appear } >
        <EntrustDelegaterOfMember seqOfMotion={seqOfMotion} setOpen={setOpen} getMotionsList={getMotionsList} />
      </Collapse>

    </Paper>
  );
}



