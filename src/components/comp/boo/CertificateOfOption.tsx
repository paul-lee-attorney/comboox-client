import { 
  Button, 
  Chip, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  Stack, 
  TextField, 
  Typography
} from "@mui/material";

import { dateParser, longDataParser, longSnParser, splitStrArr } from "../../../scripts/toolsKit";

import { Dispatch, SetStateAction, useState } from "react";
import { statesOfOpt } from "../boc/terms/Options/ContentOfOpt";
import { OraclesList } from "./OraclesList";
import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { ActionsOfOption } from "./ActionsOfOption";
import { BriefsList } from "./BriefsList";
import { Brief, CheckPoint, OptWrap, comOps, logOps, typeOfOpts } from "../../../queries/boo";
import { useBookOfOptions, useBookOfOptionsGetAllBriefsOfOption, useBookOfOptionsGetAllOraclesOfOption } from "../../../generated";

export interface CertificateOfOptionProps{
  open: boolean;
  optWrap: OptWrap;
  setOpen: Dispatch<SetStateAction<boolean>>;
  getAllOpts: ()=>void;
}

export function CertificateOfOption({open, optWrap, setOpen, getAllOpts}: CertificateOfOptionProps) {

  const { boox } = useComBooxContext();

  const [ oracles, setOracles ] = useState<readonly CheckPoint[]>();
  
  const {
    refetch: getAllOracles
  } = useBookOfOptionsGetAllOraclesOfOption({
    address: boox ? boox[7] : undefined,
    args: [ BigInt(optWrap.opt.head.seqOfOpt) ],
    onSuccess(res) {
      if (res.length > 0)
        setOracles(res);
    }
  })

  const [ briefs, setBriefs ] = useState<readonly Brief[]>();
  
  const {
    refetch: getAllBriefs
  } = useBookOfOptionsGetAllBriefsOfOption({
    address: boox ? boox[7] : undefined,
    args: [ BigInt(optWrap.opt.head.seqOfOpt) ],
    onSuccess(res) {
      if (res.length > 0)
        setBriefs(res);
    }
  })

  return (
    <Dialog
      maxWidth={false}
      open={open}
      onClose={()=>setOpen(false)}
      aria-labelledby="dialog-title" 
    >
      <Stack direction='row' sx={{ alignItems:'center', justifyContent:'space-between' }} >
        <DialogTitle id="dialog-title" sx={{ ml:1, textDecoration:'underline' }} >
          <b>Certificate Of Option</b>
        </DialogTitle>

        <Typography variant="body1" sx={{ textDecoration:'underline', mx:5 }}>
          <b>Seq. { longSnParser(optWrap.opt.head.seqOfOpt.toString())}</b>
        </Typography>

      </Stack>                
      <DialogContent>
        <table width={980} >
          <thead />
          <tbody>
            <tr>
              <td>
                <TextField 
                  fullWidth
                  inputProps={{readOnly: true}}
                  sx={{ m: 1 }} 
                  id="tfTypeOfOpt" 
                  label="TypeOfOpt" 
                  variant="outlined"
                  value = { typeOfOpts[optWrap.opt.head.typeOfOpt] }
                  size='small'
                />
              </td>
              <td>
                <TextField 
                  fullWidth
                  inputProps={{readOnly: true}}
                  sx={{ m: 1 }} 
                  id="tfClassOfShare" 
                  label="ClassOfShare" 
                  variant="outlined"
                  value = { optWrap.opt.head.classOfShare }
                  size='small'
                />
              </td>
              <td>
                <TextField 
                  fullWidth
                  inputProps={{readOnly: true}}
                  sx={{ m: 1 }} 
                  id="tfRateOfOpt" 
                  label="RateOfOpt" 
                  variant="outlined"
                  value = { optWrap.opt.head.rate }
                  size='small'
                />
              </td>
              <td>
                <TextField 
                  fullWidth
                  inputProps={{readOnly: true}}
                  size='small'
                  sx={{ m: 1 }} 
                  id="tfStateOfOpt" 
                  label="StateOfOpt" 
                  variant="outlined"
                  value = { statesOfOpt[optWrap.opt.body.state] }
                />
              </td>

            </tr>

            <tr>
              <td>
                <TextField 
                  fullWidth
                  inputProps={{readOnly: true}}
                  sx={{ m: 1 }} 
                  id="tfIssueDate" 
                  label="IssueDate" 
                  variant="outlined"
                  value = { dateParser(optWrap.opt.head.issueDate) }
                  size='small'
                />
              </td>
              <td>
                <TextField 
                  fullWidth
                  inputProps={{readOnly: true}}
                  sx={{ m: 1 }} 
                  id="tfTriggerDate" 
                  label="TriggerDate" 
                  variant="outlined"
                  value = { dateParser(optWrap.opt.head.triggerDate) }
                  size='small'
                />                  
              </td>
              <td>
                <TextField 
                  fullWidth
                  inputProps={{readOnly: true}}
                  sx={{ m: 1 }} 
                  id="tfExecDeadline" 
                  label="ExecDeadline" 
                  variant="outlined"
                  value = { dateParser(optWrap.opt.head.triggerDate + optWrap.opt.head.execDays * 86400) }
                  size='small'
                />                  
              </td>
              <td>
                <TextField 
                  fullWidth
                  inputProps={{readOnly: true}}
                  sx={{ m: 1,  }} 
                  id="tfClosingDeadline" 
                  label="ClosingDeadline" 
                  variant="outlined"
                  value = { dateParser(optWrap.opt.body.closingDeadline) }
                  size='small'
                />
              </td>
            </tr>

            <tr>
              <td>
                <TextField 
                  fullWidth
                  inputProps={{readOnly: true}}
                  sx={{ m: 1,  }} 
                  id="tfPaid" 
                  label="Paid" 
                  variant="outlined"
                  value = { longDataParser(optWrap.opt.body.paid.toString()) }
                  size='small'
                />
              </td>
              <td>
                <TextField 
                  fullWidth
                  inputProps={{readOnly: true}}
                  sx={{ m: 1,  }} 
                  id="tfPar" 
                  label="Par" 
                  variant="outlined"
                  value = { longDataParser(optWrap.opt.body.par.toString()) }
                  size='small'
                />
              </td>
              <td>
                <TextField 
                  fullWidth
                  inputProps={{readOnly: true}}
                  sx={{ m: 1,  }} 
                  id="tfRightholder" 
                  label="Rightholder" 
                  variant="outlined"
                  value = { longSnParser(optWrap.opt.body.rightholder.toString()) }
                  size='small'
                />
              </td>
              <td>
                <TextField 
                  variant='outlined'
                  label='Obligors'
                  fullWidth
                  inputProps={{readOnly: true}}
                  size='small'
                  sx={{ m:1 }}
                  multiline
                  rows={1}
                  value={ splitStrArr(optWrap.obligors.map(v => longSnParser(v.toString()))) }
                />
              </td>
            </tr>

            {optWrap.opt.head.typeOfOpt > 3 && (
              <tr>
                <td >
                  <TextField 
                    fullWidth
                    inputProps={{readOnly: true}}
                    sx={{ m: 1 }} 
                    id="tfSeqOfCond" 
                    label="SeqOfCond" 
                    variant="outlined"
                    value = { longSnParser(optWrap.opt.cond.seqOfCond.toString()) }
                    size='small'
                  />                
                </td>
                <td >
                  <TextField 
                    fullWidth
                    inputProps={{readOnly: true}}
                    sx={{ m: 1 }} 
                    id="tfLogicOpr" 
                    label="LogicOperator" 
                    variant="outlined"
                    value = { logOps[optWrap.opt.cond.logicOpr] }
                    size='small'
                  />                
                </td>
                {optWrap.opt.cond.logicOpr > 0 && (
                  <td >
                      <TextField 
                        fullWidth
                        inputProps={{readOnly: true}}
                        sx={{ m: 1 }} 
                        id="tfCompOpr1" 
                        label="CompareOperator_1" 
                        variant="outlined"
                        value = { comOps[optWrap.opt.cond.compOpr1] }
                        size='small'
                      />                
                  </td>
                )}
                {optWrap.opt.cond.logicOpr > 0 && (
                  <td >
                    <TextField 
                      fullWidth
                      inputProps={{readOnly: true}}
                      sx={{ m: 1 }} 
                      id="tfPara1" 
                      label="Parameter_1" 
                      variant="outlined"
                      value = { longDataParser(optWrap.opt.cond.para1.toString()) }
                      size='small'
                    />                
                  </td>
                )}                
              </tr>
            )}

            <tr>
              {optWrap.opt.cond.logicOpr > 2 && (
                <>
                  <td >
                    <TextField 
                      fullWidth
                      inputProps={{readOnly: true}}
                      sx={{ m: 1 }} 
                      id="tfCompOpr2" 
                      label="CompareOperator_2" 
                      variant="outlined"
                      value = { comOps[optWrap.opt.cond.compOpr2] }
                      size='small'
                    />                
                  </td>
                  <td >
                    <TextField 
                      fullWidth
                      inputProps={{readOnly: true}}
                      sx={{ m: 1 }} 
                      id="tfPara1" 
                      label="Parameter_2" 
                      variant="outlined"
                      value = { longDataParser(optWrap.opt.cond.para2.toString()) }
                      size='small'
                    />                
                  </td>
                </>                
              )}
              {optWrap.opt.cond.logicOpr > 6 && (
                <>
                  <td >
                      <TextField 
                        fullWidth
                        inputProps={{readOnly: true}}
                        sx={{ m: 1 }} 
                        id="tfCompOpr3" 
                        label="CompareOperator_3" 
                        variant="outlined"
                        value = { comOps[optWrap.opt.cond.compOpr3] }
                        size='small'
                      />                
                  </td>
                  <td >
                    <TextField 
                      fullWidth
                      inputProps={{readOnly: true}}
                      sx={{ m: 1 }} 
                      id="tfPara1" 
                      label="Parameter_3" 
                      variant="outlined"
                      value = { longDataParser(optWrap.opt.cond.para3.toString()) }
                      size='small'
                    />                
                  </td>
                </>
              )}                
            </tr>

            <tr>
              <td colSpan={2}>
                {oracles && oracles.length > 0 && (
                  <OraclesList list={ oracles }  seqOfOpt={optWrap.opt.head.seqOfOpt}  />
                )}
              </td>
              <td colSpan={2}>
                {briefs && briefs.length > 0 && (
                  <BriefsList list={ briefs } seqOfOpt={optWrap.opt.head.seqOfOpt} />
                )}
              </td>
            </tr>

            <tr>
              <td colSpan={4}>
                <ActionsOfOption 
                  seqOfOpt={optWrap.opt.head.seqOfOpt} 
                  setOpen={setOpen} 
                  getAllOpts={getAllOpts} 
                />
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