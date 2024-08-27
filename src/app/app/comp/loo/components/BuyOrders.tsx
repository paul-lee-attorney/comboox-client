import { useEffect, useState } from "react";
import { IconButton, Paper, Stack, Tooltip, Typography } from "@mui/material";
import { useComBooxContext } from "../../../../_providers/ComBooxContextProvider";
import { AddrZero, booxMap, HexType } from "../../../common";
import { usePublicClient } from "wagmi";
import { parseAbiItem } from "viem";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { baseToDollar, dateParser, longSnParser } from "../../../common/toolsKit";
import { Deal, dealParser, Node, nodeParser } from "../loo";
import { Refresh } from "@mui/icons-material";

export type OrderProps = {
  blockNumber: bigint,
  timestamp: bigint,
  transactionHash: HexType,
  typeOfOrder: string,
  expireDate: string,
  classOfShare: string,
  seqOfShare: string,
  paid: string,
  price: string,
  buyer: string,
  groupRep: string,
  votingWeight: string,
  distrWeight: string
}

interface BuyOrdersProps {
  classOfShare: number
}

export function BuyOrders({classOfShare}: BuyOrdersProps) {
  const { boox } = useComBooxContext();
  
  const client = usePublicClient();

  const [ records, setRecords ] = useState<OrderProps[]>([]);
  const [ qty, setQty ] = useState(0n);
  const [ amt, setAmt ] = useState(0n);
  
  const [ time, setTime ] = useState(0);

  const refresh = ()=>{
    setTime(Date.now());
  }

  useEffect(()=>{

    const getEvents = async () => {

      if (!boox || boox[booxMap.LOO] == AddrZero) return;

      const addrLOO = boox[booxMap.LOO];

      const lastBlock = await client.getBlockNumber();

      const buyOrderLogs = await client.getLogs({
        address: addrLOO,
        event: parseAbiItem('event PlaceBuyOrder(uint caller, uint indexed classOfShare, uint indexed paid, uint indexed price)'),
        fromBlock: lastBlock - 60000n,
      });

      let cnt = buyOrderLogs.length;
      let arr: OrderProps[] = [];

      while (cnt > 0) {

        let blkNo = buyOrderLogs[cnt-1].blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});

        let classOfOrder = Number(buyOrderLogs[cnt-1].args.classOfShare ?? 0);

        if (classOfShare != classOfOrder) {
          cnt--;
          continue;
        }

        let item:OrderProps = {
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: buyOrderLogs[cnt-1].transactionHash,
          typeOfOrder: 'Buy Order',
          expireDate: '-',
          classOfShare: longSnParser(classOfShare.toString()),
          seqOfShare: '-',
          paid: baseToDollar(buyOrderLogs[cnt-1].args.paid?.toString() ?? '0'),
          price: baseToDollar(buyOrderLogs[cnt-1].args.price?.toString() ?? '0'),
          buyer: longSnParser(buyOrderLogs[cnt-1].args.caller?.toString() ?? '0'),
          groupRep: '-',
          votingWeight: '-',
          distrWeight: '-'
        }

        cnt--;

        arr.push(item); 
      }

      let dealLogs = await client.getLogs({
        address: addrLOO,
        event: parseAbiItem('event Deal(bytes32 indexed deal)'),
        fromBlock: lastBlock - 60000n,
      });

      cnt = dealLogs.length;

      let qty:bigint = 0n;
      let amt:bigint = 0n;


      while (cnt > 0) {

        let deal:Deal = dealParser(dealLogs[cnt-1].args.deal??'0x00');

        let blkNo = dealLogs[cnt-1].blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});

        let classOfOrder = Number(deal.classOfShare);

        if (classOfShare != classOfOrder) {
          cnt--;
          continue;
        }

        let item:OrderProps = {
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: dealLogs[cnt-1].transactionHash,
          typeOfOrder: 'Deal',
          expireDate: '-',
          classOfShare: longSnParser(classOfShare.toString()),
          seqOfShare: longSnParser(deal.seqOfShare),
          paid: baseToDollar(deal.paid),
          price: baseToDollar(deal.price),
          buyer: longSnParser(deal.buyer),
          groupRep: longSnParser(deal.groupRep),
          votingWeight: longSnParser(deal.votingWeight),
          distrWeight: longSnParser(deal.distrWeight)
        }

        cnt--;

        qty += BigInt(deal.paid);
        amt += BigInt(deal.paid) * BigInt(deal.price);

        arr.push(item); 
      }

      let expOfferLogs = await client.getLogs({
        address: addrLOO,
        event: parseAbiItem('event OfferExpired(bytes32 indexed offer)'),
        fromBlock: lastBlock - 60000n,
      });

      cnt = expOfferLogs.length;

      while (cnt > 0) {

        let offer:Node = nodeParser(expOfferLogs[cnt-1].args.offer??'0x00');

        let blkNo = expOfferLogs[cnt-1].blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});

        let item:OrderProps = {
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: expOfferLogs[cnt-1].transactionHash,
          typeOfOrder: 'Exp Offer',
          expireDate: dateParser(offer.expireDate),
          classOfShare: '-',
          seqOfShare: longSnParser(offer.seqOfShare),
          paid: baseToDollar(offer.paid),
          price: baseToDollar(offer.price),
          buyer: '-',
          groupRep: '-',
          votingWeight: longSnParser(offer.votingWeight),
          distrWeight: longSnParser(offer.distrWeight)
        }

        cnt--;

        arr.push(item);        
      }

      let balanceLogs = await client.getLogs({
        address: addrLOO,
        event: parseAbiItem('event GetBalance(bytes32 indexed balance)'),
        fromBlock: lastBlock - 60000n,
      });

      cnt = balanceLogs.length;

      while (cnt > 0) {

        let balance:Deal = dealParser(balanceLogs[cnt-1].args.balance??'0x00');

        let blkNo = balanceLogs[cnt-1].blockNumber;
        let blk = await client.getBlock({blockNumber: blkNo});

        let classOfOrder = Number(balance.classOfShare);

        if (classOfShare != classOfOrder) {
          cnt--;
          continue;
        }

        let item:OrderProps = {
          blockNumber: blkNo,
          timestamp: blk.timestamp,
          transactionHash: balanceLogs[cnt-1].transactionHash,
          typeOfOrder: 'Balance',
          expireDate: '-',
          classOfShare: longSnParser(balance.classOfShare),
          seqOfShare: '-',
          paid: baseToDollar(balance.paid),
          price: baseToDollar(balance.price),
          buyer: longSnParser(balance.buyer),
          groupRep: '-',
          votingWeight: '-',
          distrWeight: '-'
        }

        cnt--;

        arr.push(item);
      }

      setQty(qty);
      setAmt(amt / 10000n);
      setRecords(arr);
    }

    getEvents();

  },[client, boox, classOfShare, setQty, setAmt]);

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
      field: 'typeOfOrder',
      headerName: 'TypeOfOrder',
      valueGetter: p => p.row.typeOfOrder,
      width: 218,
    },
    {
      field: 'seqOfCert',
      headerName: 'seqOfCert',
      valueGetter: p => p.row.seqOfShare,
      width: 218,
    },
    {
      field: 'paid',
      headerName: 'Paid',
      valueGetter: p => p.row.paid,
      width: 330,
    },
    {
      field: 'price',
      headerName: 'Price',
      valueGetter: p => p.row.price,
      width: 330,
    },
    {
      field: 'buyer',
      headerName: 'Buyer',
      valueGetter: p => p.row.buyer,
      width: 218,
    },
  ];

  return (
    <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >

      <Stack direction={'row'} sx={{ alignItems:'center' }} >

        <Typography variant='h5' sx={{ m:2, textDecoration:'underline'  }}  >
          <b>Deals List</b>  
        </Typography>

        <Typography variant='h4' sx={{ m:2 }}  >
          (Par: { baseToDollar(qty.toString())} / Value: {amt.toString()})
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
        initialState={{pagination:{paginationModel:{pageSize: 10}}}} 
        pageSizeOptions={[5, 10, 15, 20]} 
        rows={ records } 
        getRowId={(row:OrderProps) => (row.blockNumber.toString() + row.transactionHash + row.buyer) } 
        columns={ columns }
        disableRowSelectionOnClick
      />

    </Paper>
  );
} 