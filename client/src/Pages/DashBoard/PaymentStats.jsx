import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getPayments } from "../../redux/action/cashbook";
import {
  FaMoneyBillWave,
  FaUsers,
  FaPhoneAlt,
  FaHandshake,
  FaCheckCircle,
} from "react-icons/fa";

/* ✅ Revenue mapping */
const revenueKeyMap = {
  daily: "todayReceived",
  weekly: "thisWeekReceived",
  monthly: "thisMonthReceived",
  yearly: "thisYearReceived",
};

const Stats = () => {
  const dispatch = useDispatch();
  const { payments } = useSelector((state) => state.cashbook);

  const [periods, setPeriods] = useState({
    revenue: "monthly",
    leads: "monthly",
    contacted: "monthly",
    negotiation: "monthly",
    closed: "monthly",
  });

  useEffect(() => {
    dispatch(getPayments());
  }, [dispatch]);

  const statsData = [
    {
      id: "revenue",
      title: "Total Revenue",
      getValue: (p) => `$${payments?.[revenueKeyMap[p]] ?? 0}`,
      subtitle: (p) => `${p[0].toUpperCase()}${p.slice(1)} Revenue`,
      change: "+12%",
      icon: <FaMoneyBillWave />,
      iconBg: "bg-emerald-500",
      glow: "hover:shadow-emerald-200/60 border-emerald-200 border-2",
      ring: "hover:ring-emerald-200",
    },
    {
      id: "leads",
      title: "New Leads",
      getValue: () => payments?.leads ?? 0,
      subtitle: () => "Generated Leads",
      change: "+12%",
      icon: <FaUsers />,
      iconBg: "bg-blue-500",
      glow: "hover:shadow-blue-200/60 border-blue-300 border-2",
      ring: "hover:ring-blue-200",
    },
    {
      id: "contacted",
      title: "Contacted",
      getValue: () => payments?.contacted ?? 0,
      subtitle: () => "Reached Customers",
      change: "+12%",
      icon: <FaPhoneAlt />,
      iconBg: "bg-purple-500",
      glow: "hover:shadow-purple-200/60 border-purple-200 border-2",
      ring: "hover:ring-purple-200",
    },
    {
      id: "negotiation",
      title: "Negotiation",
      getValue: () => payments?.negotiation ?? 0,
      subtitle: () => "In Progress",
      change: "-09%",
      negative: true,
      icon: <FaHandshake />,
      iconBg: "bg-orange-500",
      glow: "hover:shadow-orange-200/60 border-orange-200 border-2",
      ring: "hover:ring-orange-200",
    },
    {
      id: "closed",
      title: "Closed Deals",
      getValue: () => payments?.closed ?? 0,
      subtitle: () => "Successful Deals",
      change: "+12%",
      icon: <FaCheckCircle />,
      iconBg: "bg-pink-500",
      glow: "hover:shadow-pink-200/60 border-pink-300 border-2",
      ring: "hover:ring-pink-200",
    },
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {statsData.map((item) => {
          const period = periods[item.id];

          return (
            <Link key={item.id} to="/cashbook">
              <div
                className={`
                  relative overflow-hidden rounded-2xl bg-white p-4
                  border border-gray-200
                  transition-all duration-300
                  hover:-translate-y-1 hover:shadow-xl ${item.glow}
                  hover:ring-2 ${item.ring}
                `}
              >
                {/* ✅ HEADER */}
                <div className="flex items-center justify-between">
                  <div
                    className={`w-11 h-11 rounded-xl ${item.iconBg}
                    flex items-center justify-center text-white text-lg shadow`}
                  >
                    {item.icon}
                  </div>

                  <select
                    value={period}
                    onChange={(e) =>
                      setPeriods((prev) => ({
                        ...prev,
                        [item.id]: e.target.value,
                      }))
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                    className="text-xs text-gray-700 border border-gray-200 font-bold
                    rounded-md px-2 py-1.5 bg-white
                    shadow-sm hover:border-gray-300
                    focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                {/* ✅ CONTENT */}
                <p className="text-sm font-medium text-gray-500 mt-4">
                  {item.title}
                </p>

                <div className="flex items-end justify-between mt-1">
                  <p className="text-3xl font-bold text-gray-900">
                    {item.getValue(period)}
                  </p>

                  <span
                    className={`text-sm font-semibold ${
                      item.negative ? "text-red-600" : "text-emerald-600"
                    }`}
                  >
                    {item.change}
                  </span>
                </div>

                <p className="text-sm text-black font-semibold mt-1">
                  {item.subtitle(period)}
                </p>

                {/* ✅ Decorative gradient bar */}
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-60" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Stats;
