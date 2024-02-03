"use client";

import { Box, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Header({ sidebarWidth }: { sidebarWidth: number }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [isExpanded, setIsExpanded] = useState(!isMobile);

  return (
    <>
      <Navbar sidebarWidth={sidebarWidth} isExpanded={isExpanded} toggleSidebar={setIsExpanded}></Navbar>
      <Sidebar sidebarWidth={sidebarWidth} toggleSidebar={setIsExpanded} isExpanded={isExpanded} />
    </>
  );
}
