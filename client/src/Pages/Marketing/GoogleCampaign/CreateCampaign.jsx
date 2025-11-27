// src/Pages/Marketing/GoogleCampaign/CreateCampaign.jsx
import React from "react";
import { TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";

// --------------------------------------------------
//  VALIDATION SCHEMA
// --------------------------------------------------
const CampaignSchema = Yup.object().shape({
    name: Yup.string().required("Campaign name is required"),
    type: Yup.string().required(),
    status: Yup.string().required(),
    dailyBudget: Yup.number().required("Daily budget required").min(1, "Must be greater than 0"),
    totalBudget: Yup.number().required("Total budget required").min(1, "Must be greater than 0"),
    startDate: Yup.date().required("Start date required"),
    endDate: Yup.date()
        .required("End date required")
        .min(Yup.ref("startDate"), "End date must be after Start date"),
    location: Yup.string().required("Location required"),
    language: Yup.string().required("Language required"),
    keywords: Yup.string().required("Keywords required"),
    leads: Yup.number().min(0),
    spend: Yup.number().min(0),
});


export default function CreateCampaign({ open, setOpen, onCreate = () => { } }) {
    const navigate = useNavigate();

    return (
        <div
            className={`fixed top-0 right-0 h-full w-[520px] bg-white shadow-xl transition-transform duration-300 z-50 overflow-y-auto 
      ${open ? "translate-x-0" : "translate-x-full"}`}
        >
            <div className="flex justify-between items-center p-4 border-b bg-[#20aee3] text-white">
                <h3 className="text-lg">Create Campaign</h3>
                <button onClick={() => navigate(-1)}>
                    <IoClose size={22}/>
                </button>
            </div>

            <Formik
                initialValues={{
                    name: "",
                    type: "search",
                    status: "active",
                    dailyBudget: "",
                    totalBudget: "",
                    startDate: null,
                    endDate: null,
                    location: "",
                    language: "",
                    biddingStrategy: "",
                    keywords: "",
                    leads: 0,
                    spend: 0,
                }}
                validationSchema={CampaignSchema}
                onSubmit={(values, { resetForm }) => {
                    onCreate(values ?? {}); // OR condition not needed (Formik always gives values)
                    resetForm();
                    setOpen(false);
                }}
            >
                {({ values, errors, touched, handleChange, setFieldValue }) => (
                    <Form className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Campaign Name */}
                        <TextField
                            label="Campaign Name"
                            size="small"
                            fullWidth
                            name="name"
                            value={values.name}
                            onChange={handleChange}
                            error={touched.name && Boolean(errors.name)}
                            helperText={touched.name && errors.name}
                        />

                        {/* Type */}
                        <FormControl size="small" fullWidth>
                            <InputLabel>Type</InputLabel>
                            <Select name="type" label="Type" value={values.type} onChange={handleChange}>
                                <MenuItem value="search">Search</MenuItem>
                                <MenuItem value="display">Display</MenuItem>
                                <MenuItem value="smart">Smart</MenuItem>
                                <MenuItem value="video">Video</MenuItem>
                                <MenuItem value="shopping">Shopping</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Status */}
                        <FormControl size="small" fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select name="status" label="Status" value={values.status} onChange={handleChange}>
                                <MenuItem value="active">Active</MenuItem>
                                <MenuItem value="paused">Paused</MenuItem>
                                <MenuItem value="draft">Draft</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Budgets */}
                        <TextField
                            label="Daily Budget (₹)"
                            size="small"
                            type="number"
                            fullWidth
                            name="dailyBudget"
                            value={values.dailyBudget}
                            onChange={handleChange}
                            error={touched.dailyBudget && Boolean(errors.dailyBudget)}
                            helperText={touched.dailyBudget && errors.dailyBudget}
                        />

                        <TextField
                            label="Total Budget (₹)"
                            size="small"
                            type="number"
                            fullWidth
                            name="totalBudget"
                            value={values.totalBudget}
                            onChange={handleChange}
                            error={touched.totalBudget && Boolean(errors.totalBudget)}
                            helperText={touched.totalBudget && errors.totalBudget}
                        />

                        {/* Date Fields */}
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Start Date"
                                value={values.startDate}
                                onChange={(v) => setFieldValue("startDate", v?.$d ?? null)}
                                slotProps={{
                                    textField: {
                                        size: "small",
                                        error: Boolean(errors.startDate && touched.startDate),
                                        helperText: touched.startDate && errors.startDate,
                                    },
                                }}
                            />

                            <DatePicker
                                label="End Date"
                                value={values.endDate}
                                onChange={(v) => setFieldValue("endDate", v?.$d ?? null)}
                                slotProps={{
                                    textField: {
                                        size: "small",
                                        error: Boolean(errors.endDate && touched.endDate),
                                        helperText: touched.endDate && errors.endDate,
                                    },
                                }}
                            />
                        </LocalizationProvider>

                        {/* Other Fields */}
                        <TextField
                            label="Location"
                            size="small"
                            fullWidth
                            name="location"
                            value={values.location}
                            onChange={handleChange}
                            error={touched.location && Boolean(errors.location)}
                            helperText={touched.location && errors.location}
                        />

                        <TextField
                            label="Language"
                            size="small"
                            fullWidth
                            name="language"
                            value={values.language}
                            onChange={handleChange}
                            error={touched.language && Boolean(errors.language)}
                            helperText={touched.language && errors.language}
                        />

                        <TextField
                            label="Keywords"
                            size="small"
                            fullWidth
                            name="keywords"
                            value={values.keywords}
                            onChange={handleChange}
                            error={touched.keywords && Boolean(errors.keywords)}
                            helperText={touched.keywords && errors.keywords}
                        />

                        <TextField
                            label="Leads"
                            size="small"
                            type="number"
                            fullWidth
                            name="leads"
                            value={values.leads}
                            onChange={handleChange}
                        />

                        <TextField
                            label="Spend"
                            size="small"
                            type="number"
                            fullWidth
                            name="spend"
                            value={values.spend}
                            onChange={handleChange}
                        />

                        {/* Buttons */}
                        <div className="col-span-1 md:col-span-2 flex gap-3 justify-end pt-4">
                            <button type="button" className="px-4 py-2 border" onClick={() => setOpen(false)}>
                                Cancel
                            </button>
                            <button type="submit" className="px-4 py-2 bg-[#20aee3] text-white">
                                Create
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
