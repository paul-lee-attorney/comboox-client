import { 
  Button, 
  Chip, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  Stack, 
  TextField 
} from "@mui/material";

import { dateParser, longDataParser, longSnParser } from "../../../scripts/toolsKit";
import { Pledge } from "../../../queries/bop";
import { StateOfPld } from "./PledgesList";
import { ActionsOfPledge } from "./ActionsOfPledge";

export interface CertificateOfPledgeProps{
  open: boolean,
  pld: Pledge,
  setOpen: (flag: boolean)=>void,
  getAllPledges: ()=>void,
}

export function CertificateOfPledge({open, pld, setOpen, getAllPledges}: CertificateOfPledgeProps) {

  return (
    <Dialog
      maxWidth={false}
      open={open}
      onClose={()=>setOpen(false)}
      aria-labelledby="dialog-title" 
    >
      <Stack direction='row' sx={{ alignItems:'center', justifyContent:'space-between' }} >
        <DialogTitle id="dialog-title" sx={{ ml:1, textDecoration:'underline' }} >
          {"Certificate Of Pledge"} 
        </DialogTitle>
        <Chip
          sx={{ m:1, mr:5, width: 120 }} 
          label={ StateOfPld[pld.body.state] } 
          variant='filled' 
          color={
            pld.body.state == 0
            ? 'default'
            : pld.body.state == 1
              ? 'primary'
              : pld.body.state == 2
                ? 'warning'
                : pld.body.state == 3
                  ? 'success'
                  : pld.body.state == 4
                    ? 'info'
                    : pld.body.state == 5
                      ? 'error'
                      : 'default'
          } 
        />  
      </Stack>                
      <DialogContent>
          <table width={980} >
            <thead />
            <tbody>
              <tr>
                <td>
                  <TextField 
                    fullWidth={true}
                    inputProps={{readOnly: true}}
                    sx={{ m: 1 }} 
                    id="tfSeqOfShare" 
                    label="SeqOfShare" 
                    variant="outlined"
                    value = { longSnParser(pld.head.seqOfShare.toString()) }
                    size='small'
                  />
                </td>
                <td>
                  <TextField 
                    fullWidth={true}
                    inputProps={{readOnly: true}}
                    sx={{ m: 1 }} 
                    id="tfSeqOfPld" 
                    label="SeqOfPld" 
                    variant="outlined"
                    value = { pld.head.seqOfPld.toString() }
                    size='small'
                  />
                </td>
                <td>

                </td>
              </tr>

              <tr>
                <td>
                  <TextField 
                    fullWidth={true}
                    inputProps={{readOnly: true}}
                    sx={{ m: 1 }} 
                    id="tfCreateDate" 
                    label="CreateDate" 
                    variant="outlined"
                    value = { dateParser(pld.head.createDate) }
                    size='small'
                  />
                </td>
                <td>
                  <TextField 
                    fullWidth={true}
                    inputProps={{readOnly: true}}
                    sx={{ m: 1 }} 
                    id="tfTriggerDate" 
                    label="TriggerDate" 
                    variant="outlined"
                    value = { dateParser(pld.head.triggerDate) }
                    size='small'
                  />                  
                </td>
                <td>
                  <TextField 
                    fullWidth={true}
                    inputProps={{readOnly: true}}
                    sx={{ m: 1 }} 
                    id="tfExpireDate" 
                    label="ExpireDate" 
                    variant="outlined"
                    value = { dateParser(pld.head.triggerDate + pld.body.guaranteeDays * 86400) }
                    size='small'
                  />                  
                </td>
              </tr>

              <tr>
                <td>
                  <TextField 
                    fullWidth={true}
                    inputProps={{readOnly: true}}
                    sx={{ m: 1,  }} 
                    id="tfCreditor" 
                    label="Creditor" 
                    variant="outlined"
                    value = { longSnParser(pld.body.creditor.toString()) }
                    size='small'
                  />
                </td>
                <td>
                  <TextField 
                    fullWidth={true}
                    inputProps={{readOnly: true}}
                    sx={{ m: 1,  }} 
                    id="tfDebtor" 
                    label="Debtor" 
                    variant="outlined"
                    value = { longSnParser(pld.head.debtor.toString()) }
                    size='small'
                  />
                </td>
                <td>
                  <TextField 
                    fullWidth={true}
                    inputProps={{readOnly: true}}
                    sx={{ m: 1,  }} 
                    id="tfPledgor" 
                    label="Pledgor" 
                    variant="outlined"
                    value = { longSnParser(pld.head.pledgor.toString()) }
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
                    id="tfPledgedPaid" 
                    label="PledgedPaid" 
                    variant="outlined"
                    value = { longDataParser(pld.body.paid.toString()) }
                    size='small'
                  />                
                </td>
                <td >
                  <TextField 
                    fullWidth={true}
                    inputProps={{readOnly: true}}
                    sx={{ m: 1 }} 
                    id="tfPledgedPar" 
                    label="PledgedPar" 
                    variant="outlined"
                    value = { longDataParser(pld.body.par.toString()) }
                    size='small'
                  />                
                </td>
                <td >
                  <TextField 
                    fullWidth={true}
                    inputProps={{readOnly: true}}
                    sx={{ m: 1 }} 
                    id="tfGuaranteedAmount" 
                    label="GuaranteedAmount" 
                    variant="outlined"
                    value = { longDataParser(pld.body.guaranteedAmt.toString()) }
                    size='small'
                  />                
                </td>
              </tr>

              <tr>
                <td colSpan={3}>
                  <ActionsOfPledge 
                    seqOfShare={pld.head.seqOfShare} 
                    seqOfPld={pld.head.seqOfPld} 
                    setOpen={setOpen} 
                    getAllPledges={getAllPledges} 
                  />
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