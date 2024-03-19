import { Paper, Stack, Typography } from "@mui/material";



function AboutUs() {
  return(
    <Paper elevation={3} sx={{alignItems:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >

        <Stack direction='row' sx={{ alignItems:'center' }}>

          <Typography variant='h5' sx={{ m:2, textDecoration:'underline'  }}  >
            <b>About Us - Pending Page </b> 
          </Typography>
        </Stack>
    </Paper>        
  );
}


