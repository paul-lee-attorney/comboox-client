import { Box, CircularProgress, Fade } from "@mui/material";

interface LoadingProgressProps {
  isLoading: boolean;
}

export default function LoadingProgress({isLoading}: LoadingProgressProps) {
  
  return (
    <Box sx={{ height: 20 }}>
      <Fade
        in={isLoading}
        style={{
          transitionDelay: isLoading ? '800ms' : '0ms',
        }}
        unmountOnExit
      >
        <CircularProgress size={20} />
      </Fade>
    </Box>
  );
}