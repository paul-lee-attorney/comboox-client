import { BigNumber } from "ethers";
import { Bytes32Zero, HexType } from "../../../../interfaces";
import { readContract, waitForTransaction } from "@wagmi/core";
import { investmentAgreementABI, useFilesFolder, useFilesFolderGetHeadOfFile, useInvestmentAgreementAddDeal, useInvestmentAgreementDelDeal, useInvestmentAgreementGetDeal, usePrepareInvestmentAgreementAddDeal, usePrepareInvestmentAgreementDelDeal } from "../../../../generated";
import { useEffect, useState } from "react";
import { Box, Button, Checkbox, Collapse, FormControl, FormControlLabel, InputLabel, MenuItem, Paper, Select, Stack, TextField, Toolbar } from "@mui/material";
import { AddCircle, EditNote, LockClock, RemoveCircle } from "@mui/icons-material";
import { ExecDeal } from "./ExecDeal";

import dayjs, { Dayjs } from 'dayjs';
import { DateTimeField } from "@mui/x-date-pickers";
import { useComBooxContext } from "../../../../scripts/ComBooxContext";

export interface Head {
  typeOfDeal: number,
  seqOfDeal: number,
  preSeq: number,
  classOfShare: number,
  seqOfShare: number,
  seller: number,
  priceOfPaid: number,
  priceOfPar: number,
  closingDate: number,
  para: number,
}

const defaultHead: Head = {
  typeOfDeal: 2,
  seqOfDeal: 0,
  preSeq: 0,
  classOfShare: 1,
  seqOfShare: 0,
  seller: 0,
  priceOfPaid: 100,
  priceOfPar: 100,
  closingDate: parseInt((new Date().getTime()/1000).toString()) + 90*86400,
  para: 0,
}

export interface Body {
  buyer: number,
  groupOfBuyer: number,
  paid: BigNumber,
  par: BigNumber,
  state: number,
  para: number,
  argu: number,
  flag: boolean,
}

const defaultBody: Body = {
  buyer: 0,
  groupOfBuyer: 0,
  paid: BigNumber.from(0),
  par: BigNumber.from(0),
  state: 0,
  para: 0,
  argu: 0,
  flag: false,
}

export interface Deal {
  head: Head,
  body: Body,
  hashLock: HexType,
}

const defaultDeal: Deal = {
  head: defaultHead,
  body: defaultBody,
  hashLock: Bytes32Zero,
}

export const stateOfDeal = ['Drafing', 'Locked', 'Cleared', 'Closed', 'Terminated'];

// async function parseDeal(deal: Deal): Promise<Deal> {

//   let head: Head = {
//     typeOfDeal: deal.head.typeOfDeal,
//     seqOfDeal: deal.head.seqOfDeal,
//     preSeq: deal.head.preSeq,
//     classOfShare: deal.head.classOfShare,
//     seqOfShare: deal.head.seqOfShare,
//     seller: deal.head.seller,
//     priceOfPaid: deal.head.priceOfPaid,
//     priceOfPar: deal.head.priceOfPar,
//     closingDate: deal.head.closingDate,
//   }

//   let body: Body = {
//     buyer: deal.body.buyer,
//     groupOfBuyer: deal.body.groupOfBuyer,
//     paid: deal.body.paid,
//     par: deal.body.par,
//     state: deal.body.state,    
//   }

//   let output: Deal = {
//     head: head,
//     body: body,
//     hashLock: deal.hashLock,
//   }

//   return output;
// }

export const TypeOfDeal = [
  'NaN', 
  'CapitalIncrease', 
  'ShareTransferExternal', 
  'ShareTransferInternal', 
  'PreEmptive', 
  'TagAlong', 
  'DragAlong', 
  'FirstRefusal', 
  'FreeGift'
];

export const TypeOfIa = [
  'NaN',
  'CapitalIncrease',
  'ShareTransferExternal',
  'ShareTransferInternal',
  'CI & STint',
  'SText & STint',
  'CI & SText & STint',
  'CI & SText'
]

export const StateOfDeal = [
  'Drafting',
  'Locked',
  'Cleared',
  'Closed',
  'Terminated'
];

interface SetDealProps{
  ia: HexType,
  seq: number, 
  finalized: boolean,
}

