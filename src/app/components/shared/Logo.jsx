"use client";

// React Imports
import { useEffect, useRef } from "react";

// Third-party Imports
import styled from "@emotion/styled";

// Component Imports
import VuexyLogo from "../../../@core/svg/Logo";

import VuexyLogDark from "../../../@core/svg/LogoDark";

import { useTheme } from "@mui/material";

// Hook Imports
import useVerticalNav from "../../../@menu/hooks/useVerticalNav";

const LogoText = styled.span`
  color: ${({ color }) => color ?? "var(--mui-palette-text-primary)"};
  font-size: 1.375rem;
  line-height: 1.09091;
  font-weight: 700;
  letter-spacing: 0.25px;
  transition: ${({ transitionDuration }) =>
    `margin-inline-start ${transitionDuration}ms ease-in-out, opacity ${transitionDuration}ms ease-in-out`};

  ${({ isHovered, isCollapsed, isBreakpointReached }) =>
    !isBreakpointReached && isCollapsed && !isHovered
      ? "opacity: 0; margin-inline-start: 0;"
      : "opacity: 1; margin-inline-start: 12px;"}
`;

const Logo = ({ color }) => {
  // Refs
  const logoTextRef = useRef(null);

  const theme_org = useTheme();

  // Hooks
  const { isHovered, transitionDuration, isBreakpointReached } =
    useVerticalNav();

  return (
    <div className="flex items-center w-full">
      {theme_org?.palette?.mode === "dark" ? (
        <VuexyLogDark className="text-2xl text-primary" />
      ) : (
        <VuexyLogo className="text-2xl text-primary" />
      )}
    </div>
  );
};

export default Logo;
