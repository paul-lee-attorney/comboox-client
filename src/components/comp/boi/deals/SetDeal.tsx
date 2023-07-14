import { useEffect, useState } from "react";

import { Bytes32Zero, HexType } from "../../../../interfaces";

import { 
  useInvestmentAgreementAddDeal, 
  useInvestmentAgreementDelDeal, 
  useInvestmentAgreementGetDeal, 
} from "../../../../generated";

import { 
  Box, 
  Button, 
  Checkbox, 
  Collapse, 
  FormControl, 
  FormControlLabel, 
  InputLabel, 
  MenuItem, 
  Paper, 
  Select, 
  Stack, 
  TextField, 
  Toolbar 
} from "@mui/material";

import { AddCircle, RemoveCircle } from "@mui/icons-material";

import { ExecDeal } from "./ExecDeal";

import dayjs, { Dayjs } from 'dayjs';
import { DateTimeField } from "@mui/x-date-pickers";
import { useComBooxContext } from "../../../../scripts/ComBooxContext";
import { dateParser, longDataParser, longSnParser } from "../../../../scripts/toolsKit";
import { Body, Deal, Head } from "../../../../queries/ia";
import { getHeadOfFile } from "../../../../queries/filesFolder";

export const TypeOfDeal = [
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
  isFinalized: boolean,
}

export function dealSnCodifier(head: Head): HexType {
  let hexSn:HexType = `0x${
    (head.typeOfDeal.toString(16).padStart(2, '0')) +
    (head.seqOfDeal.toString(16).padStart(4, '0')) +
    (head.preSeq.toString(16).padStart(4, '0')) +
    (head.classOfShare.toString(16).padStart(4, '0')) +
    (head.seqOfShare.toString(16).padStart(8, '0')) +
    (head.seller.toString(16).padStart(10, '0')) +
    (head.priceOfPaid.toString(16).padStart(8, '0')) +
    (head.priceOfPar.toString(16).padStart(8, '0')) +
    (head.closingDeadline.toString(16).padStart(12, '0')) + 
    '0000'
  }`;
  return hexSn;
}

