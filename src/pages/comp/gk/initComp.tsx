import { BigNumber } from 'ethers';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import { waitForTransaction } from '@wagmi/core';

import { TextField, Button } from '@mui/material';
import { Send } from '@mui/icons-material';


import { 
  usePrepareBookOfSharesIssueShare,
  useBookOfSharesIssueShare,
  useRegisterOfMembersSharesList,
} from '../../../generated';

import { Bytes32Zero, HexType } from '../../../interfaces';
import { DateZero } from '../../../interfaces';
import { DataZero } from '../../../interfaces';

type IssueShareArgs = [
  shareNumber: HexType,
  payInDeadline: BigNumber,
  paid: BigNumber,
  par: BigNumber,
]


type Log = {
  shareNumber: string,
  paid: string,
  par: string,
}

async function getReceipt(hash: HexType) {
  const receipt = await waitForTransaction({
    hash: hash
  });

  let log!:Log;

  if (receipt) {
    console.log("receipt: ", receipt);
    let shareNumber = receipt.logs[0].topics[1];
    let paid = receipt.logs[0].topics[2];
    let par = receipt.logs[0].topics[3];
    log = {
      shareNumber,
      paid,
      par
    };  
  }

  return log;  
}

function InitCompPage() {
  // const [classOfShare, setClassOfShare] = useState('');
  // const [issueDate, setIssueDate] = useState('');
  // const [shareholder, setShareholder] = useState('');
  // const [priceOfPaid, setPriceOfPaid] = useState('');
  // const [priceOfPar, setPriceOfPar] = useState('');

  const [max, setMax] = useState<number>();



  const [shareNumber, setShareNumber] = useState(Bytes32Zero);

  const [payInDeadline, setPayInDeadline] = useState(DateZero);
  const [paid, setPaid] = useState(DataZero);
  const [par, setPar] = useState(DataZero);
  
  let args:IssueShareArgs = [
    `0x${shareNumber}`,
    BigNumber.from(payInDeadline),
    BigNumber.from(paid),
    BigNumber.from(par)
  ]

  // const [args, setArgs] = useState<IssueShareArgs>();

  const [log, setLog] = useState<Log>();

  const { query } = useRouter();
  const addrOfBOS = query?.body;
  console.log('addrOfBOS: ',addrOfBOS);

  const {
    config
  } = usePrepareBookOfSharesIssueShare({
    address: `0x${addrOfBOS}`,
    args: args,
  })

  const { 
    data, 
    isLoading,
    write 
  } = useBookOfSharesIssueShare(config);

  useEffect(() => {
    if (data) {
      getReceipt(data.hash).then((log)=>setLog(log));
    }
  }, [data]);

  // const setShareNumber = () => {
  //   const shareNumber:HexType = `0x${
  //     '0'.padStart(16, '0') +
  //     parseInt(classOfShare).toString(16).padEnd(4, '0') +
  //     parseInt(issueDate).toString(16).padEnd(12, '0') +
  //     parseInt(shareholder).toString(16).padEnd(10, '0') +
  //     parseInt(priceOfPaid).toString(16).padEnd(8, '0') +
  //     parseInt(priceOfPar).toString(16).padEnd(8, '0') +
  //     '0'.padEnd(6, '0')
  //   }`;
  //   console.log('shareNumber: ', shareNumber);

  //   const deadline = BigNumber.from(payInDeadline);
  //   const paidAmt = BigNumber.from(paid);
  //   const parAmt = BigNumber.from(par);

  //   const args:IssueShareArgs = {
  //     shareNumber: shareNumber,
  //     payInDeadline: deadline,
  //     paid: paidAmt,
  //     par: parAmt,
  //   }

  //   setArgs(args);

  //   console.log('args: ', args);
  // }
  

  return (
    <>
      <h1>Initiate New Company</h1>
      <h2>BOS Address: {addrOfBOS}</h2>
      <hr />




      <hr />
      <TextField 
        sx={{ m: 1, minWidth: 120 }} 
        id="classOfShare" 
        label="ClassOfShare" 
        variant="filled"
        helperText="Int < 2^16 (e.g. '1234')"
        onChange={(e) => {
          const c = parseInt(e.target.value).toString(16).padStart(4, '0');
          setShareNumber((v) => v.substring(0,16) + c + v.substring(20));
        }}
        // value = {shareNumber.substring(16, 20)}
        size='small'
      />

      <TextField 
        sx={{ m: 1, minWidth: 120 }} 
        id="issueDate" 
        label="IssueDate" 
        variant="filled"
        helperText="Timestamp (in 's')"
        onChange={(e) => {
          const d = parseInt(e.target.value).toString(16).padStart(12, '0');
          setShareNumber(v => v.substring(0, 20) + d + v.substring(32))
        }}
        // value = {shareNumber.substring(20, 32)}
        size='small'
      />

      <TextField 
        sx={{ m: 1, minWidth: 120 }} 
        id="shareholder" 
        label="Shareholder" 
        variant="filled"
        helperText="Int < 2^40 (e.g. '1234')"
        onChange={(e) => {
          const h = parseInt(e.target.value).toString(16).padStart(10, '0');
          setShareNumber(v => v.substring(0, 32) + h + v.substring(42))
        }}
        // value = {shareNumber.substring(32, 42)}
        size='small'
      />

      <TextField 
        sx={{ m: 1, minWidth: 120 }} 
        id="priceOfPaid" 
        label="PriceOfPaid" 
        variant="filled"
        helperText="Int < 2^32 (e.g. '1234')"
        onChange={(e) => {
          const p = parseInt(e.target.value).toString(16).padStart(8, '0');
          setShareNumber(v => v.substring(0, 42) + p + v.substring(50));
        }}
        // value = {shareNumber.substring(42, 50)}
        size='small'
      />

      <TextField 
        sx={{ m: 1, minWidth: 120 }} 
        id="priceOfPar" 
        label="PriceOfPar" 
        variant="filled"
        helperText="Int < 2^32 (e.g. '1234')"
        onChange={(e) => {
          const p = parseInt(e.target.value).toString(16).padStart(8, '0');
          setShareNumber(v => v.substring(0, 50) + p + v.substring(58));
        }}
        // value = {shareNumber.substring(50, 58)}
        size='small'
      />

      <br />

      <TextField 
        sx={{ m: 1, minWidth: 120 }} 
        id="payInDeadline" 
        label="PayInDeadline" 
        variant="filled"
        helperText="Timestamp (in 's')"
        onChange={(e) => setPayInDeadline(e.target.value)}
        value = {payInDeadline}
        size='small'
      />

      <br />

      <TextField 
        sx={{ m: 1, minWidth: 120 }} 
        id="paid" 
        label="Paid" 
        variant="filled"
        helperText="Int < 2^64 (e.g. '1234')"
        onChange={(e) => setPaid(e.target.value)}
        value = {paid}
        size='small'
      />

      <TextField 
        sx={{ m: 1, minWidth: 120 }} 
        id="par" 
        label="Par" 
        variant="filled"
        helperText="Int < 2^64 (e.g. '1234')"
        onChange={(e) => setPar(e.target.value)}
        value = {par}
        size='small'
      />

      <Button 
        disabled = {!write || isLoading }

        sx={{ m: 1, minWidth: 120, height: 40 }} 
        
        variant="contained" 
        endIcon={<Send />}
        onClick={() => write}
        size='small'
      >
        Create
      </Button>
      <br />

      {log && (
        <div>
          Issued New Share: <br/>
          ShareNumber: {log.shareNumber} <br/>
          Paid: {log.paid} <br />
          Par: {log.par} <br />
        </div>
      )}

      <hr/>
      
    </>    
  )
}

export default InitCompPage