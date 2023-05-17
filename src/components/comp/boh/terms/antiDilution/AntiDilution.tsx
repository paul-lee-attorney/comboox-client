import { useEffect, useState } from "react";

import { 
  Stack,
  IconButton,
  Paper,
  Toolbar,
  TextField,
  Button,
  Tooltip,
} from "@mui/material";

import { HexType } from "../../../../../interfaces";

import {
  AddCircle,
  RemoveCircle,
  PlaylistAdd,
  PlaylistRemove,
  Delete,
} from "@mui/icons-material"

import { waitForTransaction, readContract } from "@wagmi/core";

import {
  antiDilutionABI,
  usePrepareShareholdersAgreementCreateTerm,
  useShareholdersAgreementCreateTerm,
  usePrepareShareholdersAgreementRemoveTerm,
  useShareholdersAgreementRemoveTerm,
  useAntiDilutionGetClasses, 
  usePrepareAntiDilutionAddBenchmark, 
  useAntiDilutionAddBenchmark,
  usePrepareAntiDilutionRemoveBenchmark,
  useAntiDilutionRemoveBenchmark,
  usePrepareAntiDilutionAddObligor,
  useAntiDilutionAddObligor,
  usePrepareAntiDilutionRemoveObligor,
  useAntiDilutionRemoveObligor, 
} from "../../../../../generated";

import { BigNumber } from "ethers";

import {
  GetBenchmark
} from '../../../../../components'

import { Benchmarks } from "./Benchmarks";


async function getReceipt(hash: HexType): Promise<HexType> {
  const receipt = await waitForTransaction({
    hash: hash
  });

  return `0x${receipt.logs[0].topics[2].substring(26)}`; 
}

interface BenchmarkType {
  classOfShare: string,
  floorPrice: string,
  obligors: string[],
}

interface SetShaTermProps {
  sha: HexType,
  term?: HexType | undefined,
  setTerm: (term?: HexType) => void, 
}

async function getBenchmarks(ad: HexType, classes: number[]): Promise<BenchmarkType[]> {
  let len = classes.length;
  let output: BenchmarkType[] = [];

  while (len > 0) {

    let classOfShare = classes[len - 1];

    let floorPrice = await readContract({
      address: ad,
      abi: antiDilutionABI,
      functionName: 'getFloorPriceOfClass',
      args: [BigNumber.from(classOfShare)],
    });

    let obligors = await readContract({
      address: ad,
      abi: antiDilutionABI,
      functionName: 'getObligorsOfAD',
      args: [BigNumber.from(classOfShare)],
    });
    
    let item: BenchmarkType = {
      classOfShare: classOfShare.toString(),
      floorPrice: floorPrice.toString(),
      obligors: obligors.map(v => v.toString()),
    }

    output.push(item);
  }

  return output;
}


