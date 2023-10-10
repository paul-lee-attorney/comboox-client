
import { useEffect, useState } from 'react';
import { 
  Stack,
  TextField,
  Paper,
  Box,
  Toolbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogContent,
} from '@mui/material';
import { HexType } from '../../../../../scripts/common';
import { AddRule } from '../AddRule';
import { longSnParser } from '../../../../../scripts/common/toolsKit';
import { RulesEditProps } from '../GovernanceRules/SetGovernanceRule';
import { getRule } from '../../../../../scripts/comp/sha';
import { ListAlt } from '@mui/icons-material';

export interface GroupUpdateOrder {
  seqOfRule: number;
  qtyOfSubRule: number;
  seqOfSubRule: number;
  addMember: boolean;
  groupRep: number;
  members: number[];
  para: number;
}

export function guoCodifier(order: GroupUpdateOrder):HexType {
  let hexGuo: HexType = `0x${
    (order.seqOfRule.toString(16).padStart(4, '0')) +
    (order.qtyOfSubRule.toString(16).padStart(2, '0')) +
    (order.seqOfSubRule.toString(16).padStart(2, '0')) +
    (order.addMember ? '01' : '00') +
    (order.groupRep.toString(16).padStart(10, '0')) +
    (order.members[0].toString(16).padStart(10, '0')) +
    (order.members[1].toString(16).padStart(10, '0')) +
    (order.members[2].toString(16).padStart(10, '0')) +
    (order.members[3].toString(16).padStart(10, '0')) +
    (order.para.toString(16).padStart(4, '0'))
  }`;

  return hexGuo;
}

export function guoParser(hexOrder: HexType): GroupUpdateOrder {
  let order: GroupUpdateOrder = {
    seqOfRule: parseInt(hexOrder.substring(2, 6), 16), 
    qtyOfSubRule: parseInt(hexOrder.substring(6, 8), 16),
    seqOfSubRule: parseInt(hexOrder.substring(8, 10), 16),
    addMember: hexOrder.substring(10, 12) === '01',
    groupRep: parseInt(hexOrder.substring(12, 22), 16),
    members: [
      parseInt(hexOrder.substring(22, 32), 16),
      parseInt(hexOrder.substring(32, 42), 16),
      parseInt(hexOrder.substring(42, 52), 16),
      parseInt(hexOrder.substring(52, 62), 16),
    ],
    para: parseInt(hexOrder.substring(62, 66), 16),
  }

  return order;
}

