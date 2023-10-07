import { useState } from "react";
import { AddrOfRegCenter, AddrZero, HexType } from "../../scripts/common";
import { useIPriceConsumerGetFeedRegistryAddress, useRegCenterCounterOfUsers, useRegCenterGetBookeeper, useRegCenterGetOwner, useRegCenterGetPlatformRule, useRegCenterTotalSupply } from "../../generated";
import { Rule, defaultRule } from "../../scripts/center/rc";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Stack, TextField, Toolbar } from "@mui/material";
import { CopyLongStrTF } from "../common/utils/CopyLongStr";
import { longDataParser, toPercent } from "../../scripts/common/toolsKit";
import { ActionsOfOwner } from "./ActionsOfOwner";
import { Close, Refresh, Settings } from "@mui/icons-material";
import { useWalletClient } from "wagmi";


export function CenterInfo() {
  
  const { data:signer } = useWalletClient();

  const [ owner, setOwner ] = useState<HexType>(AddrZero);

  const {
    refetch: getOwner,
  } = useRegCenterGetOwner({
    address: AddrOfRegCenter,
    onSuccess(res) {
      setOwner(res)
    }
  })

  const [ keeper, setKeeper ] = useState<HexType>(AddrZero);

  const {
    refetch: getKeeper,
  } = useRegCenterGetBookeeper({
    address: AddrOfRegCenter,
    onSuccess(res) {
      setKeeper(res)
    }
  })

  const [ platformRule, setPlatformRule ] = useState<Rule>(defaultRule);

  const {
    refetch: getPlatformRule,
  } = useRegCenterGetPlatformRule({
    address: AddrOfRegCenter,
    onSuccess(res) {
      setPlatformRule(res);
    }
  })

  const [ counterOfUsers, setCounterOfUsers ] = useState<number>(0);

  const {
    refetch: getCounterOfUser
  } = useRegCenterCounterOfUsers({
    address: AddrOfRegCenter,
    onSuccess(res) {
      setCounterOfUsers(res);
    }
  })

  const [ totalSupply, setTotalSupply ] = useState<string>('0');

  const {
    refetch: getTotalSupply
  } = useRegCenterTotalSupply({
    address: AddrOfRegCenter,
    onSuccess(res) {
      setTotalSupply(res.toString());
    }
  })

  const [ feedReg, setFeedReg ] = useState<HexType>(AddrZero);

  const {
    refetch: getFeedReg
  } = useIPriceConsumerGetFeedRegistryAddress({
    address: AddrOfRegCenter,
    onSuccess(res) {
      setFeedReg(res);
    }
  })

  const refreshPage = ()=>{
    getOwner();
    getKeeper();
    getCounterOfUser();
    getTotalSupply();
    getPlatformRule();
    getFeedReg();
  }

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
                      value={ longDataParser(totalSupply.length > 27 ? totalSupply.substring(0, totalSupply.length - 27) : '0') }
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
                      value={ longDataParser(
                          totalSupply.length > 18 
                        ? totalSupply.length > 27
                          ? totalSupply.substring(totalSupply.length - 27, totalSupply.length - 18)
                          : totalSupply.substring(0, totalSupply.length - 18) 
                        : '0') }
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
                      value={ longDataParser(
                          totalSupply.length > 9 
                        ? totalSupply.length > 18
                          ? totalSupply.substring(totalSupply.length - 18, totalSupply.length - 9)
                          : totalSupply.substring(0, totalSupply.length - 9) 
                        : '0') }
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
                      value={ longDataParser(
                          totalSupply.length > 9
                        ? totalSupply.substring(totalSupply.length - 9)
                        : totalSupply
                      )}
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
                      <ActionsOfOwner refreshPage={refreshPage} />
                    </td>
                  </tr>
                )}

              </tbody>
            </table>

          </Paper>

          </DialogContent>

          <DialogActions>
            <Stack direction='row' >
              <Button variant="outlined" sx={{ m:1, mx:3, minWidth:128 }} onClick={refreshPage} endIcon={<Refresh/>}>Refresh</Button>
              <Button variant="outlined" sx={{ m:1, mx:3, minWidth:128 }} onClick={()=>setOpen(false)} endIcon={<Close/>}>Close</Button>
            </Stack>
          </DialogActions>


        </Dialog>
    </>
  );
}