
import { useEffect, useState } from 'react';

import { 
  Stack,
  TextField,
  Paper,
  Box,
  Collapse,
  Toolbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

import { Bytes32Zero, HexType } from '../../../../interfaces';
import { AddRule } from './AddRule';

import { longSnParser } from '../../../../scripts/toolsKit';
import { SetRuleProps } from './SetVotingRule';
import { useShareholdersAgreementGetRule } from '../../../../generated';

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

export function SetGroupUpdateOrder({ sha, seq, isFinalized, getRules }: SetRuleProps) {

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

  const [ newGuo, setNewGuo ] = useState<GroupUpdateOrder>(defaultOrder);

  const [ editable, setEditable ] = useState<boolean>(false);

  const {
    refetch: obtainRule
  } = useShareholdersAgreementGetRule({
    address: sha,
    args: [ BigInt(seq) ],
    onSuccess(res) {
      setNewGuo(guoParser(res))
    }
  })

  return (
    <>
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
            refreshRule={ obtainRule }
            editable={ editable }
            setEditable={ setEditable }
            isFinalized={isFinalized}
            getRules={ getRules }
          />
        </Stack>

        <Stack direction={'column'} spacing={1} >

          <Stack direction={'row'} sx={{ alignItems: 'center' }} >

            <TextField 
              variant='outlined'
              label='SeqOfRule'
              inputProps={{readOnly: true}}
              size="small"
              sx={{
                m:1,
                minWidth: 218,
              }}
              value={ newGuo.seqOfRule.toString() }
            />

            <TextField 
              variant='outlined'
              label='QtyOfSubRule'
              inputProps={{readOnly: true}}
              size="small"
              sx={{
                m:1,
                minWidth: 218,
              }}
              value={ newGuo.qtyOfSubRule.toString() }
            />

            <TextField 
              variant='outlined'
              label='SeqOfSubRule'
              inputProps={{readOnly: true}}
              size="small"
              sx={{
                m:1,
                minWidth: 218,
              }}
              value={ newGuo.seqOfSubRule.toString() }
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
              value={ newGuo.addMember ? 'True' : 'False' }
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
              value={ longSnParser(newGuo.groupRep.toString()) }
            />

          </Stack>

          <Collapse in={ editable && !isFinalized } >
            <Stack direction={'row'} sx={{ alignItems: 'center', backgroundColor:'lightcyan' }} >

              <TextField 
                variant='outlined'
                label='SeqOfRule'
                size="small"
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                onChange={(e) => setObjGuo((v) => ({
                  ...v,
                  seqOfRule: parseInt(e.target.value),
                }))}
                value={ objGuo.seqOfRule }
              />

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

              <TextField 
                variant='outlined'
                label='SeqOfSubRule'
                size="small"
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                onChange={(e) => setObjGuo((v) => ({
                  ...v,
                  seqOfSubRule: parseInt(e.target.value),
                }))}
                value={ objGuo.seqOfSubRule }
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
          </Collapse>

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
              value={ longSnParser(newGuo.members[0].toString()) }
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
              value={ longSnParser(newGuo.members[1].toString()) }
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
              value={ longSnParser(newGuo.members[2].toString()) }
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
              value={ longSnParser(newGuo.members[3].toString()) }
            />

          </Stack>

          <Collapse in={ editable && !isFinalized } >
            <Stack direction={'row'} sx={{ alignItems: 'center', backgroundColor:'lightcyan' }} >

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
          </Collapse>

        </Stack>
      </Paper>
    </> 
  )
}
