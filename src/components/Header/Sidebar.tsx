"use client";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import {
  CSSObject,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Theme,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import MuiDrawer, { DrawerProps as MuiDrawerProps } from "@mui/material/Drawer";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarRouteItems } from "./sidebar-routes";

interface DrawerProps extends MuiDrawerProps {
  open?: boolean;
  drawerwidth?: number | string;
}

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const openedMixin = (theme: Theme, drawerWidth?: number | string): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const IconDrawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })<DrawerProps>(
  ({ theme, open, drawerwidth = 240 }) => ({
    width: drawerwidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
      ...openedMixin(theme, drawerwidth),
      "& .MuiDrawer-paper": openedMixin(theme, drawerwidth),
    }),
    ...(!open && {
      ...closedMixin(theme),
      "& .MuiDrawer-paper": closedMixin(theme),
    }),
  })
);

export default function Sidebar({
  sidebarWidth,
  toggleSidebar,
  isExpanded,
}: {
  sidebarWidth: number;
  toggleSidebar: Function;
  isExpanded: boolean;
}) {
  const theme = useTheme();
  const pathname = usePathname();

  return (
    <>
      {/* Desktop */}
      <IconDrawer
        variant="permanent"
        open={isExpanded}
        drawerwidth={sidebarWidth}
        sx={{
          display: { xs: "none", sm: "block" },
        }}
      >
        <Paper variant="outlined" square sx={{ borderRight: 0 }}>
          <DrawerHeader>
            <Typography variant="logo">{"{ jcntck.dev }"}</Typography>
            <IconButton onClick={() => toggleSidebar(false)}>
              {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </DrawerHeader>
        </Paper>
        {/* <Divider /> */}
        <List>
          {SidebarRouteItems.get().map((item, index) => (
            <ListItem key={index} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: isExpanded ? "initial" : "center",
                  px: 2.5,
                }}
                selected={pathname == item.path}
                LinkComponent={Link}
                href={item.path}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: isExpanded ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <item.icon />
                </ListItemIcon>
                <ListItemText primary={item.title} sx={{ opacity: isExpanded ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </IconDrawer>
      {/* Mobile */}
      <Drawer
        variant="temporary"
        open={isExpanded}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: "100%" },
        }}
      >
        <DrawerHeader>
          <Typography variant="logo" textAlign={"center"} flexGrow={1} sx={{ mr: 1 }}>
            {"{ jcntck.dev }"}
          </Typography>
          <IconButton onClick={() => toggleSidebar(false)}>
            <CloseIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {SidebarRouteItems.get().map((item, index) => (
            <ListItem key={index} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: "center",
                  px: 2.5,
                }}
                selected={pathname == item.path}
                LinkComponent={Link}
                href={item.path}
                onClick={() => toggleSidebar(false)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: 3,
                    justifyContent: "center",
                  }}
                >
                  <item.icon />
                </ListItemIcon>
                <ListItemText primary={item.title} sx={{ flex: "none" }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
}