export function SetDeal({ia, seq, isFinalized}: SetDealProps) {

  const defaultHead: Head = {
    typeOfDeal: 2,
    seqOfDeal: seq,
    preSeq: 0,
    classOfShare: 1,
    seqOfShare: 0,
    seller: 0,
    priceOfPaid: 100,
    priceOfPar: 100,
    closingDeadline: parseInt((new Date().getTime()/1000).toString()) + 90*86400,
    para: 0,
  };
  
  const defaultBody: Body = {
    buyer: 0,
    groupOfBuyer: 0,
    paid: BigInt(0),
    par: BigInt(0),
    state: 0,
    para: 0,
    argu: 0,
    flag: false,
  };
  
  const defaultDeal: Deal = {
    head: defaultHead,
    body: defaultBody,
    hashLock: Bytes32Zero,
  };

  const [ objSn, setObjSn ] = useState<Head>(defaultHead);

  const [ objBody, setObjBody ] = useState<Body>(defaultBody);

  const [ newDeal, setNewDeal ] = useState<Deal>(defaultDeal);

  const {
    refetch: getDeal,
  } = useInvestmentAgreementGetDeal({
    address: ia,
    args: [BigInt(seq)],
    onSuccess(deal) {
      setNewDeal(deal)
    }
  })

  // const {
  //   config: addDealConfig,
  // } = usePrepareInvestmentAgreementAddDeal({
  //   address: ia,
  //   args: [ dealSnCodifier(objSn),
  //           BigInt(objBody.buyer),
  //           BigInt(objBody.groupOfBuyer),
  //           objBody.paid,
  //           objBody.par            
  //         ],
  // });

  const {
    isLoading: addDealLoading,
    write: addDeal,
  } = useInvestmentAgreementAddDeal({
    address: ia,
    args: [ dealSnCodifier(objSn),
            BigInt(objBody.buyer),
            BigInt(objBody.groupOfBuyer),
            objBody.paid,
            objBody.par            
          ],
    onSuccess() {
      getDeal()
    }
  });

  // const {
  //   config: configDelDeal
  // } = usePrepareInvestmentAgreementDelDeal({
  //   address: ia,
  //   args: [ BigInt(seq) ],
  // });

  const {
    isLoading: delDealLoading,
    write: delDeal,
  } = useInvestmentAgreementDelDeal({
    address: ia,
    args: [ BigInt(seq) ],
    onSuccess() {
      getDeal()
    }
  });

  const [ editable, setEditable ] = useState<boolean>(false); 
  
  const { boox } = useComBooxContext();

  const [ fileState, setFileState ] = useState<number>();

  useEffect(()=>{
    const obtainFileState = async ()=>{
      if (boox ) {
        let head = await getHeadOfFile(boox[6], ia);
        setFileState(head.state);
      }
    }
    obtainFileState();
  }, [ boox, ia ]);

  return (
    <Paper elevation={3} sx={{
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

          {!isFinalized && (
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

          <Paper elevation={3} sx={{
            p:1, 
            border: 1, 
            borderColor:'divider' 
            }} 
          >
            <Stack direction={'row'} sx={{ alignItems: 'center' }} >

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

              <TextField 
                variant='filled'
                label='ClosingDeadline'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={ dateParser(newDeal.head.closingDeadline) }
              />

              <TextField 
                variant='filled'
                label='State'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={ StateOfDeal[newDeal.body.state] }
              />

            </Stack>
          </Paper>

          <Paper elevation={3} sx={{
            p:1, 
            border: 1, 
            borderColor:'divider' 
            }} 
          >

            <Stack direction={'row'} sx={{ alignItems: 'center' }} >

              <TextField 
                variant='filled'
                label='TypeOfDeal'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={ TypeOfDeal[(newDeal.head.typeOfDeal > 0 ? newDeal.head.typeOfDeal : 1) - 1] }
              />

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

              <TextField 
                variant='filled'
                label='PriceOfPaid'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={ longDataParser(newDeal.head.priceOfPaid.toString()) }
              />

              <TextField 
                variant='filled'
                label='PriceOfPar'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={ longDataParser(newDeal.head.priceOfPar.toString()) }
              />

              <TextField 
                variant='filled'
                label='ClosingDate'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={ dateParser(newDeal.head.closingDeadline) }
              />

            </Stack>

            <Collapse in={ editable && !isFinalized } >
              <Stack direction={'row'} sx={{ alignItems: 'center', backgroundColor:'lightcyan' }} >

                <FormControl variant="filled" sx={{ m: 1, minWidth: 218 }}>
                  <InputLabel id="typeOfDeal-label">TypeOfDeal</InputLabel>
                  <Select
                    labelId="typeOfDeal-label"
                    id="typeOfDeal-select"
                    value={ objSn.typeOfDeal }
                    onChange={(e) => setObjSn((v) => ({
                      ...v,
                      typeOfDeal: parseInt(e.target.value.toString()),
                    }))}
                  >
                    {TypeOfDeal.map((v,i) => (
                      <MenuItem key={v} value={i+1}>{v}</MenuItem>
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
                  value={ objSn.classOfShare }
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
                  value={ objSn.seqOfShare } 
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
                  value={ objSn.priceOfPaid }
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
                  value={ objSn.priceOfPar }
                />

                <DateTimeField
                  label='ClosingDate'
                  sx={{
                    m:1,
                    minWidth: 218,
                  }} 
                  value={ dayjs.unix(objSn?.closingDeadline) }
                  onChange={(date) => setObjSn((v) => ({
                    ...v,
                    closingDate: date ? date.unix() : 0,
                  }))}
                  format='YYYY-MM-DD HH:mm:ss'
                />

              </Stack>
            </Collapse>


            <Stack direction={'row'} sx={{ alignItems: 'center' }} >

              <TextField 
                variant='filled'
                label='Seller'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={ longSnParser(newDeal.head.seller.toString()) }
              />

              <TextField 
                variant='filled'
                label='Buyer'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={ longSnParser(newDeal.body.buyer.toString()) }
              />

              <TextField 
                variant='filled'
                label='GroupOfBuyer'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={ longSnParser(newDeal.body.groupOfBuyer.toString()) }
              />

              <TextField 
                variant='filled'
                label='QtyOfPaid'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={ longDataParser(newDeal.body.paid.toString()) }
              />

              <TextField 
                variant='filled'
                label='QtyOfPar'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={ longDataParser(newDeal.body.par.toString()) }
              />

              <TextField 
                variant='filled'
                label='TotalAmount'
                inputProps={{readOnly: true}}
                sx={{
                  m:1,
                  minWidth: 218,
                }}
                value={ longDataParser(
                  ((newDeal.body.par - newDeal.body.paid) * BigInt(newDeal.head.priceOfPar) 
                  + (newDeal.body.paid * BigInt(newDeal.head.priceOfPaid))).toString()  
                )}
              />

            </Stack>

            <Collapse in={ editable && !isFinalized } >
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
                  value={ objSn.seller }
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
                  
                  value={ objBody.buyer }
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
                  
                  value={ objBody.groupOfBuyer }
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
                    paid: BigInt(e.target.value),
                    }))
                  }
                  
                  value={ objBody.paid.toString() }
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
                    par: BigInt(e.target.value),
                    }))
                  }
                  
                  value={ objBody.par.toString() }
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



