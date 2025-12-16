// client/src/Pages/Leads/ShuffleLead.jsx
import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  Button,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Chip,
  TextField,
} from "@mui/material";
import {
  Close,
  KeyboardArrowDown,
  CheckBox,
  CheckBoxOutlineBlank,
  IndeterminateCheckBox,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { filterShuffleLeadsAction, bulkShuffleLeadsAction } from "../../redux/action/lead";
import toast from "react-hot-toast";
import { getEmployees } from "../../redux/api";

const periods = [
  { label: "Today", value: "date" },
  { label: "Last 7 Days", value: "week" },
  { label: "Last 30 Days", value: "month" },
  { label: "Custom Range", value: "range" },
];

const statusOptions = [
  { value: "notInterested", label: "Not Interested" },
  { value: "notAnswering", label: "Not Answering" },
];

const MenuProps = {
  PaperProps: {
    style: { maxHeight: 300, width: 300 },
  },
};

const ShuffleLead = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const { isFetching } = useSelector((state) => state.lead);

  const [form, setForm] = useState({
    period: "date",
    startingDate: "",
    endingDate: "",
    status: [],
    limit: "",
    employees: [],
  });

  const [preview, setPreview] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [employeesList, setEmployeesList] = useState([]);

  useEffect(() => {
    if (!open) return;

    const fetchEmployees = async () => {
      try {
        const { data } = await getEmployees();
        if (data?.success && Array.isArray(data.result)) {
          setEmployeesList(data.result);
          setForm(prev => ({ ...prev, employees: data.result.map(e => e._id) }));
        }
      } catch (err) {
        toast.error("Failed to load employees");
      }
    };
    fetchEmployees();
  }, [open]);

  const allEmployeeIds = employeesList.map(e => e._id);
  const isAllSelected = form.employees.length === allEmployeeIds.length && allEmployeeIds.length > 0;

  const handleSelectAll = () => {
    setForm(prev => ({
      ...prev,
      employees: isAllSelected ? [] : allEmployeeIds
    }));
  };

  const handleEmployeeChange = (event) => {
    const value = event.target.value;
    setForm(prev => ({ ...prev, employees: typeof value === "string" ? value.split(",") : value }));
  };

  const handleStatusChange = (event) => {
    const value = event.target.value;
    setForm(prev => ({ ...prev, status: typeof value === "string" ? value.split(",") : value }));
  };

  const handlePreview = async () => {
    if (form.employees.length === 0) return toast.error("Please select at least one employee");

    setLoadingPreview(true);
    setPreview(null);

    try {
      const result = await dispatch(filterShuffleLeadsAction({ ...form }));
      const res = result?.payload;

      if (res?.success) {
        setPreview(res);
        toast.success(`${res.total} leads ready to distribute`);
      } else {
        toast.error(res?.message || "No leads found");
      }
    } catch (err) {
      toast.error("Preview failed");
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleDistribute = async () => {
    if (!preview) return;

    try {
      const result = await dispatch(bulkShuffleLeadsAction({ ...form }));
      const res = result?.payload;

      if (res?.success) {
        toast.success(`Successfully distributed ${preview.total} leads!`);
        setOpen(false);
        setPreview(null);
      } else {
        toast.error(res?.message || "Distribution failed");
      }
    } catch (err) {
      toast.error("Distribution failed");
    }
  };

  const getProjectedCount = () => {
    if (!preview || form.employees.length === 0) return {};
    const count = {};
    form.employees.forEach((id, i) => {
      const emp = employeesList.find(e => e._id === id);
      const leads = Math.floor(preview.total / form.employees.length) +
        (i < preview.total % form.employees.length ? 1 : 0);
      count[emp?.username || "Unknown"] = leads;
    });
    return count;
  };

  return (
    <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
      <Box sx={{ width: 440, height: "100vh", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Box className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50">
          <Typography variant="h6" className="font-bold text-primary-blue">
            Distribute Leads
          </Typography>
          <IconButton onClick={() => setOpen(false)} className="hover:bg-white/50">
            <Close />
          </IconButton>
        </Box>

        {/* Content */}
        <Box className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* Time Period */}
          <FormControl fullWidth>
            <InputLabel className="text-gray-700 font-medium">Time Period</InputLabel>
            <Select
              value={form.period}
              label="Time Period"
              onChange={(e) => setForm(prev => ({ ...prev, period: e.target.value }))}
              className="bg-white"
              IconComponent={KeyboardArrowDown}
            >
              {periods.map(p => (
                <MenuItem key={p.value} value={p.value} className="hover:bg-blue-50">
                  {p.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Custom Range */}
          {form.period === "range" && (
            <Box className="grid grid-cols-2 gap-4">
              <TextField
                type="date"
                label="From"
                InputLabelProps={{ shrink: true }}
                value={form.startingDate}
                onChange={(e) => setForm(prev => ({ ...prev, startingDate: e.target.value }))}
                className="bg-white"
              />
              <TextField
                type="date"
                label="To"
                InputLabelProps={{ shrink: true }}
                value={form.endingDate}
                onChange={(e) => setForm(prev => ({ ...prev, endingDate: e.target.value }))}
                className="bg-white"
              />
            </Box>
          )}

          {/* Filter by Status */}
          <FormControl fullWidth>
            <InputLabel className="text-gray-700 font-medium">Filter by Status</InputLabel>
            <Select
              multiple
              value={form.status}
              onChange={handleStatusChange}
              input={<OutlinedInput label="Filter by Status" />}
              renderValue={(selected) => (
                <Box className="flex flex-wrap gap-1">
                  {selected.map((value) => {
                    const opt = statusOptions.find(o => o.value === value);
                    return (
                      <Chip
                        key={value}
                        label={opt?.label}
                        size="small"
                        className="bg-red-100 text-red-700 border-red-300"
                      />
                    );
                  })}
                </Box>
              )}
              MenuProps={MenuProps}
              IconComponent={KeyboardArrowDown}
            >
              {statusOptions.map(({ value, label }) => (
                <MenuItem key={value} value={value}>
                  <Checkbox checked={form.status.includes(value)} />
                  <ListItemText primary={label} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Assign To */}
          <FormControl fullWidth>
            <InputLabel className="text-gray-700 font-medium">Assign To</InputLabel>
            <Select
              multiple
              value={form.employees}
              onChange={handleEmployeeChange}
              input={<OutlinedInput label="Assign To" />}
              renderValue={(selected) => (
                <Box className="flex flex-wrap gap-1">
                  {selected.length === employeesList.length ? (
                    <Chip label="All Employees" color="primary" size="small" />
                  ) : (
                    selected.map((id) => {
                      const emp = employeesList.find(e => e._id === id);
                      return <Chip key={id} label={emp?.firstName} size="small" />;
                    })
                  )}
                </Box>
              )}
              MenuProps={MenuProps}
              IconComponent={KeyboardArrowDown}
            >
              {/* All Employees */}
              <MenuItem className="font-semibold bg-gray-50">
                <Checkbox
                  icon={<CheckBoxOutlineBlank fontSize="small" />}
                  checkedIcon={isAllSelected ? <CheckBox /> : <IndeterminateCheckBox color="primary" />}
                  checked={isAllSelected}
                  indeterminate={form.employees.length > 0 && !isAllSelected}
                  onChange={handleSelectAll}
                />
                <ListItemText primary={`All Employees (${employeesList.length})`} />
              </MenuItem>
              <Divider />

              {employeesList.map((emp) => (
                <MenuItem key={emp._id} value={emp._id}>
                  <Checkbox checked={form.employees.includes(emp._id)} />
                  <ListItemText
                    primary={`${emp.firstName} ${emp.lastName}`}
                    secondary={`@${emp.username}`}
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Limit */}
          <TextField
            fullWidth
            label="Limit Leads (Optional)"
            type="number"
            placeholder="e.g. 100"
            value={form.limit}
            onChange={(e) => setForm(prev => ({ ...prev, limit: e.target.value }))}
            className="bg-white"
          />

          {/* Preview */}
          {preview && (
            <Alert severity="info" className="bg-blue-50 border-blue-200">
              <Typography className="font-bold text-primary-blue">
                {preview.total} leads will be distributed
              </Typography>
              <Box className="mt-2 space-y-1">
                {Object.entries(getProjectedCount()).map(([name, count]) => (
                  <Box key={name} className="flex justify-between">
                    <span className="font-medium">{name}</span>
                    <span className="font-bold text-primary-blue">{count} leads</span>
                  </Box>
                ))}
              </Box>
            </Alert>
          )}
        </Box>

        {/* Bottom Buttons */}
        <Box className="p-6 border-t bg-gray-50 space-y-2">
          <Button
            fullWidth
            variant="outlined"
            size="large"
            onClick={handlePreview}
            disabled={loadingPreview || isFetching || form.employees.length === 0}
            startIcon={loadingPreview ? <CircularProgress size={20} /> : null}
            className="text-primary-blue border-blue-700 hover:bg-blue-50"
          >
            {loadingPreview ? "Loading Preview..." : "Preview Distribution"}
          </Button>

          <Button
            fullWidth
            variant="contained"
            color="success"
            size="large"
            onClick={handleDistribute}
            disabled={!preview || isFetching}
            className="bg-green-600 hover:bg-green-700"
          >
            {isFetching ? "Distributing..." : "Confirm & Distribute"}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default ShuffleLead;