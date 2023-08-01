import { Dispatch, SetStateAction } from "react";
import { Deal } from "../../../../queries/ia";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import { StateOfDeal, TypeOfDeal } from "./CreateDeal";
import { dateParser, longDataParser, longSnParser } from "../../../../scripts/toolsKit";
import { Delete } from "@mui/icons-material";
import { DeleteDeal } from "./DeleteDeal";
import { HexType } from "../../../../interfaces";
import { ActionsOfDeal } from "./ActionsOfDeal";
import { AcceptAlongDeal } from "./Actions/AcceptAlongDeal";
import { GetDTClaims } from "../GetDTClaims";



interface OrderOfDealProps {
  ia: HexType;
  isFinalized: boolean;
  open: boolean;
  deal: Deal;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setDeal: Dispatch<SetStateAction<Deal>>;
  refreshDealsList: ()=>void;
}

export function OrderOfDeal({ ia, isFinalized, open, deal, setOpen, setDeal, refreshDealsList}: OrderOfDealProps) {

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
                  value={ longDataParser(deal.head.priceOfPaid.toString()) }
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
                  value={ longDataParser(deal.head.priceOfPar.toString()) }
                />
              </td>
              <td rowSpan={2}>
                <TextField 
                  variant='outlined'
                  fullWidth
                  label='TotalAmount'
                  inputProps={{readOnly: true}}
                  size="small"
                  multiline
                  rows={3.5}
                  sx={{
                    m:1,
                  }}
                  value={ longDataParser(
                    ((deal.body.par - deal.body.paid) * BigInt(deal.head.priceOfPar) 
                    + (deal.body.paid * BigInt(deal.head.priceOfPaid))).toString()  
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
                  label='QtyOfPaid'
                  inputProps={{readOnly: true}}
                  size="small"
                  sx={{
                    m:1,
                  }}
                  value={ longDataParser(deal.body.paid.toString()) }
                />
              </td>
              <td>
                <TextField 
                  variant='outlined'
                  fullWidth
                  label='QtyOfPar'
                  inputProps={{readOnly: true}}
                  size="small"
                  sx={{
                    m:1,
                  }}
                  value={ longDataParser(deal.body.par.toString()) }
                />
              </td>
            </tr>

            <tr>
              <td colSpan={4}>
                <GetDTClaims ia={ia} deal={deal} setOpen={setOpen} setDeal={setDeal} refreshDealsList={refreshDealsList} />
              </td>
            </tr>

            <tr>
              <td colSpan={4}>
                <ActionsOfDeal ia={ia} deal={deal} setOpen={setOpen} setDeal={setDeal} refreshDealsList={refreshDealsList} />
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

