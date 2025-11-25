// src/Pages/Marketing/GoogleCampaign/Topbar.jsx
import React, { useRef, useEffect, useState } from "react";
import { Add, FilterList, Search, Close } from "@mui/icons-material";
import { Path } from "../../../utils";
import { useNavigate } from "react-router-dom";

export default function Topbar({
    title,
    onSearch = () => { },
    onOpenFilter = () => { }
}) {
    const [showSearch, setShowSearch] = useState(false);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (showSearch) inputRef.current?.focus();
    }, [showSearch]);

    return (
        <div className="flex flex-col w-full">
            <div className="w-full text-[14px] mb-2">
                <Path />
            </div>

            <div className="flex justify-between items-center w-full">
                <h1 className="text-primary-blue text-[32px] capitalize">{title}</h1>

                <div className="flex items-center gap-4">

                    {/* 🔍 Search Icon */}
                    {!showSearch ? (
                        <div
                            className="cursor-pointer bg-gray-100 hover:bg-gray-200 p-2 rounded-full shadow"
                            onClick={() => setShowSearch(true)}
                        >
                            <Search className="text-gray-600" />
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <input
                                ref={inputRef}
                                onChange={(e) => onSearch(e.target.value)}
                                placeholder="Search..."
                                className="border border-gray-300 rounded-full px-4 py-2 w-56 shadow-sm outline-none transition-all duration-300 focus:ring-2 focus:ring-primary-blue"
                            />
                            <button
                                onClick={() => setShowSearch(false)}
                                className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full shadow"
                            >
                                <Close className="text-gray-600" />
                            </button>
                        </div>
                    )}

                    {/* 🔥 Filter Button */}
                    <div
                        onClick={onOpenFilter}
                        className="cursor-pointer bg-gray-100 hover:bg-gray-200 p-2 rounded-full shadow"
                    >
                        <FilterList className="text-gray-600" />
                    </div>

                    <button
                        onClick={() => navigate("/marketing/google-campaign/create-campaign")}
                        className="bg-primary-red text-white w-[44px] h-[44px] flex justify-center items-center rounded-full shadow-lg"
                    >
                        <Add />
                    </button>

                </div>
            </div>
        </div>
    );
}
