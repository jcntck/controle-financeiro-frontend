"use client";

import MenuIcon from "@mui/icons-material/Menu";
import { Box, IconButton, Toolbar, Typography, styled, useTheme } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
  drawerwidth?: number;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open, drawerwidth }) => ({
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export function NavbarHeightSpacingHelper() {
  const theme = useTheme();
  return <Box sx={{ ...theme.mixins.toolbar }} />;
}

export default function Navbar({
  sidebarWidth,
  isExpanded,
  toggleSidebar,
}: {
  sidebarWidth: number;
  isExpanded: boolean;
  toggleSidebar: Function;
}) {
  const theme = useTheme();

  return (
    <AppBar
      color="default"
      drawerwidth={sidebarWidth}
      open={isExpanded}
      variant="outlined"
      sx={{
        zIndex: { sm: theme.zIndex.drawer + 1 },
        backgroundColor: "#fff",
        borderLeft: 0,
        ...(isExpanded && {
          width: { sm: `calc(100% - ${sidebarWidth}px)` },
          ml: { sm: `${sidebarWidth}px` },
        }),
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={() => toggleSidebar(!isExpanded)}
          edge="start"
          sx={{
            marginRight: 3,
            ...(isExpanded && { display: { sm: "none" } }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h5">Controle Financeiro</Typography>
      </Toolbar>
    </AppBar>
  );
}
