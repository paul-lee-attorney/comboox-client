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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import {
  ListAlt,
} from "@mui/icons-material"

import { LinkRule, triggerTypes } from "./DragAlong";
import { dateParser, longDataParser, toPercent } from "../../../../../scripts/toolsKit";

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
        sx={{ m:0.5, minWidth: 248, justifyContent:'start' }}
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

          <Toolbar>
            <h4> Along Link Rule </h4>
          </Toolbar>

          <Paper elevation={3} sx={{ m:1 , p:1, border:1, borderColor:'divider' }}>

            <Stack direction='column' spacing={1} >

              <Stack direction={'row'} sx={{ alignItems: 'center' }} >

                <TextField 
                  variant='filled'
                  label='TriggerDate'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ dateParser(rule.triggerDate) }              
                />
                
                <TextField 
                  variant='filled'
                  label='EffectiveDays'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ rule.effectiveDays }              
                />

                <TextField 
                  variant='filled'
                  label='ShareRatioThreshold'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ toPercent(rule.shareRatioThreshold) }              
                />

                <TextField 
                  variant='filled'
                  inputProps={{readOnly: true}}
                  label='Rate'
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ longDataParser(rule.rate.toString()) }              
                />

              </Stack>

              <Stack direction={'row'} sx={{ alignItems: 'center', backgroundColor:'lightcyan' }} >

                <FormControl variant="filled" sx={{ m: 1, minWidth: 218 }}>
                  <InputLabel id="triggerType-label">TypeOfTrigger ?</InputLabel>
                  <Select
                    labelId="triggerType-label"
                    inputProps={{readOnly:true}}
                    id="triggerType-select"
                    value={ rule.triggerType }
                  >
                    {triggerTypes.map((v, i) => (
                      <MenuItem key={i} value={ i } >{ v }</MenuItem>  
                    ))}
                  </Select>
                </FormControl>

                <FormControl variant="filled" sx={{ m: 1, minWidth: 218 }}>
                  <InputLabel id="proRata-label">ProRata ?</InputLabel>
                  <Select
                    labelId="proRata-label"
                    inputProps={{readOnly:true}}                    
                    id="proRata-select"
                    value={ rule.proRata ? '1' : '0' }
                  >
                    <MenuItem value={ '1' } > True </MenuItem>  
                    <MenuItem value={ '0' } > False </MenuItem>  
                  </Select>
                </FormControl>

                <FormControl variant="filled" sx={{ m: 1, minWidth: 218 }}>
                  <InputLabel id="typeOfFollowers-label">TypeOfFollowers</InputLabel>
                  <Select
                    labelId="typeOfFollowers-label"
                    id="typeOfFollowers-select"
                    inputProps={{readOnly:true}}
                    value={ rule.typeOfFollowers }
                  >
                    <MenuItem value={ '1' } >Rest All Members</MenuItem>  
                    <MenuItem value={ '0' } >Specified Members</MenuItem>  
                  </Select>
                </FormControl>                      

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

