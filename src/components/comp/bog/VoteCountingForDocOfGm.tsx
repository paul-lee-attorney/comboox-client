
import { Button, Stack } from "@mui/material";
import { 
  filesFolderABI,
  useGeneralKeeperVoteCountingOfGm, 
  usePrepareGeneralKeeperVoteCountingOfGm 
} from "../../../generated";

import { HexType } from "../../../interfaces";
import { useComBooxContext } from "../../../scripts/ComBooxContext";
import { Calculate } from "@mui/icons-material";
import { BigNumber } from "ethers";
import { readContract } from "@wagmi/core";

async function isPassed(folder: HexType, addrOfFile: HexType): Promise<number> {

  let res = await readContract({
    address: folder,
    abi: filesFolderABI,
    functionName: 'getHeadOfFile',
    args: [ addrOfFile ],
  })

  return res.state;
}

interface VoteCountingForDocOfGmProps {
  seqOfMotion: BigNumber,
  addrOfFile: HexType,
  seqOfBoox: number,
  setNextStep: (next: number) => void,
}

export function VoteCountingForDocOfGm({ seqOfMotion, addrOfFile, seqOfBoox, setNextStep }: VoteCountingForDocOfGmProps) {

  const { gk, boox } = useComBooxContext();

  const { 
    config
  } =  usePrepareGeneralKeeperVoteCountingOfGm({
    address: gk,
    args: [ seqOfMotion ],
  });

  const {
    isLoading,
    write
  } = useGeneralKeeperVoteCountingOfGm({
    ...config,
    onSuccess() {
      isPassed(boox[ seqOfBoox ], addrOfFile).then(
        fileState => setNextStep( fileState )
      )
    },
  });

  return (
    <Stack sx={{ alignItems:'center' }} direction={ 'row' } >
      <Button
        disabled={ !write || isLoading}
        variant="contained"
        endIcon={<Calculate />}
        sx={{ m:1, mr:6 }}
        onClick={()=>write?.()}
      >
        Count
      </Button>

    </Stack>
  )

}