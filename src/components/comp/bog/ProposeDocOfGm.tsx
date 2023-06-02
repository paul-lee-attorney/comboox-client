
import { Button } from "@mui/material";
import { useGeneralKeeperProposeDocOfGm, usePrepareGeneralKeeperProposeDocOfGm } from "../../../generated";
import { FileHistoryProps, } from "../../../interfaces";
import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { EmojiPeople } from "@mui/icons-material";
import { BigNumber } from "ethers";

export function ProposeDocOfGm({ addr, setNextStep }: FileHistoryProps) {

  const { gk } = useComBooxContext();

  const { 
    config
  } =  usePrepareGeneralKeeperProposeDocOfGm({
    address: gk,
    args: [addr, BigNumber.from('8'), BigNumber.from('0') ],
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