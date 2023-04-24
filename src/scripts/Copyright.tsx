import * as React from 'react';
import Typography from '@mui/material/Typography';
import MuiLink from '@mui/material/Link';

export default function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <MuiLink color="inherit" href="https://jingtian.com/Content/2020/03-11/1502199477.html">
        Li Li @ Jingtian & Gongcheng
      </MuiLink>{' '}
      {new Date().getFullYear()}.
    </Typography>
  );
}
