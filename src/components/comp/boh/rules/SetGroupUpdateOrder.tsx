
import { useState } from 'react';

import { 
  Stack,
  TextField,
  Paper,
  Checkbox,
  FormControlLabel,
  Box,
  Collapse,
  Toolbar,
} from '@mui/material';

import { Bytes32Zero, HexType } from '../../../../interfaces';
import { AddRule } from './AddRule';

import { SetShaRuleProps } from '../../../../interfaces';

interface GroupUpdateOrderType {
  seqOfRule?: number | undefined;
  qtyOfSubRule?: number | undefined;
  seqOfSubRule?: number | undefined;
  addMember?: boolean | undefined;
  groupRep?: number | undefined;
  members1?: number | undefined;
  members2?: number | undefined;
  members3?: number | undefined;
  members4?: number | undefined;
}

export function SetGroupUpdateOrder({ sha, qty, seq, finalized }: SetShaRuleProps) {
  const [ objGuo, setObjGuo ] = useState<GroupUpdateOrderType>(); 

  let hexGuo: HexType = `0x${
    (objGuo?.seqOfRule?.toString(16).padStart(4, '0') ?? seq.toString(16).padStart(4, '0')) +
    (objGuo?.qtyOfSubRule?.toString(16).padStart(2, '0') ?? qty.toString(16).padStart(2, '0')) +
    (objGuo?.seqOfSubRule?.toString(16).padStart(2, '0') ?? (seq - 767).toString(16).padStart(2, '0')) +
    (objGuo?.addMember ? '01' : '00') +
    (objGuo?.groupRep?.toString(16).padStart(10, '0') ?? '0'.padStart(10, '0')) +
    (objGuo?.members1?.toString(16).padStart(10, '0') ?? '0'.padStart(10, '0')) +
    (objGuo?.members2?.toString(16).padStart(10, '0') ?? '0'.padStart(10, '0')) +
    (objGuo?.members3?.toString(16).padStart(10, '0') ?? '0'.padStart(10, '0')) +
    (objGuo?.members4?.toString(16).padStart(10, '0') ?? '0'.padStart(10, '0')) +
    '0'.padStart(4, '0')
  }`;

  // console.log('objGuo: ', objGuo);

  const [ newHexGuo, setNewHexGuo ] = useState<HexType>(Bytes32Zero);

  let newGuo: GroupUpdateOrderType = {
    seqOfRule: parseInt(newHexGuo.substring(2, 6), 16), 
    qtyOfSubRule: parseInt(newHexGuo.substring(6, 8), 16),
    seqOfSubRule: parseInt(newHexGuo.substring(8, 10), 16),
    addMember: newHexGuo.substring(10, 12) === '01',
    groupRep: parseInt(newHexGuo.substring(12, 22), 16),
    members1: parseInt(newHexGuo.substring(22, 32), 16),
    members2: parseInt(newHexGuo.substring(32, 42), 16),
    members3: parseInt(newHexGuo.substring(42, 52), 16),
    members4: parseInt(newHexGuo.substring(52, 62), 16),
  };

  // console.log('newGuo: ', newGuo);

  const [ editable, setEditable ] = useState<boolean>(false); 

  return (
    <>
      <Paper sx={{
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
            rule={ hexGuo }
            setUpdatedRule={ setNewHexGuo }
            editable={ editable }
            setEditable={ setEditable }
            finalized={finalized}
          />
        </Stack>


        <Stack 
          direction={'column'} 
          spacing={1} 
        >

          <Stack direction={'row'} sx={{ alignItems: 'center' }} >
            {newGuo?.seqOfRule != undefined && (
              <TextField 
                variant='filled'
                label='SeqOfRule'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={ newGuo.seqOfRule.toString() }
              />
            )}

            {newGuo?.qtyOfSubRule != undefined && (
              <TextField 
                variant='filled'
                label='QtyOfSubRule'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={ newGuo.qtyOfSubRule.toString() }
              />
            )}

            {newGuo?.seqOfSubRule != undefined && (
              <TextField 
                variant='filled'
                label='SeqOfSubRule'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={ newGuo.seqOfSubRule.toString() }
              />
            )}

            {newGuo?.addMember != undefined && (
              <TextField 
                variant='filled'
                label='AddMember'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={ newGuo.addMember ? 'True' : 'False' }
              />
            )}

            {newGuo?.groupRep != undefined && (
              <TextField 
                variant='filled'
                label='GroupRep'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={ newGuo.groupRep.toString() }
              />
            )}

          </Stack>

          <Collapse in={ editable && !finalized } >
            <Stack direction={'row'} sx={{ alignItems: 'center', backgroundColor:'lightcyan' }} >
              {/* <Collapse in={ false } >   */}            

              <TextField 
                variant='filled'
                label='SeqOfRule'
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                onChange={(e) => setObjGuo((v) => ({
                  ...v,
                  seqOfRule: parseInt(e.target.value),
                }))}
                value={ objGuo?.seqOfRule }
              />

              <TextField 
                variant='filled'
                label='QtyOfSubRule'
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                onChange={(e) => setObjGuo((v) => ({
                  ...v,
                  qtyOfSubRule: parseInt(e.target.value),
                }))}
                value={ objGuo?.qtyOfSubRule }              
              />

              <TextField 
                variant='filled'
                label='SeqOfSubRule'
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                onChange={(e) => setObjGuo((v) => ({
                  ...v,
                  seqOfSubRule: parseInt(e.target.value),
                }))}
                value={ objGuo?.seqOfSubRule }
              />

              <Box sx={{ minWidth: 218, m: 1 }} >
                <FormControlLabel 
                  label='AddMember'
                  control={
                    <Checkbox 
                      sx={{
                        m: 1,
                        height: 64,
                      }}
                      onChange={e => setObjGuo(v => ({
                        ...v,
                        membersEqual: e.target.checked,
                      }))}
                      checked={ objGuo?.addMember }
                    />
                  }
                />
              </Box>

              <TextField 
                variant='filled'
                label='GroupRep'
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                onChange={(e) => setObjGuo((v) => ({
                  ...v,
                  groupRep: parseInt(e.target.value),
                }))}
                value={ objGuo?.groupRep }
              />

            </Stack>
          </Collapse>

          <Stack direction={'row'} sx={{ alignItems: 'center' }} >

            {newGuo?.members1 != undefined && (
              <TextField 
                variant='filled'
                label='Members_1'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={ newGuo.members1.toString() }
              />
            )}

            {newGuo?.members2 != undefined && (
              <TextField 
                variant='filled'
                label='Members_2'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={ newGuo.members2.toString() }
              />
            )}

            {newGuo?.members3 != undefined && (
              <TextField 
                variant='filled'
                label='Members_3'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={ newGuo.members3.toString() }
              />
            )}

            {newGuo?.members4 != undefined && (
              <TextField 
                variant='filled'
                label='Members_4'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={ newGuo.members4.toString() }
              />
            )}

          </Stack>

          <Collapse in={ editable && !finalized } >
            <Stack direction={'row'} sx={{ alignItems: 'center', backgroundColor:'lightcyan' }} >

              <TextField 
                variant='filled'
                label='Members_1'
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                onChange={(e) => setObjGuo((v) => ({
                  ...v,
                  members1: parseInt(e.target.value),
                }))}
                value={ objGuo?.members1 }
              />

              <TextField 
                variant='filled'
                label='Members_2'
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                onChange={(e) => setObjGuo((v) => ({
                  ...v,
                  members2: parseInt(e.target.value),
                }))}
                value={ objGuo?.members2 }
              />

              <TextField 
                variant='filled'
                label='Members_3'
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                onChange={(e) => setObjGuo((v) => ({
                  ...v,
                  members3: parseInt(e.target.value),
                }))}
                value={ objGuo?.members3 }
              />

              <TextField 
                variant='filled'
                label='Members_4'
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                onChange={(e) => setObjGuo((v) => ({
                  ...v,
                  members4: parseInt(e.target.value),
                }))}
                value={ objGuo?.members4 }
              />

            </Stack>
          </Collapse>

        </Stack>
      </Paper>
    </> 
  )
}
