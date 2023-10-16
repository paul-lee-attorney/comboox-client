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
} from "@mui/material";

import {
  ListAlt,
} from "@mui/icons-material"

import { dateParser, longDataParser, toPercent } from "../../../../../scripts/common/toolsKit";
import { LinkRule, triggerTypes } from "../../../../../scripts/comp/da";

interface LinkRuleProps {
  rule: LinkRule
}

export function LinkRule({ rule }: LinkRuleProps) {

  const [ open, setOpen ] = useState (false);

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<ListAlt />}
        sx={{ 
          m:1, minWidth: 218, 
          justifyContent:'start',
        }}
        onClick={()=>setOpen(true)}      
      >
        Link Rule 
      </Button>

      <Dialog
        maxWidth={false}
        open={open}
        onClose={()=>setOpen(false)}
        aria-labelledby="dialog-title"        
      >

        <DialogContent>

          <Toolbar sx={{ textDecoration:'underline' }}>
            <h4> Along Link Rule </h4>
          </Toolbar>

          <Paper elevation={3} sx={{ m:1 , p:1, border:1, borderColor:'divider' }}>

            <Stack direction='column' spacing={1} >

              <Stack direction={'row'} sx={{ alignItems: 'center' }} >

                <TextField 
                  variant='outlined'
                  label='TriggerDate'
                  size="small"
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ dateParser(rule.triggerDate.toString()) }              
                />
                
                <TextField 
                  variant='outlined'
                  label='EffectiveDays'
                  inputProps={{readOnly: true}}
                  size="small"
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ rule.effectiveDays }              
                />

                <TextField 
                  variant='outlined'
                  label='ShareRatioThreshold (BP)'
                  inputProps={{readOnly: true}}
                  size="small"
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ toPercent(rule.shareRatioThreshold.toString()) }              
                />

                <TextField 
                  variant='outlined'
                  inputProps={{readOnly: true}}
                  label='Rate'
                  size="small"
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ longDataParser(rule.rate.toString()) }              
                />

              </Stack>

              <Stack direction={'row'} sx={{ alignItems: 'center' }} >

                <TextField 
                  variant='outlined'
                  inputProps={{readOnly: true}}
                  label='TypeOfTrigger'
                  size="small"
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ triggerTypes[Number(rule.triggerType)] }              
                />

                <TextField 
                  variant='outlined'
                  inputProps={{readOnly: true}}
                  label='ProRata ?'
                  size="small"
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ rule.proRata ? 'True' : 'False' }              
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

