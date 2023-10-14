import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Deal, StateOfDeal, Timeline, TypeOfDeal, defaultTimeline, getAllSwaps } from "../../../../scripts/comp/ia";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import { centToDollar, dateParser, longDataParser, longSnParser, } from "../../../../scripts/common/toolsKit";
import { DeleteDeal } from "./DeleteDeal";
import { Bytes32Zero, HexType, booxMap } from "../../../../scripts/common";
import { ActionsOfDeal } from "./ActionsOfDeal";
import { GetDTClaims } from "./GetDTClaims";
import { CheckValueOfDeal } from "./CheckValueOfDeal";
import { GetFRClaims } from "./GetFRClaims";
import { Swap } from "../../../../scripts/comp/roo";
import { SwapsList } from "./SwapsList";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { usePublicClient } from "wagmi";
import { closingDeadline, dtExecDeadline, frExecDeadline, getFile, terminateStartpoint, votingDeadline } from "../../../../scripts/common/filesFolder";

interface OrderOfDealProps {
  addr: HexType;
  isFinalized: boolean;
  open: boolean;
  deal: Deal;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setDeal: Dispatch<SetStateAction<Deal>>;
  refresh: ()=>void;
}

export function OrderOfDeal({ addr, isFinalized, open, deal, setOpen, setDeal, refresh}: OrderOfDealProps) {

  const { boox } = useComBooxContext();

  const [ swaps, setSwaps ] = useState<readonly Swap[]>();
  
  useEffect(()=>{
    getAllSwaps(addr, deal.head.seqOfDeal).then(
      res => {
        if (res.length > 0)
          setSwaps(res);
      }
    )    
  }, [addr, deal.head.seqOfDeal]);

  const [ timeline, setTimeline ] = useState<Timeline>(defaultTimeline);

  useEffect(()=>{
    if (boox) {
      frExecDeadline(boox[booxMap.ROA], addr).then(
        res => setTimeline(v => ({
          ...v,
          frDeadline: res,
        }))
      );
      dtExecDeadline(boox[booxMap.ROA], addr).then(
        res => setTimeline(v => ({
          ...v,
          dtDeadline: res,
        }))
      );
      terminateStartpoint(boox[booxMap.ROA], addr).then(
        res => setTimeline(v => ({
          ...v,
          terminateStart: res,
        }))
      );
      votingDeadline(boox[booxMap.ROA], addr).then(
        res => setTimeline(v => ({
          ...v,
          votingDeadline: res,
        }))
      );
      closingDeadline(boox[booxMap.ROA], addr).then(
        res => setTimeline(v => ({
          ...v,
          closingDeadline: res,
        }))
      );
      getFile(boox[booxMap.ROA], addr).then(
        res => setTimeline(v => ({
          ...v,
          stateOfFile: res.head.state,
        }))
      );
    }
  }, [boox, addr]);

  const provider = usePublicClient();

  const [ timestamp, setTimestamp ] = useState<number>(0);
  
  useEffect(()=>{
    provider.getBlock().then(
      block => setTimestamp(Number(block.timestamp))
    );
  }, [provider]);

  return (
    <Dialog
      maxWidth={false}
      open={open}
      onClose={()=>setOpen(false)}
      aria-labelledby="dialog-title" 
    >
      <Stack direction='row' sx={{ justifyContent:'space-between', alignItems:'center' }} >
        <DialogTitle id="dialog-title" sx={{ mx:2, textDecoration:'underline' }} >
          <h4>Order of Deal</h4>
        </DialogTitle>

        {!isFinalized && (
          <DeleteDeal addr={addr} seqOfDeal={deal.head.seqOfDeal} setOpen={setOpen} setDeal={setDeal} refresh={refresh} />
        )}

      </Stack>
      <DialogContent> 
        <table width={1180} >
          <thead />
          <tbody>

            <tr>
              <td>
                <TextField 
                  variant='outlined'
                  fullWidth
                  label='SeqOfDeal'
                  inputProps={{readOnly: true}}
                  size="small"
                  sx={{
                    m:1,
                  }}
                  value={ longSnParser(deal.head.seqOfDeal.toString()) }
                />
              </td>
              <td>
                <TextField 
                  variant='outlined'
                  fullWidth
                  label='PreSeq'
                  inputProps={{readOnly: true}}
                  size="small"
                  sx={{
                    m:1,
                  }}
                  value={ longSnParser(deal.head.preSeq.toString()) }
                />
              </td>
              <td>
                <TextField 
                  variant='outlined'
                  fullWidth
                  label='ClosingDeadline'
                  inputProps={{readOnly: true}}
                  size="small"
                  sx={{
                    m:1,
                  }}
                  value={ dateParser(deal.head.closingDeadline.toString()) }
                />
              </td>
              <td>
                <TextField 
                  variant='outlined'
                  fullWidth
                  label='State'
                  inputProps={{readOnly: true}}
                  size="small"
                  sx={{
                    m:1,
                  }}
                  value={ StateOfDeal[Number(deal.body.state)] }
                />
              </td>
            </tr>

            <tr>
              <td>
                <TextField 
                  variant='outlined'
                  fullWidth
                  label='TypeOfDeal'
                  inputProps={{readOnly: true}}
                  size="small"
                  sx={{
                    m:1,
                  }}
                  value={ TypeOfDeal[ Number(deal.head.typeOfDeal) - 1 ] }
                />
              </td>
              <td>
                <TextField 
                  variant='outlined'
                  fullWidth
                  label='Seller'
                  inputProps={{readOnly: true}}
                  size="small"
                  sx={{
                    m:1,
                  }}
                  value={ longSnParser(deal.head.seller.toString()) }
                />
              </td>
              <td>
                <TextField 
                  variant='outlined'
                  fullWidth
                  label='Buyer'
                  inputProps={{readOnly: true}}
                  size="small"
                  sx={{
                    m:1,
                  }}
                  value={ longSnParser(deal.body.buyer.toString()) }
                />
              </td>
              <td>
                <TextField 
                  variant='outlined'
                  fullWidth
                  label='GroupOfBuyer'
                  inputProps={{readOnly: true}}
                  size="small"
                  sx={{
                    m:1,
                  }}
                  value={ longSnParser(deal.body.groupOfBuyer.toString()) }
                />
              </td>
            </tr>

            <tr>
              <td>
                <TextField 
                  variant='outlined'
                  fullWidth
                  label='ClassOfShare'
                  inputProps={{readOnly: true}}
                  size="small"
                  sx={{
                    m:1,
                  }}
                  value={ longSnParser(deal.head.classOfShare.toString()) }
                />
              </td>
              <td>
                <TextField 
                  variant='outlined'
                  fullWidth
                  label='PriceOfPar'
                  inputProps={{readOnly: true}}
                  size="small"
                  sx={{
                    m:1,
                  }}
                  value={ centToDollar(deal.head.priceOfPar.toString()) }
                />
              </td>
              <td>
                <TextField 
                  variant='outlined'
                  fullWidth
                  label='PriceOfPaid'
                  inputProps={{readOnly: true}}
                  size="small"
                  sx={{
                    m:1,
                  }}
                  value={ centToDollar(deal.head.priceOfPaid.toString()) }
                />
              </td>
              <td>
                <TextField 
                  variant='outlined'
                  fullWidth
                  label='VotingWeight (%)'
                  inputProps={{readOnly: true}}
                  size="small"
                  sx={{
                    m:1,
                  }}
                  value={ longDataParser(deal.head.votingWeight.toString()) }
                />
              </td>
            </tr>

            <tr>
              <td>
                <TextField 
                  variant='outlined'
                  fullWidth
                  label='SeqOfShare'
                  inputProps={{readOnly: true}}
                  size="small"
                  sx={{
                    m:1,
                  }}
                  value={ longSnParser(deal.head.seqOfShare.toString()) }
                />
              </td>
              <td>
                <TextField 
                  variant='outlined'
                  fullWidth
                  label='Par (Dollar)'
                  inputProps={{readOnly: true}}
                  size="small"
                  sx={{
                    m:1,
                  }}
                  value={ centToDollar(deal.body.par.toString()) }
                />
              </td>
              <td>
                <TextField 
                  variant='outlined'
                  fullWidth
                  label='Paid (Dollar)'
                  inputProps={{readOnly: true}}
                  size="small"
                  sx={{
                    m:1,
                  }}
                  value={ centToDollar(deal.body.paid.toString()) }
                />
              </td>
              <td >
                <TextField 
                  variant='outlined'
                  fullWidth
                  label='TotalAmount'
                  inputProps={{readOnly: true}}
                  size="small"
                  // multiline
                  // rows={ 3.5 }
                  sx={{
                    m:1,
                  }}
                  value={ centToDollar(
                    (((BigInt(deal.body.par) - BigInt(deal.body.paid)) * BigInt(deal.head.priceOfPar) 
                    + (BigInt(deal.body.paid) * BigInt(deal.head.priceOfPaid))) / BigInt(100)).toString()  
                  )}
                />
              </td>

            </tr>

            <tr>
              <td colSpan={4}>
                {deal.hashLock != Bytes32Zero && (
                  <TextField 
                    variant='outlined'
                    fullWidth
                    label='HashLock'
                    inputProps={{readOnly: true}}
                    size="small"
                    sx={{
                      m:1,
                    }}
                    value={ deal.hashLock }
                  />
                )}
              </td>
            </tr>

            <tr>
              <td>
                <GetDTClaims addr={addr} deal={deal} setOpen={setOpen} setDeal={setDeal} refresh={refresh} timeline={timeline} timestamp={timestamp}/>
              </td>
              <td>
                <GetFRClaims addr={addr} deal={deal} setOpen={setOpen} setDeal={setDeal} refresh={refresh} timeline={timeline} timestamp={timestamp}/>
              </td>
              <td>
                <SwapsList addr={addr} deal={deal} />
              </td>
              <td>
                <CheckValueOfDeal addr={addr} deal={deal} />
              </td>
            </tr>

            <tr>
              <td colSpan={4}>
                {Number(deal.body.state) > 0 && (
                  <ActionsOfDeal addr={addr} deal={deal} setOpen={setOpen} setDeal={setDeal} refresh={refresh} timeline={timeline} timestamp={timestamp} />
                )}
              </td>
            </tr>

          </tbody>
        </table>

      </DialogContent>

      <DialogActions>
        <Button variant='outlined' sx={{ m:1, mx:3 }} onClick={()=>setOpen(false)}>Close</Button>
      </DialogActions>

    </Dialog>
  );
}

