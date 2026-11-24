import { useDispatch, useSelector } from "react-redux";
import { deletionCancelled } from "../features/flights/flightsSlice.js";
import { notificationDismissed, selectNotifications } from "../features/notifications/notificationsSlice.js";

// Toasts for the Toaster component: the list and the two buttons (× and Undo).
export function useNotifications() {
  const dispatch = useDispatch();
  const items = useSelector(selectNotifications);
  return {
    items,
    dismiss: (id) => dispatch(notificationDismissed(id)),
    undoDelete: (flightId) => dispatch(deletionCancelled(flightId)), // the listener then closes the toast
  };
}
