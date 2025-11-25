// src/Pages/Marketing/GoogleCampaign/GoogleCampaign.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Topbar from "./Topbar";
import CampaignCards from "./CampaignCards";
import CreateCampaign from "./CreateCampaign";
import FilterDrawer from "./FilterDrawer";
import DeleteModal from "./DeleteModal";

import { addCampaign, deleteCampaign, setCampaigns } from "../../../redux/action/marketing";
import { Table } from "../../../Components";

import { useNavigate, useLocation } from "react-router-dom"; // <-- NEW

// fallback demo data (used when backend not present)
const demoCampaigns = [
    {
        id: "c1",
        name: "smart launch",
        type: "smart",
        status: "active",
        dailyBudget: 1000,
        totalBudget: 30000,
        createdAt: new Date().toISOString(),
        leads: 12,
        spend: 12000,
        monthlySpend: 12000,
        weeklySpend: 3000,
        dailySpend: 400,
    },
    {
        id: "c2",
        name: "gdn brand",
        type: "display",
        status: "paused",
        dailyBudget: 500,
        totalBudget: 15000,
        createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
        leads: 4,
        spend: 2200,
        monthlySpend: 2200,
        weeklySpend: 500,
        dailySpend: 70,
    },
];

const uid = () => Math.random().toString(36).slice(2, 9);

