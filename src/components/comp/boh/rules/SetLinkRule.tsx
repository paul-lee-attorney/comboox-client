
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

interface LinkRuleType {
  seqOfRule?: number | undefined;
  qtyOfSubRule?: number | undefined;
  seqOfSubRule?: number | undefined;
  drager?: number | undefined;
  dragerGroup?: number | undefined;
  triggerType?: number | undefined;
  shareRatioThreshold?: number | undefined;
  proRata?: boolean | undefined;
  unitPrice?: number | undefined;
  roe?: number | undefined;
}

export function SetLinkRule({ sha, qty, seq }: SetShaRuleProps) {
  const [ objLr, setObjLr ] = useState<LinkRuleType>(); 

  let hexLr: HexType = `0x${
    (objLr?.seqOfRule?.toString(16).padStart(4, '0') ?? seq.toString(16).padStart(4, '0')) +
    (objLr?.qtyOfSubRule?.toString(16).padStart(2, '0') ?? qty.toString(16).padStart(2, '0')) +
    (objLr?.seqOfSubRule?.toString(16).padStart(2, '0') ?? (seq - 1023).toString(16).padStart(2, '0')) +
    (objLr?.drager?.toString(16).padStart(10, '0') ?? '0'.padStart(10, '0')) +
    (objLr?.dragerGroup?.toString(16).padStart(10, '0') ?? '0'.padStart(10, '0')) +
    (objLr?.triggerType?.toString(16).padStart(2, '0') ?? '00') +
    (objLr?.shareRatioThreshold?.toString(16).padStart(4, '0') ?? '0000') +
    (objLr?.proRata ? '01' : '00') +
    (objLr?.unitPrice?.toString(16).padStart(8, '0') ?? '0'.padStart(8, '0')) +
    (objLr?.roe?.toString(16).padStart(8, '0') ?? '0'.padStart(8, '0')) +
    '0'.padStart(12, '0')
  }`;

  // console.log('objLr: ', objLr);

  const [ newHexLr, setNewHexLr ] = useState<HexType>(Bytes32Zero);

  let newLr: LinkRuleType = {
    seqOfRule: parseInt(newHexLr.substring(2, 6), 16), 
    qtyOfSubRule: parseInt(newHexLr.substring(6, 8), 16),
    seqOfSubRule: parseInt(newHexLr.substring(8, 10), 16),
    drager: parseInt(newHexLr.substring(10, 20), 16),
    dragerGroup: parseInt(newHexLr.substring(20, 30), 16),
    triggerType: parseInt(newHexLr.substring(30, 32), 16),
    shareRatioThreshold: parseInt(newHexLr.substring(32, 36), 16),
    proRata: newHexLr.substring(36, 38) === '01',
    unitPrice: parseInt(newHexLr.substring(38, 46), 16),
    roe: parseInt(newHexLr.substring(46, 54), 16),
  };

  // console.log('newLinkRule: ', newLr);

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
        <Stack direction={'row'} sx={{ justifyContent: 'flex-start', alignItems: 'center' }} >        
          
          <Toolbar>
            <h4>Rule No. { seq.toString() } </h4>
          </Toolbar>

          <AddRule 
            sha={ sha }
            rule={ hexLr }
            setUpdatedRule={ setNewHexLr }
            editable={ editable }
            setEditable={ setEditable }
          />

        </Stack>

        <Stack 
          direction={'column'} 
          spacing={1} 
        >

          <Stack direction={'row'} sx={{ alignItems: 'center' }} >
            {/* <h6>System Record</h6> */}
            {newLr?.seqOfRule != undefined && (
              <TextField 
                variant='filled'
                label='SeqOfRule'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 240,
                }}
                value={ newLr.seqOfRule.toString() }
              />
            )}

            {newLr?.qtyOfSubRule != undefined && (
              <TextField 
                variant='filled'
                label='QtyOfSubRule'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 240,
                }}
                value={ newLr.qtyOfSubRule.toString() }
              />
            )}

            {newLr?.seqOfSubRule != undefined && (
              <TextField 
                variant='filled'
                label='SeqOfSubRule'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 240,
                }}
                value={ newLr.seqOfSubRule.toString() }
              />
            )}

            {newLr?.drager != undefined && (
              <TextField 
                variant='filled'
                label='Drager'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 240,
                }}
                value={ newLr.drager.toString() }
              />
            )}

            {newLr?.dragerGroup != undefined && (
              <TextField 
                variant='filled'
                label='DragerGroup'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 240,
                }}
                value={ newLr.dragerGroup.toString() }
              />
            )}

          </Stack>

          <Collapse in={ editable } >
            <Stack direction={'row'} sx={{ alignItems: 'center', backgroundColor:'lightcyan' }} >
              {/* <Collapse in={ false } >   */}            

              <TextField 
                variant='filled'
                label='SeqOfRule'
                sx={{
                  m:1,
                  minWidth: 240,
                }}
                onChange={(e) => setObjLr((v) => ({
                  ...v,
                  seqOfRule: parseInt(e.target.value),
                }))}
                value={ objLr?.seqOfRule }
              />

              <TextField 
                variant='filled'
                label='QtyOfSubRule'
                sx={{
                  m:1,
                  minWidth: 240,
                }}
                onChange={(e) => setObjLr((v) => ({
                  ...v,
                  qtyOfSubRule: parseInt(e.target.value),
                }))}
                value={ objLr?.qtyOfSubRule }              
              />

              <TextField 
                variant='filled'
                label='SeqOfSubRule'
                sx={{
                  m:1,
                  minWidth: 240,
                }}
                onChange={(e) => setObjLr((v) => ({
                  ...v,
                  seqOfSubRule: parseInt(e.target.value),
                }))}
                value={ objLr?.seqOfSubRule }
              />

              <TextField 
                variant='filled'
                label='Drager'
                sx={{
                  m:1,
                  minWidth: 240,
                }}
                onChange={(e) => setObjLr((v) => ({
                  ...v,
                  drager: parseInt(e.target.value),
                }))}
                value={ objLr?.drager }
              />

              <TextField 
                variant='filled'
                label='DragerGroup'
                sx={{
                  m:1,
                  minWidth: 240,
                }}
                onChange={(e) => setObjLr((v) => ({
                  ...v,
                  dragerGroup: parseInt(e.target.value),
                }))}
                value={ objLr?.dragerGroup }
              />

            </Stack>
          </Collapse>

          <Stack direction={'row'} sx={{ alignItems: 'center' }} >

            {newLr?.triggerType != undefined && (
              <TextField 
                variant='filled'
                label='TriggerType'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 240,
                }}
                value={ newLr.triggerType.toString() }
              />
            )}

            {newLr?.shareRatioThreshold != undefined && (
              <TextField 
                variant='filled'
                label='ShareRatioThreshold'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 240,
                }}
                value={ newLr.shareRatioThreshold.toString() }
              />
            )}

            {newLr?.proRata != undefined && (
              <TextField 
                variant='filled'
                label='ProRata'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 240,
                }}
                value={ newLr.proRata ? 'True' : 'False' }
              />
            )}

            {newLr?.unitPrice != undefined && (
              <TextField 
                variant='filled'
                label='UnitPrice'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 240,
                }}
                value={ newLr.unitPrice.toString() }
              />
            )}

            {newLr?.roe != undefined && (
              <TextField 
                variant='filled'
                label='ReturnOnEquity'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 240,
                }}
                value={ newLr.roe.toString() }
              />
            )}

          </Stack>

          <Collapse in={ editable } >
            <Stack direction={'row'} sx={{ alignItems: 'center', backgroundColor:'lightcyan' }} >

              <TextField 
                variant='filled'
                label='TriggerType'
                sx={{
                  m:1,
                  minWidth: 240,
                }}
                onChange={(e) => setObjLr((v) => ({
                  ...v,
                  triggerType: parseInt(e.target.value),
                }))}
                value={ objLr?.triggerType }
              />

              <TextField 
                variant='filled'
                label='ShareRatioThreshold'
                sx={{
                  m:1,
                  minWidth: 240,
                }}
                onChange={(e) => setObjLr((v) => ({
                  ...v,
                  shareRatioThreshold: parseInt(e.target.value),
                }))}
                value={ objLr?.shareRatioThreshold }
              />

              <Box sx={{ minWidth: 240, m: 1 }} >
                <FormControlLabel 
                  label='ProRata'
                  control={
                    <Checkbox 
                      sx={{
                        m: 1,
                        height: 64,
                      }}
                      onChange={e => setObjLr(v => ({
                        ...v,
                        proRata: e.target.checked,
                      }))}
                      checked={ objLr?.proRata }
                    />
                  }
                />
              </Box>

              <TextField 
                variant='filled'
                label='UnitPrice'
                sx={{
                  m:1,
                  minWidth: 240,
                }}
                onChange={(e) => setObjLr((v) => ({
                  ...v,
                  unitPrice: parseInt(e.target.value),
                }))}
                value={ objLr?.unitPrice }
              />

              <TextField 
                variant='filled'
                label='ReturnOnEquity'
                sx={{
                  m:1,
                  minWidth: 240,
                }}
                onChange={(e) => setObjLr((v) => ({
                  ...v,
                  roe: parseInt(e.target.value),
                }))}
                value={ objLr?.roe }
              />

            </Stack>
          </Collapse>

        </Stack>
      </Paper>
    </> 
  )
}
