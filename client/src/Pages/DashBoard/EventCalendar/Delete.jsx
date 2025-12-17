import { useDispatch } from "react-redux";
import { IoMdClose } from "react-icons/io";
import Modal from "./Modal";
import { deleteEvent } from "../../../redux/action/event";

const Delete = ({ open, setOpen, eventId }) => {
  const dispatch = useDispatch();

  return (
    <Modal open={open}>
      <div className="relative px-6 py-5">
        {/* Close Icon */}
        <button
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 rounded-full border p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200"
          aria-label="Close modal"
        >
          <IoMdClose size={18} />
        </button>

        <h2 className="text-lg font-semibold text-gray-900">
          Delete Event?
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          Are you sure you want to delete this event?
        </p>

        <div className="mt-6 flex justify-end gap-5 text-sm">
          <button
            onClick={() => setOpen(false)}
            className="text-gray-500 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              dispatch(deleteEvent(eventId));
              setOpen(false);
            }}
            className="font-medium text-red-600 hover:text-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default Delete;
