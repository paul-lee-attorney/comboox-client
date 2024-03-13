
import { Dispatch, SetStateAction } from "react";

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";

import { centToDollar, dateParser, longDataParser, longSnParser, } from "../../../read/toolsKit";
import { Share, codifyHeadOfShare } from "../read/ros";

import { ActionsOfCap } from "./ActionsOfCap";

export interface CertificateOfContributionProps{
  open: boolean;
  share: Share;
  setOpen: Dispatch<SetStateAction<boolean>>;
  refresh: ()=>void;
}

export function CertificateOfContribution({open, share, setOpen, refresh}: CertificateOfContributionProps) {

  return (
    <Dialog
      maxWidth={false}
      open={open}
      onClose={()=>setOpen(false)}
      aria-labelledby="dialog-title" 
    >
      <DialogTitle id="dialog-title" sx={{ mx:2, textDecoration:'underline' }} >
        <b>Certificate Of Contribution</b>
      </DialogTitle>
      <DialogContent>
          <table width={1280} >
            <thead />
            <tbody>
              <tr>
                <td colSpan={2}>
                  <TextField 
                    fullWidth={true}
                    inputProps={{readOnly: true}}
                    sx={{ m: 1 }} 
                    id="tfSnOfShare" 
                    label="Sn" 
                    variant="outlined"
                    value = { codifyHeadOfShare(share.head) }
                    size='small'
                  />
                </td>
                <td>
                  <TextField 
                    fullWidth={true}
                    inputProps={{readOnly: true}}
                    sx={{ m: 1 }} 
                    id="tfIssueDate" 
                    label="IssueDate" 
                    variant="outlined"
                    value = { dateParser(share.head.issueDate.toString()) }
                    size='small'
                  />
                </td>
                <td>
                  <TextField 
                    fullWidth={true}
                    inputProps={{readOnly: true}}
                    sx={{ m: 1 }} 
                    id="tfState" 
                    label="State" 
                    variant="outlined"
                    value = { share.body.state == 0 ? 'Normal' : 'Freezed'}
                    size='small'
                  />
                </td>
                          
              </tr>

              <tr>
                <td >
                  <TextField 
                    fullWidth={true}
                    inputProps={{readOnly: true}}
                    sx={{ m: 1 }} 
                    id="tfSeqOfShare" 
                    label="SeqOfShare" 
                    variant="outlined"
                    value = { longSnParser(share.head.seqOfShare.toString()) }
                    size='small'
                  />
                </td>
                <td >
                  <TextField 
                    fullWidth={true}
                    inputProps={{readOnly: true}}
                    sx={{ m: 1 }} 
                    id="tfPreSeq" 
                    label="PreSeq" 
                    variant="outlined"
                    value = { longSnParser(share.head.preSeq.toString()) }
                    size='small'
                  />
                </td>

                <td >
                  <TextField 
                    fullWidth={true}
                    inputProps={{readOnly: true}}
                    sx={{ m: 1 }} 
                    id="tfClass" 
                    label="Class" 
                    variant="outlined"
                    value = { share.head.class.toString() }
                    size='small'
                  />
                </td>

                <td >
                  <TextField 
                    fullWidth={true}
                    inputProps={{readOnly: true}}
                    sx={{ m: 1 }} 
                    id="tfPayInDate" 
                    label="PayInDate" 
                    variant="outlined"
                    value = { dateParser(share.body.payInDeadline.toString()) }
                    size='small'
                  />                                
                </td>

              </tr>

              <tr>
                <td rowSpan={3}>
                  <TextField 
                    fullWidth={true}
                    inputProps={{readOnly: true}}
                    sx={{ m: 1,  }} 
                    multiline
                    rows={4}
                    id="tfShareholder" 
                    label="Shareholder" 
                    variant="outlined"
                    value = { longSnParser(share.head.shareholder.toString()) }
                    size='small'
                  />
                </td>
                <td colSpan={3} />
              </tr>

              <tr>
                <td >
                  <TextField 
                    fullWidth={true}
                    inputProps={{readOnly: true}}
                    sx={{ m: 1 }} 
                    id="tfPar" 
                    label="Par" 
                    variant="outlined"
                    value = { centToDollar(share.body.par.toString()) }
                    size='small'
                  />                
                </td>

                <td>
                  <TextField 
                    fullWidth={true}
                    inputProps={{readOnly: true}}
                    sx={{ m: 1 }} 
                    id="tfPriceOfPar" 
                    label="PriceOfPar" 
                    variant="outlined"
                    value = { centToDollar(share.head.priceOfPar.toString()) }
                    size='small'
                  />                
                </td>

                <td >
                  <TextField 
                    fullWidth={true}
                    inputProps={{readOnly: true}}
                    sx={{ m: 1 }} 
                    id="tfValueOfParBalance" 
                    label="ValueOfParBalance" 
                    variant="outlined"
                    value = { centToDollar(((share.body.par - share.body.paid)*BigInt(share.head.priceOfPar) / 100n).toString()) }
                    size='small'
                  />                
                </td>

              </tr>

              <tr>
                <td >
                  <TextField
                    fullWidth={true} 
                    inputProps={{readOnly: true}}
                    sx={{ m: 1 }} 
                    id="tfPaid" 
                    label="Paid" 
                    variant="outlined"
                    value = { centToDollar(share.body.paid.toString()) }
                    size='small'
                  />                
                </td>

                <td>
                  <TextField 
                    fullWidth={true}
                    inputProps={{readOnly: true}}
                    sx={{ m: 1 }} 
                    id="tfPriceOfPaid" 
                    label="PriceOfPaid" 
                    variant="outlined"
                    value = { centToDollar(share.head.priceOfPaid.toString()) }
                    size='small'
                  />                
                </td>

                <td >
                  <TextField 
                    fullWidth={true}
                    inputProps={{readOnly: true}}
                    sx={{ m: 1 }} 
                    id="tfValueOfPaid" 
                    label="ValueOfPaid" 
                    variant="outlined"
                    value = { centToDollar((share.body.paid * BigInt(share.head.priceOfPaid) / 100n).toString()) }
                    size='small'
                  />                
                </td>

                <td/>
              </tr>

              <tr>
                <td>
                  <TextField 
                    fullWidth={true}
                    inputProps={{readOnly: true}}
                    sx={{ m: 1 }} 
                    id="tfVotingWeight" 
                    label="VotingWeight (%)" 
                    variant="outlined"
                    value = { longDataParser(share.head.votingWeight.toString()) }
                    size='small'
                  />                                                  
                </td>
                <td colSpan={2}>
                  <TextField 
                    fullWidth={true}
                    inputProps={{readOnly: true}}
                    sx={{ m: 1 }} 
                    id="tfCleanPaid" 
                    label="CleanPaid" 
                    variant="outlined"
                    value = { centToDollar(share.body.cleanPaid.toString()) }
                    size='small'
                  />                                
                </td>

                <td >
                  <TextField 
                    fullWidth={true}
                    inputProps={{readOnly: true}}
                    sx={{ m: 1 }} 
                    id="tfValue" 
                    label="Value" 
                    variant="outlined"
                    value = { centToDollar(((share.body.paid * BigInt(share.head.priceOfPaid) / 100n) 
                      + ((share.body.par - share.body.paid) * BigInt(share.head.priceOfPar) / 100n)).toString())
                    }
                    size='small'
                  />                                
                </td>
              </tr>

              <tr>
                <td colSpan={4}>

                  {share && (share.body.par != share.body.paid) && (
                    <ActionsOfCap share={share} setDialogOpen={setOpen} refresh={refresh} />
                  )}

                </td>
              </tr>

            </tbody>
          </table>

      </DialogContent>
      <DialogActions>
        <Button variant="outlined" sx={{ m:1, mx:3 }} onClick={()=>setOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>

  )
}