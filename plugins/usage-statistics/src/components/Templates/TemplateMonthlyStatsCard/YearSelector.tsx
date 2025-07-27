import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';

interface YearSelectorProps {
  years: string[];
  selectedYear: string;
  onYearChange: (year: string) => void;
  disabled?: boolean;
}

export const YearSelector = ({ years, selectedYear, onYearChange, disabled = false }: YearSelectorProps) => {
  return (
    <FormControl variant="outlined" size="small" disabled={disabled || years.length <= 1}>
      <InputLabel id="year-select-label">Year</InputLabel>
      <Select
        labelId="year-select-label"
        value={selectedYear}
        onChange={e => onYearChange(e.target.value as string)}
        label="Year"
      >
        {years.map(year => (
          <MenuItem key={year} value={year}>
            {year}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
