import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { LockerOfPayInCap } from "./LockerOfPayInCap";
import { dateParser, longDataParser, longSnParser } from "../../../scripts/toolsKit";
import { Share } from "../../../queries/bos";


export interface CertificateOfContributionProps{
  open: boolean,
  share: Share,
  setOpen: (flag: boolean)=>void,
  obtainSharesList: ()=>any,
}

export function CertificateOfContribution({open, share, setOpen, obtainSharesList}: CertificateOfContributionProps) {


  return (
    <Dialog
      maxWidth={false}
      open={open}
      onClose={()=>setOpen(false)}
      aria-labelledby="dialog-title" 
    >
      <DialogTitle id="dialog-title" >
        {"Certificate Of Contribution"}
      </DialogTitle>
      <DialogContent>
          <table width={1180} >
            <thead />
            <tbody>
              <tr>
                <td colSpan={3}>
                  <TextField 
                    fullWidth={true}
                    inputProps={{readOnly: true}}
                    sx={{ m: 1 }} 
                    id="tfSnOfShare" 
                    label="Sn" 
                    variant="outlined"
                    value = { share.sn }
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
                    value = { dateParser(share.head.issueDate) }
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
                    value = { dateParser(share.body.payInDeadline) }
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
                    value = { longDataParser(share.body.par.toString()) }
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
                    value = { longDataParser(share.head.priceOfPar.toString()) }
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
                    value = { longDataParser(((share.body.par - share.body.paid)*BigInt(share.head.priceOfPar)).toString()) }
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
                    value = { longDataParser(share.body.paid.toString()) }
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
                    value = { longDataParser(share.head.priceOfPaid.toString()) }
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
                    value = { longDataParser((share.body.paid * BigInt(share.head.priceOfPaid)).toString()) }
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
                    id="tfState" 
                    label="State" 
                    variant="outlined"
                    value = { share.body.state == 0 ? 'Normal' : 'Freezed'}
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
                    value = { longDataParser(share.body.cleanPaid.toString()) }
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
                    value = { longDataParser(((share.body.paid * BigInt(share.head.priceOfPaid)) + (
                      (share.body.par - share.body.paid) * BigInt(share.head.priceOfPar))).toString())
                    }
                    size='small'
                  />                                
                </td>
              </tr>

              <tr>
                <td colSpan={4}>

                  {share && (share.body.par != share.body.paid) && (
                    <LockerOfPayInCap share={share} obtainSharesList={obtainSharesList} setDialogOpen={setOpen} />
                  )}

                </td>
              </tr>

            </tbody>
          </table>

      </DialogContent>
      <DialogActions>
        <Button onClick={()=>setOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>

  )
}