export function SetDeal({ia, seq, finalized}: SetDealProps) {

  const [ objSn, setObjSn ] = useState<Head>(defaultHead);

  let hexSn:HexType = `0x${
    (objSn?.typeOfDeal.toString(16).padStart(2, '0') ?? defaultHead.typeOfDeal.toString(16).padStart(2, '0')) +
    seq.toString(16).padStart(4, '0') +
    (objSn?.preSeq.toString(16).padStart(4, '0') ?? defaultHead.preSeq.toString(16).padStart(4, '0')) +
    (objSn?.classOfShare.toString(16).padStart(4, '0') ?? defaultHead.classOfShare.toString(16).padStart(4, '0')) +
    (objSn?.seqOfShare.toString(16).padStart(8, '0') ?? defaultHead.seqOfShare.toString(16).padStart(8, '0')) +
    (objSn?.seller.toString(16).padStart(10, '0') ?? defaultHead.seller.toString(16).padStart(10, '0')) +
    (objSn?.priceOfPaid.toString(16).padStart(8, '0') ?? defaultHead.priceOfPaid.toString(16).padStart(8, '0')) +
    (objSn?.priceOfPar.toString(16).padStart(8, '0') ?? defaultHead.priceOfPar.toString(16).padStart(8, '0')) +
    (objSn?.closingDate.toString(16).padStart(12, '0') ?? defaultHead.closingDate?.toString(16).padStart(12, '0')) + 
    '0000'
  }`;

  const [ objBody, setObjBody ] = useState<Body>(defaultBody);

  const [ newDeal, setNewDeal ] = useState<Deal>(defaultDeal);

  const {
    refetch: getDeal,
  } = useInvestmentAgreementGetDeal({
    address: ia,
    args: [BigNumber.from(seq)],
    onSuccess(deal) {
      setNewDeal(deal)
    }
  })

  const {
    config: configAddDeal,
  } = usePrepareInvestmentAgreementAddDeal({
    address: ia,
    args: [ hexSn,
            BigNumber.from(objBody.buyer),
            BigNumber.from(objBody.groupOfBuyer),
            BigNumber.from(objBody.paid),
            BigNumber.from(objBody.par)            
          ],
  });

  const {
    isLoading: addDealLoading,
    write: addDeal,
  } = useInvestmentAgreementAddDeal({
    ...configAddDeal,
    onSuccess() {
      getDeal()
    }
  });

  const {
    config: configDelDeal
  } = usePrepareInvestmentAgreementDelDeal({
    address: ia,
    args: [ BigNumber.from(seq) ],
  });

  const {
    isLoading: delDealLoading,
    write: delDeal,
  } = useInvestmentAgreementDelDeal({
    ...configDelDeal,
    onSuccess() {
      getDeal()
    }
  });

  const [ editable, setEditable ] = useState<boolean>(false); 

  const [ hashLock, setHashLock ] = useState<HexType>();
  
  // useEffect(()=>{
  //   getDeal(ia, seq).then(deal => setNewDeal(deal))
  // }, [ia, seq, hashLock]);


  const { boox } = useComBooxContext();

  const [ fileState, setFileState ] = useState<number>();

  const {
    refetch: getHeadOfFile,
  } = useFilesFolderGetHeadOfFile({
    address: boox[1],
    args: [ia],
    onSuccess(head) {
      setFileState(head.state)
    }
  })

  // useEffect(()=>{
  //   if (ia) getHeadOfFile()
  // }, [ ia, getHeadOfFile ])

  return (
    <Paper sx={{
      alignContent:'center', 
      justifyContent:'center', 
      p:1, m:1, 
      border: 1, 
      borderColor:'divider' 
      }} 
    >

        <Stack direction={'row'} sx={{ justifyContent: 'space-between', alignItems: 'center' }} >        
          <Box sx={{ minWidth:600 }} >
            <Toolbar>
              <h4>Deal No. { seq.toString() } </h4>
            </Toolbar>
          </Box>

          {!finalized && (
            <Stack direction={'row'} sx={{ alignItems:'center'}} >

              <Button 
                disabled = {!addDeal || addDealLoading}

                sx={{ m:1, mr:5, p:1, minWidth: 120, height: 40 }} 
                variant="contained" 
                startIcon={<AddCircle />}
                onClick={()=> addDeal?.()}
                size='small'
              >
                Add_Deal
              </Button>

              <Button 
                disabled = {!delDeal || delDealLoading}

                sx={{ m:1, ml:5, p:1, minWidth: 120, height: 40 }} 
                variant="contained" 
                endIcon={<RemoveCircle />}
                onClick={()=> delDeal?.()}
                size='small'
              >
                Remove_Deal
              </Button>

              <FormControlLabel 
                label='Edit'
                sx={{
                  ml: 1,
                }}
                control={
                  <Checkbox 
                    sx={{
                      m: 1,
                      height: 64,
                    }}
                    onChange={e => setEditable(e.target.checked)}
                    checked={ editable }
                  />
                }
              />     

            </Stack>
          )}


        </Stack>

        <Stack 
          direction={'column'} 
          spacing={1} 
        >

          <Paper sx={{
            p:1, 
            border: 1, 
            borderColor:'divider' 
            }} 
          >
            <Stack direction={'row'} sx={{ alignItems: 'center' }} >

            {newDeal?.head.seqOfDeal != undefined && (
                <TextField 
                  variant='filled'
                  label='SeqOfDeal'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ newDeal.head.seqOfDeal.toString() }
                />
              )}

              {newDeal?.head.preSeq != undefined && (
                <TextField 
                  variant='filled'
                  label='PreSeq'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ newDeal.head.preSeq.toString() }
                />
              )}

              {newDeal?.head.closingDate != undefined && (
                <TextField 
                  variant='filled'
                  label='ClosingDate'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ dayjs.unix(newDeal.head.closingDate).format('YYYY-MM-DD HH:mm:ss') }
                />
              )}

              {newDeal?.body.state != undefined && (
                <TextField 
                  variant='filled'
                  label='State'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ stateOfDeal[newDeal.body.state] }
                />
              )}

            </Stack>
          </Paper>

          <Paper sx={{
            p:1, 
            border: 1, 
            borderColor:'divider' 
            }} 
          >

            <Stack direction={'row'} sx={{ alignItems: 'center' }} >

              {newDeal?.head.typeOfDeal != undefined && (
                <TextField 
                  variant='filled'
                  label='TypeOfDeal'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ TypeOfDeal[newDeal.head.typeOfDeal] }
                />
              )}

              {newDeal?.head.classOfShare != undefined && (
                <TextField 
                  variant='filled'
                  label='ClassOfShare'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ newDeal.head.classOfShare.toString() }
                />
              )}

              {newDeal?.head.seqOfShare != undefined && (
                <TextField 
                  variant='filled'
                  label='SeqOfShare'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ newDeal.head.seqOfShare.toString() }
                />
              )}

              {newDeal?.head.priceOfPaid != undefined && (
                <TextField 
                  variant='filled'
                  label='PriceOfPaid'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ newDeal.head.priceOfPaid.toString() }
                />
              )}

              {newDeal?.head.priceOfPar != undefined && (
                <TextField 
                  variant='filled'
                  label='PriceOfPar'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ newDeal.head.priceOfPar.toString() }
                />
              )}

              {newDeal?.head.closingDate != undefined && (
                <TextField 
                  variant='filled'
                  label='ClosingDate'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ dayjs.unix(newDeal.head.closingDate).format('YYYY-MM-DD HH:mm:ss') }
                />
              )}

            </Stack>

            <Collapse in={ editable && !finalized } >
              <Stack direction={'row'} sx={{ alignItems: 'center', backgroundColor:'lightcyan' }} >

                <FormControl variant="filled" sx={{ m: 1, minWidth: 218 }}>
                  <InputLabel id="typeOfDeal-label">TypeOfDeal</InputLabel>
                  <Select
                    labelId="typeOfDeal-label"
                    id="typeOfDeal-select"
                    value={ objSn?.typeOfDeal }
                    onChange={(e) => setObjSn((v) => ({
                      ...v,
                      typeOfDeal: parseInt(e.target.value.toString()),
                    }))}

                    label="TypeOfDeal"
                  >
                    {TypeOfDeal.map((v,i) => (
                      <MenuItem key={v} value={i}>{v}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField 
                  variant='filled'
                  label='ClassOfShare'
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  onChange={(e) => setObjSn((v) => ({
                    ...v,
                    classOfShare: parseInt(e.target.value),
                    }))
                  }
                  
                  value={ objSn?.classOfShare }
                />

                <TextField 
                  variant='filled'
                  label='SeqOfShare'
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  onChange={(e) => setObjSn((v) => ({
                    ...v,
                    seqOfShare: parseInt(e.target.value),
                  }))}
                  value={ objSn?.seqOfShare } 
                />

                <TextField 
                  variant='filled'
                  label='PriceOfPaid'
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  onChange={(e) => setObjSn((v) => ({
                    ...v,
                    priceOfPaid: parseInt(e.target.value),
                  }))}
                  value={ objSn?.priceOfPaid }
                />

                <TextField 
                  variant='filled'
                  label='PriceOfPar'
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  onChange={(e) => setObjSn((v) => ({
                    ...v,
                    priceOfPar: parseInt(e.target.value),
                  }))}
                  value={ objSn?.priceOfPar }
                />

                <DateTimeField
                  label='ClosingDate'
                  sx={{
                    m:1,
                    minWidth: 218,
                  }} 
                  value={ dayjs.unix(objSn?.closingDate) }
                  onChange={(date) => setObjSn((v) => ({
                    ...v,
                    closingDate: date ? date.unix() : 0,
                  }))}
                  format='YYYY-MM-DD HH:mm:ss'
                />

              </Stack>
            </Collapse>


            {newDeal && (
              <Stack direction={'row'} sx={{ alignItems: 'center' }} >

                <TextField 
                  variant='filled'
                  label='Seller'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ newDeal.head.seller.toString(16).padStart(10, '0') }
                />

                <TextField 
                  variant='filled'
                  label='Buyer'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ newDeal.body.buyer.toString(16).padStart(10, '0') }
                />

                <TextField 
                  variant='filled'
                  label='GroupOfBuyer'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ newDeal.body.groupOfBuyer.toString(16).padStart(10, '0') }
                />

                <TextField 
                  variant='filled'
                  label='QtyOfPaid'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ newDeal.body.paid.toString() }
                />

                <TextField 
                  variant='filled'
                  label='QtyOfPar'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ newDeal.body.par.toString() }
                />

                <TextField 
                  variant='filled'
                  label='TotalAmount'
                  inputProps={{readOnly: true}}
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  value={ 
                    newDeal.body.par.sub(newDeal.body.paid).
                    mul(BigNumber.from(newDeal.head.priceOfPar)).
                    add(
                        newDeal.body.paid.mul(
                        BigNumber.from(newDeal.head.priceOfPaid)
                      )
                    ).toString()  
                  }
                />

              </Stack>

            )}

            <Collapse in={ editable && !finalized } >
              <Stack direction={'row'} sx={{ alignItems: 'center', backgroundColor:'lightcyan' }} >

                <TextField 
                  variant='filled'
                  label='Seller'
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  onChange={(e) => setObjSn((v) => ({
                    ...v,
                    seller: parseInt(e.target.value),
                    }))
                  }
                  
                  value={ objSn?.seller }
                />

                <TextField 
                  variant='filled'
                  label='Buyer'
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  onChange={(e) => setObjBody((v) => ({
                    ...v,
                    buyer: parseInt(e.target.value),
                    }))
                  }
                  
                  value={ objBody?.buyer }
                />

                <TextField 
                  variant='filled'
                  label='GroupOfBuyer'
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  onChange={(e) => setObjBody((v) => ({
                    ...v,
                    groupOfBuyer: parseInt(e.target.value),
                    }))
                  }
                  
                  value={ objBody?.groupOfBuyer }
                />

                <TextField 
                  variant='filled'
                  label='QtyOfPaid'
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  onChange={(e) => setObjBody((v) => ({
                    ...v,
                    paid: BigNumber.from(e.target.value),
                    }))
                  }
                  
                  value={ objBody?.paid.toString() }
                />

                <TextField 
                  variant='filled'
                  label='QtyOfPar'
                  sx={{
                    m:1,
                    minWidth: 218,
                  }}
                  onChange={(e) => setObjBody((v) => ({
                    ...v,
                    par: BigNumber.from(e.target.value),
                    }))
                  }
                  
                  value={ objBody?.par.toString() }
                />

              </Stack>
            </Collapse>

          </Paper>

          { fileState && fileState > 2 && (
            <ExecDeal ia={ia} seq={seq} newDeal={newDeal} getDeal={getDeal} />
          )}

        </Stack>
    
    </Paper>
  );
}



