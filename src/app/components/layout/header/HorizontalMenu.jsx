// Next Imports
import { useParams } from "next/navigation";

// MUI Imports
import { useTheme } from "@mui/material/styles";

// Component Imports
import HorizontalNav, {
  Menu,
  SubMenu,
  MenuItem,
} from "../../../../@menu/horizontal-menu";
import VerticalNavContent from "../header/VerticalNavContent";
import CustomChip from "../../../../@core/components/mui/Chip";

// import { GenerateHorizontalMenu } from '@components/GenerateMenu'
// Hook Imports
import useVerticalNav from "../../../../@menu/hooks/useVerticalNav";

// Styled Component Imports
import StyledHorizontalNavExpandIcon from "../../../../@menu/styles/horizontal/StyledHorizontalNavExpandIcon";
import StyledVerticalNavExpandIcon from "../../../../@menu/styles/vertical/StyledVerticalNavExpandIcon";

// Style Imports
import menuItemStyles from "../../../../@core/styles/horizontal/menuItemStyles";
import menuRootStyles from "../../../../@core/styles/horizontal/menuRootStyles";
import verticalNavigationCustomStyles from "../../../../@core/styles/vertical/navigationCustomStyles";
import verticalMenuItemStyles from "../../../../@core/styles/vertical/menuItemStyles";
import verticalMenuSectionStyles from "../../../../@core/styles/vertical/menuSectionStyles";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import {
  AccountCircleOutlined,
  AppsOutlined,
  ArticleOutlined,
  AttachMoneyOutlined,
  BarChartOutlined,
  BrandingWatermark,
  CalendarMonthOutlined,
  ChevronRight,
  CircleOutlined,
  CopyAllOutlined,
  DescriptionOutlined,
  DonutLargeOutlined,
  FileOpenOutlined,
  FilePresentOutlined,
  FireTruck,
  FireTruckOutlined,
  HelpCenterOutlined,
  HelpOutlineOutlined,
  HomeOutlined,
  InsertDriveFileOutlined,
  LinkOutlined,
  ListOutlined,
  LockOutlined,
  Mail,
  MailOutline,
  MessageOutlined,
  MoreHorizOutlined,
  PaymentOutlined,
  PieChart,
  PieChartOutline,
  SafetyCheckOutlined,
  School,
  SchoolOutlined,
  SettingsOutlined,
  ShopOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
  SquareOutlined,
  TableChartOutlined,
  TrendingUp,
  TrendingUpOutlined,
  VerifiedUserOutlined,
  ChevronLeft,
} from "@mui/icons-material";
import {
  FilledInput,
  Grid,
  Typography,
  Box,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { MobileSliderMenu } from "./VerticalMenu";

const RenderExpandIcon = ({ level }) => (
  <StyledHorizontalNavExpandIcon level={level}>
    <ChevronRight />
    {/* <i className='tabler-chevron-right' /> */}
  </StyledHorizontalNavExpandIcon>
);

const RenderVerticalExpandIcon = ({ open, transitionDuration }) => (
  <StyledVerticalNavExpandIcon
    open={open}
    transitionDuration={transitionDuration}
  >
    <ChevronRight />
    {/* <i className='tabler-chevron-right' /> */}
  </StyledVerticalNavExpandIcon>
);
export const CustomMenuItem = ({ href, label, icon, suffix }) => {
  const theme = useTheme();
  return (
    <MenuItem href={href} style={{ color: theme?.palette?.text?.primary }}>
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

const HorizontalMenu = ({ dictionary }) => {
  // Hooks
  const verticalNavOptions = useVerticalNav();
  const theme = useTheme();
  const params = useParams();

  // Vars
  const { transitionDuration } = verticalNavOptions;
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Box sx={{ width: "100%" }} className="hidden md:block">
      <HorizontalNav
        switchToVertical
        verticalNavContent={VerticalNavContent}
        verticalNavProps={{
          customStyles: verticalNavigationCustomStyles(
            verticalNavOptions,
            theme
          ),
          backgroundColor: "var(--mui-palette-background-paper)",
        }}
      >
        <Menu
          rootStyles={menuRootStyles(theme)}
          renderExpandIcon={({ level }) => <RenderExpandIcon level={level} />}
          menuItemStyles={menuItemStyles(theme, "tabler-circle")}
          renderExpandedMenuItemIcon={{
            icon: <i className="tabler-circle text-xs" />,
          }}
          popoutMenuOffset={{
            mainAxis: ({ level }) => (level && level > 0 ? 14 : 12),
            alignmentAxis: 0,
          }}
          verticalMenuProps={{
            menuItemStyles: verticalMenuItemStyles(verticalNavOptions, theme),
            renderExpandIcon: ({ open }) => (
              <RenderVerticalExpandIcon
                open={open}
                transitionDuration={transitionDuration}
              />
            ),
            renderExpandedMenuItemIcon: {
              icon: <i className="tabler-circle text-xs" />,
            },
            menuSectionStyles: verticalMenuSectionStyles(
              verticalNavOptions,
              theme
            ),
          }}
        >
          <Box
            id="scroll-container"
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: { xs: "column", sm: "row", md: "row" },
              alignItems: { xs: "start", sm: "start", md: "start" },
              gap: 2,
            }}
          >
            {/* <div className="flex items-center">
              <IconButton
                onClick={() => {
                  document
                    .getElementById("scroll-menu")
                    .scrollBy({ left: -200, behavior: "smooth" });
                }}
                sx={{ display: { xs: "none", sm: "flex", md: "flex" } }}
              >
                <ChevronLeft className="cursor-pointer" />
              </IconButton>
            </div> */}

            <Box
              id="scroll-menu"
              sx={{
                overflowX: "auto",
                scrollBehavior: "smooth",
                whiteSpace: "nowrap",
                width: "100%",
                display: "flex",
                flexDirection: { xs: "row", sm: "row", md: "row" },
                alignItems: { xs: "start", sm: "start", md: "start" },
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              <Grid item xs={6} md={"auto"} sx={{ paddingLeft: "0.5rem" }}>
                <SubMenu
                  label="All Traders"
                  // icon={<img src="./images/icons/users.svg" className="w-5" />}
                  icon={<i className="tabler-users " />}
                >
                  <CustomMenuItem
                    href="/all-traders/create"
                    label=" Add Trader"
                    icon={<i className="tabler-user-plus " />}
                  />
                  <CustomMenuItem
                    href="/all-traders"
                    label=" All Traders"
                    icon={<i className="tabler-leaf " />}
                  />
                </SubMenu>
              </Grid>
              <Grid item xs={6} md={"auto"} sx={{ paddingLeft: "0.5rem" }}>
                <SubMenu
                  label="Sales"
                  // icon={<img src="./images/icons/shopping-cart.svg" className="w-5" />}
                  icon={<i className="tabler-shopping-cart " />}
                >
                  <CustomMenuItem
                    href="/sales/create"
                    label="Add Sale"
                    icon={<i className="tabler-shopping-cart-plus " />}
                  />
                  <CustomMenuItem
                    href="/sales"
                    label="All Sales"
                    icon={<i className="tabler-list " />}
                  />
                </SubMenu>
              </Grid>
              <Grid item xs={6} md={"auto"} sx={{ paddingLeft: "0.5rem" }}>
                <SubMenu
                  label="Reports"
                  icon={<i className="tabler-file-report" />}
                >
                  <CustomMenuItem
                    href="/trader-reports"
                    label="Trader Report"
                    icon={<i className="tabler-leaf " />}
                  />

                  <CustomMenuItem
                    href="/market-report"
                    label="Market Report"
                    icon={<i className="tabler-wallet " />}
                  />
                </SubMenu>
              </Grid>
              <Grid item xs={6} md={"auto"} sx={{ paddingLeft: "0.5rem" }}>
                <SubMenu
                  label="Settings"
                  icon={<i className="tabler-settings" />}
                >
                  <CustomMenuItem
                    href="/flower-type"
                    label="Flower Type"
                    icon={<i className="tabler-flower " />}
                  />
                    <CustomMenuItem
                    href="/group_type"
                    label="Group Type"
                    icon={<i className="tabler-users" />}
                  />    
                </SubMenu>
              </Grid>
            </Box>

            {/* <div className="flex items-center">
              <IconButton
                onClick={() => {
                  document
                    .getElementById("scroll-menu")
                    .scrollBy({ left: 200, behavior: "smooth" });
                }}
                sx={{ display: { xs: "none", sm: "flex", md: "flex" } }}
              >
                <ChevronRight className="cursor-pointer" />
              </IconButton>
            </div> */}
          </Box>
        </Menu>
      </HorizontalNav>
    </Box>
  );
};

export default HorizontalMenu;
