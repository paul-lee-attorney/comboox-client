import { 
  Stack,
  TextField,
  Paper,
  Chip,
} from '@mui/material';
import { AlongLink } from './DragAlong';
import { longSnParser, splitStrArr } from '../../../../../scripts/toolsKit';

interface AlongLinksProps {
  link: AlongLink;
}

export function AlongLinks({ link }: AlongLinksProps) {

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

        <Chip label={ longSnParser(link.drager.toString()) } color='primary' sx={{m:1}} />

        <LinkRule rule={link.linkRule} />

        <TextField 
          variant='filled'
          label='Followers'
          inputProps={{readOnly: true}}
          sx={{
            m:1,
            minWidth: 218,
          }}
          multiline
          rows={1}
          value={ splitStrArr(link.followers.map(v => v.toString())) }
        />

      </Stack>
    </Paper>
  )
}
