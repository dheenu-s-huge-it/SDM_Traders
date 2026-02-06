// Third-party Imports
import styled from "@emotion/styled";
import classnames from "classnames";

// Component Imports
import HorizontalMenu from "../header/HorizontalMenu";
import VerticalMenu from "../header/VerticalMenu"
// Config Imports
import themeConfig from "../../../../configs/themeConfig";

// Hook Imports
import { useSettings } from "../../../../@core/hooks/useSettings";
import useHorizontalNav from "../../../../@menu/hooks/useHorizontalNav";

// Util Imports
import { horizontalLayoutClasses } from "../../../../@layouts/utils/layoutClasses";
import { useMediaQuery, useTheme } from "@mui/material";

const StyledDiv = styled.div`
  ${({ isContentCompact, isBreakpointReached }) =>
    !isBreakpointReached &&
    `
    padding: ${themeConfig.layoutPadding}px;

    ${
      isContentCompact &&
      `
      margin-inline: auto;
      // max-inline-size: ${themeConfig.compactContentWidth}px;
      width: 100%;
    `
    }
  `}
`;

const Navigation = ({ dictionary }) => {
  const theme = useTheme();
  // Hooks
  const { settings } = useSettings();
  const { isBreakpointReached } = useHorizontalNav();

  // Vars
  const headerContentCompact = settings?.navbarContentWidth === "compact";
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <div
      {...(!isBreakpointReached && {
        className: classnames(
          horizontalLayoutClasses?.navigation,
          "relative flex border-t w-full shadow-lg hidden md:block"
        ),
      })}
      style={{ borderColor: theme.palette.secondary.lightOpacity }}
    >
      <StyledDiv
        isContentCompact={headerContentCompact}
        isBreakpointReached={isBreakpointReached}
        {...(!isBreakpointReached && {
          className: classnames(
            horizontalLayoutClasses?.navigationContentWrapper,
            "flex items-center is-full p-2"
          ),
        })}
      >
      
          <HorizontalMenu dictionary={dictionary} /> 
        
      </StyledDiv>
    </div>
  );
};

export default Navigation;
