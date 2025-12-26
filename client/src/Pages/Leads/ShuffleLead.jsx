import React, { useEffect, useState } from "react";
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
import { Close, KeyboardArrowDown } from "@mui/icons-material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import {
  filterShuffleLeadsAction,
  bulkShuffleLeadsAction,
  getLeads,
} from "../../redux/action/lead";
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

const defaultForm = {
  period: "date",
  startingDate: null,
  endingDate: null,
  status: [],
  limit: "",
  employees: [],
};


const ShuffleLead = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const { isFetching } = useSelector((state) => state.lead);

  const [form, setForm] = useState(defaultForm);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [employeesList, setEmployeesList] = useState([]);

  useEffect(() => {
    if (!open) return;

    const fetchEmployees = async () => {
      try {
        const { data } = await getEmployees();
        if (data?.success && Array.isArray(data.result)) {
          setEmployeesList(data.result);
          setForm((p) => ({
            ...p,
            employees: data.result.map((e) => e._id),
          }));
        }
      } catch {
        toast.error("Failed to load employees");
      }
    };

    fetchEmployees();
  }, [open]);

  const allEmployeeIds = employeesList.map((e) => e._id);
  const isAllSelected =
    form.employees.length === allEmployeeIds.length &&
    allEmployeeIds.length > 0;

  const handleSelectAll = () => {
    setForm((p) => ({
      ...p,
      employees: isAllSelected ? [] : allEmployeeIds,
    }));
  };

  const handleReset = () => {
    setForm(defaultForm);
    setPreview(null);
  };

  const handleApplyShuffle = async () => {
    if (!form.employees.length) {
      toast.error("Please select at least one employee");
      return;
    }

    setLoading(true);
    setPreview(null);

    const payload = {
      period: form.period,
      status: form.status,
      limit: form.limit,
      employees: form.employees,
    };

    if (form.period === "range") {
      payload.startingDate = dayjs(form.startingDate).format("YYYY-MM-DD");
      payload.endingDate = dayjs(form.endingDate).format("YYYY-MM-DD");
    }

    console.log("Shuffle payload:", payload);

    try {
      const previewData = await dispatch(filterShuffleLeadsAction(payload));

      if (!previewData?.success || previewData.total === 0) {
        toast.error("No leads found");
        return;
      }

      setPreview(previewData);

      await dispatch(bulkShuffleLeadsAction(payload));

      await dispatch(getLeads());

      toast.success(`Distributed ${previewData.total} leads`);
      setOpen(false);
      handleReset();
    } catch (err) {
      toast.error("Shuffle failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
      <Box
        sx={{
          width: 440,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <Box className="p-4 border-b flex justify-between items-center bg-blue-50">
          <Typography variant="h6" fontWeight={600}>
            Distribute Leads
          </Typography>
          <IconButton onClick={() => setOpen(false)}>
            <Close />
          </IconButton>
        </Box>

        {/* Content */}
        <Box className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* Time Period */}
          <FormControl fullWidth>
            <InputLabel>Time Period</InputLabel>
            <Select
              value={form.period}
              onChange={(e) =>
                setForm((p) => ({ ...p, period: e.target.value }))
              }
              IconComponent={KeyboardArrowDown}
            >
              {periods.map((p) => (
                <MenuItem key={p.value} value={p.value}>
                  {p.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Custom Range */}
          {form.period === "range" && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <DatePicker
                  label="From"
                  value={form.startingDate}
                  onChange={(v) =>
                    setForm((p) => ({ ...p, startingDate: v }))
                  }
                />
                <DatePicker
                  label="To"
                  value={form.endingDate}
                  onChange={(v) =>
                    setForm((p) => ({ ...p, endingDate: v }))
                  }
                />
              </Box>
            </LocalizationProvider>
          )}

          {/* Filter by Status */}
          <FormControl fullWidth>
            <InputLabel>Filter by Status</InputLabel>
            <Select
              multiple
              value={form.status}
              onChange={(e) => {
                const value = e.target.value;
                setForm((p) => ({
                  ...p,
                  status: typeof value === "string" ? value.split(",") : value,
                }));
              }}
              input={<OutlinedInput label="Filter by Status" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((val) => {
                    const opt = statusOptions.find((o) => o.value === val);
                    return (
                      <Chip
                        key={val}
                        size="small"
                        label={opt?.label || val}
                      />
                    );
                  })}
                </Box>
              )}
            >
              {statusOptions.map((s) => (
                <MenuItem key={s.value} value={s.value}>
                  <Checkbox checked={form.status.indexOf(s.value) > -1} />
                  <ListItemText primary={s.label} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>


          {/* Assign To — UI FIXED */}
          <FormControl fullWidth>
            <InputLabel>Assign To</InputLabel>
            <Select
              multiple
              value={form.employees}
              onChange={(e) =>
                setForm((p)({ ...p, employees: e.target.value }))
              }
              input={<OutlinedInput label="Assign To" />}
              IconComponent={KeyboardArrowDown}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.length === employeesList.length ? (
                    <Chip size="small" label="All Employees" />
                  ) : (
                    selected.map((id) => {
                      const emp = employeesList.find((e) => e._id === id);
                      return (
                        <Chip
                          key={id}
                          size="small"
                          label={emp?.firstName}
                        />
                      );
                    })
                  )}
                </Box>
              )}
              MenuProps={{
                PaperProps: {
                  style: { maxHeight: 260 },
                },
              }}
            >
              <MenuItem sx={{ alignItems: "center" }}>
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={
                    form.employees.length > 0 && !isAllSelected
                  }
                  onChange={handleSelectAll}
                />
                <ListItemText
                  primary={`All Employees (${employeesList.length})`}
                />
              </MenuItem>

              <Divider />

              {employeesList.map((emp) => (
                <MenuItem
                  key={emp._id}
                  value={emp._id}
                  sx={{ alignItems: "center" }}
                >
                  <Checkbox
                    checked={form.employees.includes(emp._id)}
                  />
                  <ListItemText
                    primary={`${emp.firstName} ${emp.lastName}`}
                    secondary={`@${emp.username}`}
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {preview && (
            <Alert severity="info">
              {preview.total} leads will be distributed
            </Alert>
          )}
        </Box>

        {/* Footer */}
        <Box className="p-6 border-t space-y-2">
          <Button fullWidth variant="outlined" onClick={handleReset}>
            RESET FILTER
          </Button>

          <Button
            fullWidth
            variant="contained"
            color="success"
            onClick={handleApplyShuffle}
            disabled={loading || isFetching}
            startIcon={loading && <CircularProgress size={18} />}
          >
            APPLY SHUFFLE
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default ShuffleLead;
