import { React, useState, useEffect, useContext } from "react";
import Menuitems from "./MenuItems";
import { usePathname } from "next/navigation";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import NavItem from "./NavItem";
import { allowedPathsByUserType } from "@/lib/config";
import { useRouter } from "next/navigation";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { PrivilegesContext } from "@/app/PrivilegesProvider";
import Link from "next/link";
import {
  BugReportOutlined,
  BugReportSharp,
  Feedback,
  FeedbackOutlined,
} from "@mui/icons-material";
function getBasePath(fullPath) {
  // Split by '/' and take the first two segments
  const parts = fullPath.split("/").filter(Boolean);
  return `/${parts[0]}`;
}
const SidebarItems = ({ toggleMobileSidebar }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { userType, menuItems } = useContext(PrivilegesContext);
  const [mainMenuItems, setMainMenuItems] = useState([]);
  // const  = ;
  const pathDirect = getBasePath(pathname);

  const theme = useTheme();
  useEffect(() => {
    if (menuItems) {
      const formattedData = menuItems?.map((item) => ({
        id: item.data_uniq_id,
        title: item.menu_item_name,
        icon: item.icon_path,
        icon_c: "/images/icons/dashboard_c.svg", // icon: GridViewOutlinedIcon,
        href: item.path,
        innerItem: item.children
          ? item.children.map((item) => ({
              id: item.data_uniq_id,
              title: item.menu_item_name,
              icon: item.icon_path,
              icon_c: "/images/icons/dashboard_c.svg", // icon: GridViewOutlinedIcon,
              href: item.path,
            }))
          : [],
      }));
      setMainMenuItems(formattedData);
    }
  }, [menuItems]);

  const ListItemStyled = styled(ListItem)(() => ({
    padding: 0,
    ".MuiButtonBase-root": {
      whiteSpace: "nowrap",
      marginBottom: "3px",
      padding: "3px 5px",
      borderRadius: "10px",
      // backgroundColor: level > 1 ? "transparent !important" : "inherit",
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

  return (
    <Box
      sx={{
        px: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "calc(100vh - 94px)",
      }}
    >
      <List sx={{ pt: 0 }} className="sidebarNav" component="div">
        <ListItemStyled>
          <ListItemButton
            component={Link}
            href={"/"}
            selected={pathDirect === "/undefined"}
          >
            <ListItemIcon
              sx={{
                minWidth: "26px",
                // p: "3px 0",
                color: "inherit",
              }}
            >
              <img
                src={
                  pathDirect === "/undefined"
                    ? "/images/icons/home_c.svg"
                    : "/images/icons/home.svg"
                }
                alt=""
                style={{
                  objectFit: "cover",
                  width: "18px",
                }}
              />
            </ListItemIcon>
            <ListItemText>
              <>Home</>
            </ListItemText>
          </ListItemButton>
        </ListItemStyled>
        {mainMenuItems.map((item) => {
          return (
            <NavItem
              item={item}
              key={item.id}
              pathDirect={pathDirect}
              onClick={toggleMobileSidebar}
            />
          );
        })}
      </List>
      <List sx={{ pt: 0 }} className="sidebarNav" component="div">
        <ListItemStyled>
          <ListItemButton
            component={Link}
            href={"/feedback"}
            selected={pathDirect === "/feedback"}
          >
            <ListItemIcon
              sx={{
                minWidth: "26px",
                // p: "3px 0",
                color: "inherit",
              }}
            >
              <FeedbackOutlined sx={{ width: "18px" }} />
              {/*       {pathDirect === "" ? (
                  img //
                 ) : (
                    <img
                      src={item.icon}
                      alt=""
                      style={{
                        objectFit: "cover",
                      }}
                    />
                  )} */}
            </ListItemIcon>
            <ListItemText>
              <>Feedback</>
            </ListItemText>
          </ListItemButton>
        </ListItemStyled>
       <ListItemStyled>
          <ListItemButton
            component={Link}
            href={"/report-bug"}
            selected={pathDirect === "/report-bug"}
          >
            <ListItemIcon
              sx={{
                minWidth: "26px",
                // p: "3px 0",
                color: "inherit",
              }}
            >
              <BugReportOutlined sx={{ width: "18px" }} />
             
            </ListItemIcon>
            <ListItemText>
              <>Report Bugs</>
            </ListItemText>
          </ListItemButton>
        </ListItemStyled> 
      </List>
    </Box>
  );
};
export default SidebarItems;
