import { useState } from "react";


import { AddrZero, booxMap, Bytes32Zero, HexType, MaxSeqNo, MaxUserNo } from "../../../../common";

import { cashierABI, useGeneralKeeperCreateActionOfGm, useGeneralKeeperProposeToTransferFund } from "../../../../../../../generated";

import { Divider, FormControl, FormHelperText, InputLabel, MenuItem, Paper, Select, Stack, TextField } from "@mui/material";
import { EmojiPeople } from "@mui/icons-material";
import { FormResults, HexParser, defFormResults, hasError, longSnParser, onlyChars, onlyHex, onlyInt, onlyNum, refreshAfterTx, stampToUtc, strNumToBigInt, utcToStamp } from "../../../../common/toolsKit";
import { DateTimeField } from "@mui/x-date-pickers";
import { CreateMotionProps } from "../../../bmm/components/CreateMotionOfBoardMeeting";
import { LoadingButton } from "@mui/lab";
import { useComBooxContext } from "../../../../../_providers/ComBooxContextProvider";
import { encodeFunctionData, keccak256, stringToBytes, stringToHex } from "viem";

export interface ParasOfTransfer {
  toBMM: boolean;
  to: HexType;
  isCBP: boolean;
  amt: string;
  expireDate: number;
}

export const defaultParasOfTransfer: ParasOfTransfer = {
  toBMM: false,
  to: AddrZero,
  isCBP: false,
  amt: '0',
  expireDate: 0,
}

export const typesOfCurrency: string[] = [
  'USD', 'ETH', 'CBP'
]

export function ProposeToTransferFund({ refresh }:CreateMotionProps) {

  const { gk, boox, setErrMsg } = useComBooxContext();

  const [ typeOfCurrency, setTypeOfCurrency ] = useState(0);

  const [ paras, setParas ] = useState<ParasOfTransfer>(defaultParasOfTransfer);
  const [ seqOfVR, setSeqOfVR ] = useState<string>('9');
  const [ executor, setExecutor ] = useState<string>('0');

  const [ remark, setRemark ] = useState('ReimburseExp');

  const [ valid, setValid ] = useState<FormResults>(defFormResults);
  const [ loading, setLoading ] = useState(false);

  const updateResults=()=>{
    refresh();
    setLoading(false);
  }

  const {
    isLoading: proposeToTransferFundLoading,
    write: proposeToTransferFund
  } = useGeneralKeeperProposeToTransferFund({
    address: gk,
    onError(err) {
      setErrMsg(err.message);
    },
    onSuccess(data) {
      setLoading(true);
      let hash: HexType = data.hash;
      refreshAfterTx(hash, updateResults);
    }
  });

  const {
    isLoading: proposeToTransferUsdLoading,
    write: proposeToTransferUsd
  } = useGeneralKeeperCreateActionOfGm({
    address: gk,
    onError(err) {
      setErrMsg(err.message);
    },
    onSuccess(data) {
      setLoading(true);
      let hash: HexType = data.hash;
      refreshAfterTx(hash, updateResults);
    }
  });

  const handleClick = ()=> {
    if (typeOfCurrency > 0) {

      if (typeOfCurrency == 2) {
        setParas(v => ({
          ...v,
          isCBP: true,
        }));
      } 

      proposeToTransferFund({
        args: [
          false, 
          paras.to, 
          paras.isCBP, 
          strNumToBigInt(paras.amt, 9) * 10n ** 9n, 
          BigInt(paras.expireDate), 
          BigInt(seqOfVR), 
          BigInt(executor)
        ],
      });

    } else {

      if (boox) {

        const cashier = boox[booxMap.Cashier];
        const amtOfUsd = strNumToBigInt(paras.amt, 6);

        const desHash = stringToHex("TransferUSD", {size: 32});

        const data = encodeFunctionData({
          abi: cashierABI,
          functionName: 'transferUsd',
          args: [paras.to, amtOfUsd, stringToHex(remark, {size: 32})],
        });

        proposeToTransferUsd({
          args: [
            BigInt(seqOfVR),
            [cashier],
            [0n],
            [data],
            desHash, 
            BigInt(executor)
          ],
        });
      }
    }
  };

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
              helperText={ valid['SeqOfVR']?.helpTx ?? ' ' }
                sx={{
                m:1,
                width: 101,
              }}
              onChange={(e) => {
                let input = e.target.value;
                onlyInt('SeqOfVR', input, MaxSeqNo, setValid);
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
                value={ typeOfCurrency }
                onChange={(e) => setTypeOfCurrency(Number(e.target.value))}
              >
                {typesOfCurrency.map((v,i) => (
                  <MenuItem key={v} value={i} ><b>{v}</b></MenuItem>
                ))}
              </Select>
              <FormHelperText>{' '}</FormHelperText>
            </FormControl>

            <TextField 
              variant='outlined'
              label='To'
              size="small"
              error={ valid['To']?.error }
              helperText={ valid['To']?.helpTx ?? ' ' }
              sx={{
                m:1,
                minWidth: 452,
              }}
              onChange={(e) => {
                let input = HexParser( e.target.value );
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
              helperText={ valid['Amount']?.helpTx ?? ' ' }
              sx={{
                m:1,
                minWidth: 218,
              }}
              onChange={(e) => {
                let input = e.target.value;
                onlyNum('Amount', input, 0n, 9, setValid);
                setParas(v => ({
                  ...v,
                  amt: input,
                }));
              }}
              value={ paras.amt.toString() }
            />

            <TextField 
              variant='outlined'
              label='Executor'
              size="small"
              error={ valid['Executor']?.error }
              helperText={ valid['Executor']?.helpTx ?? ' ' }
              sx={{
                m:1,
                minWidth: 218,
              }}
              onChange={(e) => {
                let input = e.target.value;
                onlyInt('Executor', input, MaxUserNo, setValid);
                setExecutor(input);
              }}
              value={ executor }
            />

            {typeOfCurrency > 0 && (
              <DateTimeField
                label='ExpireDate'
                size='small'
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                helperText=' '
                value={ stampToUtc(paras.expireDate) }
                onChange={(date) => setParas((v) => ({
                  ...v,
                  expireDate: utcToStamp(date),
                }))}
                format='YYYY-MM-DD HH:mm:ss'
              />
            )}

            {typeOfCurrency == 0 && (
              <TextField 
                variant='outlined'
                label='Remark'
                size="small"
                error={ valid['Remark']?.error }
                helperText={ valid['Remark']?.helpTx ?? ' ' }
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                onChange={(e) => {
                  let input = e.target.value;
                  onlyChars('Remark', input, 32, setValid);
                  setRemark(input);
                }}
                value={ remark }
              />
            )}

          </Stack>

        </Stack>

        <Divider orientation="vertical" flexItem sx={{m:1}} />

        <LoadingButton
          disabled={ proposeToTransferFundLoading || proposeToTransferUsdLoading || hasError(valid)}
          loading={loading}
          loadingPosition="end"
          variant="contained"
          endIcon={<EmojiPeople />}
          sx={{ m:1, minWidth:128 }}
          onClick={ handleClick }
        >
          Propose
        </LoadingButton>

      </Stack>

    </Paper>

  );


}

