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
  Typography,
} from "@mui/material";
import Link from "next/link";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import AdjustIcon from '@mui/icons-material/Adjust';
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

const NavInnerItem = ({ item, level, pathDirect, onClick }) => {
  const Icon = item.icon;
  const theme = useTheme();
  const innerItem = item.innerItem;
  // const itemIcon = <Icon stroke={1.5} size="1.3rem" />;
  const [isTrue, setIsTrue] = useState(false);
  const [openItems, setOpenItems] = useState([]);
  const ListItemStyled = styled(ListItem)(() => ({
    padding: 0,
    ".MuiButtonBase-root": {
      whiteSpace: "nowrap",
      marginBottom: "3px",
      padding: "1px 2px",
      borderRadius: "10px",
      backgroundColor: level > 1 ? "transparent !important" : "inherit",
      color: theme.palette.text.primary,
      paddingLeft: "10px",
      "&:hover": {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.text.main,
      },
      "&.Mui-selected": {
        color: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.light,
        "&:hover": {
          backgroundColor: theme.palette.primary.light,
          color: theme.palette.text.primary,
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
            pathDirect === item.href || item.related_path?.includes(pathDirect)
          }
          target={item.external ? "_blank" : ""}
          onClick={() => handleOnClick(item.id)}
        >
          <ListItemIcon
            sx={{
              minWidth: "20px",
            //   p: "3px 0",
              color: "inherit",
            }}
          >
            <AdjustIcon sx={{width:15}} />
          </ListItemIcon>
          {/* <ListItemIcon
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
          </ListItemIcon> */}
          <ListItemText  >
           <Typography fontSize={15}>{item.title}</Typography>
          </ListItemText>

          {innerItem && <KeyboardArrowDownIcon />}
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

export default NavInnerItem;
