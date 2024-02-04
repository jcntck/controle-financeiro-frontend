"use client";

import { useTheme } from "@mui/material";
import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Header({ sidebarWidth }: { sidebarWidth: number }) {
  const theme = useTheme();

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <Navbar sidebarWidth={sidebarWidth} isExpanded={isExpanded} toggleSidebar={setIsExpanded}></Navbar>
      <Sidebar sidebarWidth={sidebarWidth} toggleSidebar={setIsExpanded} isExpanded={isExpanded} />
    </>
  );
}
