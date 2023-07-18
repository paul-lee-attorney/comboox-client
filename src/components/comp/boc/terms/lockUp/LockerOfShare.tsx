import { 
  Stack,
  TextField,
  Paper,
  Chip,
} from '@mui/material';
import { dateParser, longSnParser } from '../../../../../scripts/toolsKit';

interface LockerOfShareProps {
  seqOfShare: number,
  dueDate: number,
  keyholders: number[],
}

export function LockerOfShare({ seqOfShare, dueDate, keyholders }: LockerOfShareProps) {

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

        <Chip label="M" color='primary' sx={{m:1}} />

        <TextField 
          variant='filled'
          label='SeqOfShare'
          inputProps={{readOnly: true}}
          sx={{
            m:1,
            minWidth: 218,
          }}
          value={ longSnParser(seqOfShare.toString()) }
        />

        <TextField 
          variant='filled'
          label='DueDate'
          inputProps={{readOnly: true}}
          sx={{
            m:1,
            minWidth: 218,
          }}
          value={ dateParser(dueDate) }
        />

        <TextField 
          variant='filled'
          label='Keyholders'
          inputProps={{readOnly: true}}
          sx={{
            m:1,
            minWidth: 218,
          }}
          multiline
          rows={1}
          value={ keyholders }
        />

      </Stack>
    </Paper>
  )
}
