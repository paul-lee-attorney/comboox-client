import { useState } from "react";
import { AddrOfRegCenter } from "../../interfaces";
import { Locker, User, getLocker } from "../../queries/rc";
import { Divider, Paper, TextField, Toolbar } from "@mui/material";
import { longDataParser, longSnParser, toPercent, toStr } from "../../scripts/toolsKit";
import { regCenterABI, useRegCenterGetLocksList, useRegCenterGetOwner } from "../../generated";
import { useContractRead, useWalletClient } from "wagmi";
import { LockersList } from "../../components/center/LockersList";
import { HashLockerOfPoints } from "../../components/center/HashLockerOfPoints";
import { useComBooxContext } from "../../scripts/ComBooxContext";
import { CopyLongStrTF } from "../../components/common/utils/CopyLongStr";
import { ActionsOfUser } from "../../components/center/ActionsOfUser";


function UserInfo() {

  const { userNo } = useComBooxContext();

  const [ user, setUser ] = useState<User>();

  const { data: signer } = useWalletClient();

  const {
    refetch: obtainUser
  } = useContractRead({
    address: AddrOfRegCenter,
    abi: regCenterABI,
    functionName: 'getUser',
    account: signer?.account ,
    onSuccess(data) {
      if (signer) setUser(data);
      else setUser(undefined);
    },
  })
    
  const [ isOwner, setIsOwner ] = useState(false);

  useRegCenterGetOwner({
    address: AddrOfRegCenter,
    onSuccess(owner) {
      if (owner == signer?.account.address)
        setIsOwner(true);
      else setIsOwner(false);
    }
  })

  const [ lockersList, setLockersList ] = useState<Locker[]>();

  const {
    refetch: getLocksList
  } = useRegCenterGetLocksList({
    address: AddrOfRegCenter,
    onSuccess(ls) {
      const obtainLockers = async ()=>{
        let len = ls.length;
        let list: Locker[] = [];

        while (len > 0) {
          list.push(await getLocker(AddrOfRegCenter, ls[len-1]));
          len--;
        }
        
        if (list.length > 0)
          setLockersList(list);
      }

      obtainLockers();
    }
  });

  const [ open, setOpen ] = useState(false);
  const [ locker, setLocker ] = useState<Locker>();

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
          <td colSpan={2}>
            <TextField 
              size="small"
              variant='outlined'
              label='BalanceAmt'
              inputProps={{readOnly: true}}
              fullWidth
              sx={{
                m:1,
              }}
              value={ longDataParser(user?.balance.toString() ?? '0') }
            />
          </td>
          <td colSpan={2}>
            <TextField 
              size="small"
              variant='outlined'
              label='CounterOfVerification'
              inputProps={{readOnly: true}}
              fullWidth
              sx={{
                m:1,
              }}
              value={ longDataParser(user?.counterOfV.toString() ?? '0') }
            />
          </td>
          <td>
            <TextField 
              size="small"
              variant='outlined'
              label='TypeOfAcct'
              inputProps={{readOnly: true}}
              fullWidth
              sx={{
                m:1,
                minWidth: 168,
              }}
              value={ user?.isCOA ? 'COA' : 'EOA' }
            />
          </td>

          </tr>

          <tr>
            <td>
              <CopyLongStrTF size="body1" title='PrimeKey' src={user?.primeKey.pubKey.toLowerCase() ?? '-'} />
            </td>
            <td>
              <TextField 
                size="small"
                variant='outlined'
                label='Info_1'
                inputProps={{readOnly: true}}
                fullWidth
                sx={{
                  m:1,
                  minWidth: 168,
                }}
                value={ toStr(user?.primeKey.refund ?? 0) }
              />
            </td>
            <td>
              <TextField 
                size="small"
                variant='outlined'
                label='Info_2'
                inputProps={{readOnly: true}}
                fullWidth
                sx={{
                  m:1,
                  minWidth: 168,
                }}
                value={ toStr(user?.primeKey.discount ?? 0) }
              />
            </td>
            <td>
              <TextField 
                size="small"
                variant='outlined'
                label='Info_3'
                inputProps={{readOnly: true}}
                fullWidth
                sx={{
                  m:1,
                  minWidth: 168,
                }}
                value={ toStr( user?.primeKey.gift ?? 0 ) }
              />
            </td>

            <td>
              <TextField 
                size="small"
                variant='outlined'
                label='Info_4'
                inputProps={{readOnly: true}}
                fullWidth
                sx={{
                  m:1,
                  minWidth: 168,
                }}
                value={ toStr( user?.primeKey.coupon ?? 0 ) }
              />
            </td>

          </tr>

          <tr>
            <td>
              <CopyLongStrTF size="body1" title='BackupKey' src={ user?.backupKey.pubKey.toLowerCase() ?? '-' } />
            </td>
            <td>
              <TextField 
                size="small"
                variant='outlined'
                label='RefundRate'
                inputProps={{readOnly: true}}
                fullWidth
                sx={{
                  m:1,
                  minWidth: 168,
                }}
                value={ toPercent(user?.backupKey.refund ?? 0) }
              />
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
                  minWidth: 168,
                }}
                value={ toPercent( user?.backupKey.discount ?? 0 ) }
              />
            </td>
            <td>
              <TextField 
                size="small"
                variant='outlined'
                label='GiftAmt'
                inputProps={{readOnly: true}}
                fullWidth
                sx={{
                  m:1,
                  minWidth: 168,
                }}
                value={ longDataParser(user?.backupKey.discount.toString() ?? '0') }
              />
            </td>
            <td>
              <TextField 
                size="small"
                variant='outlined'
                label='CouponAmt'
                inputProps={{readOnly: true}}
                fullWidth
                sx={{
                  m:1,
                  minWidth: 168,
                }}
                value={ longDataParser(user?.backupKey.coupon.toString() ?? '0') }
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
                <ActionsOfUser user={user} isOwner={isOwner} showList={showList} setShowList={setShowList} refreshList={getLocksList} getUser={ obtainUser } />
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
                <HashLockerOfPoints open={ open } locker={ locker } userNo={ userNo } setOpen={ setOpen } refreshList={ getLocksList } getUser={ obtainUser }  />
              )}
            </td>
          </tr>

        </tbody>
      </table>
    </Paper>
  );
}

export default UserInfo;