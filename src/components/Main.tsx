"use client";

import { Box, useTheme } from "@mui/material";
import { NavbarHeightSpacingHelper } from "./Header/Navbar";

export default function Main({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 3, backgroundColor: "grey.100", width: `calc(100% - ${theme.spacing(8)} )` }}
    >
      <NavbarHeightSpacingHelper />
      {children}
    </Box>
  );
}
