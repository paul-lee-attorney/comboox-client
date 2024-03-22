"use client"

import { useState } from "react";
import { AddrOfRegCenter, AddrOfTank, AddrZero, HexType } from "../../read";
import { balanceOfWei } from "../read/rc";
import { Divider, Paper, Stack, TextField, Toolbar } from "@mui/material";
import { bigIntToStrNum, getEthPart, getGWeiPart, getWeiPart, } from "../../read/toolsKit";

import { useFuleTankGetOwner, useFuleTankRate, useFuleTankGetRegCenter, useFuleTankSum, useRegCenterBalanceOf, } from "../../../generated";

import { useWalletClient } from "wagmi";

import { CopyLongStrSpan, CopyLongStrTF } from "../../read/CopyLongStr";
import { useComBooxContext } from "../../_providers/ComBooxContextProvider";
import { ActionsOfFule } from "./write/ActionsOfFule";

function FuleTank() {

  const { setErrMsg } = useComBooxContext();

  const [ owner, setOwner ] = useState<HexType>(AddrZero);
  const [ isOwner, setIsOwner ] = useState(false);
  const { data: signer } = useWalletClient();
  const {
    refetch: getOwner
  } = useFuleTankGetOwner ({
    address: AddrOfTank,
    onError(err) {
      setErrMsg(err.message);
    },
    onSuccess(res) {
      setOwner(res);
      if (res == signer?.account.address) {
        setIsOwner(true);
      } else setIsOwner(false);
    },
  })

  const [ regCenter, setRegCenter ] = useState<HexType>(AddrZero);
  const {
    refetch: getRegCenter
  } = useFuleTankGetRegCenter ({
    address: AddrOfTank,
    onError(err) {
      setErrMsg(err.message);
    },
    onSuccess(res) {
      setRegCenter(res);
    },
  })

  const [ rate, setRate ] = useState<string>('0');
  const {
    refetch: getRate
  } = useFuleTankRate ({
    address: AddrOfTank,
    onError(err) {
      setErrMsg(err.message);
    },
    onSuccess(res) {
      setRate(bigIntToStrNum(res, 4));
    },
  })

  const getSetting = ()=> {
    getOwner();
    getRegCenter();
    getRate();
  }

  const [ cbpOfTank, setCbpOfTank ] = useState<string>('0');
  const {
    refetch: getCbpOfTank
  } = useRegCenterBalanceOf({
    address: AddrOfRegCenter,
    args: [ AddrOfTank ],
    onError(err) {
      setErrMsg(err.message);
    },
    onSuccess(amt) {
      setCbpOfTank( bigIntToStrNum(amt/(10n**9n), 9) );
    }
  })

  const [ ethOfTank, setEthOfTank ] = useState<string>('0');
  const getEthOfTank = ()=>{
    balanceOfWei(AddrOfTank).then(
      wei => setEthOfTank( bigIntToStrNum(wei/(10n**9n), 9) )
    )
  }
  getEthOfTank();

  const [ sum, setSum ] = useState<string>('0');
  const {
    refetch: getSum
  } = useFuleTankSum ({
    address: AddrOfTank,
    onError(err) {
      setErrMsg(err.message);
    },
    onSuccess(res) {
      setSum( bigIntToStrNum(res / (10n**9n), 9) );
    },
  })

  const [ cbpOfUser, setCbpOfUser ] = useState<string>('0');
  const {
    refetch: getCbpOfUser
  } = useRegCenterBalanceOf({
    address: AddrOfRegCenter,
    args: signer ? [ signer.account.address ] : undefined,
    onError(err) {
      setErrMsg(err.message);
    },
    onSuccess(amt) {
      setCbpOfUser( amt.toString() );
    }
  })

  const [ ethOfUser, setEthOfUser ] = useState<string>('0');
  const getEthOfUser = ()=>{
    if (signer) {
      balanceOfWei(signer.account.address).then(
        wei => setEthOfUser(wei.toString())
      )
    }    
  }
  getEthOfUser();

  const getFinInfo = ()=>{
    getCbpOfTank();
    getEthOfTank();
    getSum();
    getCbpOfUser();
    getEthOfUser();
  }

  const [ open, setOpen ] = useState(false);

  return (
    <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', m:1, p:1, border:1, borderColor:'divider' }} >

      <Stack direction='row' sx={{alignItems:'center'}}>

        <Toolbar sx={{ textDecoration:'underline' }} >
          <b>Fule Tank</b>
        </Toolbar>

        <CopyLongStrSpan title="Addr" src={AddrOfTank} />

      </Stack>

      {signer && (
        <table >
          <thead />

          <tbody>
            <tr>
              <td>
                <CopyLongStrTF title='Owner' src={owner.toLowerCase() ?? '-'} />
              </td>
              <td>
                <CopyLongStrTF title='RegCenter' src={regCenter.toLowerCase() ?? '-'} />
              </td>
              <td>
                <TextField 
                  size="small"
                  variant='outlined'
                  label='Rate (CBP/ETH)'
                  inputProps={{readOnly: true}}
                  fullWidth
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ rate }
                />
              </td>
            </tr>

            <tr>
              <td>
                <TextField 
                  size="small"
                  variant='outlined'
                  label='BalanceOfTank (CBP)'
                  inputProps={{readOnly: true}}
                  fullWidth
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ cbpOfTank }
                />
              </td>
              <td>
                <TextField 
                  size="small"
                  variant='outlined'
                  label='SumOfSold (CBP)'
                  inputProps={{readOnly: true}}
                  fullWidth
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ sum }
                />
              </td>
              <td>
                <TextField 
                  size="small"
                  variant='outlined'
                  label='BalanceOfCash (ETH)'
                  inputProps={{readOnly: true}}
                  fullWidth
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ ethOfTank }
                />
              </td>
            </tr>

            <tr>
              <td colSpan={ 3 } >
                <Divider orientation="horizontal" sx={{ m:1 }} flexItem />
              </td>
            </tr>

            <tr>
              <td>
                <TextField 
                  size="small"
                  variant='outlined'
                  label='CbpOfUser (CBP)'
                  inputProps={{readOnly: true}}
                  fullWidth
                  sx={{
                    m:1,
                  }}
                  value={ getEthPart(cbpOfUser) }
                />
              </td>
              <td>
                <TextField 
                  size="small"
                  variant='outlined'
                  label='CbpOfUser (GLee)'
                  inputProps={{readOnly: true}}
                  fullWidth
                  sx={{
                    m:1,
                  }}
                  value={ getGWeiPart(cbpOfUser) }
                />
              </td>
              <td>
                <TextField 
                  size="small"
                  variant='outlined'
                  label='CbpOfUser (Lee)'
                  inputProps={{readOnly: true}}
                  fullWidth
                  sx={{
                    m:1,
                  }}
                  value={ getWeiPart(cbpOfUser) }
                />
              </td>
            </tr>

            <tr>
              <td>
                <TextField 
                  size="small"
                  variant='outlined'
                  label='EthOfUser (ETH)'
                  inputProps={{readOnly: true}}
                  fullWidth
                  sx={{
                    m:1,
                  }}
                  value={ getEthPart(ethOfUser) }
                />
              </td>
              <td>
                <TextField 
                  size="small"
                  variant='outlined'
                  label='EthOfUser (GWei)'
                  inputProps={{readOnly: true}}
                  fullWidth
                  sx={{
                    m:1,
                  }}
                  value={ getGWeiPart(ethOfUser) }
                />
              </td>
              <td>
                <TextField 
                  size="small"
                  variant='outlined'
                  label='EthOfUser (Wei)'
                  inputProps={{readOnly: true}}
                  fullWidth
                  sx={{
                    m:1,
                  }}
                  value={ getWeiPart(ethOfUser) }
                />
              </td>
            </tr>

            <tr>
              <td colSpan={ 3 } >
                <Divider orientation="horizontal" sx={{ m:1 }} flexItem />
              </td>
            </tr>

            <tr>
              <td colSpan={ 3 }>
                <ActionsOfFule user={signer.account.address} isOwner={isOwner} getFinInfo={getFinInfo} getSetting={getSetting} />
              </td>
            </tr>

          </tbody>
        </table>
      )}

    </Paper>
  );
}

export default FuleTank;