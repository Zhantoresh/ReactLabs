import { useEffect, useState } from "react";
import { getAdjacentFlights } from "../services/service.js";

export function useAdjacentFlights(id) {
  const [adjacent, setAdjacent] = useState({ prev: null, next: null });

  useEffect(() => {
    let ignore = false;

    getAdjacentFlights(id)
      .then((result) => {
        if (!ignore) setAdjacent(result);
      })
      .catch(() => {
        if (!ignore) setAdjacent({ prev: null, next: null });
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  return adjacent;
}