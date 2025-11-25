// src/Pages/Marketing/GoogleCampaign/CampaignCards.jsx
import React, { useState } from "react";
import { FormControl, InputLabel, Select, MenuItem, Card, CardContent, Typography, Grid, Box } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function CampaignCards({ stats = {}, onRangeChange = () => {} }) {
  const [range, setRange] = useState("monthly");
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);

  const handleRangeChange = (v) => {
    setRange(v);
    if (v !== "custom") onRangeChange(v, null, null);
  };

  const handleDateChange = (s, e) => {
    if (s) setStart(s);
    if (e) setEnd(e);
    if ((s || start) && (e || end)) {
      onRangeChange("custom", (s || start).$d || s.$d, (e || end).$d || e.$d);
    }
  };

  return (
    <Box className="mt-4">
      <Box display="flex" justifyContent="space-between" alignItems="center" className="mb-4">
        <Typography variant="h6" fontWeight="400">Campaign Overview</Typography>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="range-label">Range</InputLabel>
          <Select labelId="range-label" value={range} label="Range" onChange={(e) => handleRangeChange(e.target.value)}>
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="custom">Custom Range</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}><Card><CardContent><Typography color="gray">Total Campaigns</Typography><Typography variant="h4">{stats.totalCampaigns || 0}</Typography></CardContent></Card></Grid>
        <Grid item xs={12} md={3}><Card><CardContent><Typography color="gray">Total Leads</Typography><Typography variant="h4">{stats.totalLeads || 0}</Typography></CardContent></Card></Grid>
        <Grid item xs={12} md={3}><Card><CardContent><Typography color="gray">Active Campaigns</Typography><Typography variant="h4">{stats.active || 0}</Typography></CardContent></Card></Grid>
        <Grid item xs={12} md={3}><Card><CardContent><Typography color="gray">Spend ({range})</Typography><Typography variant="h4">₹{stats.spend || 0}</Typography></CardContent></Card></Grid>
      </Grid>

      {range === "custom" && (
        <Box mt={4} display="flex" gap={3}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="Start Date" value={start} onChange={(d) => handleDateChange(d, null)} slotProps={{ textField: { size: "small" } }} />
            <DatePicker label="End Date" value={end} onChange={(d) => handleDateChange(null, d)} slotProps={{ textField: { size: "small" } }} />
          </LocalizationProvider>
        </Box>
      )}
    </Box>
  );
}
