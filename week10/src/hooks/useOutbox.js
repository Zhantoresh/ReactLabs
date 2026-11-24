import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { discardChange, flushOutbox, getOutboxSnapshot, subscribeToOutbox } from "../services/outbox.js";
import { flightKeys } from "../services/queryClient.js";
import { useAuth } from "./useAuth.js";
import { useOnlineStatus } from "./useOnlineStatus.js";


export function useOutbox() {
  const { user } = useAuth();
  const online = useOnlineStatus();
  const queryClient = useQueryClient();
  const { items: all, flushing: sending } = useSyncExternalStore(subscribeToOutbox, getOutboxSnapshot);
  const items = user ? all.filter((item) => item.uid === user.uid) : [];

  const [result, setResult] = useState(null); 

  const uid = user?.uid;
  const count = items.length;

  
  const report = useCallback(
    (outcome) => {
      if (outcome.sent.length === 0 && outcome.failed.length === 0) return;
      setResult(outcome);
      queryClient.invalidateQueries({ queryKey: flightKeys.all });
    },
    [queryClient],
  );

  
  useEffect(() => {
    if (online && uid && count > 0) flushOutbox(uid).then(report);
  }, [online, uid, count, report]);


  async function send() {
    if (uid) report(await flushOutbox(uid));
  }

 
  useEffect(() => {
    if (!result) return;
    const timer = setTimeout(() => setResult(null), 6000);
    return () => clearTimeout(timer);
  }, [result]);

  async function discard(flightId) {
    await discardChange(uid, flightId);
    queryClient.invalidateQueries({ queryKey: flightKeys.all });
  }

  return { items, online, sending, result, send, discard };
}