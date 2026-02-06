import React, { useState } from "react";
import { TextField, IconButton, Box, Autocomplete } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CustomTextField from "../../../@core/components/mui/TextField";

function SearchFilter({
  handleSearchButtonClick,
  setSearchInput,
  searchInput,
  suggestions,
  handleSearchFinal,
}) {
  const handleOptionSelected = (event, value) => {
    if (value) {
      setSearchInput(value);
      handleSearchButtonClick(value);
    } else {
      setSearchInput("");
      handleSearchButtonClick("");
    }
  };

  const handleOptionSelectedValue = (event, value) => {
    setSearchInput(value || "");
    const inputElement = event.target;
    if (inputElement) {
      inputElement.style.paddingRight = "0px"; // Dynamically remove padding while typing
    }
  };


  return (
    <Box className=" w-[150px] md:w-[300px] ">
      <form onSubmit={handleSearchFinal}>
        <Autocomplete
          size="small"
          freeSolo
          options={suggestions}
          inputValue={searchInput}
          onInputChange={(event, value) => handleOptionSelectedValue(event, value)}
          onChange={handleOptionSelected}
          sx={{ width: "100%", }}
          renderInput={(params) => (
            <CustomTextField
              {...params}
              margin="normal"
              title="Search"
              id="search"
              type="text"
              name="search_input"
              placeholder="Search"
              variant="outlined"
              InputProps={{
                ...params.InputProps,
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
                  ...params.inputProps,
                  sx: {
                    width: "100%",
                   
                  },
                },
              }}
            />
          )}
        />
      </form>
    </Box>
  );
}

export default SearchFilter;
