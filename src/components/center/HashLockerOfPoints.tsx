import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { Locker } from "../../queries/rc";
import { dateParser, longDataParser, longSnParser } from "../../scripts/toolsKit";
import { AddrZero } from "../../interfaces";


export interface HashLockerOfPointsProps{
  open: boolean,
  locker: Locker,
  setOpen: (flag: boolean)=>void,
  refreshList: ()=>any,
}

export function HashLockerOfPoints({open, locker, setOpen, refreshList}: HashLockerOfPointsProps) {

  return (
    <Dialog
      maxWidth={false}
      open={open}
      onClose={()=>setOpen(false)}
      aria-labelledby="dialog-title" 
    >
      <DialogTitle id="dialog-title" >
        {"Hash Locker of ComBooxPoints"}
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
                    id="tfHashLock" 
                    label="HashLock" 
                    variant="outlined"
                    value = { locker.hashLock }
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
                    id="tfFrom" 
                    label="From" 
                    variant="outlined"
                    value = { longSnParser(locker.head.from.toString()) }
                    size='small'
                  />
                </td>
                <td >
                  <TextField 
                    fullWidth={true}
                    inputProps={{readOnly: true}}
                    sx={{ m: 1 }} 
                    id="tfTo" 
                    label="To" 
                    variant="outlined"
                    value = { longSnParser(locker.head.to.toString()) }
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
                    value = { dateParser(locker.head.expireDate) }
                    size='small'
                  />
                </td>                            
              </tr>

              <tr>
                <td colSpan={3}>
                  <TextField 
                    fullWidth={true}
                    inputProps={{readOnly: true}}
                    sx={{ m: 1 }} 
                    id="tfAmount" 
                    label="Amount" 
                    variant="outlined"
                    value = { longDataParser(locker.head.value.toString()) }
                    size='small'
                  />
                </td>

              </tr>

              {locker.body.counterLocker != AddrZero && (
                <tr>
                  <td colSpan={2}>
                    <TextField 
                      fullWidth={true}
                      inputProps={{readOnly: true}}
                      sx={{ m: 1,  }} 
                      id="tfCounterLockerAddress" 
                      label="CounterLockerAddress" 
                      variant="outlined"
                      value = { locker.body.counterLocker }
                      size='small'
                    />
                  </td>
                  <td>
                    <TextField 
                      fullWidth={true}
                      inputProps={{readOnly: true}}
                      sx={{ m: 1,  }} 
                      id="tfFunctionSelector" 
                      label="FunctionSelector" 
                      variant="outlined"
                      value = { locker.body.selector }
                      size='small'
                    />                  
                  </td>
                </tr>
              )}


            </tbody>
          </table>

      </DialogContent>
      <DialogActions>
        <Button onClick={()=>setOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>

  )
}