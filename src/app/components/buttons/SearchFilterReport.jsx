import React, { useState } from "react";
import { TextField, IconButton, Box, Autocomplete } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CustomTextField from "../../../@core/components/mui/TextField";

function SearchFilterReport({
  handleSearchButtonClick,
  setSearchInput,
  searchInput,
  suggestions,
  handleSearchFinal,
  searchFilterData, // Add this prop to access the full employee data
}) {
  const handleOptionSelected = (event, value) => {
    if (value) {
      // Extract employee ID from the suggestion format "ID--Name"
      const employeeId = value.split("--")[0];
      
      // Find the full employee data using the ID
      const selectedEmployee = searchFilterData?.find(emp => emp.user_id === employeeId);
      
      setSearchInput(value);
      
      // Pass the employee's data_uniq_id instead of just the search value
      if (selectedEmployee) {
        handleSearchButtonClick(selectedEmployee.data_uniq_id, value);
      } else {
        handleSearchButtonClick("", value);
      }
    } else {
      setSearchInput("");
      handleSearchButtonClick("", "");
    }
  };

  const handleOptionSelectedValue = (event, value) => {
    setSearchInput(value || "");
    const inputElement = event.target;
    if (inputElement) {
      inputElement.style.paddingRight = "0px";
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (searchInput) {
      // Extract employee ID from the search input if it matches suggestion format
      const employeeId = searchInput.split("--")[0];
      const selectedEmployee = searchFilterData?.find(emp => emp.user_id === employeeId);
      
      if (selectedEmployee) {
        handleSearchButtonClick(selectedEmployee.data_uniq_id, searchInput);
      } else {
        // If it's a manual search (not from suggestions), pass empty ID
        handleSearchButtonClick("", searchInput);
      }
    } else {
      handleSearchButtonClick("", "");
    }
  };

  return (
    <Box className=" w-[150px] md:w-[300px] ">
      <form onSubmit={handleFormSubmit}>
        <Autocomplete
          size="small"
          freeSolo
          options={suggestions}
          inputValue={searchInput}
          onInputChange={(event, value) => handleOptionSelectedValue(event, value)}
          onChange={handleOptionSelected}
          sx={{ width: "100%" }}
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
                    type="submit"
                    size="small"
                  >
                    <SearchIcon />
                  </IconButton>
                ),
                sx: { pr: 0 },
              }}
            />
          )}
        />
      </form>
    </Box>
  );
}

export default SearchFilterReport;