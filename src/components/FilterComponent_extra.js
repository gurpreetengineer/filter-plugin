import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';

const FilterPlugin = ({ filterObject, updateFilter }) => {
  const [filterData, setFilterData] = useState({});
  const [additionalFilters, setAdditionalFilters] = useState([]);
  const [newFilterColumn, setNewFilterColumn] = useState('');
  const [newFilterValue, setNewFilterValue] = useState('');

  useEffect(() => {
    // Fetch filter data from the API
    axios.get('your-api-endpoint')
      .then(response => {
        setFilterData(response.data.scheduled_class_filter_fields);
      })
      .catch(error => {
        console.error('Error fetching filter data:', error);
      });
  }, []);

  const handleNewFilterColumnChange = (event) => {
    setNewFilterColumn(event.target.value);
  };

  const handleNewFilterValueChange = (event) => {
    setNewFilterValue(event.target.value);
  };

  const handleAddFilter = () => {
    if (newFilterColumn && newFilterValue) {
      const newFilter = { column: newFilterColumn, value: newFilterValue };
      setAdditionalFilters([...additionalFilters, newFilter]);
      setNewFilterColumn('');
      setNewFilterValue('');
    }
  };

  const handleRemoveFilter = (index) => {
    const updatedFilters = additionalFilters.filter((_, i) => i !== index);
    setAdditionalFilters(updatedFilters);
  };

  const handleFilterColumnChange = (event, index) => {
    const updatedFilters = [...additionalFilters];
    updatedFilters[index].column = event.target.value;
    setAdditionalFilters(updatedFilters);
  };

  const handleFilterValueChange = (event, index) => {
    const updatedFilters = [...additionalFilters];
    updatedFilters[index].value = event.target.value;
    setAdditionalFilters(updatedFilters);
  };

  const filterUI = Object.entries(filterData).map(([key, value]) => (
    <TextField
      key={key}
      fullWidth
      label={value.displayName}
      variant="outlined"
      value={filterObject[key] || ''}
      onChange={(e) => updateFilter(key, e.target.value)}
    />
  ));

  const additionalFiltersUI = additionalFilters.map((filter, index) => (
    <div key={index}>
      <FormControl fullWidth variant="outlined">
        <InputLabel>Column</InputLabel>
        <Select
          value={filter.column}
          onChange={(e) => handleFilterColumnChange(e, index)}
          label="Column"
        >
          {Object.keys(filterData).map((columnKey) => (
            <MenuItem key={columnKey} value={columnKey}>
              {filterData[columnKey].displayName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {filter.column === 'date' || filter.column === 'start_time' ? (
        <TextField
          fullWidth
          label={filterData[filter.column].displayName}
          type={filter.column === 'date' ? 'date' : 'time'}
          variant="outlined"
          value={filter.value}
          onChange={(e) => handleFilterValueChange(e, index)}
          InputLabelProps={{ shrink: true }}
        />
      ) : (
        <TextField
          fullWidth
          label={filterData[filter.column].displayName}
          variant="outlined"
          value={filter.value}
          onChange={(e) => handleFilterValueChange(e, index)}
        />
      )}
      <Button variant="outlined" onClick={() => handleRemoveFilter(index)}>
        Remove
      </Button>
    </div>
  ));

  return (
    <Card>
      <CardContent>
        <h2>Filters</h2>
        {filterUI}
        <h3>Add Additional Filters</h3>
        {additionalFiltersUI}
        <Button variant="outlined" onClick={handleAddFilter}>
          Add Filter
        </Button>
      </CardContent>
    </Card>
  );
};

export default FilterPlugin;
