import { useEffect, useState } from "react";
import { AddrOfRegCenter, AddrZero, HexType } from "../../interfaces";
import { Locker, User, getMyUserNo, getOwner, getUser, getLocker } from "../../queries/rc";
import { Collapse, Divider, Paper, TextField, Toolbar } from "@mui/material";
import { longDataParser, longSnParser } from "../../scripts/toolsKit";
import { RegUser } from "../../components/center/RegUser";
import { regCenterABI, useRegCenterGetLocksList, useRegCenterGetMyUserNo, useRegCenterGetUser } from "../../generated";
import { SetBackupKey } from "../../components/center/SetBackupKey";
import { useAccount, useContract, useSigner } from "wagmi";
import { MintPoints } from "../../components/center/MintPoints";
import { MintAndLockPoints } from "../../components/center/MintAndLockPoints";
import { MintTools } from "../../components/center/MintTools";
import { LockersList } from "../../components/center/LockersList";
import { HashLockerOfPoints } from "../../components/center/HashLockerOfPoints";






function UserInfo() {

  const {isConnected} = useAccount();

  const {data: signer} = useSigner();


  const rc = useContract({
    address: AddrOfRegCenter,
    abi: regCenterABI,
    signerOrProvider: signer,
  });

  const [ userNo, setUserNo ] = useState<number>();

  const obtainMyUserNo = async ()=> {
    let res = await rc?.getMyUserNo();
    res && setUserNo( res );
  }

  const [ user, setUser ] = useState<User>();

  const obtainUser = async ()=>{
    let res = await rc?.getUser();
    res && setUser( res );
  }

  const [ isOwner, setIsOwner ] = useState(false);

  const checkOwner = async ()=>{
    let owner = await getOwner(AddrOfRegCenter);
    let addrOfSigner = await signer?.getAddress();
    setIsOwner(addrOfSigner == owner);
  }

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

  useEffect(()=>{
    obtainMyUserNo();
    obtainUser();
    checkOwner();
  });

  const [ open, setOpen ] = useState(false);
  const [ locker, setLocker ] = useState<Locker>();

  return (
    // <Collapse in={isConnected} >
    <>
    {isConnected && (
      <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', m:1, p:1, border:1, borderColor:'divider' }} >
        <Toolbar>
          <h3>User Info - ( No. { longSnParser(userNo?.toString() ?? '0') } ) </h3>
        </Toolbar>

        <table >
          <thead />

          <tbody>
            <tr>
              <td>
                <TextField 
                  size="small"
                  variant='filled'
                  label='BalanceAmt'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 456,
                  }}
                  value={ longDataParser(user?.balance.toString() ?? '0') }
                />
              </td>
              <td colSpan={2}>
                <TextField 
                  size="small"
                  variant='filled'
                  label='CounterOfVerification'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 456,
                  }}
                  value={ longDataParser(user?.counterOfV.toString() ?? '0') }
                />
              </td>
              <td>
                <TextField 
                  size="small"
                  variant='filled'
                  label='TypeOfAcct'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ user?.isCOA ? 'COA' : 'EOA' }
                />
              </td>

            </tr>

            <tr>
              <td>
                <TextField 
                  size="small"
                  variant='filled'
                  label='PrimeKey'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 456,
                  }}
                  value={ user?.primeKey.pubKey.toLowerCase() ?? '-' }
                />
              </td>
              <td>
                <TextField 
                  size="small"
                  variant='filled'
                  label='SeqOfKey'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ user?.primeKey.seqOfKey.toString(16).padStart(4, '0') ?? '-' }
                />
              </td>
              <td>
                <TextField 
                  size="small"
                  variant='filled'
                  label='DataOfKey'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ user?.primeKey.dataOfKey.toString(16).padStart(8, '0') ?? '-' }
                />
              </td>
              <td>
                <TextField 
                  size="small"
                  variant='filled'
                  label='DateOfKey'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ user?.primeKey.dateOfKey.toString(16).padStart(12, '0') ?? '-' }
                />
              </td>
            </tr>

            <tr>
              <td>
                <TextField 
                  size="small"
                  variant='filled'
                  label='BackupKey'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 456,
                  }}
                  value={ user?.backupKey.pubKey.toLowerCase() ?? '-' }
                />
              </td>
              <td>
                <TextField 
                  size="small"
                  variant='filled'
                  label='SeqOfKey'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ user?.backupKey.seqOfKey.toString(16).padStart(4, '0') ?? '-'}
                />
              </td>
              <td>
                <TextField 
                  size="small"
                  variant='filled'
                  label='DataOfKey'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ user?.backupKey.dataOfKey.toString(16).padStart(8, '0') ?? '-' }
                />
              </td>
              <td>
                <TextField 
                  size="small"
                  variant='filled'
                  label='DateOfKey'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ user?.backupKey.dateOfKey.toString(16).padStart(12, '0') ?? '-' }
                />
              </td>
            </tr>

            <tr>
              <td colSpan={4} >
                <Divider />
              </td>
            </tr>

            <tr>
              <td colSpan={4}>
                {lockersList && (
                  <LockersList list={ lockersList } setLocker={ setLocker } setOpen={ setOpen } />
                )}
              </td>
            </tr>

            <tr>
              <td colSpan={4}>
                {locker && (
                  <HashLockerOfPoints open={ open } locker={ locker } setOpen={ setOpen } refreshList={ getLocksList }  />
                )}
              </td>
            </tr>

            <tr>
              <td colSpan={4}>
                {!userNo && (
                  <RegUser getMyUserNo={ obtainMyUserNo } getUser={ obtainUser } />
                )}
              </td>
            </tr>

            <tr>
              <td colSpan={4}>
                {userNo && user && user.backupKey.pubKey == AddrZero && (
                  <SetBackupKey getUser={ obtainUser } />
                )}
              </td>
            </tr>

            <tr>
              <td colSpan={4}>
                {isOwner && (
                  <MintTools refreshList={ getLocksList } />
                )}
              </td>
            </tr>

          </tbody>
        </table>
      </Paper>
    )}
    </>
  );
}

export default UserInfo;