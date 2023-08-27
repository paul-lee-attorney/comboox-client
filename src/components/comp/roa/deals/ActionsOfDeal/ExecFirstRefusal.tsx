import { useState } from "react";
import { Bytes32Zero, HexType } from "../../../../../interfaces";
import { defaultDeal } from "../../../../../queries/ia";
import { useRegisterOfConstitutionPointer, useGeneralKeeperExecFirstRefusal } from "../../../../../generated";
import { Button, Divider, FormControl, InputLabel, MenuItem, Paper, Select, Stack, TextField } from "@mui/material";
import { EmojiPeopleOutlined } from "@mui/icons-material";
import { useComBooxContext } from "../../../../../scripts/ComBooxContext";
import { ActionsOfDealProps } from "../ActionsOfDeal";
import { FirstRefusalRule } from "../../../roc/rules/SetFirstRefusalRule";
import { getFirstRefusalRules } from "../../../../../queries/sha";
import { HexParser, longSnParser } from "../../../../../scripts/toolsKit";

export function ExecFirstRefusal({ia, deal, setOpen, setDeal, refreshDealsList}:ActionsOfDealProps) {

  const { gk, boox } = useComBooxContext();

  const [ rules, setRules ] = useState<FirstRefusalRule[]>();

  useRegisterOfConstitutionPointer({
    address: boox ? boox[1] : undefined,
    onSuccess(sha) {
      getFirstRefusalRules(sha).then(
        list => setRules(list)
      )
    }
  })
  
  const [ seqOfRule, setSeqOfRule ] = useState<number>(512);
  const [ seqOfRightholder, setSeqOfRightholder ] = useState<number>(0);

  const [ sigHash, setSigHash ] = useState<HexType>(Bytes32Zero);

  const closeOrderOfDeal = ()=>{
    setDeal(defaultDeal);
    refreshDealsList();
    setOpen(false);    
  }

  const {
    isLoading: execFirstRefusalLoading,
    write: execFirstRefusal,
  } = useGeneralKeeperExecFirstRefusal({
    address: gk,
    args: [ BigInt(seqOfRule),
            BigInt(seqOfRightholder),
            ia, 
            BigInt(deal.head.seqOfDeal), 
            sigHash 
          ],
    onSuccess() {
      closeOrderOfDeal();
    }
  })

  const typesOfDeal = ['Capital Increase', 'Share Transfer (Ext)'];

  return (

    <Paper elevation={3} sx={{
      m:1, p:1, 
      border: 1, 
      borderColor:'divider' 
      }} 
    >
        <Stack direction={'row'} sx={{ alignItems:'center'}} >

          <Stack direction='column'>

            <Stack direction='row' sx={{ alignItems:'center' }} >

              <FormControl variant="outlined" size="small" sx={{ m: 1}}>
                <InputLabel id="seqOfRule-label">SeqOfRule</InputLabel>
                <Select
                  labelId="seqOfRule-label"
                  id="seqOfRule-select"
                  label="SeqOfRule"
                  sx={{ minWidth: 258 }} 
                  value={ (seqOfRule - 512).toString() }
                  onChange={(e) => setSeqOfRule(512 + Number(e.target.value))}
                >
                  {rules && rules.map((v, i) => (
                    <MenuItem key={i} value={i.toString()} > {v.seqOfRule} - {typesOfDeal[v.typeOfDeal - 1]} </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl variant="outlined" size="small" sx={{ m: 1, minWidth: 218 }}>
                <InputLabel id="rightholder-label">Rightholder</InputLabel>
                <Select
                  labelId="rightholder-label"
                  id="rightholder-select"
                  label="Rightholder"
                  value={ seqOfRightholder.toString() }
                  onChange={(e) => setSeqOfRightholder( Number(e.target.value ?? '0') )}
                >
                  {rules && seqOfRule >= 512 && rules[ seqOfRule - 512 ].rightholders.map((v, i) => (
                    <MenuItem key={i} value={i.toString()} > {longSnParser(v.toString())} </MenuItem>
                  ))}
                </Select>
              </FormControl>

            </Stack>

            <TextField 
              variant='outlined'
              label='SigHash'
              size="small"
              sx={{
                m:1,
                minWidth: 685,
              }}
              onChange={(e) => setSigHash(HexParser( e.target.value ))}
              value={ sigHash }
            />


          </Stack>
          
          <Divider orientation="vertical" flexItem />

          <Button 
            disabled = {!execFirstRefusal || execFirstRefusalLoading }

            sx={{ m: 1, minWidth: 218, height: 40 }} 
            variant="contained" 
            endIcon={<EmojiPeopleOutlined />}
            onClick={()=> execFirstRefusal?.()}
            size='small'
          >
            First Refusal
          </Button>

        </Stack>

    </Paper>

  );
  
}