export function AntiDilution({ sha, term, setTerm }: SetShaTermProps) {

  const [ version, setVersion ] = useState<string>();

  const {
    config: createAdConfig
  } = usePrepareShareholdersAgreementCreateTerm({
    address: sha,
    args: version ? 
      [BigNumber.from('23'), BigNumber.from(version)]: 
      undefined,
  });

  const {
    data: createAdReceipt,
    isLoading: createAdIsLoading,
    write: createAd,
  } = useShareholdersAgreementCreateTerm(createAdConfig);

  useEffect(()=>{
    if (createAdReceipt)
      getReceipt(createAdReceipt.hash).
        then(addrOfAd => setTerm(addrOfAd));
  });

  const {
    config: removeAdConfig
  } = usePrepareShareholdersAgreementRemoveTerm({
    address: sha,
    args: [BigNumber.from('23')],
  });

  const {
    data: removeAdReceipt,
    isSuccess: removeAdIsSuccess,
    isLoading: removeAdIsLoading,
    write: removeAd,
  } = useShareholdersAgreementRemoveTerm(removeAdConfig);

  useEffect(()=>{
    if (removeAdReceipt && removeAdIsSuccess)
      setTerm();
  }, [removeAdReceipt, removeAdIsSuccess, setTerm]);

  const [ newClasses, setNewClasses ] = useState<number[]>();

  const [ newMarks, setNewMarks ] = useState<BenchmarkType[]>();

  const { refetch } = useAntiDilutionGetClasses({
    address: term,
    onSuccess(data) {
      let output = data.map(v => v.toNumber());
      setNewClasses(output);
    }
  });

  const [ classOfShare, setClassOfShare ] = useState<string>();
  const [ price, setPrice ] = useState<string>();

  const { 
    config: addMarkConfig 
  } = usePrepareAntiDilutionAddBenchmark({
    address: term,
    args: classOfShare && 
          price ? 
            [BigNumber.from(classOfShare), BigNumber.from(price)] :
            undefined, 
  });

  const { 
    data: addMarkReceipt,
    isLoading: addMarkIsLoading,
    write: addMark 
  } = useAntiDilutionAddBenchmark(addMarkConfig);

  const { 
    config: removeMarkConfig 
  } = usePrepareAntiDilutionRemoveBenchmark({
    address: term,
    args: classOfShare ? 
            [BigNumber.from(classOfShare)] :
            undefined, 
  });

  const { 
    data: removeMarkReceipt,
    isLoading: removeMarkIsLoading, 
    write: removeMark 
  } = useAntiDilutionRemoveBenchmark(removeMarkConfig);

  const [ obligor, setObligor ] = useState<string>();

  const { 
    config: addObligorConfig 
  } = usePrepareAntiDilutionAddObligor({
    address: term,
    args: classOfShare &&
          obligor ? 
            [ BigNumber.from(classOfShare),
              BigNumber.from(obligor)] :
            undefined, 
  });

  const { 
    data: addObligorReceipt,
    isLoading: addObligorIsLoading, 
    write: addObligor 
  } = useAntiDilutionAddObligor(addObligorConfig);

  const { 
    config: removeObligorConfig 
  } = usePrepareAntiDilutionRemoveObligor({
    address: term,
    args: classOfShare &&
          obligor ? 
            [ BigNumber.from(classOfShare),
              BigNumber.from(obligor)] :
            undefined, 
  });

  const { 
    data: removeObligorReceipt,
    isLoading: removeObligorIsLoading, 
    write: removeObligor 
  } = useAntiDilutionRemoveObligor(removeObligorConfig);

  useEffect(()=>{
    if (createAdReceipt ||
      addMarkReceipt || 
      removeMarkReceipt ||
      addObligorReceipt ||
      removeObligorReceipt)

      if (newClasses && term) {
        getBenchmarks(term, newClasses).
          then(marks => setNewMarks(marks));  
      };
  }, [ createAdReceipt, 
      addMarkReceipt, 
      removeMarkReceipt, 
      addObligorReceipt, 
      removeObligorReceipt,
      newClasses, term ]
  );

  return (
    <Paper sx={{ m:1 , p:1, border:1, borderColor:'divider' }}>
      <Stack direction={'row'} sx={{ alignItems:'center' }}>
        <Toolbar>
          <h4>AntiDilution</h4>
        </Toolbar>

        {term == undefined && (
          <>
            <TextField 
              variant='filled'
              label='Version'
              sx={{
                m:1,
                ml:3,
                minWidth: 240,
              }}
              onChange={(e) => setVersion(e.target.value)}
              value={ version }              
            />

            <Button
              disabled={ !createAd || createAdIsLoading }
              variant="contained"
              sx={{
                height: 40,
              }}
              endIcon={ <PlaylistAdd /> }
              onClick={() => createAd?.()}
            >
              Create
            </Button>

          </>
        )}

        {term && (
            <Button
              disabled={ !removeAd || removeAdIsLoading }
              variant="contained"
              sx={{
                height: 40,
                mr: 5,
              }}
              endIcon={ <Delete /> }
              onClick={() => removeAd?.()}
            >
              Remove
            </Button>
        )}

      </Stack>

      {term && (
        <Stack direction={'row'} sx={{ alignItems:'center' }}>      

          <Tooltip
            title='Add Price Benchmark'
            placement="left"
            arrow
          >
            <span>
              <IconButton 
                disabled={ !addMark || addMarkIsLoading }
                sx={{width: 20, height: 20, m: 1, ml: 5,}} 
                onClick={ () => addMark?.() }
                color="primary"
              >
                <AddCircle/>
              </IconButton>
            </span>
          </Tooltip>

          <TextField 
            variant='filled'
            label='ClassOfShare'
            sx={{
              m:1,
              minWidth: 240,
            }}
            onChange={(e) => setClassOfShare(e.target.value)}
            value={ classOfShare }              
          />

          <TextField 
            variant='filled'
            label='Price'
            sx={{
              m:1,
              minWidth: 240,
            }}
            onChange={(e) => setPrice(e.target.value)}
            value={ price }
          />

          <Tooltip
            title='Remove Price Benchmark'
            placement="right"
            arrow
          >
            <span>
           
              <IconButton
                disabled={ !removeMark || removeMarkIsLoading } 
                sx={{width: 20, height: 20, m: 1, mr: 10}} 
                onClick={ () => removeMark?.() }
                color="primary"
              >
                <RemoveCircle/>
              </IconButton>
          
            </span>
          </Tooltip>

          <Tooltip
            title='Add Obligor'
            placement="left"
            arrow
          >
            <span>
              <IconButton 
                disabled={ !addObligor || addObligorIsLoading }
                sx={{width: 20, height: 20, m: 1, ml: 10,}} 
                onClick={ () => addObligor?.() }
                color="primary"
              >
                <AddCircle/>
              </IconButton>
            </span>

          </Tooltip>

          <TextField 
            variant='filled'
            label='Obligor'
            sx={{
              m:1,
              minWidth: 240,
            }}
            onChange={(e) => setObligor(e.target.value)}
            value={ obligor }              
          />

          <Tooltip
            title='Remove Obligor'
            placement="right"
            arrow
          >
            <span>

              <IconButton
                disabled={ !removeObligor || removeObligorIsLoading } 
                sx={{width: 20, height: 20, m: 1}} 
                onClick={ () => removeObligor?.() }
                color="primary"
              >
                <RemoveCircle/>
              </IconButton>
          
            </span>
          </Tooltip>

        </Stack>
      )}
      
      {newMarks && newMarks.map((v) => (
        <Benchmarks 
          key={ v.classOfShare }
          classOfShare={ v.classOfShare } 
          floorPrice={ v.floorPrice } 
          obligors={ v.obligors } 
        />
      ))}

    </Paper>
  );
} 

