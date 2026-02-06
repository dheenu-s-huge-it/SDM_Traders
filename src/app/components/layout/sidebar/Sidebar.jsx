import { useMediaQuery, Box, Drawer, IconButton } from "@mui/material";
import DarkLogo from "../shared/logo/LogoDark";
import SidebarItems from "./SidebarItems";
import Upgrade from "./Updrade";
import { SidebarProfile } from "./SidebarProfile";
import { IconMenu, IconMenu2 } from "@tabler/icons-react";
import CloseIcon from '@mui/icons-material/Close';
import { PrivilegesContext } from "@/app/PrivilegesProvider";
import {useContext} from "react"
// interface ItemType {
//   isMobileSidebarOpen: boolean;
//   onSidebarClose: (event: React.MouseEvent<HTMLElement>) => void;
//   isSidebarOpen: boolean;
// }

const Sidebar = ({
  isMobileSidebarOpen,
  onSidebarClose,
  isSidebarOpen,
  toggleMobileSidebar,
  menuItems
}) => {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const {userType} = useContext(PrivilegesContext);

  const sidebarWidth = "230px";
  if (lgUp) {
    return (
      <Box
        sx={{
          width: sidebarWidth,
          flexShrink: 0,
          zIndex: 100,
        }}
      >
        {/* ------------------------------------------- */}
        {/* Sidebar for desktop */}
        {/* ------------------------------------------- */}
        <Drawer
          anchor="left"
          open={isSidebarOpen}
          variant="permanent"
          PaperProps={{
            sx: {
              width: sidebarWidth,
              boxSizing: "border-box",
              border: "0",
              top: "64px",
              boxShadow: "1px 0 20px #00000014",
            },
          }}
        >
          {/* ------------------------------------------- */}
          {/* Sidebar Box */}
          {/* ------------------------------------------- */}
          <Box
            sx={{
              height: "100%",
            }}
          >
            <Box
              sx={{
                height: "calc(100vh - 70px)",
                overflow: "auto",
              }}
            >
              {/* ------------------------------------------- */}
              {/* Sidebar Items */}
              {/* ------------------------------------------- */}
              <Box pt={3}>
                <SidebarItems userType={userType} menuItems={menuItems} />
              </Box>
            </Box>
          </Box>
        </Drawer>
      </Box>
    );
  }

  return (
    <Drawer
      anchor="left"
      open={isMobileSidebarOpen}
      onClose={onSidebarClose}
      variant="temporary"
      PaperProps={{
        sx: {
          width: sidebarWidth,
          boxShadow: (theme) => theme.shadows[8],
        },
      }}
    >
      {/* ------------------------------------------- */}
      {/* Logo */}
      {/* ------------------------------------------- */}
      <Box px={2} pt={2} display={'flex'} gap={2} alignItems={"center"}>
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={toggleMobileSidebar}
          sx={{
            color: "#000",
            display: {
              lg: "none",
              xs: "flex",
            },
          }}
        >
          {/* <Clo */}
          <CloseIcon width="22" height="22" />
        </IconButton>
        MENU
      </Box>
      {/* ------------------------------------------- */}
      {/* Sidebar For Mobile */}
      {/* ------------------------------------------- */}
      <Box pt={3}>
        <SidebarItems userType={userType} menuItems={menuItems} />
      </Box>
    </Drawer>
  );
};

export default Sidebar;
