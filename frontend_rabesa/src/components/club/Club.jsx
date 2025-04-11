import { Box, Toolbar, Typography } from "@mui/material";

function Club() {
  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
        }}
      >
        <Toolbar />
        <Typography sx={{ marginBottom: 2 }}>Clubs</Typography>

        
      </Box>
    </>
  );
}

export default Club;