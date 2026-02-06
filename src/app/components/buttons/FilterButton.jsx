import React from "react";
import { IconButton, Box } from "@mui/material";
import { FilterList, FilterListOff } from "@mui/icons-material";

export default function FilterButton({ HandleChangeFilter, filtersList }) {
  return (
    <Box>
      <IconButton
        size="small"
        onClick={() => HandleChangeFilter()}
        sx={{
          fontSize: "11px",
          fontWeight: "300",
          border: "1px solid #e0e0e0",
          borderRadius: "6px",
          padding: "8px",
        }}
      >
        {filtersList == false ? (
            <i className='tabler-filter ' style={{fontSize: "18px",}}/>
          ) : (
            <i className='tabler-filter-off ' style={{fontSize: "18px",}}/>
          )}
      </IconButton>
    </Box>
  );
}
