"use client"

import { useEffect, useState } from "react";
import { Button, FormControl, InputLabel, MenuItem, Paper, Select, Stack, Toolbar } from "@mui/material";
import { updateMonthlyEthPrices } from "../../../api/firebase/ethPriceTools";

export const aMonths = [
    '2023-11', '2023-12', '2024-01', '2024-02', '2024-03',
    '2024-04', '2024-05', '2024-06', '2024-07', '2024-08',
    '2024-09', '2024-10' 
]

function EthPrices() {

useEffect(()=>{
    const updateEthPrices = async ()=>{
        let flag = await updateMonthlyEthPrices();
        if (flag) console.log('successfully updated Eth Prices!');
        else console.log('failed Eth Prices update!');
    };
    
    updateEthPrices();
});

    const [ availableMonth, setAvailableMonth ] = useState('');

    const uploadEthPrices = async () => {
        if (!availableMonth) return;
        // let flag = await uploadPricesOfMonth(availableMonth);
        // if (flag) console.log('uploaded prices ');
    }

    return (
    <Paper elevation={3} sx={{m:1, p:1, color:'divider', border:1 }} >
        <Stack direction={'row'} sx={{ alignItems:'center', color:'black' }} >
    
            <Toolbar sx={{ textDecoration:'underline' }}>
                <h4>Upload ETH Prices</h4>
            </Toolbar>
    
            <FormControl variant="outlined" size="small" sx={{ m: 1, minWidth: 168 }}>
                <InputLabel id="MonthOfPrice-label">MonthOfPrice</InputLabel>
                <Select
                labelId="MonthOfPrice-label"
                id="MonthOfPrice-select"
                label="MonthOfPrice"
                value={ availableMonth }
                onChange={(e) => setAvailableMonth(e.target.value)}
                >
                {aMonths.map((v) => (
                    <MenuItem key={v} value={v} > <b>{v}</b> </MenuItem>
                ))}
                </Select>
            </FormControl>

            <Button
                variant="outlined"
                sx={{m:0.5, minWidth:288, justifyContent:'start'}}
                onClick={()=>uploadEthPrices()}
            >
                Upload
            </Button>
    
        </Stack>
    </Paper>          
    );
}

export default EthPrices;
