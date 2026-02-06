import React from "react";
import { TextField, IconButton, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CustomTextField from "../../../@core/components/mui/TextField";

function SearchSingleFilter({
  setSearchInput,
  searchInput,
  handleSearchFinal,
}) {
  const handleInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  return (
    <Box className="w-[150px] md:w-[300px]">
      <form onSubmit={handleSearchFinal}>
        <CustomTextField
          margin="normal"
          title="Search"
          id="search"
          type="text"
          name="search_input"
          placeholder="Search"
          variant="outlined"
          size="small"
          value={searchInput}
          style={{ width: "100%" }}
          onChange={handleInputChange}
          InputProps={{
            endAdornment: (
              <IconButton
                type="button"
                size="small"
                onClick={handleSearchFinal}
              >
                <SearchIcon />
              </IconButton>
            ),
            inputProps: {
              sx: {
                width: "100%",
                paddingRight: '0px'
              },
            },
          }}
        />
      </form>
    </Box>
  );
}

export default SearchSingleFilter;
