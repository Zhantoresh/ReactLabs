import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFlights } from "../features/flights/flightsSlice.js";
import {
  discardChange,
  flushOutbox,
  loadOutbox,
  selectOutboxFlushing,
  selectOutboxItemsForUser,
} from "../features/outbox/outboxSlice.js";
import { useAuth } from "./useAuth.js";
import { useOnlineStatus } from "./useOnlineStatus.js";

export function useOutbox() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const online = useOnlineStatus();
  const uid = user?.uid;
  const items = useSelector((state) => selectOutboxItemsForUser(state, uid));
  const sending = useSelector(selectOutboxFlushing);
  const count = items.length;

  const [result, setResult] = useState(null);


  useEffect(() => {
    dispatch(loadOutbox());
  }, [dispatch]);

  
  useEffect(() => {
    if (!online || !uid || count === 0) return;
    dispatch(flushOutbox(uid))
      .unwrap()
      .then((outcome) => {
        if (outcome.sent.length === 0 && outcome.failed.length === 0) return;
        setResult(outcome);
        dispatch(fetchFlights({ force: true })); 
      })
      .catch(() => {}); 
  }, [dispatch, online, uid, count]);

  
  useEffect(() => {
    if (!result) return;
    const timer = setTimeout(() => setResult(null), 6000);
    return () => clearTimeout(timer);
  }, [result]);


  async function send() {
    if (!uid) return;
    const outcome = await dispatch(flushOutbox(uid)).unwrap();
    if (outcome.sent.length > 0 || outcome.failed.length > 0) {
      setResult(outcome);
      dispatch(fetchFlights({ force: true }));
    }
  }

  async function discard(flightId) {
    await dispatch(discardChange({ uid, flightId }));
    dispatch(fetchFlights({ force: true })); 
  }

  return { items, online, sending, result, send, discard };
}