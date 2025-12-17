import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { IoMdClose } from "react-icons/io";
import { MdAdd, MdTitle, MdDescription, MdCalendarToday, MdAccessTime, MdSave } from "react-icons/md";
import Modal from "./Modal";
import { createEvent } from "../../../redux/action/event";

const Create = ({ open, setOpen }) => {
  const dispatch = useDispatch();

  const [data, setData] = useState({
    title: "",
    description: "",
    start: "",
    end: "",
  });

  const handleSubmit = () => {
    if (!data.title || !data.start || !data.end) {
      alert("Title, Start date, and End date are required");
      return;
    }
    dispatch(createEvent(data));
    setOpen(false);
    setData({ title: "", description: "", start: "", end: "" });
  };

  return (
    <Modal open={open}>
      <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden max-w-lg w-full">
        {/* Gradient Header */}
        <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
        
        <div className="px-8 py-7">
          {/* Close Button */}
          <button
            onClick={() => setOpen(false)}
            className="absolute right-5 top-5 rounded-full border p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200 hover:rotate-90 transform"
            aria-label="Close modal"
          >
            <IoMdClose size={20} />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6 pr-8">
            <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
              <MdAdd className="text-white" size={22} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Create New Event
            </h2>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Title Input */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <MdTitle className="text-emerald-500" size={18} />
                Event Title
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 hover:border-gray-300"
                placeholder="Enter event title"
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
              />
            </div>

            {/* Description Input */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <MdDescription className="text-teal-500" size={18} />
                Description
                <span className="text-xs text-gray-400 ml-1">(optional)</span>
              </label>
              <textarea
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100 hover:border-gray-300 resize-none"
                rows={3}
                placeholder="Enter event description"
                value={data.description}
                onChange={(e) => setData({ ...data, description: e.target.value })}
              />
            </div>

            {/* Date/Time Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Start Date/Time */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <MdCalendarToday className="text-cyan-500" size={16} />
                  Start Date & Time
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm text-gray-900 transition-all duration-200 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 hover:border-gray-300"
                    value={data.start}
                    onChange={(e) => setData({ ...data, start: e.target.value })}
                  />
                </div>
              </div>

              {/* End Date/Time */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <MdAccessTime className="text-blue-500" size={16} />
                  End Date & Time
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm text-gray-900 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 hover:border-gray-300"
                    value={data.end}
                    onChange={(e) => setData({ ...data, end: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Required Fields Note */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-lg">
              <span className="text-blue-600 text-xs">ℹ️</span>
              <p className="text-xs text-blue-700">
                Fields marked with <span className="text-red-500 font-medium">*</span> are required
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex gap-3">
            <button
              onClick={() => {
                setOpen(false);
                setData({ title: "", description: "", start: "", end: "" });
              }}
              className="flex-1 px-5 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-200 transition-all duration-200 transform hover:scale-105"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium text-sm shadow-lg hover:shadow-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 transform hover:scale-105"
            >
              <MdSave size={16} />
              Create Event
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default Create;