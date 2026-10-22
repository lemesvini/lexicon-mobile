import { useEffect, useState } from "react";

import { fetchPresentation } from "@/features/presentation/data/presentation";
import type { PresentationState } from "@/features/presentation/types/presentation-state";

/** Loads when the viewer opens, and only then: the deck is a bigger document
 *  than the material, and most visits to a lesson never ask for it — the web's
 *  reason for loading it lazily too. */
export function usePresentation(lessonId: string) {
  const [state, setState] = useState<PresentationState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    fetchPresentation(lessonId)
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
