import { Stack } from "@mui/material";
import { LinearProgress, Typography } from "@mui/joy";

import { BigNumber } from "ethers";
import { toPercent } from "../../../scripts/toolsKit";
import { VoteCase } from "../../comp/bog/VoteForDocOfGm";

interface VoteResultProps {
  voteResult: VoteCase[];
}

export function VoteResult({ voteResult }: VoteResultProps) {

  return (
    <Stack direction={'row'} sx={{m:1, p:1, alignItems:'center'}}>

      {voteResult[0] && voteResult[0].head > 0 && (
        <Stack direction={'column'} sx={{m:1, p:1, justifyContent:'center', alignItems:'start'}}>            
          <LinearProgress
            determinate
            variant="outlined"
            color="danger"
            size="sm"
            thickness={32}
            value={ voteResult[1].head * 100 / voteResult[0].head }
            sx={{
              '--LinearProgress-radius': '0px',
              '--LinearProgress-progressThickness': '24px',
              boxShadow: 'sm',
              borderColor: 'neutral.500',
              minWidth: 218,
              m:0.25,
            }}
          >
            <Typography
              level="body3"
              fontWeight="xl"
              textColor="common.white"
              sx={{ mixBlendMode: 'difference' }}
            >
              Support Head Ratio: {`${Math.round(voteResult[1].head * 100 / voteResult[0].head)}%`}
            </Typography>            
          </LinearProgress>

          {voteResult[0].weight.gt(0) && (
            <LinearProgress
              determinate
              variant="outlined"
              color="danger"
              size="sm"
              thickness={32}
              value={ voteResult[1].weight.mul(100).div(voteResult[0].weight).toNumber() }
              sx={{
                '--LinearProgress-radius': '0px',
                '--LinearProgress-progressThickness': '24px',
                boxShadow: 'sm',
                borderColor: 'neutral.500',
                minWidth: 218,
                m:0.25,
              }}
            >
              <Typography
                level="body3"
                fontWeight="xl"
                textColor="common.white"
                sx={{ mixBlendMode: 'difference' }}
              >
                Support Weight Ratio: {`${Math.round(voteResult[1].weight.mul(100).div(voteResult[0].weight).toNumber())}%`}
              </Typography>            
            </LinearProgress>
          )}

       </Stack>
      )}

      {voteResult[0] && voteResult[0].head > 0 && (
        <Stack direction={'column'} sx={{m:1, p:1, justifyContent:'center', alignItems:'center'}}>            
          <LinearProgress
            determinate
            variant="outlined"
            color="warning"
            size="sm"
            thickness={32}
            value={ voteResult[3].head * 100 / voteResult[0].head }
            sx={{
              '--LinearProgress-radius': '0px',
              '--LinearProgress-progressThickness': '24px',
              boxShadow: 'sm',
              borderColor: 'neutral.500',
              minWidth: 218,
              m:0.25,
            }}
          >
            <Typography
              level="body3"
              fontWeight="xl"
              textColor="common.white"
              sx={{ mixBlendMode: 'difference' }}
            >
              Abstain Head Ratio: {`${Math.round(voteResult[3].head * 100 / voteResult[0].head)}%`}
            </Typography>            
          </LinearProgress>

          {voteResult[0].weight.gt(0) && (
            <LinearProgress
              determinate
              variant="outlined"
              color="warning"
              size="sm"
              thickness={32}
              value={ voteResult[3].weight.mul(10000).div(voteResult[0].weight).toNumber() }
              sx={{
                '--LinearProgress-radius': '0px',
                '--LinearProgress-progressThickness': '24px',
                boxShadow: 'sm',
                borderColor: 'neutral.500',
                minWidth: 218,
                m:0.25,
              }}
            >
              <Typography
                level="body3"
                fontWeight="xl"
                textColor="common.white"
                sx={{ mixBlendMode: 'difference' }}
              >
                Abstain Weight Ratio: {`${Math.round(voteResult[3].weight.mul(100).div(voteResult[0].weight).toNumber())}%`}
              </Typography>            
            </LinearProgress>
          )}

       </Stack>
      )}


      {voteResult[0] && voteResult[0].head > 0 && (
        <Stack direction={'column'} sx={{m:1, p:1, justifyContent:'center', alignItems:'center'}}>            
          <LinearProgress
            determinate
            variant="outlined"
            color="primary"
            size="sm"
            thickness={32}
            value={ voteResult[2].head * 100 / voteResult[0].head }
            sx={{
              '--LinearProgress-radius': '0px',
              '--LinearProgress-progressThickness': '24px',
              boxShadow: 'sm',
              borderColor: 'neutral.500',
              minWidth: 218,
              m:0.25,              
            }}
          >
            <Typography
              level="body3"
              fontWeight="xl"
              textColor="common.white"
              sx={{ mixBlendMode: 'difference' }}
            >
              Against Head Ratio: {`${Math.round(voteResult[2].head * 100 / voteResult[0].head)}%`}
            </Typography>            
          </LinearProgress>

          {voteResult[0].weight.gt(0) && (
            <LinearProgress
              determinate
              variant="outlined"
              color="primary"
              size="sm"
              thickness={32}
              value={ voteResult[2].weight.mul(100).div(voteResult[0].weight).toNumber() }
              sx={{
                '--LinearProgress-radius': '0px',
                '--LinearProgress-progressThickness': '24px',
                boxShadow: 'sm',
                borderColor: 'neutral.500',
                minWidth: 218,
                m:0.25,              
              }}
            >
              <Typography
                level="body3"
                fontWeight="xl"
                textColor="common.white"
                sx={{ mixBlendMode: 'difference' }}
              >
                Against Weight Ratio: {`${Math.round(voteResult[2].weight.mul(100).div(voteResult[0].weight).toNumber())}%`}
              </Typography>            
            </LinearProgress>
          )}

       </Stack>
      )}


    </Stack>
  )

}