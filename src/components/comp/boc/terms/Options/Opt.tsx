import { 
  Stack,
  TextField,
  Paper,
  Chip,
} from '@mui/material';
import { longSnParser, splitStrArr } from '../../../../../scripts/toolsKit';
import { Option } from './Options';
import { ContentOfOpt } from './ContentOfOpt';
import { TriggerCondition } from './TriggerCondition';

interface OptProps {
  opt: Option;
}

export function Opt({ opt }: OptProps) {

  return (
    <Paper elevation={3} 
      sx={{
        p:1, m:1,
        alignContent:'center', 
        justifyContent:'center', 
        border: 1,
        borderColor:'divider' 
      }} 
    >
      <Stack direction={'row'} sx={{ alignItems: 'center' }} >

        <Chip label={ longSnParser(opt.head.seqOfOpt.toString()) } color='primary' sx={{m:1}} />

        <ContentOfOpt opt={opt} />

        <TriggerCondition cond={opt.cond} />

        <TextField 
          variant='filled'
          label='Obligors'
          inputProps={{readOnly: true}}
          sx={{
            m:1,
            minWidth: 218,
          }}
          multiline
          rows={1}
          value={ splitStrArr(opt.obligors.map(v => v.toString())) }
        />

      </Stack>
    </Paper>
  )
}
