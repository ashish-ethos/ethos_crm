import { IoMdClose } from "react-icons/io";
import { MdCalendarToday, MdAccessTime, MdEdit, MdDelete } from "react-icons/md";
import Modal from "./Modal";

const View = ({
  open,
  setOpen,
  event,
  isAdmin,
  setOpenUpdateModal,
  setOpenDeleteModal,
}) => {
  if (!open || !event) return null;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Modal open={open}>
      <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden max-w-md w-full">
        {/* Gradient Header */}
        <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
        
        <div className="px-8 py-7">
          {/* Close Button */}
          <button
            onClick={() => setOpen(false)}
            className="absolute right-5 top-5 border rounded-full p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200 hover:rotate-90 transform"
            aria-label="Close modal"
          >
            <IoMdClose size={20} />
          </button>

          {/* Title Section */}
          <div className="pr-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-2">
              {event.title}
            </h2>
            {event.description && (
              <p className="text-sm text-gray-600 leading-relaxed">
                {event.description}
              </p>
            )}
          </div>

          {/* Date & Time Info Cards */}
          <div className="space-y-3">
            {/* Start Date/Time */}
            <div className="group relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl px-5 py-4 border border-blue-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-2 bg-white rounded-lg shadow-sm">
                  <MdCalendarToday className="text-blue-600" size={18} />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">
                    Start
                  </div>
                  <div className="text-gray-900 font-semibold text-sm">
                    {formatDate(event.start)}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 text-gray-600 text-sm">
                    <MdAccessTime size={14} />
                    <span>{formatTime(event.start)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* End Date/Time */}
            <div className="group relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl px-5 py-4 border border-purple-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-2 bg-white rounded-lg shadow-sm">
                  <MdCalendarToday className="text-purple-600" size={18} />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium text-purple-600 uppercase tracking-wide mb-1">
                    End
                  </div>
                  <div className="text-gray-900 font-semibold text-sm">
                    {formatDate(event.end)}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 text-gray-600 text-sm">
                    <MdAccessTime size={14} />
                    <span>{formatTime(event.end)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isAdmin && (
            <div className="mt-7 pt-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => {
                  setOpen(false);
                  setOpenUpdateModal(true);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium text-sm shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
              >
                <MdEdit size={16} />
                Update
              </button>
              <button
                onClick={() => {
                  setOpen(false);
                  setOpenDeleteModal(true);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium text-sm shadow-md hover:shadow-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105"
              >
                <MdDelete size={16} />
                Delete
              </button>
            </div>
          )}

          {/* Close Button (for non-admin users) */}
          {!isAdmin && (
            <div className="mt-7 pt-6 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setOpen(false)}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-200 transition-all duration-200"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default View;