import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { IoMdClose } from "react-icons/io";
import { MdEdit, MdTitle, MdDescription, MdCalendarToday, MdAccessTime } from "react-icons/md";
import Modal from "./Modal";
import { updateEvent } from "../../../redux/action/event";

const Update = ({ open, setOpen, event }) => {
  const dispatch = useDispatch();
  const [data, setData] = useState(event);

  useEffect(() => {
    setData(event);
  }, [event]);

  if (!data) return null;

  return (
    <Modal open={open}>
      <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden max-w-lg w-full">
        {/* Gradient Header */}
        <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

        <div className="px-8 py-7">
          {/* Close Button */}
          <button
            onClick={() => setOpen(false)}
            className="absolute right-5 border top-5 rounded-full p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200 hover:rotate-90 transform"
            aria-label="Close modal"
          >
            <IoMdClose size={20} />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6 pr-8">
            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <MdEdit className="text-white" size={22} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Update Event
            </h2>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Title Input */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <MdTitle className="text-blue-500" size={18} />
                Event Title
              </label>
              <input
                type="text"
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 hover:border-gray-300"
                placeholder="Enter event title"
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
              />
            </div>

            {/* Description Input */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <MdDescription className="text-purple-500" size={18} />
                Description
              </label>
              <textarea
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 hover:border-gray-300 resize-none"
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
                  <MdCalendarToday className="text-green-500" size={16} />
                  Start
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm text-gray-900 transition-all duration-200 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 hover:border-gray-300"
                    value={data.start}
                    onChange={(e) => setData({ ...data, start: e.target.value })}
                  />
                </div>
              </div>

              {/* End Date/Time */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <MdAccessTime className="text-orange-500" size={16} />
                  End
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm text-gray-900 transition-all duration-200 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 hover:border-gray-300"
                    value={data.end}
                    onChange={(e) => setData({ ...data, end: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex gap-3">
            <button
              onClick={() => setOpen(false)}
              className="flex-1 px-5 py-3 bg-gray-100 border text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-200 transition-all duration-200 transform hover:scale-105"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                dispatch(updateEvent(event._id, data));
                setOpen(false);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 
                rounded-lg text-sm font-medium text-white
                bg-gradient-to-r from-blue-500 to-blue-600
                shadow-md transition-all duration-200
                hover:shadow-lg hover:from-blue-600 hover:to-blue-700"
              >
              <MdEdit size={16} />
              Update Event
            </button>

          </div>
        </div>
      </div>
    </Modal>
  );
};

export default Update;