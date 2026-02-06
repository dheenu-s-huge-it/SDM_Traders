import React from 'react';
import { Autocomplete } from '@mui/material';
import CustomTextField from "../../../@core/components/mui/TextField";

const CustomAutocomplete = ({ options, value, onChange, label, id ,option_label,error,helperText,createdisabled}) => {
  return (
    <Autocomplete
      id={id}
      value={value}
      disabled={createdisabled}
      onChange={(event, newValue) => onChange(event, newValue)}
      options={options}
      getOptionLabel={option_label}
      renderInput={(params) => <CustomTextField {...params} variant="outlined" error={error} helperText={helperText}  />}
      isOptionEqualToValue={(option, value) => option.value === value}
      disableClearable
    />
  );
};

export default CustomAutocomplete;
