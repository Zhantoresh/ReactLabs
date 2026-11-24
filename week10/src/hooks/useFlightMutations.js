import { useDispatch } from "react-redux";
import { changeFlightStatus, createFlight, deletionScheduled, updateFlight } from "../features/flights/flightsSlice.js";
import { useAuth } from "./useAuth.js";

// Each hook returns a function that dispatches a thunk.
// .unwrap() returns the thunk result, or throws its rejectWithValue payload ({ message, kind }),
// so the page can use try / catch.

// const createFlight = useCreateFlight();  await createFlight(values) -> { flight, warning }
export function useCreateFlight() {
  const dispatch = useDispatch();
  return (values) => dispatch(createFlight(values)).unwrap();
}

// await updateFlight({ id, changes }) -> flight
export function useUpdateFlight() {
  const dispatch = useDispatch();
  return ({ id, changes }) => dispatch(updateFlight({ id, changes })).unwrap();
}

// await changeStatus({ id, status }) -> { flight, queued }
export function useChangeFlightStatus() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  return ({ id, status }) => dispatch(changeFlightStatus({ id, status, uid: user?.uid })).unwrap();
}

// removeFlight(flight): delete with Undo (bonus).
// The flight is hidden at once; the DELETE request is sent by store/listeners.js
// only if nobody presses Undo in the toast within 5 seconds.
export function useRemoveFlight() {
  const dispatch = useDispatch();
  return (flight) => dispatch(deletionScheduled({ id: flight.id, name: flight.name }));
}
