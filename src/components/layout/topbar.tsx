"use client";

import { useStore } from "@/lib/store";

export function Topbar() {
  const { state } = useStore();

  return (
    <div className="nike-sticky-bar h-12">
      <div className="flex items-center gap-2">
        <span className="text-caption-md text-[var(--mute)]">
          AturDuit
        </span>
        {state.profile && (
          <span className="nike-badge">{state.profile}</span>
        )}
      </div>
    </div>
  );
}
