import React, { useState } from 'react';
import { Autocomplete, Checkbox, TextField, ListItemText } from '@mui/material';

const CustomAutoCheckBox = ({ id, label, options,onChange }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  // Handle checkbox selection
  const handleChange = (event, newValue) => {
    setSelectedOptions(newValue);
  };

  // Filter out non-checkbox options
  const renderOptions = (props, option) => (
    <li {...props}>
      <Checkbox
        checked={selectedOptions.some((item) => item.value === option.value)}
      />
      <ListItemText primary={option.label} />
    </li>
  );

  return (
    <Autocomplete
      multiple size='small'
      id={id}
      options={options}
      value={selectedOptions}
      onChange={handleChange}
      getOptionLabel={(option) => option.label}
      renderOption={renderOptions}
      renderInput={(params) => <TextField {...params} label={label} />}
      isOptionEqualToValue={(option, value) => option.value === value.value}
    />
  );
};


export default CustomAutoCheckBox