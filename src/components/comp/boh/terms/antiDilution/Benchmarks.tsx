import { 
  Stack,
  TextField,
  Paper,
} from '@mui/material';

interface BenchmarkType {
  classOfShare: string,
  floorPrice: string,
  obligors: string[],
}

export function Benchmarks({ classOfShare, floorPrice, obligors }: BenchmarkType) {

  return (
    <>
      <Paper sx={{
        alignContent:'center', 
        justifyContent:'center', 
        p:1, m:1,
        border: 1,
        borderColor:'divider' 
        }} 
      >
        <Stack direction={'row'} sx={{ alignItems: 'center' }} >

          <TextField 
            variant='filled'
            label='ClassOfShare'
            inputProps={{readOnly: true}}
            sx={{
              m:1,
              minWidth: 240,
            }}
            value={ classOfShare }
          />

          <TextField 
            variant='filled'
            label='FloorPrice'
            inputProps={{readOnly: true}}
            sx={{
              m:1,
              minWidth: 240,
            }}
            value={ floorPrice }
          />

          <TextField 
            variant='filled'
            label='Obligors'
            inputProps={{readOnly: true}}
            sx={{
              m:1,
              minWidth: 240,
            }}
            multiline
            rows={1}
            value={ obligors }
          />

        </Stack>
      </Paper>
    </> 
  )
}
