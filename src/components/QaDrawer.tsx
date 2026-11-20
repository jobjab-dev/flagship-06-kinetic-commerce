"use client";

import { useState } from "react";
import { SlidersHorizontal, X, ShoppingBag, Maximize2, Link2, RotateCcw } from "lucide-react";

interface QaDrawerProps {
  onPrefillBag: () => void;
  onOpenSampleDetail: () => void;
  onCopyUrl: () => void;
  onResetAll: () => void;
}

export function QaDrawer({
  onPrefillBag,
  onOpenSampleDetail,
  onCopyUrl,
  onResetAll,
}: QaDrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 left-4 z-40">
      {open ? (
        <div className="w-[295px] border border-obsidian bg-chalk p-3.5 text-obsidian shadow-[0_14px_34px_rgba(18,17,16,0.16)]">
          <div className="flex items-center justify-between border-b border-hairline pb-2">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-oxblood">
              Showcase / QA Gallery
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close Showcase / QA drawer"
              className="p-1 text-pewter hover:text-obsidian"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-2.5 flex flex-col gap-1.5">
            <button
              type="button"
              onClick={onPrefillBag}
              className="flex items-center justify-between border border-hairline bg-stone/60 px-2.5 py-2 text-left text-xs font-medium hover:border-oxblood"
            >
              <span className="inline-flex items-center gap-2">
                <ShoppingBag className="h-3.5 w-3.5 text-oxblood" />
                Prefill 3 Objects &amp; Open Bag
              </span>
              <span className="font-mono text-[10px] text-pewter">SPRING</span>
            </button>

            <button
              type="button"
              onClick={onOpenSampleDetail}
              className="flex items-center justify-between border border-hairline bg-stone/60 px-2.5 py-2 text-left text-xs font-medium hover:border-oxblood"
            >
              <span className="inline-flex items-center gap-2">
                <Maximize2 className="h-3.5 w-3.5 text-oxblood" />
                Morph Open Product Detail
              </span>
              <span className="font-mono text-[10px] text-pewter">LAYOUTID</span>
            </button>

            <button
              type="button"
              onClick={onCopyUrl}
              className="flex items-center justify-between border border-hairline bg-stone/60 px-2.5 py-2 text-left text-xs font-medium hover:border-obsidian"
            >
              <span className="inline-flex items-center gap-2">
                <Link2 className="h-3.5 w-3.5 text-obsidian" />
                Copy Synced Query URL
              </span>
              <span className="font-mono text-[10px] text-pewter">URL</span>
            </button>

            <button
              type="button"
              onClick={onResetAll}
              className="flex items-center justify-between border border-hairline bg-stone/60 px-2.5 py-2 text-left text-xs font-medium hover:border-obsidian"
            >
              <span className="inline-flex items-center gap-2">
                <RotateCcw className="h-3.5 w-3.5 text-pewter" />
                Reset Filters &amp; Bag
              </span>
              <span className="font-mono text-[10px] text-pewter">RESET</span>
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-obsidian bg-chalk/95 px-3.5 py-1.5 font-mono text-[11px] font-medium text-obsidian shadow-[0_4px_14px_rgba(18,17,16,0.1)] hover:border-oxblood"
        >
          <SlidersHorizontal className="h-3.5 w-3.5 text-oxblood" />
          Showcase / QA
        </button>
      )}
    </div>
  );
}
