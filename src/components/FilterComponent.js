import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import axios from 'axios';

const FilterComponent = ({ filterObject, updateFilter, sortObject, updateSort }) => {
  const [filterData, setFilterData] = useState({});
  const [sortData, setSortData] = useState({});
  const [additionalFilters, setAdditionalFilters] = useState([]);
  const [newFilterColumn, setNewFilterColumn] = useState('');
  const [newFilterValue, setNewFilterValue] = useState('');

  const excludedColumns = [...Object.keys(filterData), ...Object.keys(sortData)];

  const columnOptions = Object.entries(filterData).map(([key, value]) => (
    <MenuItem key={key} value={key}>{value.displayName}</MenuItem>
  ));

  useEffect(() => {
    // Fetch filter data from the API
    axios.get('your-api-endpoint')
      .then(response => {
        setFilterData(response.data.scheduled_class_filter_fields);
      })
      .catch(error => {
        console.error('Error fetching filter data:', error);
      });

    // Fetch sort data from the API
    axios.get('your-sort-api-endpoint')
      .then(response => {
        setSortData(response.data.scheduled_class_sort_fields);
      })
      .catch(error => {
        console.error('Error fetching sort data:', error);
      });
  }, []);

  const handleFilterChange = (key, value) => {
    updateFilter(key, value);
  };

  const handleSortChange = (key) => {
    const direction = sortObject[key] === 'asc' ? 'desc' : 'asc';
    updateSort(key, direction);
  };

  const handleNewFilterColumnChange = (event) => {
    setNewFilterColumn(event.target.value);
  };

  const handleNewFilterValueChange = (event) => {
    setNewFilterValue(event.target.value);
  };

  const handleAddFilter = () => {
    if (newFilterColumn && newFilterValue) {
      setAdditionalFilters([...additionalFilters, { column: newFilterColumn, value: newFilterValue }]);
      setNewFilterColumn('');
      setNewFilterValue('');
    }
  };

  const handleRemoveFilter = (index) => {
    const updatedFilters = additionalFilters.filter((_, i) => i !== index);
    setAdditionalFilters(updatedFilters);
  };

  const filterUI = Object.entries(filterData).map(([key, value]) => (
    <Grid key={key} item xs={12} md={6} lg={4}>
      <TextField
        fullWidth
        label={value.displayName}
        variant="outlined"
        value={filterObject[key] || ''}
        onChange={e => handleFilterChange(key, e.target.value)}
      />
    </Grid>
  ));

  const sortUI = Object.entries(sortData).map(([key, value]) => (
    <Grid key={key} item xs={12} md={6} lg={4}>
      <Button
        fullWidth
        variant="outlined"
        startIcon={sortObject[key] === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
        onClick={() => handleSortChange(key)}
      >
        {value.displayName}
      </Button>
    </Grid>
  ));

  const additionalFiltersUI = additionalFilters.map((filter, index) => (
    <Grid key={index} container item xs={12} spacing={2}>
      <Grid item xs={4}>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Column</InputLabel>
          <Select
            value={filter.column}
            onChange={handleNewFilterColumnChange}
            label="Column"
          >
            {/* Populate with column names */}
            {/* Make sure to exclude existing filters */}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={4}>
        {filter.column === 'date' ? (
          <TextField
            fullWidth
            label="Date"
            type="date"
            variant="outlined"
            value={filter.value}
            onChange={handleNewFilterValueChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        ) : filter.column === 'start_time' ? (
          <TextField
            fullWidth
            label="Start Time"
            type="time"
            variant="outlined"
            value={filter.value}
            onChange={handleNewFilterValueChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        ) : (
          <TextField
            fullWidth
            label={filter.column}
            variant="outlined"
            value={filter.value}
            onChange={handleNewFilterValueChange}
          />
        )}
      </Grid>
      <Grid item xs={4}>
        <Button
          variant="outlined"
          color="error"
          onClick={() => handleRemoveFilter(index)}
        >
          Remove
        </Button>
      </Grid>
    </Grid>
  ));

  return (
    <Grid container spacing={2}>
      {filterUI}
      {sortUI}
      <Grid item xs={12}>
        <h2>Add Additional Filters</h2>
        {additionalFiltersUI}
        <Button
          variant="outlined"
          onClick={handleAddFilter}
        >
          Add Filter
        </Button>
      </Grid>
    </Grid>
  );
};

export default FilterComponent;
