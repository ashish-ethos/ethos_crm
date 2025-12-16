// src/Pages/Marketing/GoogleCampaign/GoogleCampaign.jsx
import React, { useEffect, useCallback, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    getGoogleCampaigns,
    createGoogleCampaign,
    updateGoogleCampaign,
    deleteGoogleCampaign,
    cloneGoogleCampaign,
} from "../../../redux/api";

import {
    setCampaigns,
    addCampaign,
    updateCampaign as updateCampaignAction,
    deleteCampaign as deleteCampaignAction,
} from "../../../redux/action/marketing";

import Table from "../../../Components/Table/Table";
import Topbar from "./Topbar";
import CreateCampaign from "./CreateCampaign";
import FilterDrawer from "./FilterDrawer";
import DeleteModal from "./DeleteModal";
import CampaignCards from "./CampaignCards";

export default function GoogleCampaign() {
    const dispatch = useDispatch();
    const campaigns = useSelector((state) => state.marketing.campaigns || []);

    const [loading, setLoading] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);
    const [openFilter, setOpenFilter] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [search, setSearch] = useState("");
    const [appliedFilters, setAppliedFilters] = useState(null);
    const [error, setError] = useState(null);

    // Fetch campaigns from backend
    const fetchCampaigns = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getGoogleCampaigns(); // uses central API instance
            // API may return { data: [...] } or { data: { data: [...] } }, handle both
            const payload = res?.data?.data ?? res?.data ?? [];
            dispatch(setCampaigns(payload));
        } catch (err) {
            console.error("Fetch campaigns error:", err);
            setError(err?.message || "Failed to load campaigns");
        } finally {
            setLoading(false);
        }
    }, [dispatch]);

    useEffect(() => {
        fetchCampaigns();
    }, [fetchCampaigns]);

    // Create campaign
    const handleCreate = async (values) => {
        setLoading(true);
        try {
            const res = await createGoogleCampaign(values);
            const created = res?.data?.data ?? res?.data;
            dispatch(addCampaign(created));
            setOpenCreate(false);
        } catch (err) {
            console.error("Create error", err);
            setError(err?.message || "Create failed");
        } finally {
            setLoading(false);
        }
    };

    // Update campaign
    const handleUpdate = async (id, values) => {
        setLoading(true);
        try {
            const res = await updateGoogleCampaign(id, values);
            const updated = res?.data?.data ?? res?.data;
            // your reducer expects updateCampaign action with id+campaign — but you have action:updateCampaign
            dispatch(updateCampaignAction(id, updated));
        } catch (err) {
            console.error("Update error", err);
            setError(err?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    // Delete campaign
    const handleDeleteConfirm = async () => {
        if (!deleteId) return;
        setLoading(true);
        try {
            await deleteGoogleCampaign(deleteId);
            dispatch(deleteCampaignAction(deleteId));
            setOpenDelete(false);
            setDeleteId(null);
        } catch (err) {
            console.error("Delete err", err);
            setError(err?.message || "Delete failed");
        } finally {
            setLoading(false);
        }
    };

    // Clone campaign
    const handleClone = async (id) => {
        setLoading(true);
        try {
            const res = await cloneGoogleCampaign(id);
            const cloned = res?.data?.data ?? res?.data;
            dispatch(addCampaign(cloned));
        } catch (err) {
            console.error("Clone err", err);
            setError(err?.message || "Clone failed");
        } finally {
            setLoading(false);
        }
    };

    // Filtering and search (client-side)
    const filteredCampaigns = useMemo(() => {
        let list = campaigns || [];

        if (search?.trim()) {
            const q = search.toLowerCase();
            list = list.filter(
                (c) =>
                    (c.name || "").toLowerCase().includes(q) ||
                    (c.type || "").toLowerCase().includes(q) ||
                    (c.status || "").toLowerCase().includes(q)
            );
        }

        if (appliedFilters) {
            const f = appliedFilters;
            if (f.status && f.status !== "all") list = list.filter((c) => c.status === f.status);
            if (f.type && f.type !== "all") list = list.filter((c) => c.type === f.type);
        }

        return list;
    }, [campaigns, search, appliedFilters]);

    // Prepare table columns
    const columns = [
        { field: "name", headerName: "Campaign Name", headerClassName: "super-app-theme--header", width: 220 },
        { field: "type", headerName: "Type", headerClassName: "super-app-theme--header", width: 120 },
        {
            field: "status",
            headerName: "Status",
            headerClassName: "super-app-theme--header",
            width: 140,
            renderCell: (p) => {
                const val = p.row.status || "unknown";
                const cls =
                    val === "active"
                        ? "bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-sm"
                        : val === "paused"
                            ? "bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-sm"
                            : val === "scheduled"
                                ? "bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-sm"
                                : "bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-sm";
                return <div className={cls}>{val}</div>;
            },
        },
        {
            field: "dailyBudget",
            headerName: "Daily Budget",
            headerClassName: "super-app-theme--header",
            width: 140,
            renderCell: (p) => `₹${p.row.dailyBudget ?? 0}`,
        },
        {
            field: "totalBudget",
            headerName: "Total Budget",
            headerClassName: "super-app-theme--header",
            width: 140,
            renderCell: (p) => `₹${p.row.totalBudget ?? 0}`,
        },
        { field: "leads", headerName: "Leads", headerClassName: "super-app-theme--header", width: 110 },
        {
            field: "actions",
            headerName: "Actions",
            headerClassName: "super-app-theme--header",
            width: 260,
            renderCell: (params) => {
                const row = params.row;
                return (
                    <div className="flex gap-3">
                        <button
                            className="text-blue-600 hover:text-blue-800 transition"
                            onClick={() => setOpenCreate(true)}
                        >
                            Edit
                        </button>

                        <button
                            className="text-green-600 hover:text-green-800 transition"
                            onClick={() => handleClone(row._id)}
                        >
                            Clone
                        </button>

                        <button
                            className="text-red-600 hover:text-red-800 transition"
                            onClick={() => {
                                setDeleteId(row._id);
                                setOpenDelete(true);
                            }}
                        >
                            Delete
                        </button>
                    </div>
                );
            },
        },
    ];

    const rowsForTable = filteredCampaigns.map((c) => ({ id: c._id, ...c }));

    // compute derived stats used by CampaignCards
    const stats = useMemo(() => {
        const totalCampaigns = campaigns.length;
        const totalLeads = campaigns.reduce((s, c) => s + (Number(c.leads) || 0), 0);
        const active = campaigns.filter((c) => c.status === "active").length;
        const paused = campaigns.filter((c) => c.status === "paused").length;
        const scheduled = campaigns.filter((c) => c.status === "scheduled").length;
        const draft = campaigns.filter((c) => c.status === "draft").length;
        const spend = campaigns.reduce((s, c) => s + (Number(c.spend) || 0), 0);

        const monthly = Math.round(spend);
        const weekly = Math.round(spend / 4);
        const daily = Math.round(spend / 30);
        const yearly = Math.round(spend * 12);

        return { totalCampaigns, totalLeads, active, paused, scheduled, draft, spend, monthly, weekly, daily, yearly };
    }, [campaigns]);

    return (
        <div className="w-full">
            {/* topbar */}
            <div className="bg-white rounded-xl p-4 mb-6 shadow-sm flex items-center justify-between">
                <Topbar
                    title="Google Campaigns"
                    onSearch={(q) => setSearch(q)}
                    onOpenFilter={() => setOpenFilter(true)}
                    onOpenCreate={() => setOpenCreate(true)}
                />
            </div>

            {/* metrics + charts */}
            <div className="mb-8">
                <CampaignCards stats={stats} onRangeChange={(r, s, e) => setAppliedFilters((p) => ({ ...(p || {}), range: r, start: s, end: e }))} />
            </div>

            {/* table */}
            <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">All Campaigns</h2>
                </div>

                <Table columns={columns} rows={rowsForTable} isFetching={loading} error={error} rowsPerPage={10} />
            </div>

            {/* drawers & modals */}
            <CreateCampaign open={openCreate} setOpen={setOpenCreate} onCreate={async (values) => {
                if (values._id) await handleUpdate(values._id, values);
                else await handleCreate(values);
            }} />

            <FilterDrawer open={openFilter} setOpen={setOpenFilter} onApply={(f) => { setAppliedFilters(f); setOpenFilter(false); }} />

            <DeleteModal open={openDelete} setOpen={setOpenDelete} onConfirm={handleDeleteConfirm} />
        </div>
    );
}
