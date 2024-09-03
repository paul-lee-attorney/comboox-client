import { useEffect, useState } from "react";
import { IconButton, Paper, Stack, Tooltip, Typography } from "@mui/material";
import { useComBooxContext } from "../../../_providers/ComBooxContextProvider";
import { HexType } from "../../common";
import { usePublicClient } from "wagmi";
import { parseAbiItem } from "viem";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { baseToDollar, bigIntToStrNum, dateParser, longSnParser } from "../../common/toolsKit";
import { CopyLongStrTF } from "../../common/CopyLongStr";
import { Refresh } from "@mui/icons-material";

export type DepositProps = {
  blockNumber: bigint,
  timestamp: bigint,
  transactionHash: HexType,
  isDeposit: boolean,
  amt: bigint,
  acct: number,
}

export function Deposits() {
  const { gk, keepers, boox } = useComBooxContext();
  
  const client = usePublicClient();

  const [ records, setRecords ] = useState<DepositProps[]>([]);
  const [ total, setTotal ] = useState(0n);

  const [ time, setTime ] = useState<number>(0);

  const refresh = ()=>{
    setTime(Date.now());
  }

  useEffect(()=>{

    const getEvents = async () => {

      let sum = 0n;

      let logs = await client.getLogs({
        address: gk,
        event: parseAbiItem('event SaveToCoffer(uint indexed acct, uint256 indexed value)'),
        fromBlock: 1n,
      });

      let cnt = logs.length;
      let arr: DepositProps[]=[];

      while (cnt > 0) {

        let blkNo = logs[cnt-1].blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});

        let item:DepositProps = {
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: logs[cnt-1].transactionHash,
          isDeposit: true,
          amt: logs[cnt-1].args.value ?? 0n,
          acct: Number(logs[cnt-1].args.acct) ?? 0,
        }

        // console.log('get saveToDeposit: ', item);
        cnt--;

        if (item.amt > 0n) {

          sum += item.amt;

          if (arr.length > 0 ) {
            let last:DepositProps = arr[arr.length-1];

            if (last.blockNumber == item.blockNumber &&
                last.transactionHash == item.transactionHash &&
                last.acct == item.acct ) 
            {
              arr[arr.length-1].amt += item.amt;
              continue;
            }
          }

          arr.push(item);          
        }

      }

      let pickupLogs = await client.getLogs({
        address: gk,
        event: parseAbiItem('event PickupDeposit(address indexed to, uint indexed caller, uint indexed amt)'),
        fromBlock: 1n,
      });  
      
      cnt = pickupLogs.length;

      while (cnt > 0) {

        let blkNo = pickupLogs[cnt-1].blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});

        let item:DepositProps = {
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: pickupLogs[cnt-1].transactionHash,
          isDeposit: false,
          amt: pickupLogs[cnt-1].args.amt ?? 0n,
          acct: Number(pickupLogs[cnt-1].args.caller) ?? 0,
        }

        // console.log('get pickup: ', item);
        cnt--;

        if (item.amt > 0n) {
          sum -= item.amt;
          arr.push(item);
        }

      }

      setRecords(arr);
      setTotal(sum);
    }

    getEvents();

  },[client, gk, boox, keepers, time]);

  const columns: GridColDef[] = [
    {
      field: 'blockNumber',
      headerName: 'BlockNumber',
      valueGetter: p => longSnParser(p.row.blockNumber.toString()),
      width: 218,
    },
    {
      field: 'timestamp',
      headerName: 'Date',
      valueGetter: p => dateParser(p.row.timestamp.toString()),
      width: 218,
    },
    {
      field: 'typeOfActioin',
      headerName: 'TypeOfAction',
      valueGetter: p => p.row.isDeposit ? '+' : '-',
      width: 218,
    },
    {
      field: 'amount',
      headerName: 'Amount (ETH)',
      valueGetter: p => bigIntToStrNum(p.row.amt, 18),
      width: 218,
    },
    {
      field: 'acct',
      headerName: 'Acct',
      valueGetter: p => longSnParser(p.row.acct.toString()),
      width: 258,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'transactionHash',
      headerName: 'TransactionHash',
      valueGetter: p => longSnParser(p.row.transactionHash),
      width: 258,
      headerAlign: 'center',
      renderCell: ({ value }) => (
        <CopyLongStrTF title="Hash" src={value} />
      ),
    },
  ];


  return (
    <>
      {records && (
      <Paper elevation={3} 
        sx={{
          alignContent:'center', 
          justifyContent:'center', 
          m:1, p:1, border:1, 
          borderColor:'divider' 
        }} 
      >

        <Paper elevation={3} sx={{m:1, p:1 }} >
          <Stack direction='row' sx={{ alignItems:'center' }} >

            <Typography variant='h5' sx={{ m:2, textDecoration:'underline'  }}  >
              <b>Deposits - { baseToDollar((total / 10n**14n).toString()) } ETH</b>
            </Typography>

            <Tooltip
              title='Refresh List' 
              placement='right' 
              arrow 
            >
              <IconButton 
                size='small'
                sx={{ mx:5 }}
                onClick={()=>refresh()}
                color="primary"
              >
                <Refresh />
              </IconButton>
            </Tooltip>

          </Stack>

          <DataGrid 
            initialState={{pagination:{paginationModel:{pageSize: 5}}}} 
            pageSizeOptions={[5, 10, 15, 20]} 
            rows={ records } 
            getRowId={(row:DepositProps) => (row.blockNumber.toString() + row.transactionHash + longSnParser(row.acct.toString())) } 
            columns={ columns }
            disableRowSelectionOnClick
          />

        </Paper>
      </Paper>
      )}

    </>
  );
} 