"use client"

import { useEffect, useState } from 'react';

import { 
  FormControl, 
  InputLabel, 
  MenuItem, 
  Select,
} from '@mui/material';

import { AddrZero, HexType } from '../../../common';
import { HexParser } from '../../../common/toolsKit';
import { SetBookAddrProps } from '../../../components/SetBookAddr';

const gmms = [
  "0x5887E0768fdE5Bb1673d7F9A0e084cc87A2488FB",
  "0xd02114Eb9C569b0db4d60988b7aE179a5d170539",
  "0xb183cE2a7787b6319b9f9d1F4ECa5422393D1732",
  "0x7fD7bA313ACb928F92fB7BB67729c999A5b50744"
];

export function HistOfGMM({ setAddr }: SetBookAddrProps) {

  const [ temp, setTemp ] = useState<HexType>(AddrZero);

  useEffect(()=>{
    if (!temp) {
      setAddr(temp);
    }
  }, [temp, setAddr]);

  return (
    <FormControl variant="outlined" size="small" sx={{ m:1, mr:5, minWidth: 218 }}>
      <InputLabel id="typeOfAction-label">HistOfGMM:</InputLabel>
      <Select
        labelId="typeOfAction-label"
        id="typeOfAction-select"
        label="HistOfGMM"
        value={ temp }
        onChange={(e) => setTemp(HexParser(e.target.value))}
      >
        {gmms.map((v,i) => (
          <MenuItem key={v} value={ v } > <b>GMM_{i+1}</b> </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
