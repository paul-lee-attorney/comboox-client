import { useState } from "react";

import { 
  Stack,
  Paper,
  Toolbar,
  TextField,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Chip,
} from "@mui/material";

import {
  ListAlt,
} from "@mui/icons-material"

import { Option, typeOfOpts } from "./Options";
import { dateParser, longDataParser, longSnParser } from "../../../../../scripts/toolsKit";

export const optStates = ['Pending', 'Issued', 'Executed', 'Closed'];

interface ContentOfOptProps {
  opt: Option; 
}

export function ContentOfOpt({ opt }: ContentOfOptProps) {

  const [ open, setOpen ] = useState (false);

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<ListAlt />}
        sx={{ m:0.5, minWidth: 248, justifyContent:'start' }}
        onClick={()=>setOpen(true)}      
      >
        Content Of Option 
      </Button>

      <Dialog
        maxWidth={false}
        open={open}
        onClose={()=>setOpen(false)}
        aria-labelledby="dialog-title"        
      >

        <DialogContent>

          <Toolbar>
            <h4> Head Of Option </h4>
          </Toolbar>

          <Paper elevation={3} sx={{ m:1 , p:1, border:1, borderColor:'divider' }}>

            <Stack direction='column' spacing={1} >

              <Stack direction={'row'} sx={{ alignItems: 'center' }} >

                <TextField 
                  variant='filled'
                  label='TypeOfOption'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ typeOfOpts[opt.head.typeOfOpt] }              
                />

                <TextField 
                  variant='filled'
                  label='ClassOfShare'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ opt.head.classOfShare }
                />

                <TextField 
                  variant='filled'
                  label='RateOfOption'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ longDataParser(opt.head.rate.toString()) }              
                />

                <TextField 
                  variant='filled'
                  label='Rightholder'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ longSnParser(opt.body.rightholder.toString()) }              
                />

                <TextField 
                  variant='filled'
                  label='Paid'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ longDataParser(opt.body.paid.toString()) }              
                />

                <TextField 
                  variant='filled'
                  label='Par'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ longDataParser(opt.body.par.toString()) }              
                />

              </Stack>

              <Stack direction={'row'} sx={{ alignItems: 'center' }} >

                <TextField 
                  variant='filled'
                  label='IssueDate'
                  inputProps={{readOnly:true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ dateParser(opt.head.issueDate ?? '0') }
                />

                <TextField 
                  variant='filled'
                  label='TriggerDate'
                  inputProps={{readOnly:true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ dateParser(opt.head.triggerDate ?? '0') }
                />

                <TextField 
                  variant='filled'
                  label='ExecDays'
                  inputProps={{readOnly:true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ opt.head.execDays }              
                />

                <TextField 
                  variant='filled'
                  label='ClosingDays'
                  inputProps={{readOnly:true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ opt.head.closingDays }              
                />

                <TextField 
                  variant='filled'
                  label='ClosingDeadline'
                  inputProps={{readOnly:true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ dateParser(opt.body.closingDeadline ?? '0') }
                />

                <Chip
                  variant='filled'
                  label={ optStates[opt.body.state] }
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
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

            </Stack>

          </Paper>

        </DialogContent>

        <DialogActions>
          <Button onClick={()=>setOpen(false)}>Close</Button>
        </DialogActions>

      </Dialog>
  
    </>
  );
} 

