import { useEffect, useState } from "react";
import { AddrOfRegCenter, AddrZero } from "../../interfaces";
import { User, getMyUserNo, getUser } from "../../queries/rc";
import { Collapse, Divider, Paper, TextField, Toolbar } from "@mui/material";
import { longDataParser, longSnParser } from "../../scripts/toolsKit";
import { RegUser } from "../../components/center/RegUser";
import { regCenterABI, useRegCenterGetMyUserNo, useRegCenterGetUser } from "../../generated";
import { SetBackupKey } from "../../components/center/SetBackupKey";
import { useAccount, useContract, useSigner } from "wagmi";
import { MintPoints } from "../../components/center/MintPoints";





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

  useEffect(()=>{
    obtainMyUserNo();
    obtainUser();
  });

  return (
    <Collapse in={isConnected} >
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
                  value={ user?.primeKey.pubKey ?? '-' }
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
                  value={ user?.backupKey.pubKey ?? '-' }
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
                {userNo && (
                  <MintPoints />
                )}
              </td>
            </tr>

          </tbody>
        </table>
      </Paper>
    </Collapse>
  );
}

export default UserInfo;