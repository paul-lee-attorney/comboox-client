import { useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useComBooxContext } from "../../../../_providers/ComBooxContextProvider";
import { HexType, keepersMap } from "../../../common";
import { usePublicClient } from "wagmi";
import { parseAbiItem } from "viem";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { bigIntToStrNum, dateParser, longSnParser } from "../../../common/toolsKit";
import { CopyLongStrTF } from "../../../common/CopyLongStr";
import { CapProps } from "./PaidInCap";

export type DistributionProps = {
  blockNumber: bigint,
  timestamp: bigint,
  transactionHash: HexType,
  seqOfMotion: bigint,
  amt: bigint,
  executor: number,
}

export function Distribution({sum, setSum}:CapProps) {

  const { keepers } = useComBooxContext();
  
  const [ open, setOpen ] = useState(false);

  const client = usePublicClient();

  const [ records, setRecords ] = useState<DistributionProps[]>([]);
  const [ distr, setDistr ] = useState(0n);

  useEffect(()=>{
  
    const getEvents = async () => {

      let sum = 0n;

      if (!keepers) return;

      let dpLogs = await client.getLogs({
        address: keepers[keepersMap.GMMKeeper],
        event: parseAbiItem('event DistributeProfits(uint256 indexed sum, uint indexed seqOfMotion, uint indexed caller)'),
        fromBlock: 1n,
      });

      let cnt = dpLogs.length;
      let arr: DistributionProps[] = [];

      while (cnt > 0) {

        if (!dpLogs[cnt-1].args.sum) {
          cnt--;
          continue;
        }

        let blkNo = dpLogs[cnt-1].blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});

        let item:DistributionProps = {
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: dpLogs[cnt-1].transactionHash,
          seqOfMotion: dpLogs[cnt-1].args.seqOfMotion ?? 0n,
          amt: dpLogs[cnt-1].args.sum ?? 0n,
          executor: Number(dpLogs[cnt-1].args.caller ?? 0n),
        }

        // console.log('get dpItem: ', item);
        cnt--;

        sum += item.amt;
        arr.push(item);
      }      

      setSum(sum);
      setDistr(sum);
      setRecords(arr);
    }

    getEvents();

  },[client, keepers, setSum]);

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
      field: 'seqOfMotion',
      headerName: 'SeqOfMotion',
      valueGetter: p => p.row.seqOfMotion,
      width: 218,
    },
    {
      field: 'amount',
      headerName: 'Amount (ETH)',
      valueGetter: p => bigIntToStrNum(p.row.amt, 18),
      width: 218,
    },
    {
      field: 'executor',
      headerName: 'Executor',
      valueGetter: p => longSnParser(p.row.executor.toString()),
      width: 258,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'transactionHash',
      headerName: 'TransactionHash',
      valueGetter: p => p.row.transactionHash,
      width: 258,
      headerAlign: 'center',
      renderCell: ({ value }) => (
        <CopyLongStrTF title="Hash" src={value} />
      ),
    },
  ];


  return (
    <>
      <Button 
        variant="outlined"
        fullWidth
        sx={{m:0.5, minWidth:218, justifyContent:'start'}}
        onClick={()=>setOpen(true)}
      >
          <b>Distribution: {'(' + bigIntToStrNum(distr, 18) + ' ETH)'} </b>
      </Button>

      <Dialog
        maxWidth={false}
        open={open}
        onClose={()=>setOpen(false)}
        aria-labelledby="dialog-title" 
      >

        <DialogTitle id="dialog-title" sx={{ mx:2, textDecoration:'underline' }} >
          <b>Distribution - {'(' + bigIntToStrNum(distr, 18) + ' ETH)'} </b>
        </DialogTitle>

        <DialogContent>

          <DataGrid 
            initialState={{pagination:{paginationModel:{pageSize: 10}}}} 
            pageSizeOptions={[5, 10, 15, 20]} 
            rows={ records } 
            getRowId={(row:DistributionProps) => row.blockNumber.toString() + row.transactionHash + row.executor } 
            columns={ columns }
            disableRowSelectionOnClick
          />

        </DialogContent>

        <DialogActions>
          <Button variant="outlined" sx={{ m:1, mx:3 }} onClick={()=>setOpen(false)}>Close</Button>
        </DialogActions>

      </Dialog>

    </>
  );
} 