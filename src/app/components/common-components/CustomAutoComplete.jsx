import React from 'react';
import { Autocomplete, TextField } from '@mui/material';

const CustomAutocomplete = ({ options, value, onChange, label, id }) => {
  return (
    <Autocomplete
    size='small'
      id={id}
      value={value}
      onChange={(event, newValue) => onChange(newValue)}
      options={options}
      getOptionLabel={(option) => option.label || option} // In case options are simple strings or objects with label
      renderInput={(params) => <TextField {...params} label={label} variant="outlined" />}
      isOptionEqualToValue={(option, value) => option.value === value}
      disableClearable // Optional: if you don't want the option to be cleared
    />
  );
};

export default CustomAutocomplete;
