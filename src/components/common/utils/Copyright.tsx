import * as React from 'react';
import Typography from '@mui/material/Typography';
import MuiLink from '@mui/material/Link';
import { Stack } from '@mui/material';
import Link from '../../../scripts/common/Link';

export default function Copyright() {
  return (
    <Stack direction='row' sx={{ justifyContent:'center' }} >
      <Typography variant="body2" color="primary" align="center" sx={{mt:20, mr: 10}}>
        <MuiLink color="inherit" href="https://comboox.gitbook.io/whitepaper">
          Documentation
        </MuiLink>
      </Typography>

      <Typography variant="body2" color="primary" align="center" sx={{mt:20}}>
        <MuiLink color="inherit" href="https://jingtian.com/Content/2020/03-11/1525064223.html">
          Copyright (c) 2021-2023 Li Li
        </MuiLink>
      </Typography>

      <Typography variant="body2" color="text.secondary" align="center" sx={{mt:20, ml:10}}>
        <Link href={{pathname:'/about/LICENSE'}}>
          License
        </Link>
      </Typography>

      <Typography variant="body2" color="text.secondary" align="center" sx={{mt:20, ml:10}}>
        <Link href="https://github.com/paul-lee-attorney/comboox">
          GitHub
        </Link>
      </Typography>      
    </Stack>
  );
}
