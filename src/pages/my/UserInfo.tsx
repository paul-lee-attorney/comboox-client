import { useEffect, useState } from "react";
import { AddrOfRegCenter, AddrZero } from "../../interfaces";
import { Locker, User, getOwner, getLocker, getUser } from "../../queries/rc";
import { Checkbox, Collapse, Divider, FormControlLabel, Paper, Radio, RadioGroup, Stack, TextField, Toolbar } from "@mui/material";
import { longDataParser, longSnParser } from "../../scripts/toolsKit";
import { RegUser } from "../../components/center/RegUser";
import { useRegCenterGetLocksList } from "../../generated";
import { SetBackupKey } from "../../components/center/SetBackupKey";
import { useAccount } from "wagmi";
import { MintTools } from "../../components/center/MintTools";
import { LockersList } from "../../components/center/LockersList";
import { HashLockerOfPoints } from "../../components/center/HashLockerOfPoints";
import { TransferTools } from "../../components/center/TransferTools";
import { LockConsideration } from "../../components/center/LockConsideration";
import { useComBooxContext } from "../../scripts/ComBooxContext";


function UserInfo() {


  const { userNo } = useComBooxContext();

  const [ user, setUser ] = useState<User>();

  const obtainUser = async ()=>{
    setUser( await getUser());
  }

  const [ isOwner, setIsOwner ] = useState(false);

  const { address:signer, isConnected } = useAccount();

  const checkOwner = async ()=>{
    let owner = await getOwner(AddrOfRegCenter);
    setIsOwner(signer ? signer == owner : false);
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
    obtainUser();
    checkOwner();
  });

  const [ open, setOpen ] = useState(false);
  const [ locker, setLocker ] = useState<Locker>();

  const [ typeOfAction, setTypeOfAction ] = useState<string>();

  const [ showList, setShowList ] = useState(false);

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
          {userNo && (
            <>
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
                  minWidth: 465,
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
            </>
          )}

            <tr>
              <td colSpan={4}>

                {!userNo && (
                  <RegUser getUser={ obtainUser } />
                )}

                {userNo && (
                  <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }} >
                    <Stack direction='row' sx={{ alignItems:'center', justifyContent:'space-between', color:'black', }}>

                      <Toolbar >
                        <h4>User Actions</h4>
                      </Toolbar>

                      <FormControlLabel 
                        label='Show Lockers List'
                        sx={{
                          ml: 1,
                        }}
                        control={
                          <Checkbox 
                            sx={{
                              m: 1,
                              height: 64,
                            }}
                            onChange={e => setShowList(e.target.checked)}
                            checked={ showList }
                          />
                        }
                      />

                    </Stack>

                    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }} >
                      <RadioGroup
                        sx={{mx:1, px:1, color:'black' }}
                        row
                        aria-labelledby="typeOfActionRadioGrup"
                        name="typeOfActionRadioGroup"
                        onChange={(e)=>(setTypeOfAction(e.target.value))}
                        defaultValue={'0'}
                      >
                        {userNo && user && user.backupKey.pubKey == AddrZero && (
                          <FormControlLabel value={'0'} control={<Radio size='small' />} label="Set BackupKey" />
                        )}

                        {isOwner && (
                          <FormControlLabel value={'1'} control={<Radio size='small' />} label="Mint Points" />
                        )}
                        {!isOwner && (
                          <FormControlLabel value={'2'} control={<Radio size='small' />} label="Transfer Points" />
                        )}

                        <FormControlLabel value={'3'} control={<Radio size='small' />} label="Lock Consideration" />
                      </RadioGroup>
                    </Paper>

                  </Paper>
                )}

              </td>
            </tr>

            <tr>
              <td colSpan={4}>
                {userNo && user && user.backupKey.pubKey == AddrZero && (
                  <Collapse in={ typeOfAction == '0' } >
                    <SetBackupKey getUser={ obtainUser } />
                  </Collapse>
                )}
                {isOwner && (
                  <Collapse in={ typeOfAction == '1' } >
                    <MintTools refreshList={ getLocksList } />
                  </Collapse>
                )}
                {!isOwner && (
                  <Collapse in={ typeOfAction == '2' } >
                    <TransferTools refreshList={ getLocksList } getUser={ obtainUser } />
                  </Collapse>
                )}
                  <Collapse in={ typeOfAction == '3' }>
                    <LockConsideration refreshList={ getLocksList } getUser={ obtainUser } />                  
                  </Collapse>
              </td>
            </tr>

            <tr>
              <td colSpan={4}>
                {lockersList && userNo && showList && (
                  <LockersList list={ lockersList } setLocker={ setLocker } setOpen={ setOpen } />
                )}
              </td>
            </tr>

            <tr>
              <td colSpan={4}>
                {locker && userNo && (
                  <HashLockerOfPoints open={ open } locker={ locker } userNo={ userNo } setOpen={ setOpen } refreshList={ getLocksList } getUser={ obtainUser }  />
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