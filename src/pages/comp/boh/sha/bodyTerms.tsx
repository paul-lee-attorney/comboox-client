import { useEffect, useState } from "react";

import { useRouter } from "next/router";

import { 
  Stack,
} from "@mui/material";

import {
  BigNumber
} from 'ethers';

import { AddrZero, HexType } from "../../../../interfaces";

import { 
  SetGovernanceRule, 
  ShaNavi, 
  PositionAllocateRules,
  FirstRefusalRules,
  VotingRules,
  GroupUpdateOrders,
  LinkRules,
} from '../../../../components';

import { useShareholdersAgreementRules } from "../../../../generated";

function BodyTerms() {
  const { query } = useRouter();
  const sha:HexType = `0x${query?.addr?.toString().substring(2)}`;

  const [rules, setRules] = useState<number[]>();

  const [ vrLs, setVrLs ] = useState<number[]>();
  const [ prLs, setPrLs ] = useState<number[]>();
  const [ frLs, setFrLs ] = useState<number[]>();
  const [ guoLs, setGuoLs ] = useState<number[]>();
  const [ lrLs, setLrLs ] = useState<number[]>();

  const {data, refetch } = useShareholdersAgreementRules({
    address: sha,
    onSuccess(data) {
      let arrRules = [1, 256, 512, 768, 1024];

      if (data.length > 0) {
        data.map(v => {
          let seq = v.toNumber();
          if (seq % 256 > 0 && seq != 1) {
            arrRules.push(seq);
          }
        });
      } 
      
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
            case 4:
              setLrLs(l => {
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

  return (
    <Stack direction={'column'} sx={{ width: '100%' }}>

      <ShaNavi contractName={'Shareholders Agreement'} addr={ sha } thisPath='./bodyTerms' />

      {vrLs && (<SetGovernanceRule addr={ sha } />)}

      {vrLs && (<VotingRules sha={ sha } seqList={ vrLs } />)}

      {prLs && (<PositionAllocateRules sha={ sha } seqList={ prLs } />)}

      {frLs && (<FirstRefusalRules sha={ sha } seqList={ frLs } />)}

      {guoLs && (<GroupUpdateOrders sha={ sha } seqList={ guoLs } />)}

      {lrLs && (<LinkRules sha={ sha } seqList={ lrLs } />)}

    </Stack>    
  );
} 

export default BodyTerms;