export default function GoogleCampaign() {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // <-- NEW
    const location = useLocation(); // <-- NEW

    const marketing = useSelector(s => s.marketing || {}); // reducer namespace 'marketing'
    const storeCampaigns = marketing.campaigns && marketing.campaigns.length ? marketing.campaigns : demoCampaigns;

    // UI states
    const [openCreate, setOpenCreate] = useState(false);
    const [openFilter, setOpenFilter] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [appliedFilters, setAppliedFilters] = useState(null);

    // if store empty seed demo campaigns
    useEffect(() => {
        if (!marketing.campaigns || marketing.campaigns.length === 0) {
            dispatch(setCampaigns(demoCampaigns));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ----------- SYNC openCreate WITH URL -----------
    // when URL contains '/create-campaign' we open drawer; when not, we close it.
    useEffect(() => {
        if (location.pathname.includes("/marketing/google-campaign/create-campaign")) {
            setOpenCreate(true);
        } else {
            setOpenCreate(false);
        }
    }, [location.pathname]);


    // function to open the drawer AND push the url (use this if you want to programmatically open)
    const openCreateAndPush = () => {
        // push the URL — Topbar already navigates directly, but if you ever call from here use this helper
        navigate("/marketing/google-campaign/create-campaign", { replace: false });
        setOpenCreate(true);
    };

    // function to close drawer AND return to listing URL
    const closeCreateAndPop = () => {
        // if current url is the create url, navigate back to listing
        if (location.pathname.includes("/marketing/google-campaign/create-campaign")) {
            navigate("/marketing/google-campaign", { replace: true });
        }
        setOpenCreate(false);
    };
    // ------------------------------------------------

    // compute filtered rows dynamically (search + advanced filters)
    const filteredRows = useMemo(() => {
        let rows = (marketing.campaigns && marketing.campaigns.length) ? marketing.campaigns : storeCampaigns;

        // search
        if (searchTerm?.trim()) {
            const q = searchTerm.trim().toLowerCase();
            rows = rows.filter(r =>
                (r.name || "").toString().toLowerCase().includes(q) ||
                (r.type || "").toString().toLowerCase().includes(q) ||
                (r.status || "").toString().toLowerCase().includes(q)
            );
        }

        // apply advanced filters
        if (appliedFilters) {
            const f = appliedFilters;
            if (f.status && f.status !== "all") rows = rows.filter(r => r.status === f.status);
            if (f.type && f.type !== "all") rows = rows.filter(r => r.type === f.type);
            if (f.budgetMin) rows = rows.filter(r => (Number(r.dailyBudget) || 0) >= Number(f.budgetMin));
            if (f.budgetMax) rows = rows.filter(r => (Number(r.dailyBudget) || 0) <= Number(f.budgetMax));
            if (f.leadsMin) rows = rows.filter(r => (Number(r.leads) || 0) >= Number(f.leadsMin));
            if (f.leadsMax) rows = rows.filter(r => (Number(r.leads) || 0) <= Number(f.leadsMax));
            if (f.spendMin) rows = rows.filter(r => (Number(r.spend) || 0) >= Number(f.spendMin));
            if (f.spendMax) rows = rows.filter(r => (Number(r.spend) || 0) <= Number(f.spendMax));
            if (f.startDate && f.endDate) {
                const s = new Date(f.startDate);
                const e = new Date(f.endDate);
                rows = rows.filter(r => {
                    const d = new Date(r.createdAt);
                    return d >= s && d <= e;
                });
            }
            if (f.sortBy) {
                const [field, dir] = f.sortBy.split("-");
                rows = rows.slice().sort((a, b) => {
                    const av = a[field] ?? 0;
                    const bv = b[field] ?? 0;
                    if (av === bv) return 0;
                    return (av > bv ? 1 : -1) * (dir === "desc" ? -1 : 1);
                });
            }
        }

        return rows;
    }, [marketing.campaigns, storeCampaigns, searchTerm, appliedFilters]);

    // Stats computed over filteredRows so UI shows filtered view stats
    const stats = useMemo(() => {
        const list = filteredRows;
        return {
            totalCampaigns: list.length,
            totalLeads: list.reduce((s, c) => s + (c.leads || 0), 0),
            active: list.filter(c => c.status === "active").length,
            spend: list.reduce((s, c) => s + (Number(c.spend) || Number(c.monthlySpend) || 0), 0),
        };
    }, [filteredRows]);

    // DataGrid columns (render dynamic cells using row props)
    const columns = [
        { field: "id", headerName: "ID", width: 90 },
        {
            field: "name",
            headerName: "Campaign Name",
            width: 220,
            renderCell: (params) => <span className="font-primary px-3 capitalize">{params.row.name}</span>,
        },
        {
            field: "createdAt",
            headerName: "Created",
            width: 140,
            renderCell: (params) => <span>{new Date(params.row.createdAt).toLocaleDateString()}</span>
        },
        { field: "leads", headerName: "Leads", width: 100 },
        { field: "dailyBudget", headerName: "Daily Budget", width: 140, renderCell: p => <span>₹{p.row.dailyBudget || 0}</span> },
        {
            field: "status",
            headerName: "Status",
            width: 120,
            renderCell: (params) => (
                <span className={`px-2 py-1 rounded text-sm ${params.row.status === "active" ? "bg-green-100 text-green-600"
                        : params.row.status === "paused" ? "bg-yellow-100 text-yellow-600"
                            : "bg-gray-200 text-gray-600"}`}>
                    {params.row.status}
                </span>
            )
        },
        {
            field: "action",
            headerName: "Action",
            width: 120,
            renderCell: (params) => (
                <div className="flex gap-2">
                    <button className="text-red-500" onClick={() => { setDeleteId(params.row.id || params.row._id); setOpenDelete(true); }}>
                        Delete
                    </button>
                </div>
            )
        }
    ];

    // Create (front-end only) — generate ID and dispatch
    const handleCreateCampaign = (payload) => {
        const newCampaign = {
            id: uid(),
            name: payload.name || "New Campaign",
            type: payload.type || "search",
            status: payload.status || "active",
            dailyBudget: Number(payload.dailyBudget) || 0,
            totalBudget: Number(payload.totalBudget) || 0,
            startDate: payload.startDate ? new Date(payload.startDate).toISOString() : null,
            endDate: payload.endDate ? new Date(payload.endDate).toISOString() : null,
            location: payload.location || "",
            language: payload.language || "",
            biddingStrategy: payload.biddingStrategy || "",
            leads: Number(payload.leads) || 0,
            spend: Number(payload.spend) || 0,
            createdAt: new Date().toISOString(),
            keywords: payload.keywords || "",
        };
        dispatch(addCampaign(newCampaign));
        // close drawer by navigating back to listing route
        navigate("/marketing/google-campaign", { replace: true });
        setOpenCreate(false);
    };

    const handleDeleteConfirmed = () => {
        if (deleteId) dispatch(deleteCampaign(deleteId));
        setOpenDelete(false);
        setDeleteId(null);
    };

    const handleApplyFilters = (f) => {
        setAppliedFilters(f);
        setOpenFilter(false);
    };

    return (
        <div className="h-auto w-full font-primary p-6">
            <DeleteModal open={openDelete} setOpen={setOpenDelete} onConfirm={handleDeleteConfirmed} />

            <Topbar
                title="Google Campaigns"
                onSearch={(q) => setSearchTerm(q)}
                // Topbar already navigates to the create-campaign URL on Add click.
                onOpenCreate={() => openCreateAndPush()}
                onOpenFilter={() => setOpenFilter(true)}
            />

            <CampaignCards stats={stats} onRangeChange={(type, s, e) => {
                if (type === "custom" && s && e) setAppliedFilters(prev => ({ ...(prev || {}), startDate: s, endDate: e }));
                else setAppliedFilters(prev => ({ ...(prev || {}), range: type }));
            }} />

            <div className="mt-6">
                <div className="flex justify-center text-2xl text-gray-600 mb-6">All Google Campaigns</div>

                <Table rows={filteredRows} columns={columns} rowsPerPage={10} />
            </div>

            {/* Drawer (CreateCampaign) - open controlled by URL / openCreate */}
            <CreateCampaign open={openCreate} setOpen={closeCreateAndPop} onCreate={handleCreateCampaign} />
            <FilterDrawer open={openFilter} setOpen={setOpenFilter} onApply={handleApplyFilters} />
        </div>
    );
}
