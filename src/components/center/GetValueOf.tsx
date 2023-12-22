import { useEffect, useState } from "react"
import { getCentPrice } from "../../scripts/comp/gk";
import { useComBooxContext } from "../../scripts/common/ComBooxContext";
import { strNumToBigInt } from "../../scripts/common/toolsKit";
import { ShowValueOf } from "./ShowValueOf";

interface GetValueOfProps {
  amt: string;
}

export function GetValueOf({ amt }:GetValueOfProps ) {

  const { gk } = useComBooxContext();

  const [ value, setValue ] = useState(0n);

  useEffect(()=>{
    if (gk) {
      getCentPrice( gk ).then(
        centPrice => {
          let output = strNumToBigInt(amt, 2) * centPrice;
          setValue(output);
        }
      )
    }    
  });

  return (
    <ShowValueOf value={value} />
  )
}