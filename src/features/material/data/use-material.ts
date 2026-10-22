import { useEffect, useState } from "react";

import { fetchMaterial } from "@/features/material/data/material";
import type { MaterialState } from "@/features/material/types/material-state";

/** Loads once: the viewer is a modal, opened afresh every time. */
export function useMaterial(lessonId: string) {
  const [state, setState] = useState<MaterialState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    fetchMaterial(lessonId)
      .then((slides) => {
        if (!cancelled) setState(slides ? { status: "ready", slides } : { status: "missing" });
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState({ status: "error", message: error instanceof Error ? error.message : String(error) });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [lessonId]);

  return state;
}
