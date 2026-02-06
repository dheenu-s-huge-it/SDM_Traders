import React, { useState } from "react";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Box,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ExpandLess,
  ExpandMore,
  Home,
  ShoppingBag,
  Close,
} from "@mui/icons-material";
import { useTheme } from "@emotion/react";
import useVerticalNav from "../../../../@menu/hooks/useVerticalNav";
import { useParams } from "next/navigation";
// Import your custom icons here
import PerfectScrollbar from "react-perfect-scrollbar";
import Logo from "../shared/logo/Logo";
import {
  Menu,
  SubMenu,
  MenuItem,
  MenuSection,
} from "../../../../@menu/vertical-menu";

import StyledVerticalNavExpandIcon from "../../../../@menu/styles/vertical/StyledVerticalNavExpandIcon";

// Style Imports
import menuItemStyles from "../../../../@core/styles/vertical/menuItemStyles";
import menuSectionStyles from "../../../../@core/styles/vertical/menuSectionStyles";

export const CustomMenuItem = ({ href, label, icon, suffix, setIsOpen }) => {
  const handleClick = () => {
    // Close the drawer when item is clicked
    setIsOpen(false);
  };

  const theme = useTheme();
  return (
    <MenuItem
      href={href}
      style={{ color: theme?.palette?.text?.primary }}
      onClick={handleClick}
    >
      <div className="flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          {icon ? icon : <i className="tabler-point" />}
          {label}
        </div>
        {suffix && suffix}
      </div>
    </MenuItem>
  );
};

export const MobileSliderMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setIsOpen(open);
  };

  const theme = useTheme();
  const verticalNavOptions = useVerticalNav();

  const RenderExpandIcon = ({ open, transitionDuration }) => (
    <StyledVerticalNavExpandIcon
      open={open}
      transitionDuration={transitionDuration}
    >
      <i className="tabler-chevron-right" />
    </StyledVerticalNavExpandIcon>
  );

  // Vars
  const { isBreakpointReached, transitionDuration } = verticalNavOptions;

  return (
    <>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={toggleDrawer(true)}
        sx={{ display: { sm: "none" }, color: "primary.main" }}
      >
        <i className="tabler-menu-2" /> {/* Use the CSS class for the icon */}
      </IconButton>

      <Drawer
        anchor="left"
        open={isOpen}
        onClose={toggleDrawer(false)}
        sx={{
          display: { sm: "none" },
          width: 300, // Adjust this value to your desired width
          flexShrink: 0, // Prevents shrinking
          "& .MuiDrawer-paper": {
            width: 250, // Adjust this value to your desired width
          },
        }}
      >
        <div className="flex items-center justify-between p-4 ">
          <Logo />
          <IconButton onClick={() => setIsOpen(false)} className="lg:hidden">
            <i className="tabler-x" />{" "}
            {/* Use the tabler-x icon with the CSS class */}
          </IconButton>
        </div>
        {/* <List>{menuItems.map(renderMenuItem)}</List>  */}

      
        <Menu
          popoutMenuOffset={{ mainAxis: 23 }}
          menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
          renderExpandIcon={({ open }) => (
            <RenderExpandIcon
              open={open}
              transitionDuration={transitionDuration}
            />
          )}
          renderExpandedMenuItemIcon={{
            icon: <i className="tabler-circle text-xs" />,
          }}
          menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
        >
          <SubMenu
            label="All Users"
            // icon={<img src="./images/icons/users.svg" className="w-5" />}
            icon={<i className="tabler-users " />}
          >
            <CustomMenuItem
              href="/all-traders/create"
              label=" Add User"
              icon={<i className="tabler-user-plus " />}
              setIsOpen={setIsOpen}
            />
            <CustomMenuItem
              href="/all-traders"
              label=" All Traders"
              icon={<i className="tabler-leaf " />}
              setIsOpen={setIsOpen}
            />
          </SubMenu>
          <SubMenu
            label="Sales"
            // icon={<img src="./images/icons/shopping-cart.svg" className="w-5" />}
            icon={<i className="tabler-shopping-cart " />}
          >
            <CustomMenuItem
              href="/sales/create"
              label="Add Sale"
              icon={<i className="tabler-shopping-cart-plus " />}
              setIsOpen={setIsOpen}
            />
            <CustomMenuItem
              href="/sales"
              label="All Sales"
              icon={<i className="tabler-list " />}
              setIsOpen={setIsOpen}
            />
          </SubMenu>

          <SubMenu label="Settings" icon={<i className="tabler-settings" />}>
            <CustomMenuItem
              href="/flower-type"
              label="Flower Type"
              icon={<i className="tabler-flower " />}
              setIsOpen={setIsOpen}
            />
            <CustomMenuItem
              href="/group_type"
              label="Group Type"
              icon={<i className="tabler-users" />}
              setIsOpen={setIsOpen}
            />
          </SubMenu>
        </Menu>
      </Drawer>
    </>
  );
};
