import React from "react";
import Menuitems from "./MenuItems";
import { usePathname } from "next/navigation";
import { Box, List, Divider } from "@mui/material";
import NavItem from "./NavItem";
import { allowedPathsByUserType } from "@/lib/config";
import { useRouter } from "next/navigation";

const SidebarItems = ({ toggleMobileSidebar, userType }) => {
  const router = useRouter();
  const pathname = usePathname();
  const pathDirect = pathname;
  const filteredMenuItems = Menuitems.filter((item) =>
    item.allowed_type.includes(userType)
  );

  const groupedItems = {
    userManagement: [],
    masters: [],
    other: [],
  };

  filteredMenuItems.forEach((item) => {
    if (item.title === "Manager" || item.title === "Adjuster") {
      groupedItems.userManagement.push(item);
    } else if (
      item.title === "Insurance Company" ||
      item.title === "Vehicle Make" ||
      item.title === "Vehicle Models" ||
      item.title === "Workshop"
    ) {
      groupedItems.masters.push(item);
    } else {
      groupedItems.other.push(item);
    }
  });

  return (
    <Box sx={{ px: 2 }}>
      <List sx={{ pt: 0 }} className="sidebarNav" component="div">
        {groupedItems.userManagement.map((item, index) => (
          <div key={item.id}>
            <NavItem
              item={item}
              pathDirect={pathDirect}
              onClick={toggleMobileSidebar}
            />
            {index < groupedItems.userManagement.length - 1 && (
              <Divider variant="middle" />
            )}
          </div>
        ))}

        {groupedItems.masters.map((item, index) => (
          <div key={item.id}>
            <NavItem
              item={item}
              pathDirect={pathDirect}
              onClick={toggleMobileSidebar}
            />
            {index < groupedItems.masters.length - 1 && (
              <Divider variant="middle" />
            )}
          </div>
        ))}

        {groupedItems.other.map((item, index) => (
          <div key={item.id}>
            <NavItem
              item={item}
              pathDirect={pathDirect}
              onClick={toggleMobileSidebar}
            />
            {index < groupedItems.other.length - 1 && (
              <Divider variant="middle" />
            )}
          </div>
        ))}
        <Divider variant="middle" />
      </List>
    </Box>
  );
};

export default SidebarItems;
