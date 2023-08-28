import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Deal } from "../../../../scripts/comp/ia";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import { StateOfDeal, TypeOfDeal } from "./CreateDeal";
import { centToDollar, dateParser, longSnParser } from "../../../../scripts/common/toolsKit";
import { DeleteDeal } from "./DeleteDeal";
import { Bytes32Zero, HexType, booxMap } from "../../../../scripts/common";
import { ActionsOfDeal } from "./ActionsOfDeal";
import { GetDTClaims } from "./GetDTClaims";
import { CheckValueOfDeal } from "./CheckValueOfDeal";
import { GetFRClaims } from "./GetFRClaims";
import { useFilesFolderClosingDeadline, useFilesFolderDtExecDeadline, useFilesFolderFrExecDeadline, useFilesFolderGetFile, useFilesFolderTerminateStartpoint, useFilesFolderVotingDeadline, useInvestmentAgreementGetAllSwaps } from "../../../../generated";
import { Swap } from "../../../../scripts/comp/roo";
import { SwapsList } from "./SwapsList";
import { useComBooxContext } from "../../../../scripts/common/ComBooxContext";
import { usePublicClient } from "wagmi";

interface OrderOfDealProps {
  ia: HexType;
  isFinalized: boolean;
  open: boolean;
  deal: Deal;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setDeal: Dispatch<SetStateAction<Deal>>;
  refreshDealsList: ()=>void;
}

export interface Timeline {
  frDeadline: number;
  dtDeadline: number;
  terminateStart: number;
  votingDeadline: number;
  closingDeadline: number;
  stateOfFile: number;
}

export const defaultTimeline: Timeline = {
  frDeadline: 0,
  dtDeadline: 0,
  terminateStart: 0,
  votingDeadline: 0,
  closingDeadline: 0,
  stateOfFile: 0,
}

export function OrderOfDeal({ ia, isFinalized, open, deal, setOpen, setDeal, refreshDealsList}: OrderOfDealProps) {

  const { boox } = useComBooxContext();

  const [ swaps, setSwaps ] = useState<readonly Swap[]>();
  
  const {
    refetch: getAllSwaps
  } = useInvestmentAgreementGetAllSwaps({
    address: ia,
    args: [ BigInt(deal.head.seqOfDeal) ],
    onSuccess(res) {
      if (res.length > 0)
        setSwaps(res);
    }
  })

  const [ timeline, setTimeline ] = useState<Timeline>(defaultTimeline);

  useFilesFolderFrExecDeadline({
    address: boox ? boox[booxMap.ROA]: undefined,
    args: [ia],
    onSuccess(res){
      setTimeline(v => ({
        ...v,
        frDeadline: res,
      }));
    }
  });

  useFilesFolderDtExecDeadline({
    address: boox ? boox[booxMap.ROA]: undefined,
    args: [ia],
    onSuccess(res){
      setTimeline(v => ({
        ...v,
        dtDeadline: res,
      }));
    }
  });

  useFilesFolderTerminateStartpoint({
    address: boox ? boox[booxMap.ROA]: undefined,
    args: [ia],
    onSuccess(res){
      setTimeline(v => ({
        ...v,
        terminateStart: res,
      }));
    }
  });

  useFilesFolderVotingDeadline({
    address: boox ? boox[booxMap.ROA]: undefined,
    args: [ia],
    onSuccess(res){
      setTimeline(v => ({
        ...v,
        votingDeadline: res,
      }));
    }
  });

  useFilesFolderClosingDeadline({
    address: boox ? boox[booxMap.ROA]: undefined,
    args: [ia],
    onSuccess(res){
      setTimeline(v => ({
        ...v,
        closingDeadline: res,
      }));
    }
  });

  useFilesFolderGetFile({
    address: boox ? boox[booxMap.ROA]: undefined,
    args: [ia],
    onSuccess(res){
      setTimeline(v => ({
        ...v,
        stateOfFile: res.head.state,
      }));
    }
  });

  const provider = usePublicClient();

  const [ timestamp, setTimestamp ] = useState<number>(0);
  
  useEffect(()=>{
    const getTimestamp = async () => {
      let block = await provider.getBlock();
      setTimestamp(Number(block.timestamp));
    }

    getTimestamp();
  })

  
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
          <DeleteDeal ia={ia} seqOfDeal={deal.head.seqOfDeal} setOpen={setOpen} setDeal={setDeal} refreshDealsList={refreshDealsList} />
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
                  value={ dateParser(deal.head.closingDeadline) }
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
                  value={ StateOfDeal[deal.body.state] }
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
                  value={ TypeOfDeal[ deal.head.typeOfDeal - 1 ] }
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
                  label='PriceOfPar'
                  inputProps={{readOnly: true}}
                  size="small"
                  sx={{
                    m:1,
                  }}
                  value={ centToDollar(deal.head.priceOfPar.toString()) }
                />
              </td>
              <td rowSpan={ 2 }>
                <TextField 
                  variant='outlined'
                  fullWidth
                  label='TotalAmount'
                  inputProps={{readOnly: true}}
                  size="small"
                  multiline
                  rows={ 3.5 }
                  sx={{
                    m:1,
                  }}
                  value={ centToDollar(
                    (((deal.body.par - deal.body.paid) * BigInt(deal.head.priceOfPar) 
                    + (deal.body.paid * BigInt(deal.head.priceOfPaid))) / BigInt(100)).toString()  
                  )}
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
                  label='Paid (Dollar)'
                  inputProps={{readOnly: true}}
                  size="small"
                  sx={{
                    m:1,
                  }}
                  value={ centToDollar(deal.body.paid.toString()) }
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
                <GetDTClaims ia={ia} deal={deal} setOpen={setOpen} setDeal={setDeal} refreshDealsList={refreshDealsList} timeline={timeline} timestamp={timestamp}/>
              </td>
              <td>
                <GetFRClaims ia={ia} deal={deal} setOpen={setOpen} setDeal={setDeal} refreshDealsList={refreshDealsList} timeline={timeline} timestamp={timestamp}/>
              </td>
              <td>
                <SwapsList ia={ia} deal={deal} setOpen={setOpen} setDeal={setDeal} refreshDealsList={refreshDealsList} />
              </td>
              <td>
                <CheckValueOfDeal ia={ia} deal={deal} />
              </td>
            </tr>

            <tr>
              <td colSpan={4}>
                {deal.body.state > 0 && (
                  <ActionsOfDeal ia={ia} deal={deal} setOpen={setOpen} setDeal={setDeal} refreshDealsList={refreshDealsList} timeline={timeline} timestamp={timestamp} />
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