export function SetGroupUpdateOrder({ sha, seq, isFinalized, time, setTime }: RulesEditProps) {

  const defaultOrder: GroupUpdateOrder = {
    seqOfRule: seq,
    qtyOfSubRule: seq - 767,
    seqOfSubRule: seq - 767,
    addMember: true,
    groupRep: 0,
    members: [0, 0, 0, 0],
    para: 0,    
  };

  const [ objGuo, setObjGuo ] = useState<GroupUpdateOrder>(defaultOrder); 
  const [ open, setOpen ] = useState<boolean>(false);

  useEffect(()=>{
    getRule(sha, seq).then(
      res => setObjGuo(guoParser(res))
    );
  }, [sha, seq, time]);

  return (
    <>
      <Button
        variant={objGuo && objGuo.groupRep > 0 ? 'contained' : 'outlined'}
        startIcon={<ListAlt />}
        fullWidth={true}
        sx={{ m:0.5, minWidth: 248, justifyContent:'start' }}
        onClick={()=>setOpen(true)}      
      >
        Rule No. { seq } 
      </Button>

      <Dialog
        maxWidth={false}
        open={open}
        onClose={()=>setOpen(false)}
        aria-labelledby="dialog-title"        
      >
        <DialogContent>

          <Paper 
            elevation={3} 
            sx={{
              alignContent:'center', 
              justifyContent:'center', 
              p:1, m:1, 
              border: 1, 
              borderColor:'divider' 
              }} 
          >
            <Stack direction={'row'} sx={{ justifyContent: 'space-between', alignItems: 'center' }} >        
              <Box sx={{ minWidth:600 }} >
                <Toolbar>
                  <h4>Rule No. { seq.toString() } </h4>
                </Toolbar>
              </Box>

              <AddRule 
                sha={ sha }
                rule={ guoCodifier(objGuo) }
                isFinalized = { isFinalized }
                setTime = { setTime }
                setOpen = { setOpen }
              />
            </Stack>

            <Stack direction={'column'} spacing={1} >

              {isFinalized && (
                <Stack direction={'row'} sx={{ alignItems: 'center' }} >

                  <TextField 
                    variant='outlined'
                    label='QtyOfSubRule'
                    inputProps={{readOnly: true}}
                    size="small"
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={ objGuo.qtyOfSubRule.toString() }
                  />

                  <TextField 
                    variant='outlined'
                    label='AddMember ?'
                    inputProps={{readOnly: true}}
                    size="small"
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={ objGuo.addMember ? 'True' : 'False' }
                  />

                  <TextField 
                    variant='outlined'
                    label='GroupRep'
                    inputProps={{readOnly: true}}
                    size="small"
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={ longSnParser(objGuo.groupRep.toString()) }
                  />

                </Stack>
              )}

              {!isFinalized && (
                <Stack direction={'row'} sx={{ alignItems: 'center' }} >

                  <TextField 
                    variant='outlined'
                    label='QtyOfSubRule'
                    size="small"
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    onChange={(e) => setObjGuo((v) => ({
                      ...v,
                      qtyOfSubRule: parseInt(e.target.value),
                    }))}
                    value={ objGuo.qtyOfSubRule }              
                  />

                  <FormControl variant="outlined" size="small" sx={{ m: 1, minWidth: 218 }}>
                    <InputLabel id="addMember-label">AddMember ?</InputLabel>
                    <Select
                      labelId="addMember-label"
                      id="addMember-select"
                      label="AddMember ?"
                      value={ objGuo.addMember ? '1' : '0' }
                      onChange={(e) => setObjGuo((v) => ({
                        ...v,
                        addMember: e.target.value == '1',
                      }))}
                    >
                      <MenuItem value={ '1' } > True </MenuItem>
                      <MenuItem value={ '0' } > False </MenuItem>
                    </Select>
                  </FormControl>

                  <TextField 
                    variant='outlined'
                    label='GroupRep'
                    size="small"
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    onChange={(e) => setObjGuo((v) => ({
                      ...v,
                      groupRep: parseInt(e.target.value),
                    }))}
                    value={ objGuo.groupRep }
                  />

                </Stack>
              )}

              {isFinalized && (
                <Stack direction={'row'} sx={{ alignItems: 'center' }} >

                  <TextField 
                    variant='outlined'
                    label='Members_1'
                    inputProps={{readOnly: true}}
                    size="small"
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={ longSnParser(objGuo.members[0].toString()) }
                  />

                  <TextField 
                    variant='outlined'
                    label='Members_2'
                    inputProps={{readOnly: true}}
                    size="small"
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={ longSnParser(objGuo.members[1].toString()) }
                  />

                  <TextField 
                    variant='outlined'
                    label='Members_3'
                    inputProps={{readOnly: true}}
                    size="small"
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={ longSnParser(objGuo.members[2].toString()) }
                  />

                  <TextField 
                    variant='outlined'
                    label='Members_4'
                    inputProps={{readOnly: true}}
                    size="small"
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    value={ longSnParser(objGuo.members[3].toString()) }
                  />

                </Stack>
              )}

              {!isFinalized && (
                <Stack direction={'row'} sx={{ alignItems: 'center' }} >

                  <TextField 
                    variant='outlined'
                    label='Members_1'
                    size="small"
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    onChange={(e) => setObjGuo((v) => {
                      let arr = [...v.members];
                      arr[0] = parseInt(e.target.value);
                      return {
                        ...v,
                        members: arr,
                      };
                    })}
                    value={ objGuo.members[0] }
                  />

                  <TextField 
                    variant='outlined'
                    label='Members_2'
                    size="small"
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    onChange={(e) => setObjGuo((v) => {
                      let arr = [...v.members];
                      arr[1] = parseInt(e.target.value);
                      return {
                        ...v,
                        members: arr,
                      };
                    })}
                    value={ objGuo.members[1] }
                  />

                  <TextField 
                    variant='outlined'
                    label='Members_3'
                    size="small"
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    onChange={(e) => setObjGuo((v) => {
                      let arr = [...v.members];
                      arr[2] = parseInt(e.target.value);
                      return {
                        ...v,
                        members: arr,
                      };
                    })}
                    value={ objGuo.members[2] }
                  />

                  <TextField 
                    variant='outlined'
                    label='Members_4'
                    size="small"
                    sx={{
                      m:1,
                      minWidth: 218,
                    }}
                    onChange={(e) => setObjGuo((v) => {
                      let arr = [...v.members];
                      arr[3] = parseInt(e.target.value);
                      return {
                        ...v,
                        members: arr,
                      };
                    })}
                    value={ objGuo.members[3] }
                  />

                </Stack>
              )}

            </Stack>
          </Paper>

        </DialogContent>
      </Dialog>
    </> 
  )
}
