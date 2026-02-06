import React from "react";
import { useState } from "react";
// mui imports
import {
  ListItemIcon,
  ListItem,
  List,
  styled,
  ListItemText,
  useTheme,
  ListItemButton,
  Collapse,
  Box,
} from "@mui/material";
import Link from "next/link";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import NavInnerItem from "../NavInnerItem";

// type NavGroup = {
//   [x: string]: any;
//   id?: string;
//   navlabel?: boolean;
//   subheader?: string;
//   title?: string;
//   icon?: any;
//   href?: any;
//   onClick?: React.MouseEvent<HTMLButtonElement, MouseEvent>;
// };

// interface ItemType {
//   item: NavGroup;
//   onClick: (event: React.MouseEvent<HTMLElement>) => void;
//   hideMenu?: any;
//   level?: number | any;
//   pathDirect: string;
// }

const NavItem = ({ item, level, pathDirect, onClick }) => {
  const Icon = item.icon;
  const theme = useTheme();
  const innerItem = item.innerItem;
  const innerPathNames = innerItem ? innerItem?.map(inItem => inItem.href) : []
  // const itemIcon = <Icon stroke={1.5} size="1.3rem" />;
  const [isTrue, setIsTrue] = useState(false);
  const [openItems, setOpenItems] = useState([]);
  const ListItemStyled = styled(ListItem)(() => ({
    padding: 0,
    ".MuiButtonBase-root": {
      whiteSpace: "nowrap",
      marginBottom: "3px",
      padding: "3px 5px",
      borderRadius: "10px",
      backgroundColor: level > 1 ? "transparent !important" : "inherit",
      color: theme.palette.text.primary,
      paddingLeft: "10px",
      "&:hover": {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.primary.main,
      },
      "&.Mui-selected": {
        color: "white",
        backgroundColor: theme.palette.primary.main,
        "&:hover": {
          backgroundColor: theme.palette.primary.main,
          color: "white",
        },
      },
    },
  }));

  const handleOnClick = (id) => {
    if (openItems.includes(id)) {
      // If id is already in openItems, remove it
      setOpenItems(openItems.filter((item) => item !== id));
    } else {
      // If id is not in openItems, add it
      setOpenItems([...openItems, id]);
    }
  };


  return (
    <List component="div" disablePadding key={item.id}>
      <ListItemStyled>
        <ListItemButton
          component={item.href ? Link : ""}
          href={item.href}
          disabled={item.disabled}
          selected={
            pathDirect === item.href || item.related_path?.includes(pathDirect) || innerPathNames.includes(pathDirect)
          }
          target={item.external ? "_blank" : ""}
          onClick={() => handleOnClick(item.id)}
        >
          {/* <ListItemIcon
            sx={{
              minWidth: "36px",
              p: "3px 0",
              color: "inherit",
            }}
          >
            <Icon isTrue={pathDirect === item.href} />
          </ListItemIcon> */}
          <ListItemIcon
            sx={{
              minWidth: "26px",
              // p: "3px 0",
              color: "inherit",
            }}
          >
            {pathDirect === item.href ? (
              <img
                src={item.icon_c}
                alt=""
                style={{
                  objectFit: "cover",
                }}
              />
            ) : (
              <img
                src={item.icon}
                alt=""
                style={{
                  objectFit: "cover",
                }}
              />
            )}
          </ListItemIcon>
          <ListItemText>
            <>{item.title}</>
          </ListItemText>

          {innerItem.length > 0 &&
            (openItems.includes(item.id) ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            ))}
        </ListItemButton>
      </ListItemStyled>
      <Collapse in={openItems.includes(item.id)}>
        <Box ml={2}>
          {innerItem?.map((item) => {
            return (
              <NavInnerItem
                item={item}
                key={item.id}
                pathDirect={pathDirect}
                // onClick={toggleMobileSidebar}
              />
            );
          })}
        </Box>
      </Collapse>
    </List>
  );
};

export default NavItem;
