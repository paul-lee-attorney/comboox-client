import { useEffect, useState } from "react";
import { AddrOfRegCenter } from "../../scripts/common";
import { StrLocker, User, defaultStrLocker, getLocker } from "../../scripts/center/rc";
import { Divider, Paper, TextField, Toolbar } from "@mui/material";
import { longDataParser, longSnParser, toPercent } from "../../scripts/common/toolsKit";
import { regCenterABI, useRegCenterBalanceOf, useRegCenterGetLocksList, useRegCenterGetOwner } from "../../generated";
import { useContractRead, useWalletClient } from "wagmi";
import { LockersList } from "../../components/center/LockersList";
import { HashLockerOfPoints } from "../../components/center/HashLockerOfPoints";
import { useComBooxContext } from "../../scripts/common/ComBooxContext";
import { CopyLongStrTF } from "../../components/common/utils/CopyLongStr";
import { ActionsOfUser } from "../../components/center/ActionsOfUser";
import { balanceOfWei } from "../../scripts/comp/gk";


function UserInfo() {

  const { userNo, setErrMsg } = useComBooxContext();

  const [ user, setUser ] = useState<User>();

  const { data: signer } = useWalletClient();

  const {
    refetch: obtainUser
  } = useContractRead({
    address: AddrOfRegCenter,
    abi: regCenterABI,
    functionName: 'getUser',
    account: signer?.account ,
    onError(err) {
      setErrMsg(err.message);
    },
    onSuccess(data) {
      if (signer) setUser(data);
      else setUser(undefined);
    },
  })
    
  const [ isOwner, setIsOwner ] = useState(false);

  useRegCenterGetOwner({
    address: AddrOfRegCenter,
    onError(err) {
      setErrMsg(err.message);
    },
    onSuccess(owner) {
      if (owner == signer?.account.address)
        setIsOwner(true);
      else setIsOwner(false);
    }
  })

  const [ lockersList, setLockersList ] = useState<StrLocker[]>();

  const {
    refetch: getLocksList
  } = useRegCenterGetLocksList({
    address: AddrOfRegCenter,
    onError(err) {
      setErrMsg(err.message);
    },
    onSuccess(ls) {
      const obtainLockers = async ()=>{
        let len = ls.length;
        let list: StrLocker[] = [];

        while (len > 0) {
          list.push(await getLocker(ls[len-1]));
          len--;
        }
        
        if (list.length > 0)
          setLockersList(list);
      }

      obtainLockers();
    }
  });

  const [ balance, setBalance ] = useState<string>('0');

  const {
    refetch: getBalanceOf
  } = useRegCenterBalanceOf({
    address: AddrOfRegCenter,
    args: user ? [ user.primeKey.pubKey ] : undefined,
    onError(err) {
      setErrMsg(err.message);
    },
    onSuccess(amt) {
      setBalance(amt.toString());
    }
  })

  const [ balanceOfETH, setBalanceOfETH ] = useState<string>('0');

  useEffect(()=>{
    if (user) {
      balanceOfWei(user.primeKey.pubKey).then(
        wei => setBalanceOfETH(wei.toString())
      )
    }
  }, [user]);

  const [ open, setOpen ] = useState(false);
  const [ locker, setLocker ] = useState<StrLocker>(defaultStrLocker);

  const [ showList, setShowList ] = useState(false);

  return (
    <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', m:1, p:1, border:1, borderColor:'divider' }} >
      <Toolbar sx={{ textDecoration:'underline' }} >
        <h3>User Info - ( No. { longSnParser(userNo?.toString() ?? '0') } ) </h3>
      </Toolbar>

      <table >
        <thead />

        <tbody>
        {userNo && (
          <>
          <tr>
            <td>
              <CopyLongStrTF title='PrimeKey' src={user?.primeKey.pubKey.toLowerCase() ?? '-'} />
            </td>
            <td>
              <TextField 
                size="small"
                variant='outlined'
                label='isCOA ?'
                inputProps={{readOnly: true}}
                fullWidth
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={ user?.primeKey.discount == 1 ? 'True' : 'False' }
              />
            </td>
            <td>
              <TextField 
                size="small"
                variant='outlined'
                label='RegRewards(GLee)'
                inputProps={{readOnly: true}}
                fullWidth
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={ longDataParser(user?.primeKey.gift.toString() ?? '0') }
              />
            </td>
            <td>
              <TextField 
                size="small"
                variant='outlined'
                label='CounterOfVerify'
                inputProps={{readOnly: true}}
                fullWidth
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={ longDataParser( user?.primeKey.coupon.toString() ?? '0' ) }
              />
            </td>

          </tr>

          <tr>
            <td>
              <CopyLongStrTF title='BackupKey' src={ user?.backupKey.pubKey.toLowerCase() ?? '-' } />
            </td>
            <td>
              <TextField 
                size="small"
                variant='outlined'
                label='DiscountRate'
                inputProps={{readOnly: true}}
                fullWidth
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={ toPercent(user?.backupKey.discount.toString() ?? '0') }
              />
            </td>
            <td>
              <TextField 
                size="small"
                variant='outlined'
                label='GiftAmt(CBP)'
                inputProps={{readOnly: true}}
                fullWidth
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={ longDataParser((Number(user?.backupKey.gift ?? '0') / (10**9)).toString()) }
              />
            </td>
            <td>
              <TextField 
                size="small"
                variant='outlined'
                label='CouponAmt(CBP)'
                inputProps={{readOnly: true}}
                fullWidth
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={ longDataParser((Number(user?.backupKey.coupon ?? '0') / (10**9)).toString()) }
              />
            </td>
          </tr>

          <tr>
            <td>
              <TextField 
                size="small"
                variant='outlined'
                label='BalanceOfCBP (Giga CBP)'
                inputProps={{readOnly: true}}
                fullWidth
                sx={{
                  m:1,
                }}
                value={ longDataParser(balance.length > 27 ? balance.substring(0, balance.length - 27) : '0') }
              />
            </td>
            <td>
              <TextField 
                size="small"
                variant='outlined'
                label='BalanceOfCBP (CBP)'
                inputProps={{readOnly: true}}
                fullWidth
                sx={{
                  m:1,
                }}
                value={ longDataParser(
                    balance.length > 18 
                  ? balance.length > 27
                    ? balance.substring(balance.length - 27, balance.length - 18)
                    : balance.substring(0, balance.length - 18) 
                  : '0') }
              />
            </td>
            <td>
              <TextField 
                size="small"
                variant='outlined'
                label='BalanceOfCBP (GLee)'
                inputProps={{readOnly: true}}
                fullWidth
                sx={{
                  m:1,
                }}
                value={ longDataParser(
                    balance.length > 9 
                  ? balance.length > 18
                    ? balance.substring(balance.length - 18, balance.length - 9)
                    : balance.substring(0, balance.length - 9) 
                  : '0') }
              />
            </td>
            <td>
              <TextField 
                size="small"
                variant='outlined'
                label='BalanceOfCBP (Lee)'
                inputProps={{readOnly: true}}
                fullWidth
                sx={{
                  m:1,
                }}
                value={ longDataParser(
                    balance.length > 9
                  ? balance.substring(balance.length - 9)
                  : balance
                )}
              />
            </td>
          </tr>

          <tr>
            <td>
              <TextField 
                size="small"
                variant='outlined'
                label='BalanceOfETH (Giga ETH)'
                inputProps={{readOnly: true}}
                fullWidth
                sx={{
                  m:1,
                }}
                value={ longDataParser(balanceOfETH.length > 27 ? balanceOfETH.substring(0, balanceOfETH.length - 27) : '0') }
              />
            </td>
            <td>
              <TextField 
                size="small"
                variant='outlined'
                label='BalanceOfETH (ETH)'
                inputProps={{readOnly: true}}
                fullWidth
                sx={{
                  m:1,
                }}
                value={ longDataParser(
                    balanceOfETH.length > 18 
                  ? balanceOfETH.length > 27
                    ? balanceOfETH.substring(balanceOfETH.length - 27, balanceOfETH.length - 18)
                    : balanceOfETH.substring(0, balanceOfETH.length - 18) 
                  : '0') }
              />
            </td>
            <td>
              <TextField 
                size="small"
                variant='outlined'
                label='BalanceOfETH (GWei)'
                inputProps={{readOnly: true}}
                fullWidth
                sx={{
                  m:1,
                }}
                value={ longDataParser(
                    balanceOfETH.length > 9 
                  ? balanceOfETH.length > 18
                    ? balanceOfETH.substring(balanceOfETH.length - 18, balanceOfETH.length - 9)
                    : balanceOfETH.substring(0, balanceOfETH.length - 9) 
                  : '0') }
              />
            </td>
            <td>
              <TextField 
                size="small"
                variant='outlined'
                label='BalanceOfETH (Wei)'
                inputProps={{readOnly: true}}
                fullWidth
                sx={{
                  m:1,
                }}
                value={ longDataParser(
                    balanceOfETH.length > 9
                  ? balanceOfETH.substring(balanceOfETH.length - 9)
                  : balanceOfETH
                )}
              />
            </td>
          </tr>



          <tr>
            <td colSpan={ 5 } >
              <Divider orientation="horizontal" sx={{ m:1 }} flexItem />
            </td>
          </tr>
          </>
        )}

          <tr>
            <td colSpan={ 5 }>
              {userNo && (
                <ActionsOfUser user={user} isOwner={isOwner} showList={showList} setShowList={setShowList} refreshList={getLocksList} getUser={ obtainUser } getBalanceOf={ getBalanceOf } />
              )}
            </td>
          </tr>

          <tr>
            <td colSpan={ 5 }>
              {lockersList && userNo && showList && (
                <LockersList list={ lockersList } setLocker={ setLocker } setOpen={ setOpen } />
              )}
            </td>
          </tr>

          <tr>
            <td colSpan={ 5 }>
              {locker && userNo && (
                <HashLockerOfPoints open={ open } locker={ locker } userNo={ userNo } setOpen={ setOpen } refreshList={ getLocksList } getUser={ obtainUser } />
              )}
            </td>
          </tr>

        </tbody>
      </table>
    </Paper>
  );
}

export default UserInfo;