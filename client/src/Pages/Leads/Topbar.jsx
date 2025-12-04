// client/src/Pages/Leads/Topbar.jsx
import React, { useState } from "react";
import { Add, Close } from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Path } from "../../utils";
import { Chip, FormControl, Input, InputAdornment, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { searchLeadReducer } from "../../redux/reducer/lead";
import { PiArchive, PiMagnifyingGlass, PiNote, PiShuffleBold } from "react-icons/pi";
import { FiFilter, FiList, FiUser } from "react-icons/fi";
import CreateLead from "./CreateLead";
import ShuffleLead from "./ShuffleLead";

const Topbar = ({ options, setOptions, isFiltered, setIsFiltered, openFilters, setOpenFilters }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const { loggedUser } = useSelector(state => state.user);

  const title = pathname.split("/")[1] || "Leads";
  const pathArr = pathname.split("/").filter(item => item);
  const showOptionButtons = !pathArr.includes("create");

  const [openCreate, setOpenCreate] = useState(false);
  const [openShuffle, setOpenShuffle] = useState(false);

  const handleSearch = (term) => {
    dispatch(searchLeadReducer(term));
  };

  const toggleView = (key) => {
    setOptions(prev => ({
      ...prev,
      [key]: !prev[key],
      ...(key !== "isKanbanView" && { isKanbanView: false }),
      ...(key !== "showArchivedLeads" && { showArchivedLeads: false }),
      ...(key !== "showEmployeeLeads" && { showEmployeeLeads: false }),
    }));
  };

  return (
    <div className="flex flex-col tracking-wide pb-8 font-primary">
      <div className="w-full text-[14px]"><Path /></div>

      <div className="md:flex justify-between items-center flex-none">
        <h1 className="text-primary-blue text-[32px] capitalize font-light">{title}</h1>

        {showOptionButtons && (
          <div className="flex items-center justify-end gap-2 md:mt-0 mt-4">
            {isFiltered && (
              <Chip label="Filtered" onDelete={() => setIsFiltered(false)} deleteIcon={<Close />} />
            )}

            <div className="bg-[#ebf2f5] hover:bg-[#dfe6e8] p-1 pl-2 pr-2 rounded-md w-48">
              <FormControl>
                <Input
                  placeholder="Search Leads"
                  onChange={(e) => handleSearch(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <PiMagnifyingGlass className="text-[25px]" />
                    </InputAdornment>
                  }
                />
              </FormControl>
            </div>

            <Tooltip title="Archived" arrow placement="top">
              <div onClick={() => toggleView("showArchivedLeads")} className={`p-2 rounded-md cursor-pointer ${options.showArchivedLeads ? "text-[#20aee3] bg-[#e4f1ff]" : "bg-[#ebf2f5] hover:bg-[#dfe6e8] text-[#a6b5bd]"}`}>
                <PiArchive className="text-[25px]" />
              </div>
            </Tooltip>

            <Tooltip title="My Leads" arrow placement="top">
              <div onClick={() => toggleView("showEmployeeLeads")} className={`p-2 rounded-md cursor-pointer ${options.showEmployeeLeads ? "text-[#20aee3] bg-[#e4f1ff]" : "bg-[#ebf2f5] hover:bg-[#dfe6e8] text-[#a6b5bd]"}`}>
                <FiUser className="text-[25px]" />
              </div>
            </Tooltip>

            <Tooltip title="Kanban View" arrow placement="top">
              <div onClick={() => toggleView("isKanbanView")} className={`p-2 rounded-md cursor-pointer ${options.isKanbanView ? "text-[#20aee3] bg-[#e4f1ff]" : "bg-[#ebf2f5] hover:bg-[#dfe6e8] text-[#a6b5bd]"}`}>
                <FiList className="text-[25px]" />
              </div>
            </Tooltip>

            {(loggedUser.role === "super_admin" || loggedUser.role === "manager") && (
              <Tooltip title="Shuffle Leads" arrow placement="top">
                <div
                  onClick={() => setOpenShuffle(true)}
                  className={`p-2 rounded-md cursor-pointer ${openShuffle ? "text-[#20aee3] bg-[#e4f1ff]" : "bg-[#ebf2f5] hover:bg-[#dfe6e8] text-[#a6b5bd]"}`}
                >
                  <PiShuffleBold className="w-6 h-6" />
                </div>
              </Tooltip>
            )}

            <Tooltip title="Filter" arrow placement="top">
              <div onClick={() => setOpenFilters(prev => !prev)} className={`p-2 rounded-md cursor-pointer ${openFilters ? "text-[#20aee3] bg-[#e4f1ff]" : "bg-[#ebf2f5] hover:bg-[#dfe6e8] text-[#a6b5bd]"}`}>
                <FiFilter className="text-[25px]" />
              </div>
            </Tooltip>

            <Tooltip title="Call Reminders" arrow placement="top">
              <div onClick={() => navigate('/leads/call-reminders')} className="p-2 rounded-md cursor-pointer bg-[#ebf2f5] hover:bg-[#dfe6e8] text-[#a6b5bd]">
                <PiNote className="text-[25px]" />
              </div>
            </Tooltip>

            <Tooltip title="Add New Lead" placement="top" arrow>
              <button
                onClick={() => setOpenCreate(true)}
                className="bg-primary-red hover:bg-red-400 transition-all text-white w-[44px] h-[44px] flex justify-center items-center rounded-full shadow-xl"
              >
                <Add />
              </button>
            </Tooltip>
          </div>
        )}
      </div>

      <ShuffleLead open={openShuffle} setOpen={setOpenShuffle} />
      <CreateLead open={openCreate} setOpen={setOpenCreate} scroll="body" />
    </div>
  );
};

export default Topbar;