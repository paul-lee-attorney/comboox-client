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
import { Option, comOps, logOps, typeOfOpts } from "../boc/terms/Options/Options";
import { Dispatch, SetStateAction } from "react";
import { optStates } from "../boc/terms/Options/ContentOfOpt";
import { OraclesList } from "./OraclesList";
import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { ActionsOfOption } from "./ActionsOfOption";
import { BriefsList } from "./BriefsList";

export interface CertificateOfOptionProps{
  open: boolean;
  opt: Option;
  setOpen: Dispatch<SetStateAction<boolean>>;
  getAllOpts: ()=>void;
}

export function CertificateOfOption({open, opt, setOpen, getAllOpts}: CertificateOfOptionProps) {

  const {boox} = useComBooxContext();

  return (
    <Dialog
      maxWidth={false}
      open={open}
      onClose={()=>setOpen(false)}
      aria-labelledby="dialog-title" 
    >
      <Stack direction='row' sx={{ alignItems:'center', justifyContent:'space-between' }} >
        <DialogTitle id="dialog-title" sx={{ ml:1, textDecoration:'underline' }} >
          {"Certificate Of Option"} 
        </DialogTitle>
        <Chip
          sx={{ m:1, mr:5, width: 120 }} 
          label={ optStates[opt.body.state] } 
          variant='filled' 
          color={
            opt.body.state == 0
            ? 'default'
            : opt.body.state == 1
              ? 'info'
              : opt.body.state == 2
                ? 'primary'
                : 'success'
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
                  id="tfSeqOfOpt" 
                  label="SeqOfOpt" 
                  variant="outlined"
                  value = { longSnParser(opt.head.seqOfOpt.toString()) }
                  size='small'
                />
              </td>
              <td>
                <TextField 
                  fullWidth={true}
                  inputProps={{readOnly: true}}
                  sx={{ m: 1 }} 
                  id="tfTypeOfOpt" 
                  label="TypeOfOpt" 
                  variant="outlined"
                  value = { typeOfOpts[opt.head.typeOfOpt] }
                  size='small'
                />
              </td>
              <td>
                <TextField 
                  fullWidth={true}
                  inputProps={{readOnly: true}}
                  sx={{ m: 1 }} 
                  id="tfClassOfShare" 
                  label="ClassOfShare" 
                  variant="outlined"
                  value = { opt.head.classOfShare }
                  size='small'
                />
              </td>
              <td>
                <TextField 
                  fullWidth={true}
                  inputProps={{readOnly: true}}
                  sx={{ m: 1 }} 
                  id="tfRateOfOpt" 
                  label="RateOfOpt" 
                  variant="outlined"
                  value = { opt.head.rate }
                  size='small'
                />
              </td>
            </tr>

            <tr>
              <td>
                <TextField 
                  fullWidth={true}
                  inputProps={{readOnly: true}}
                  sx={{ m: 1 }} 
                  id="tfIssueDate" 
                  label="IssueDate" 
                  variant="outlined"
                  value = { dateParser(opt.head.issueDate) }
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
                  value = { dateParser(opt.head.triggerDate) }
                  size='small'
                />                  
              </td>
              <td>
                <TextField 
                  fullWidth={true}
                  inputProps={{readOnly: true}}
                  sx={{ m: 1 }} 
                  id="tfExecDeadline" 
                  label="ExecDeadline" 
                  variant="outlined"
                  value = { dateParser(opt.head.triggerDate + opt.head.execDays * 86400) }
                  size='small'
                />                  
              </td>
              <td>
                <TextField 
                  fullWidth={true}
                  inputProps={{readOnly: true}}
                  sx={{ m: 1 }} 
                  id="tfClosingDays" 
                  label="ClosingDays" 
                  variant="outlined"
                  value = { opt.head.closingDays }
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
                  id="tfClosingDeadline" 
                  label="ClosingDeadline" 
                  variant="outlined"
                  value = { dateParser(opt.body.closingDeadline) }
                  size='small'
                />
              </td>
              <td>
                <TextField 
                  fullWidth={true}
                  inputProps={{readOnly: true}}
                  sx={{ m: 1,  }} 
                  id="tfRightholder" 
                  label="Rightholder" 
                  variant="outlined"
                  value = { longSnParser(opt.body.rightholder.toString()) }
                  size='small'
                />
              </td>
              <td>
                <TextField 
                  fullWidth={true}
                  inputProps={{readOnly: true}}
                  sx={{ m: 1,  }} 
                  id="tfPaid" 
                  label="Paid" 
                  variant="outlined"
                  value = { longDataParser(opt.body.paid.toString()) }
                  size='small'
                />
              </td>
              <td>
                <TextField 
                  fullWidth={true}
                  inputProps={{readOnly: true}}
                  sx={{ m: 1,  }} 
                  id="tfPar" 
                  label="Par" 
                  variant="outlined"
                  value = { longDataParser(opt.body.par.toString()) }
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
                  id="tfSeqOfCond" 
                  label="SeqOfCond" 
                  variant="outlined"
                  value = { longSnParser(opt.cond.seqOfCond.toString()) }
                  size='small'
                />                
              </td>
              <td >
                <TextField 
                  fullWidth={true}
                  inputProps={{readOnly: true}}
                  sx={{ m: 1 }} 
                  id="tfLogicOpr" 
                  label="LogicOperator" 
                  variant="outlined"
                  value = { logOps[opt.cond.logicOpr] }
                  size='small'
                />                
              </td>
              <td >
                {opt.cond.logicOpr > 0 && (
                  <TextField 
                    fullWidth={true}
                    inputProps={{readOnly: true}}
                    sx={{ m: 1 }} 
                    id="tfCompOpr1" 
                    label="CompareOperator_1" 
                    variant="outlined"
                    value = { comOps[opt.cond.compOpr1] }
                    size='small'
                  />                
                )}
              </td>
              <td >
                {opt.cond.logicOpr > 0 && (
                  <TextField 
                    fullWidth={true}
                    inputProps={{readOnly: true}}
                    sx={{ m: 1 }} 
                    id="tfPara1" 
                    label="Parameter_1" 
                    variant="outlined"
                    value = { longDataParser(opt.cond.para1.toString()) }
                    size='small'
                  />                
                )}
              </td>                
            </tr>

            <tr>
              <td >
                {opt.cond.logicOpr > 2 && (
                  <TextField 
                    fullWidth={true}
                    inputProps={{readOnly: true}}
                    sx={{ m: 1 }} 
                    id="tfCompOpr2" 
                    label="CompareOperator_2" 
                    variant="outlined"
                    value = { comOps[opt.cond.compOpr2] }
                    size='small'
                  />                
                )}
              </td>
              <td >
                {opt.cond.logicOpr > 2 && (
                  <TextField 
                    fullWidth={true}
                    inputProps={{readOnly: true}}
                    sx={{ m: 1 }} 
                    id="tfPara1" 
                    label="Parameter_2" 
                    variant="outlined"
                    value = { longDataParser(opt.cond.para2.toString()) }
                    size='small'
                  />                
                )}
              </td>                
              <td >
                {opt.cond.logicOpr > 6 && (
                  <TextField 
                    fullWidth={true}
                    inputProps={{readOnly: true}}
                    sx={{ m: 1 }} 
                    id="tfCompOpr3" 
                    label="CompareOperator_3" 
                    variant="outlined"
                    value = { comOps[opt.cond.compOpr3] }
                    size='small'
                  />                
                )}
              </td>
              <td >
                {opt.cond.logicOpr > 6 && (
                  <TextField 
                    fullWidth={true}
                    inputProps={{readOnly: true}}
                    sx={{ m: 1 }} 
                    id="tfPara1" 
                    label="Parameter_3" 
                    variant="outlined"
                    value = { longDataParser(opt.cond.para3.toString()) }
                    size='small'
                  />                
                )}
              </td>                
            </tr>

            <tr>
              <td colSpan={2}>
                {boox && (
                  <OraclesList addr={boox[7]}  seqOfOpt={opt.head.seqOfOpt}  />
                )}
              </td>
              <td colSpan={2}>
                {boox && (
                  <BriefsList addr={boox[7]} seqOfOpt={opt.head.seqOfOpt} />
                )}
              </td>
            </tr>

            <tr>
              <td colSpan={4}>
                <ActionsOfOption 
                  seqOfOpt={opt.head.seqOfOpt} 
                  setOpen={setOpen} 
                  getAllOpts={getAllOpts} 
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