import { Box, Toolbar, Typography } from "@mui/material";

function Plantilla() {
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
        <Typography sx={{ marginBottom: 2 }}>Plantilla</Typography>
      </Box>
    </>
  );
}

export default Plantilla;
