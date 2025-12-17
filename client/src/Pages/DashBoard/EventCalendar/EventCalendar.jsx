import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useDispatch, useSelector } from "react-redux";
import { MdAdd, MdCalendarMonth } from "react-icons/md";
import "./EventCalendar.css";
import { getEvents, getEmployeeEvents } from "../../../redux/action/event";

import View from "./View";
import Create from "./Create";
import Update from "./Update";
import Delete from "./Delete";

const localizer = momentLocalizer(moment);

const EventCalendar = () => {
  const dispatch = useDispatch();
  const { events } = useSelector((state) => state.event);
  const { loggedUser } = useSelector((state) => state.user);

  const isAdmin = loggedUser?.role === "super_admin";

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch]);


  const calendarEvents =
    events?.map((e) => ({
      ...e,
      title: e.title,
      start: new Date(e.start),
      end: new Date(e.end),
    })) || [];

  return (
    <div className="relative  bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-2">
      {/* Header Section */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
            <MdCalendarMonth className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Event Calendar</h1>
            <p className="text-sm text-gray-700 mt-0.5">
              {isAdmin ? "Manage all events" : "View your events"}
            </p>
          </div>
        </div>

        {/* Desktop Add Button */}
        {isAdmin && (
          <button
            onClick={() => setCreateOpen(true)}
            className="hidden md:flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium text-sm shadow-lg hover:shadow-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 transform hover:scale-105"
          >
            <MdAdd size={20} />
            Create Event
          </button>
        )}
      </div>

      {/* Calendar Container */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          defaultView="month"
          views={["month", "week", "day", "agenda"]}
          style={{ height: 650 }}
          onDoubleClickEvent={(event) => {
            setSelectedEvent(event);
            setViewOpen(true);
          }}
          popup
        />
      </div>

      {/* Floating Action Button (Mobile) */}
      {isAdmin && (
        <button
          onClick={() => setCreateOpen(true)}
          className="md:hidden fixed bottom-8 right-8 z-50 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 p-4 text-white shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label="Create new event"
        >
          <MdAdd size={28} />
        </button>
      )}

      {/* Event Stats Badge */}
      <div className="fixed bottom-8 left-8 z-40 hidden lg:block">
        <div className="bg-white rounded-xl shadow-lg px-4 py-3 border border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-gray-700">
              {calendarEvents.length} {calendarEvents.length === 1 ? 'Event' : 'Events'}
            </span>
          </div>
        </div>
      </div>

      {/* Modals */}
      <View
        open={viewOpen}
        setOpen={setViewOpen}
        event={selectedEvent}
        isAdmin={isAdmin}
        setOpenUpdateModal={setUpdateOpen}
        setOpenDeleteModal={setDeleteOpen}
      />

      {isAdmin && (
        <>
          <Create open={createOpen} setOpen={setCreateOpen} />
          <Update open={updateOpen} setOpen={setUpdateOpen} event={selectedEvent} />
          <Delete open={deleteOpen} setOpen={setDeleteOpen} eventId={selectedEvent?._id} />
        </>
      )}
    </div>
  );
};

export default EventCalendar;