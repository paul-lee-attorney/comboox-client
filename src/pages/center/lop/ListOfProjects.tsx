import { useEffect, useState } from "react";

import {
  Paper, 
  Toolbar,
  TextField,
  Stack,
} from "@mui/material";

import { useComBooxContext } from "../../../scripts/common/ComBooxContext";

import { Create } from "@mui/icons-material";

import {
  useRegCenterCreateDoc, 
} from "../../../generated";

import { CopyLongStrSpan } from "../../../components/common/utils/CopyLongStr";
import { AddrOfRegCenter, AddrZero, HexType } from "../../../scripts/common";
import { FormResults, HexParser, defFormResults, hasError, onlyHex, refreshAfterTx } from "../../../scripts/common/toolsKit";
import { LoadingButton } from "@mui/lab";
import { Doc, getDocsList } from "../../../scripts/center/rc";
import { GetDocsList } from "../../../components/center/lop/GetDocsList";
import { useRouter } from "next/router";

function ListOfProjects() {
  const { gk, boox, setErrMsg } = useComBooxContext();
  const [ time, setTime ] = useState(0);
  const [ loading, setLoading ] = useState(false);

  const router = useRouter();

  const refresh = ()=>{
    setTime(Date.now());
    setLoading(false);
  }

  const [ docList, setDocList ] = useState<readonly Doc[]>();

  const snOfDoc:HexType = `0x${'0000001B00000001'.padEnd(64,'0')}`;
  const [ owner, setOwner ] = useState<HexType>(AddrZero);
  const [ valid, setValid ] = useState<FormResults>(defFormResults);

  const {
    isLoading: createPayrollLoading, 
    write: createPayroll,
  } = useRegCenterCreateDoc({
    address: AddrOfRegCenter,
    onError(err){
      setErrMsg(err.message);
    },

    onSuccess(data) {
      setLoading(true);
      let hash:HexType = data.hash;
      refreshAfterTx(hash, refresh);
    }
  });

  const handleClick = ()=>{
    createPayroll({
      args: [snOfDoc, owner],
    });
  };

  useEffect(()=>{
    getDocsList(snOfDoc).then(
      ls => setDocList(ls)
    )
  }, [snOfDoc, time]);

  const [ open, setOpen ] = useState<boolean>(false);
  return (
    <>
      <Paper elevation={3} sx={{alignContent:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >
        <Stack direction='row' sx={{ alignContent:'space-between' }}>

          <Toolbar sx={{ textDecoration:'underline' }}>
            <h3>POP - Payroll Of Projects</h3>
          </Toolbar>

          {AddrOfRegCenter && (
            <CopyLongStrSpan title="Addr"  src={AddrOfRegCenter.toLowerCase()} />
          )}

        </Stack>

        <table width={880} >
          <thead />
          
          <tbody>

            <tr>        
              <td colSpan={2}>
                <Stack 
                    direction={'row'}
                  >
                    <TextField 
                      sx={{ m: 1, minWidth: 488 }} 
                      id="tfOwner" 
                      label="Owner" 
                      error={ valid['Owner']?.error }
                      variant="outlined"
                      helperText="Address"
                      onChange={(e) => {
                        let input = HexParser(e.target.value);
                        onlyHex('Owner', input, 40, setValid);
                        setOwner(input);
                      }}
                      value = { owner }
                      size='small'
                    />

                    <LoadingButton 
                      disabled={createPayrollLoading || hasError(valid)}
                      loading={loading}
                      loadingPosition="end"
                      sx={{ m: 1, minWidth: 180, height: 40 }} 
                      variant="contained" 
                      endIcon={ <Create /> }
                      onClick={ handleClick }
                      size='small'
                    >
                      Create Payroll
                    </LoadingButton>

                </Stack>
              </td>
            </tr>

            <tr>
              <td colSpan={4}>
                <GetDocsList list={ docList } />
              </td>
            </tr>

          </tbody>

        </table>

      </Paper>
    </>
  );
} 

export default PayrollOfProjects;