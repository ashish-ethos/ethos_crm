import React, { useEffect, useState } from "react";
import { Drawer, Button, TextField, Autocomplete, Select, MenuItem } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { filterLead } from "../../redux/action/lead";
import { FiFilter } from "react-icons/fi";
import { PiFunnelLight, PiXLight } from "react-icons/pi";
import { countries, indianCities } from "../../constant";
import { DatePicker, DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { filterLeadReducer } from "../../redux/reducer/lead";

const FilterDrawer = ({ open, setOpen, setIsFiltered }) => {

  //////////////////////////////// VARIABLES ///////////////////////////////////////////////////
  const dispatch = useDispatch()
  const { leads } = useSelector(state => state.lead)
  const priorities = [
    { name: "Very Cold", value: 'veryCold' },
    { name: "Cold", value: 'cold' },
    { name: "Moderate", value: 'moderate' },
    { name: "Hot", value: 'hot' },
    { name: "Very Hot", value: 'veryHot' },
  ];
  // const priorities = ["Very Cold", "Cold", "Moderate", "Hot", "Very Hot"];

  const statuses = [
    { name: "New", value: "new" },
    { name: "Closed(Won)", value: "closedWon" },
    { name: "Closed(Lost)", value: "closedLost" },
    { name: "Followed Up(Call)", value: "followedUpCall" },
    { name: "Followed Up(Email)", value: "followedUpEmail" },
    { name: "Contacted Client(Call)", value: "contactedClientCall" },
    { name: "Contacted Client(Call Attempt)", value: "contactedClientCallAttempt" },
    { name: "Contacted Client(Email)", value: "contactedClientEmail" },
    { name: "Meeting(Done)", value: "meetingDone" },
    { name: "Meeting(Attempt)", value: "meetingAttempt" },
    { name: "Not Interested", value: "notInterested" },
    { name: "Not Answering", value: "notAnswering" }
  ];

  const sources = [
    { name: "Instagram", value: "instagram" },
    { name: "Facebook Comment", value: "facebookComment" },
    { name: "Friend and Family", value: "FriendAndFamily" },
    { name: "Facebook", value: "facebook" },
    { name: "Direct Call", value: "directCall" },
    { name: "Google", value: "google" },
    { name: "Referral", value: "referral" },
  ];
  const degrees = [
    { name: "Bacholers", value: "bacholers" },
    { name: "Masters", value: "masters" },
    { name: "PHD", value: "phd" },
    { name: "Diploma", value: "diploma" },
    { name: "Other", value: "other" },
  ];
  const visa = [
    { name: "Student Visa", value: "studentVisa" },
    { name: "Visit Visa", value: "visitVisa" },
  ];
  const initialFilterState = { city: '', startingDate: '', endingDate: '', status: '', priority: '', country: '', degree: '', visa: '' }
  //////////////////////////////// STATES ///////////////////////////////////////////////////
  const [filters, setFilters] = useState(initialFilterState)

  //////////////////////////////// USE EFFECTS ///////////////////////////////////////////////////

  //////////////////////////////// FUNCTIONS ///////////////////////////////////////////////////
  const handleFilter = () => {
    console.log("APPLY FILTERS:", filters);
    dispatch(filterLeadReducer(filters))
    setIsFiltered(true)
    setFilters(initialFilterState)
    setOpen(false)
  }

  const handleChange = (field, value) => {
    setFilters((pre) => ({ ...pre, [field]: value }))
  }

  return (
    <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
      <div className="font-primary" style={{ minWidth: "50vh", maxWidth: "60vh" }}>
        <div className="flex justify-between items-center h-[10vh] bg-[#20aee3] p-5 text-white font-thin">
          <div className="flex items-center text-[25px] gap-2">
            <PiFunnelLight className="text-[25px]" />
            Filter Items
          </div>
          <div className="cursor-pointer" onClick={() => setOpen(false)}>
            <PiXLight className="text-[25px]" />
          </div>
        </div>
        <div className="p-4 flex flex-col gap-4">
          <Autocomplete
            size="small"
            disablePortal
            id="combo-box-demo"
            options={indianCities}
            onChange={(event, value) => handleChange('city', value)}
            className="w-full"
            renderInput={(params) => (
              <TextField {...params} autoComplete="false" fullWidth label="City" />
            )}
          />
          <Autocomplete
            size="small"
            disablePortal
            options={priorities}
            getOptionLabel={(option) => option.name}
            onChange={(event, value) => handleChange('priority', value?.value || '')}
            renderInput={(params) => (
              <TextField {...params} label="Priority" fullWidth />
            )}
          />
          <div className="flex flex-col">
            <div>Date : </div>
            <div className="flex gap-3">
              <div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DesktopDatePicker"]}>
                    <DesktopDatePicker
                      onChange={(date) => handleChange("startingDate", date ? date.$d : '')}
                      slotProps={{ textField: { size: "small", maxWidth: 200 } }}
                      label="From"
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </div>
              <div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DesktopDatePicker"]}>
                    <DesktopDatePicker
                      className="w-3/6"
                      label="To"
                      onChange={(date) => handleChange("endingDate", date ? date.$d : '')}
                      slotProps={{ textField: { size: "small" } }}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </div>
            </div>
          </div>
          <Autocomplete
            size="small"
            disablePortal
            id="combo-box-demo"
            options={countries.map((country) => country.name)}
            onChange={(event, value) => handleChange('country', value)}
            className="w-full"
            renderInput={(params) => (
              <TextField {...params} autoComplete="false" fullWidth label="Country" />
            )}
          />
          <Autocomplete
            size="small"
            disablePortal
            options={degrees}
            getOptionLabel={(option) => option.name}
            onChange={(event, value) => handleChange('degree', value?.value || '')}
            renderInput={(params) => (
              <TextField {...params} label="Degree" fullWidth />
            )}
          />
          <Autocomplete
            size="small"
            disablePortal
            options={visa}
            getOptionLabel={(option) => option.name}
            onChange={(event, value) => handleChange('visa', value?.value || '')}
            renderInput={(params) => (
              <TextField {...params} label="Visa" fullWidth />
            )}
          />

          <Autocomplete
            size="small"
            disablePortal
            options={statuses}
            getOptionLabel={(option) => option.name}
            onChange={(event, selectedOption) => {
              handleChange("status", selectedOption?.value || "");
            }}
            renderInput={(params) => (
              <TextField {...params} label="Status" fullWidth />
            )}
          />
          <Autocomplete
            size="small"
            disablePortal
            options={sources}
            getOptionLabel={(option) => option.name}
            onChange={(event, value) => handleChange('source', value?.value || '')}
            renderInput={(params) => (
              <TextField {...params} label="Source" fullWidth />
            )}
          />

          <div className="flex gap-4 justify-end">
            <button className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-primary">
              Cancel
            </button>
            <button
              className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-primary"
              onClick={handleFilter}
              autoFocus>
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default FilterDrawer;
