import { useState } from "react";

import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";

import { useGeneralKeeperProposeToTransferFund } from "../../../../generated";

import { Button, Divider, FormControl, InputLabel, MenuItem, Paper, Select, Stack, TextField } from "@mui/material";
import { EmojiPeople } from "@mui/icons-material";
import { FormResults, HexParser, defFormResults, hasError, onlyHex, onlyNum, refreshAfterTx } from "../../../../scripts/common/toolsKit";
import { CreateMotionProps } from "../CreateMotionOfBoardMeeting";
import { DateTimeField } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { ParasOfTransfer, defaultParasOfTransfer } from "../../gmm/CreateMotions/ProposeToTransferFund";
import { HexType, MaxSeqNo, MaxUserNo } from "../../../../scripts/common";

export function ProposeToTransferFund({ refresh }:CreateMotionProps) {

  const { gk } = useComBooxContext();

  const [ paras, setParas ] = useState<ParasOfTransfer>(defaultParasOfTransfer);
  const [ seqOfVR, setSeqOfVR ] = useState<string>('11');
  const [ executor, setExecutor ] = useState<string>('0');

  const [ valid, setValid ] = useState<FormResults>(defFormResults);

  const {
    isLoading: proposeToTransferFundLoading,
    write: proposeToTransferFund
  } = useGeneralKeeperProposeToTransferFund({
    address: gk,
    args: [
        true, 
        paras.to, 
        paras.isCBP, 
        BigInt(paras.amt), 
        BigInt(paras.expireDate), 
        BigInt(seqOfVR), 
        BigInt(executor)
    ],
    onSuccess(data) {
      let hash: HexType = data.hash;
      refreshAfterTx(hash, refresh);
    }
  })

  return (

    <Paper elevation={3} sx={{ m:1, p:1, color:'divider', border:1 }}  >

      <Stack direction="row" sx={{ alignItems:'center' }} >

        <Stack direction="column" >

          <Stack direction="row" sx={{ alignItems:'center' }} >

            <TextField 
              variant='outlined'
              label='SeqOfVR'
              size="small"
              error={ valid['SeqOfVR']?.error }
              helperText={ valid['SeqOfVR']?.helpTx }
              sx={{
                m:1,
                width: 101,
              }}
              onChange={(e) => {
                let input = e.target.value;
                onlyNum('SeqOfVR', input, MaxSeqNo, setValid);
                setSeqOfVR(input);
              }}
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
              error={ valid['To']?.error }
              helperText={ valid['To']?.helpTx }              
              sx={{
                m:1,
                minWidth: 452,
              }}
              onChange={(e) => {
                let input = HexParser( e.target.value ?? '0x00');
                onlyHex('To', input, 40, setValid);
                setParas( v => ({
                  ...v,
                  to: input,
                }));
              }}

              value={ paras.to }
            />

          </Stack>

          <Stack direction="row" sx={{ alignItems:'center' }} >

            <TextField 
              variant='outlined'
              label='Amount'
              size="small"
              error={ valid['Amount']?.error }
              helperText={ valid['Amount']?.helpTx }
              sx={{
                m:1,
                minWidth: 218,
              }}
              onChange={(e) => {
                let input = e.target.value;
                onlyNum('Amount', input, 0n, setValid);
                setParas(v => ({
                  ...v,
                  amt: input,
                }));
              }}
              value={ paras.amt }
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
              error={ valid['Executor']?.error }
              helperText={ valid['Executor']?.helpTx }    
              sx={{
                m:1,
                minWidth: 218,
              }}
              onChange={(e) => {
                let input = e.target.value;
                onlyNum('Executor', input, MaxUserNo, setValid);
                setExecutor(input);
              }}
              value={ executor }
            />

          </Stack>

        </Stack>

        <Divider orientation="vertical" flexItem sx={{m:1}} />


        <Button
          disabled={ proposeToTransferFundLoading || hasError(valid)}
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

