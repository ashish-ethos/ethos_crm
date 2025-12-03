// src/Pages/Marketing/GoogleCampaign/CampaignCards.jsx
import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import dayjs from "dayjs";

export default function CampaignCards({ stats = {}, onRangeChange = () => { } }) {
  const [range, setRange] = useState("monthly");
  const [selectedStatus, setSelectedStatus] = useState("active");
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");

  const handleRangeChange = (v) => {
    setRange(v);
    onRangeChange(v, null, null);
  };

  const handleStatusChange = (v) => {
    setSelectedStatus(v);
  };

  const handlePeriodChange = (v) => {
    setSelectedPeriod(v);
  };

  // simple mock of average CPC (cost-per-click) — replace if backend provides CPC
  const avgCPC = useMemo(() => {
    if (!stats.totalLeads || stats.totalLeads === 0) return 0;
    return (stats.spend / Math.max(1, stats.totalLeads)).toFixed(2);
  }, [stats]);

  // Build small synthetic weekly data for the charts — replace by backend responses if available
  const chartData = useMemo(() => {
    // last 7 days labels
    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    // synthetic leads: vary based on totalLeads
    const baseLeads = Math.round((stats.totalLeads || 20) / 7) || 5;
    // synthetic spend: use monthly/weekly to approximate
    const baseSpend = stats.weekly || stats.monthly / 4 || Math.round((stats.spend || 1000) / 7);

    return labels.map((d, idx) => ({
      name: d,
      leads: Math.max(0, Math.round(baseLeads * (0.6 + Math.sin(idx + 1) * 0.4 + (idx % 2)))),
      spend: Math.round(baseSpend * (0.6 + idx * 0.15)),
      search: Math.round((baseSpend * (0.6 + idx * 0.15)) * 0.45),
      display: Math.round((baseSpend * (0.6 + idx * 0.15)) * 0.35),
      video: Math.round((baseSpend * (0.6 + idx * 0.15)) * 0.20),
    }));
  }, [stats]);

  // values for pills in Campaign Status card
  const statusPills = [
    { label: "Active", count: stats.active || 0, color: "green" },
    { label: "Paused", count: stats.paused || 0, color: "yellow" },
    { label: "Scheduled", count: stats.scheduled || 0, color: "blue" },
    { label: "Draft", count: stats.draft || 0, color: "gray" },
  ];

  const statusMap = {
    active: stats.active || 0,
    paused: stats.paused || 0,
    scheduled: stats.scheduled || 0,
    draft: stats.draft || 0,
  };

  const periodMap = {
    monthly: stats.monthly || 0,
    weekly: stats.weekly || 0,
  };

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getPeriodLabel = (period) => {
    return period.charAt(0).toUpperCase() + period.slice(1);
  };

  return (
    <Box>
      {/* TOP ROW METRICS */}
      <Grid container spacing={2} className="mb-6 " sx={{ '& > .MuiGrid-item': { pt: 1, pl: 1 } }}>

        {/* Total Leads */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 0,
              borderRadius: 3,
              background: "#d9f5f729",
              boxShadow: "0px 3px 10px rgba(0,0,0,0.06)",
              border: "1px solid #9cc2f3ff",
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <p className="font-semibold" sx={{ fontSize: 15, color: "#6b7280" }}>
                Total Leads
              </p>

              <Typography sx={{ fontSize: 32, fontWeight: 700, mt: 1, color: "#2563eb" }}>
                {stats.totalLeads || 0}
              </Typography>

              <Typography sx={{ fontSize: 12, color: "#16a34a", mt: 1 }}>
                +15% vs. last period ↑
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Active Campaigns -> Dynamic Status Campaigns */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 0,
              borderRadius: 3,
              boxShadow: "0px 3px 10px rgba(0,0,0,0.06)",
              border: "1px solid #e5e7eb",
            }}
          >
            <CardContent sx={{ p: 2, position: "relative" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", }}>
                <p className="font-semibold" sx={{ fontSize: 15, color: "#6b7280" }}>
                  {getStatusLabel(selectedStatus)} Campaigns
                </p>
                <FormControl size="small" sx={{ minWidth: 80, padding: 0 }}>
                  <Select
                    value={selectedStatus}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    sx={{ fontSize: 12 }}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="paused">Paused</MenuItem>
                    <MenuItem value="scheduled">Scheduled</MenuItem>
                    <MenuItem value="draft">Draft</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Typography sx={{ fontSize: 32, fontWeight: 700, mt: 0, color: "#111827" }}>
                {statusMap[selectedStatus] || 0}
              </Typography>

              {/* Small progress bar */}
              <Box sx={{ mt: 2, height: 6, background: "#d1fae5", borderRadius: 3 }}>
                <Box sx={{ height: "100%", width: "40%", background: "#10b981", borderRadius: 3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Average CPC */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 0,
              borderRadius: 3,
              boxShadow: "0px 3px 10px rgba(0,0,0,0.06)",
              border: "1px solid #fed7aa",
              background: "#fff7ed",
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <p className="font-semibold" sx={{ fontSize: 15, color: "#6b7280" }}>
                Average CPC
              </p>

              <Typography sx={{ fontSize: 32, fontWeight: 700, mt: 1, color: "#ea580c" }}>
                ₹{avgCPC}
              </Typography>

              {/* Orange Bar */}
              <Box sx={{ mt: 2, height: 6, background: "#ffedd5", borderRadius: 3 }}>
                <Box
                  sx={{
                    height: "100%",
                    width: `${Math.min(100, (avgCPC / (avgCPC + 20)) * 100)}%`,
                    background: "#fb923c",
                    borderRadius: 3,
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Monthly Spend -> Dynamic Period Spend */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 0,
              borderRadius: 3,
              background:"#a389fc30",
              boxShadow: "0px 3px 10px rgba(0,0,0,0.06)",
              border: "1px solid #f5acf97a",
            }}
          >
            <CardContent sx={{ p: 2, position: "relative" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start",  }}>
                <p className="font-semibold" sx={{ fontSize: 15, color: "#6b7280" }}>
                  {getPeriodLabel(selectedPeriod)} Spend
                </p>
                <FormControl size="small" sx={{ minWidth: 80 }}>
                  <Select
                    value={selectedPeriod}
                    onChange={(e) => handlePeriodChange(e.target.value)}
                    sx={{ fontSize: 12 }}
                  >
                    <MenuItem value="weekly">Daily</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="yearly">Yearly</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Typography sx={{ fontSize: 32, fontWeight: 700, mt: 0, color: "#1e3a8a" }}>
                ₹{periodMap[selectedPeriod]?.toLocaleString() || 0}
              </Typography>

              {/* Tiny blue bar */}
              <Box sx={{ mt: 2, height: 6, background: "#dbeafe", borderRadius: 3 }}>
                <Box sx={{ height: "100%", width: "55%", background: "#3b82f6", borderRadius: 3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts row */}
      <Grid container spacing={2} sx={{ '& > .MuiGrid-item': { pt: 1, pl: 1 } }}>
        {/* Performance trend (line chart) */}
        <Grid item xs={12} md={7}>
          <Card elevation={1} className="p-0">
            <CardContent className="p-4">
              <p variant="subtitle1" className="mb-3 font-semibold">Performance Trend</p>

              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="leads" stroke="#10b981" strokeWidth={3} dot />
                  <Line type="monotone" dataKey="spend" stroke="#06b6d4" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Campaign type spend (stacked bars) */}
        <Grid item xs={12} md={5}>
          <Card elevation={1} className="p-0">
            <CardContent className="p-4">
              <Box className="flex items-center justify-between mb-2">
                <p variant="subtitle1" className="font-semibold">Campaign Type Spend</p>
                <FormControl size="small" variant="outlined">
                  <Select
                    value={range}
                    onChange={(e) => handleRangeChange(e.target.value)}
                  >
                    <MenuItem value="7">Last 7 Days</MenuItem>
                    <MenuItem value="30">Last 30 Days</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="search" stackId="a" fill="#1e40af" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="display" stackId="a" fill="#f97316" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="video" stackId="a" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}