import { useEffect, useState } from "react";

import { useRouter } from "next/router";

import { 
  Stack,
} from "@mui/material";

import {
  BigNumber
} from 'ethers';

import { AddrZero, HexType } from "../../../../interfaces";

import { readContract } from "@wagmi/core";

import { 
  SetGovernanceRule, 
  ShaNavi, 
  PositionAllocateRules,
  FirstRefusalRules,
  VotingRules,
  GroupUpdateOrders,
  LinkRules,
} from '../../../../components';

import { 
  useShareholdersAgreementRules, 
  useShareholdersAgreementTitles,
  shareholdersAgreementABI,
} from "../../../../generated";
import { AntiDilution } from "../../../../components/comp/boh/terms/antiDilution/AntiDilution";
import { LoadingButton } from "@mui/lab";
import { Send } from "@mui/icons-material";

async function getTerm(addr: HexType, title: number): Promise<HexType> {

  let addrOfTerm = await readContract({
    address: addr,
    abi: shareholdersAgreementABI,
    functionName: 'getTerm',
    args: [BigNumber.from(title)],
  });

  return addrOfTerm;
}



function BodyTerms() {
  const { query } = useRouter();
  const sha:HexType = `0x${query?.addr?.toString().substring(2)}`;

  const [rules, setRules] = useState<number[]>();

  const [ vrLs, setVrLs ] = useState<number[]>();
  const [ prLs, setPrLs ] = useState<number[]>();
  const [ frLs, setFrLs ] = useState<number[]>();
  const [ guoLs, setGuoLs ] = useState<number[]>();

  const {data, refetch } = useShareholdersAgreementRules({
    address: sha,
    onSuccess(data) {
      let arrRules = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 256, 512, 513, 768];

      data.map(v => {
        let seq = v.toNumber();
        if ( !arrRules.includes(seq) ) {
          arrRules.push(seq);
        }
      });
      
      setRules(arrRules);
    }
  });

  useEffect(()=>{
    if ( rules ) {
      rules.map(v => {
        if (v > 0) 
          switch (parseInt(`${v/256}`)) {
            case 0: 
              setVrLs((l) => {
                if (l) {
                  let arr = [...l];
                  arr.push(v);
                  return arr;
                } else {
                  return [v];
                }
              });
              break;
            case 1:
              setPrLs(l => {
                if (l) {
                  let arr = [...l];
                  arr.push(v);
                  return arr;
                } else {
                  return [v];
                }
              });
              break;
            case 2:
              setFrLs(l => {
                if (l) {
                  let arr = [...l];
                  arr.push(v);
                  return arr;
                } else {
                  return [v];
                }
              });
              break;
            case 3:
              setGuoLs(l => {
                if (l) {
                  let arr = [...l];
                  arr.push(v);
                  return arr;
                } else {
                  return [v];
                }
              });
              break;
          };
      });
    } 
  }, [data, rules]);

  const [ titles, setTitles ] = useState<number[]>();

  const [ ad, setAD ] = useState<HexType>();

  const { 
    data: bnTitles, 
    refetch: refetchTitles 
  } = useShareholdersAgreementTitles({
    address: sha,
    onSuccess(data) {
      let arrTitles: number[] = [];
      data.map(v => {
        let title = v.toNumber();
        arrTitles.push(title);
      });
      setTitles(arrTitles);
    }
  });

  useEffect(() => {
    if (titles) {
      titles.map(async v => {
        switch (v) {
          case 23:
            setAD( await getTerm(sha, v));
            break;
        }
      });      
    }
  }, [sha, titles, setAD]);

  return (
    <Stack direction={'column'} sx={{ width: '100%', alignItems: 'center' }}>

      <ShaNavi contractName={'Shareholders Agreement'} addr={ sha } thisPath='./bodyTerms' />

      {(!vrLs || !prLs || !frLs || !guoLs) && (
            <LoadingButton 
              loading={true} 
              loadingPosition='end' 
              endIcon={<Send/>} 
              sx={{p:1, m:1}} 
            >
              <span>Loading</span>
            </LoadingButton>
          )}


      {vrLs && (<SetGovernanceRule addr={ sha } />)}

      {vrLs && (<VotingRules sha={ sha } seqList={ vrLs } />)}

      {prLs && (<PositionAllocateRules sha={ sha } seqList={ prLs } />)}

      {frLs && (<FirstRefusalRules sha={ sha } seqList={ frLs } />)}

      {guoLs && (<GroupUpdateOrders sha={ sha } seqList={ guoLs } />)}

      <AntiDilution sha={ sha } term={ ad } setTerm={ setAD } />

    </Stack>    
  );
} 

export default BodyTerms;