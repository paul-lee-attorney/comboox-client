import { useAccount } from 'wagmi';
import { useState } from 'react';
import { GetDoc } from './GetDoc';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
// import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';



export function DocFinder() {
  const {isConnected} = useAccount();

  const [typeOfDoc, setTypeOfDoc] = useState('');
  const [nameOfDoc, setNameOfDoc] = useState('');
  const [version, setVersion] = useState('');
  const [seqOfDoc, setSeqOfDoc] = useState('');

  const [snOfDoc, setSnOfDoc] = useState('');

  const handleTypeChange = (e: SelectChangeEvent) => {
    setTypeOfDoc(e.target.value);
    console.log(e.target.value);
  };

  const handleClick = () => {
    const sn = parseInt(typeOfDoc).toString(16).padStart(4, '0') +
      parseInt(version).toString(16).padStart(4, '0') +
      parseInt(seqOfDoc).toString(16).padStart(16, '0') + '0'.padEnd(40, '0');
    console.log(sn); 
    setSnOfDoc(sn);
  };



  // const [compSn, setCompSn] = useState<string>();
  // const [snOfDoc, setSnOfDoc] = useState<string>();

  return (
    <>
      {isConnected && (
        <div>
          <Box >

            <FormControl sx={{ m: 1, minWidth: 120 } } >
              <InputLabel id="lable-TypeOfDoc">Type</InputLabel>
              <Select
                labelId="select-helper-label-typeOfDoc"
                id="slTypeOfDoc"
                value={typeOfDoc}
                label="Type"
                onChange={ handleTypeChange }                
                autoWidth
                size='small'
              >
                <MenuItem value={''}><em>None</em></MenuItem>
                <MenuItem value={20}>GeneralKeeper</MenuItem>
                <MenuItem value={1}>BOAKeeper</MenuItem>
                <MenuItem value={2}>BODKeeper</MenuItem>
                <MenuItem value={3}>BOGKeeper</MenuItem>
                <MenuItem value={4}>BOHKeeper</MenuItem>
                <MenuItem value={5}>BOOKeeper</MenuItem>
                <MenuItem value={6}>BOPKeeper</MenuItem>
                <MenuItem value={7}>BOSKeeper</MenuItem>
                <MenuItem value={8}>ROMKeeper</MenuItem>
                <MenuItem value={9}>ROSKeeper</MenuItem>
                <MenuItem value={10}>SHAKeeper</MenuItem>
                <MenuItem value={11}>BOA</MenuItem>
                <MenuItem value={12}>BOD</MenuItem>
                <MenuItem value={13}>BOG</MenuItem>
                <MenuItem value={14}>BOH</MenuItem>
                <MenuItem value={15}>BOO</MenuItem>
                <MenuItem value={16}>BOP</MenuItem>
                <MenuItem value={17}>BOS</MenuItem>
                <MenuItem value={18}>ROM</MenuItem>
                <MenuItem value={19}>ROS</MenuItem>
                <MenuItem value={21}>InvestmentAgreement</MenuItem>
                <MenuItem value={22}>ShareholdersAgreement</MenuItem>
                <MenuItem value={23}>AntiDilution</MenuItem>
                <MenuItem value={24}>DragAlong</MenuItem>
                <MenuItem value={25}>LockUp</MenuItem>
                <MenuItem value={26}>Options</MenuItem>
                <MenuItem value={27}>TagAlong</MenuItem>
              </Select>
            </FormControl>

            <TextField 
              sx={{ m: 1, minWidth: 120 }} 
              id="txVersion" 
              label="Version" 
              variant="outlined"
              helperText="Integer < 2^17 (e.g. '12')"
              onChange={(e) => setVersion(e.target.value)}
              value = {version}
              size='small'
            />

            <TextField 
              sx={{ m: 1, minWidth: 300 }} 
              id="txSeqOfDoc" 
              label="Sequence" 
              variant="outlined"
              helperText="Integer < 2^65 (e.g. '3223438')"
              onChange={(e) => setSeqOfDoc(e.target.value)}
              value = {seqOfDoc}
              size='small'
            />

            <Button 
              disabled = {typeOfDoc == '' ||
                          version == '' || 
                          seqOfDoc == ''}

              sx={{ m: 1, minWidth: 120, height: 40 }} 
              variant="contained" 
              endIcon={<SearchIcon />}
              onClick={handleClick}
              size='small'
            >
              Search
            </Button>


          </Box>

          {snOfDoc && (
             <GetDoc sn={snOfDoc} />
           )}

        </div>








        // <div>
        //   <input
        //     size={80}
        //     onChange={(e) => setCompSn(e.target.value)}
        //     placeholder="Company SN (80-bits HexNumber, e.g. '0x123456789abcdef12345')"
        //     value={compSn}
        //   />          
        //   <button onClick={handleClick}>
        //     query
        //   </button>

        //   {snOfDoc && (
        //     <GetDoc sn={snOfDoc} />
        //   )}

        // </div>
      )}
    </>
  )
}
