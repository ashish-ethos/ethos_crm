import React from "react";
import Drawer from "@mui/material/Drawer";
import { Close } from "@mui/icons-material";
import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
  Typography,
  Autocomplete,
  TextField,
} from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const ShuffleLead = ({
  open,
  setOpen,

  shuffleOptions = [],
  leadStatusOptions = [],
  employeeList = [],

  shuffleType,
  setShuffleType,
  status,
  setStatus,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  employees,
  setEmployees,

  onShuffle,
  onReset,
}) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => setOpen(false)}
      PaperProps={{
        sx: { width: { xs: "100%", sm: 430 }, border: "none" },
      }}
    >
      <div className="flex flex-col h-full bg-white">

        {/* ===== HEADER ===== */}
        <div className="flex items-center justify-between bg-[#20aee3] text-white px-5 py-4 shadow-md">
          <h2 className="text-lg font-semibold">Shuffle Leads</h2>

          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-full hover:bg-white/20 transition"
          >
            <Close className="text-white" />
          </button>
        </div>

        {/* ===== CONTENT ===== */}
        <div className="p-5 space-y-4 overflow-y-auto">

          {/* Shuffle Based On */}
          <FormControl fullWidth size="small">
            <InputLabel>Shuffle Based On</InputLabel>
            <Select
              value={shuffleType}
              label="Shuffle Based On"
              onChange={(e) => setShuffleType(e.target.value)}
            >
              {shuffleOptions.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Lead Status */}
          <FormControl fullWidth size="small">
            <InputLabel>Lead Status</InputLabel>
            <Select
              multiple
              value={status}
              label="Lead Status"
              onChange={(e) => setStatus(e.target.value)}
              renderValue={(selected) => selected.join(", ")}
            >
              {leadStatusOptions.map((item) => (
                <MenuItem key={item} value={item}>
                  <Checkbox checked={status.includes(item)} />
                  <ListItemText primary={item} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Date Range - only when custom shuffle */}
          {shuffleType === "custom" && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className="flex flex-col gap-4">
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(newVal) => setStartDate(newVal)}
                />
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(newVal) => setEndDate(newVal)}
                />
              </div>
            </LocalizationProvider>
          )}

          {/* Assign Leads To */}
          <div>
            <Typography className="text-gray-700 text-[14px] font-medium mb-1">
              Assign Leads To
            </Typography>

            <Autocomplete
              multiple
              disableCloseOnSelect
              options={employeeList}
              value={employees}
              onChange={(e, newValue) => setEmployees(newValue)}
              renderOption={(props, option, { selected }) => (
                <li {...props} className="flex items-center gap-2 px-2 py-1">
                  <Checkbox size="small" checked={selected} />
                  {option}
                </li>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Select Employees" size="small" />
              )}
            />
          </div>
        </div>

        {/* ===== FOOTER ===== */}
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onReset}
            className="border border-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition"
          >
            Reset
          </button>

          <button
            onClick={onShuffle}
            className="bg-[#20aee3] hover:bg-[#1593c4] text-white px-4 py-2 rounded-md font-medium transition"
          >
            Shuffle Leads
          </button>
        </div>
      </div>
    </Drawer>
  );
};

export default ShuffleLead;
