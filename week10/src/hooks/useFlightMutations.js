import { useDispatch } from "react-redux";
import { changeFlightStatus, createFlight, deleteFlight, updateFlight } from "../features/flights/flightsSlice.js";
import { useAuth } from "./useAuth.js";


export function useCreateFlight() {
  const dispatch = useDispatch();
  return (values) => dispatch(createFlight(values)).unwrap();
}

export function useUpdateFlight() {
  const dispatch = useDispatch();
  return ({ id, changes }) => dispatch(updateFlight({ id, changes })).unwrap();
}


export function useChangeFlightStatus() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  return ({ id, status }) => dispatch(changeFlightStatus({ id, status, uid: user?.uid })).unwrap();
}


export function useDeleteFlight() {
  const dispatch = useDispatch();
  return (id) => dispatch(deleteFlight(id)).unwrap();
}