
import { Button } from "@mui/material";
import { useGeneralKeeperProposeDocOfGm, usePrepareGeneralKeeperProposeDocOfGm } from "../../../generated";
import { FileHistoryProps, HexType, } from "../../../interfaces";
import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { EmojiPeople } from "@mui/icons-material";
import { BigNumber } from "ethers";


interface ProposeDocOfGmProps {
  addr: HexType,
  seqOfVR: number,
  setNextStep: (next: number ) => void,
}

export function ProposeDocOfGm({ addr, seqOfVR, setNextStep }: ProposeDocOfGmProps) {

  const { gk } = useComBooxContext();

  const { 
    config
  } =  usePrepareGeneralKeeperProposeDocOfGm({
    address: gk,
    args: [addr, BigNumber.from(seqOfVR), BigNumber.from('0') ],
  });

  const {
    isLoading,
    write
  } = useGeneralKeeperProposeDocOfGm({
    ...config,
    onSuccess() {
      setNextStep(4);
    }
  });

  return (
      <Button
        disabled={!write || isLoading}
        variant="contained"
        endIcon={<EmojiPeople />}
        sx={{ m:1, minWidth:218 }}
        onClick={()=>write?.()}
      >
        Propose
      </Button>
  )

}