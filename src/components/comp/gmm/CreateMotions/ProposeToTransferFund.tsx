import { useState } from "react";

import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";

import { AddrZero, HexType } from "../../../../scripts/common";

import { useGeneralKeeperProposeToTransferFund } from "../../../../generated";

import { Button, Divider, FormControl, InputLabel, MenuItem, Paper, Select, Stack, TextField } from "@mui/material";
import { EmojiPeople } from "@mui/icons-material";
import { HexParser, refreshAfterTx } from "../../../../scripts/common/toolsKit";
import { DateTimeField } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { CreateMotionProps } from "../../bmm/CreateMotionOfBoardMeeting";

export interface ParasOfTransfer {
  toBMM: boolean;
  to: HexType;
  isCBP: boolean;
  amt: bigint;
  expireDate: number;
}

export const defaultParasOfTransfer: ParasOfTransfer = {
  toBMM: false,
  to: AddrZero,
  isCBP: false,
  amt: BigInt(0),
  expireDate: 0,
}

export function ProposeToTransferFund({ refresh }:CreateMotionProps) {

  const { gk } = useComBooxContext();

  const [ paras, setParas ] = useState<ParasOfTransfer>(defaultParasOfTransfer);
  const [ seqOfVR, setSeqOfVR ] = useState<number>(9);
  const [ executor, setExecutor ] = useState<number>(0);

  const {
    isLoading: proposeToTransferFundLoading,
    write: proposeToTransferFund
  } = useGeneralKeeperProposeToTransferFund({
    address: gk,
    args: [
        false, 
        paras.to, 
        paras.isCBP, 
        paras.amt, 
        BigInt(paras.expireDate), 
        BigInt(seqOfVR), 
        BigInt(executor)
    ],
    onSuccess(data) {
      let hash: HexType = data.hash;
      refreshAfterTx(hash, refresh);
    }
  });


  return (

    <Paper elevation={3} sx={{ m:1, p:1, color:'divider', border:1 }}  >

      <Stack direction="row" sx={{ alignItems:'center' }} >

        <Stack direction="column" >

          <Stack direction="row" sx={{ alignItems:'center' }} >

            <TextField 
              variant='outlined'
              label='SeqOfVR'
              size="small"
              sx={{
                m:1,
                width: 101,
              }}
              onChange={(e) => setSeqOfVR(parseInt(e.target.value ?? '0'))}
              value={ seqOfVR }
            />


            <FormControl variant="outlined" size="small" sx={{ m: 1, width: 101 }}>
              <InputLabel id="symbolOfToken-label">Token</InputLabel>
              <Select
                labelId="symbolOfToken-label"
                id="symbolOfToken-select"
                label="Token"
                value={ paras.isCBP ? '1' : '0' }
                onChange={(e) => setParas( v => ({
                  ...v,
                  isCBP: e.target.value == '1',
                }))}
              >
                  <MenuItem value={ '0' } > <b>{'ETH'}</b> </MenuItem>
                  <MenuItem value={ '1' } > <b>{'CBP'}</b> </MenuItem>
              </Select>
            </FormControl>

            <TextField 
              variant='outlined'
              label='To'
              size="small"
              sx={{
                m:1,
                minWidth: 452,
              }}
              onChange={(e) => setParas( v => ({
                ...v,
                to: HexParser( e.target.value ?? '0x00'),
              }))}

              value={ paras.to }
            />

          </Stack>

          <Stack direction="row" sx={{ alignItems:'center' }} >

            <TextField 
              variant='outlined'
              label='Amount'
              size="small"
              sx={{
                m:1,
                minWidth: 218,
              }}
              onChange={(e) => setParas(v => ({
                ...v,
                amt: BigInt(e.target.value ?? '0'),
              }))}
              value={ paras.amt.toString() }
            />

            <DateTimeField
              label='ExpireDate'
              size='small'
              sx={{
                m:1,
                minWidth: 218,
              }} 
              value={ dayjs.unix(paras.expireDate) }
              onChange={(date) => setParas((v) => ({
                ...v,
                expireDate: date ? date.unix() : 0,
              }))}
              format='YYYY-MM-DD HH:mm:ss'
            />


            <TextField 
              variant='outlined'
              label='Executor'
              size="small"
              sx={{
                m:1,
                minWidth: 218,
              }}
              onChange={(e) => setExecutor(parseInt(e.target.value ?? '0'))}
              value={ executor }
            />

          </Stack>

        </Stack>

        <Divider orientation="vertical" flexItem sx={{m:1}} />


        <Button
          disabled={ proposeToTransferFundLoading }
          variant="contained"
          endIcon={<EmojiPeople />}
          sx={{ m:1, minWidth:128 }}
          onClick={()=>proposeToTransferFund?.()}
        >
          Propose
        </Button>

      </Stack>

    </Paper>

  );


}

