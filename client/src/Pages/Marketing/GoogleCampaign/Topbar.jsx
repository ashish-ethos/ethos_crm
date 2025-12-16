// src/Pages/Marketing/GoogleCampaign/Topbar.jsx
import React, { useState } from "react";
import { Add, FilterList, Search, Close } from "@mui/icons-material";
import { TextField, InputAdornment, IconButton } from "@mui/material";

export default function Topbar({ title, onSearch = () => {}, onOpenFilter = () => {}, onOpenCreate = () => {} }) {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className="flex items-center justify-between w-full gap-4">
      <div className="flex items-center gap-4">
        <div className="text-2xl font-semibold">{title}</div>
      </div>

      <div className="flex items-center gap-3">
        {!showSearch ? (
          <div onClick={() => setShowSearch(true)} className="p-2 rounded-full bg-gray-100 cursor-pointer">
            <Search />
          </div>
        ) : (
          <TextField
            size="small"
            placeholder="Search campaigns..."
            onChange={(e) => onSearch(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
              endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowSearch(false)}><Close /></IconButton></InputAdornment>
            }}
            sx={{ width: 260 }}
          />
        )}

        <div onClick={onOpenFilter} className="p-2 rounded-full bg-gray-100 cursor-pointer">
          <FilterList />
        </div>

        <button onClick={onOpenCreate} className="bg-[#38bdf8] text-white px-4 py-2 rounded-lg shadow">
          + New Campaign
        </button>
      </div>
    </div>
  );
}
