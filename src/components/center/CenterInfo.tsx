import { useEffect, useState } from "react";
import { AddrZero, HexType } from "../../scripts/common";
import { 
  Rule, 
  defaultRule, 
  getBookeeper,
  getOwner, 
  getPlatformRule,
  getCounterOfUsers,
  getTotalSupply,
  getFeedRegistryAddress
} from "../../scripts/center/rc";

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Stack, TextField } from "@mui/material";
import { CopyLongStrTF } from "../common/utils/CopyLongStr";
import { getEthPart, getGEthPart, getGWeiPart, getWeiPart, longDataParser, toPercent } from "../../scripts/common/toolsKit";
import { ActionsOfOwner } from "./ActionsOfOwner";
import { Close, Refresh, Settings } from "@mui/icons-material";
import { useWalletClient } from "wagmi";


export function CenterInfo() {
  
  const { data:signer } = useWalletClient();

  const [ time, setTime ] = useState<number>(0);

  const [ owner, setOwner ] = useState<HexType>(AddrZero);
  const [ keeper, setKeeper ] = useState<HexType>(AddrZero);
  const [ platformRule, setPlatformRule ] = useState<Rule>(defaultRule);
  const [ counterOfUsers, setCounterOfUsers ] = useState<number>(0);
  const [ totalSupply, setTotalSupply ] = useState<string>('0');
  const [ feedReg, setFeedReg ] = useState<HexType>(AddrZero);

  useEffect(()=>{

    getOwner().then(
      res => setOwner(res)
    );
      
    getBookeeper().then(
      res => setKeeper(res)
    );

    getPlatformRule().then(
      res => setPlatformRule(res)
    );

    getCounterOfUsers().then(
      res => setCounterOfUsers(res)
    );

    getTotalSupply().then(
      res => setTotalSupply(res.toString())
    );

    getFeedRegistryAddress().then(
      res => setFeedReg(res)
    );

  }, [time]);

  const [ open, setOpen ] = useState(false);

  const handleClick = ()=> {
    setOpen(true);
  }

  return(
    <>
      <Button
        variant="outlined"
        startIcon={<Settings />}
        sx={{ m:3, width:488, height:40 }}
        onClick={ handleClick }      
      >
        Registration Center Info
      </Button>

      <Dialog
        maxWidth={false}
        open={open}
        onClose={()=>setOpen(false)}
        aria-labelledby="dialog-title"
      >
        <DialogTitle id="dialog-title" sx={{ textDecoration:'underline' }}>
          <h3>RegCenter Info</h3>
        </DialogTitle>

        <DialogContent>

          <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', m:1, p:1, border:1, borderColor:'divider' }} >
            {/* <Toolbar sx={{ textDecoration:'underline' }} >
              <h3>Management of RegCenter</h3>
            </Toolbar> */}
            <table>
              <thead />

              <tbody>

                <tr>
                  <td>
                    <CopyLongStrTF title='Owner' src={owner.toLowerCase() ?? '-'} />
                  </td>
                  <td>
                    <CopyLongStrTF title='Keeper' src={keeper.toLowerCase() ?? '-'} />
                  </td>

                  <td>
                    <CopyLongStrTF title='FeedReg' src={feedReg.toLowerCase() ?? '-'} />
                  </td>

                  <td>
                    <TextField
                      size="small"
                      variant='outlined'
                      label='CounterOfUsers'
                      inputProps={{readOnly: true}}
                      fullWidth
                      sx={{
                        m:1,
                        minWidth:218,
                      }}
                      value={ longDataParser(counterOfUsers.toString() ?? '0') }
                    />
                  </td>
                </tr>

                <tr>
                  <td>
                    <TextField 
                      size="small"
                      variant='outlined'
                      label='TotalSupply (Giga-CBP)'
                      inputProps={{readOnly: true}}
                      fullWidth
                      sx={{
                        m:1,
                      }}
                      value={ getGEthPart(totalSupply) }
                    />
                  </td>
                  <td>
                    <TextField 
                      size="small"
                      variant='outlined'
                      label='TotalSupply (CBP)'
                      inputProps={{readOnly: true}}
                      fullWidth
                      sx={{
                        m:1,
                      }}
                      value={ getEthPart(totalSupply) }
                    />
                  </td>
                  <td>
                    <TextField 
                      size="small"
                      variant='outlined'
                      label='TotalSupply (GLee)'
                      inputProps={{readOnly: true}}
                      fullWidth
                      sx={{
                        m:1,
                      }}
                      value={ getGWeiPart(totalSupply) }
                    />
                  </td>
                  <td>
                    <TextField 
                      size="small"
                      variant='outlined'
                      label='TotalSupply (Lee)'
                      inputProps={{readOnly: true}}
                      fullWidth
                      sx={{
                        m:1,
                      }}
                      value={ getWeiPart(totalSupply) }
                    />
                  </td>
                </tr>

                <tr>
                  <td>
                    <TextField
                      size="small"
                      variant='outlined'
                      label='EOA_Rewards(GLee)'
                      inputProps={{readOnly: true}}
                      fullWidth
                      sx={{
                        m:1,
                        minWidth:218,
                      }}
                      value={ longDataParser(platformRule.eoaRewards.toString() ?? '0') }
                    />
                  </td>
                  <td>
                    <TextField
                      size="small"
                      variant='outlined'
                      label='COA_Rewards(GLee)'
                      inputProps={{readOnly: true}}
                      fullWidth
                      sx={{
                        m:1,
                        minWidth:218,
                      }}
                      value={ longDataParser(platformRule.coaRewards.toString() ?? '0') }
                    />
                  </td>
                  <td>
                    <TextField
                      size="small"
                      variant='outlined'
                      label='FloorOfRoyalty(GLee)'
                      inputProps={{readOnly: true}}
                      fullWidth
                      sx={{
                        m:1,
                        minWidth:218,
                      }}
                      value={ longDataParser(platformRule.floor.toString() ?? '0') }
                    />
                  </td>

                  <td>
                    <TextField
                      size="small"
                      variant='outlined'
                      label='RateOfCommission'
                      inputProps={{readOnly: true}}
                      fullWidth
                      sx={{
                        m:1,
                        minWidth:218,
                      }}
                      value={ toPercent(2000 - (platformRule.rate ?? 0)) }
                    />
                  </td>

                </tr>

                {signer && (signer.account.address == owner || signer.account.address == keeper) && (
                  <tr>
                    <td colSpan={4}>
                      <ActionsOfOwner setTime={setTime} />
                    </td>
                  </tr>
                )}

              </tbody>
            </table>

          </Paper>

          </DialogContent>

          <DialogActions>
            <Stack direction='row' >
              <Button variant="outlined" sx={{ m:1, mx:3, minWidth:128 }} onClick={()=>setTime(Date.now())} endIcon={<Refresh/>}>Refresh</Button>
              <Button variant="outlined" sx={{ m:1, mx:3, minWidth:128 }} onClick={()=>setOpen(false)} endIcon={<Close/>}>Close</Button>
            </Stack>
          </DialogActions>


        </Dialog>
    </>
  );
}