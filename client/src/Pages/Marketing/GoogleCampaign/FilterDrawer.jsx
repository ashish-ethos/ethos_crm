// src/Pages/Marketing/GoogleCampaign/FilterDrawer.jsx
import React, { useState } from "react";
import { TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { IoClose } from "react-icons/io5";

export default function FilterDrawer({ open, setOpen, onApply = () => {} }) {
  const [filters, setFilters] = useState({
    status: "all",
    type: "all",
    budgetMin: "",
    budgetMax: "",
    leadsMin: "",
    leadsMax: "",
    spendMin: "",
    spendMax: "",
    startDate: null,
    endDate: null,
    sortBy: "created-desc",
  });

  const handleChange = (k, v) => setFilters(p => ({ ...p, [k]: v }));
  const resetFilters = () => setFilters({ status: "all", type: "all", budgetMin: "", budgetMax: "", leadsMin: "", leadsMax: "", spendMin: "", spendMax: "", startDate: null, endDate: null, sortBy: "created-desc" });
  const applyFilters = () => { onApply(filters); setOpen(false); };

  return (
    <div className={`fixed top-0 right-0 h-full w-[350px] bg-white shadow-xl transition-transform duration-300 z-50 ${open ? "translate-x-0" : "translate-x-full"}`}>
      <div className="flex justify-between items-center border-b p-4 bg-[#20aee3] text-white">
        <h2 className="text-xl font-semibold">Filters</h2>
        <button className="text-lg" onClick={() => setOpen(false)}>
            <IoClose size={22}/>
        </button>
      </div>

      <div className="p-5 space-y-4">
        <div>
          <label className="block font-medium mb-1">Campaign Status</label>
          <TextField select SelectProps={{ native: true }} value={filters.status} onChange={(e) => handleChange("status", e.target.value)} fullWidth size="small">
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
          </TextField>
        </div>

        <div>
          <label className="block font-medium mb-1">Campaign Type</label>
          <TextField select SelectProps={{ native: true }} value={filters.type} onChange={(e) => handleChange("type", e.target.value)} fullWidth size="small">
            <option value="all">All</option>
            <option value="search">Search</option>
            <option value="display">Display</option>
            <option value="smart">Smart</option>
            <option value="shopping">Shopping</option>
            <option value="video">Video</option>
          </TextField>
        </div>

        <div>
          <label className="block font-medium mb-1">Budget Range (₹)</label>
          <div className="flex gap-2">
            <TextField type="number" size="small" fullWidth placeholder="Min" value={filters.budgetMin} onChange={(e) => handleChange("budgetMin", e.target.value)} />
            <TextField type="number" size="small" fullWidth placeholder="Max" value={filters.budgetMax} onChange={(e) => handleChange("budgetMax", e.target.value)} />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Lead Count Range</label>
          <div className="flex gap-2">
            <TextField type="number" size="small" fullWidth placeholder="Min" value={filters.leadsMin} onChange={(e) => handleChange("leadsMin", e.target.value)} />
            <TextField type="number" size="small" fullWidth placeholder="Max" value={filters.leadsMax} onChange={(e) => handleChange("leadsMax", e.target.value)} />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Spend Range (₹)</label>
          <div className="flex gap-2">
            <TextField type="number" size="small" fullWidth placeholder="Min" value={filters.spendMin} onChange={(e) => handleChange("spendMin", e.target.value)} />
            <TextField type="number" size="small" fullWidth placeholder="Max" value={filters.spendMax} onChange={(e) => handleChange("spendMax", e.target.value)} />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Date Range</label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="flex flex-col gap-3">
              <DatePicker label="Start Date" value={filters.startDate} onChange={(d) => handleChange("startDate", d ? d.$d : null)} slotProps={{ textField: { size: "small" }}} />
              <DatePicker label="End Date" value={filters.endDate} onChange={(d) => handleChange("endDate", d ? d.$d : null)} slotProps={{ textField: { size: "small" }}} />
            </div>
          </LocalizationProvider>
        </div>

        <div>
          <label className="block font-medium mb-1">Sort By</label>
          <TextField select SelectProps={{ native: true }} value={filters.sortBy} onChange={(e) => handleChange("sortBy", e.target.value)} fullWidth size="small">
            <option value="created-desc">Newest Created</option>
            <option value="created-asc">Oldest Created</option>
            <option value="leads-desc">Highest Leads</option>
            <option value="leads-asc">Lowest Leads</option>
            <option value="spend-desc">Highest Spend</option>
            <option value="spend-asc">Lowest Spend</option>
          </TextField>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-4 border-t bg-white flex gap-3">
        <button className="w-1/2 py-2 border rounded-lg" onClick={resetFilters}>Reset</button>
        <button className="w-1/2 py-2 bg-[#20aee3] text-white rounded-lg" onClick={applyFilters}>Apply</button>
      </div>
    </div>
  );
}
