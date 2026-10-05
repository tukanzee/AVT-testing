import { useEffect, useMemo, useRef, useState } from "react";
import type { TranscriptEvidenceChunk } from "../workflowTypes";

type Props = {
  chunks: TranscriptEvidenceChunk[];
  currentUnitId?: string;
  linkedUnitIds?: string[];
  onToggleEvidence?: (unitId: string) => void;
  compact?: boolean;
};

export default function TranscriptContextViewer({
  chunks,
  currentUnitId,
  linkedUnitIds = [],
  onToggleEvidence,
  compact = false
}: Props) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [showLinkedOnly, setShowLinkedOnly] = useState(false);
  const [linkedCursorId, setLinkedCursorId] = useState<string>();

  const orderedLinkedIds = useMemo(
    () => chunks.filter((chunk) => linkedUnitIds.includes(chunk.id)).map((chunk) => chunk.id),
    [chunks, linkedUnitIds]
  );

  const visibleChunks = showLinkedOnly && orderedLinkedIds.length
    ? chunks.filter((chunk) => orderedLinkedIds.includes(chunk.id))
    : chunks;

  const scrollToUnit = (unitId?: string, behavior: ScrollBehavior = "auto") => {
    if (!unitId) return;
    const container = viewerRef.current;
    const target = container?.querySelector<HTMLElement>(`[data-unit-id="${unitId}"]`);
    if (!container || !target) return;

    const top = Math.max(0, target.offsetTop - (container.clientHeight - target.offsetHeight) / 2);
    container.scrollTo({ top, behavior });
  };

  // Whenever the reviewed claim/unit changes, jump straight to the evidence being assessed.
  useEffect(() => {
    setShowLinkedOnly(false);
    const nextCursor = orderedLinkedIds.includes(currentUnitId ?? "")
      ? currentUnitId
      : orderedLinkedIds[0];
    setLinkedCursorId(nextCursor);
    const frame = requestAnimationFrame(() => scrollToUnit(currentUnitId ?? orderedLinkedIds[0], "auto"));
    return () => cancelAnimationFrame(frame);
  }, [currentUnitId]);

  // Keep the linked-evidence cursor valid as evidence is linked/unlinked.
  useEffect(() => {
    if (!orderedLinkedIds.length) {
      setLinkedCursorId(undefined);
      return;
    }
    if (!linkedCursorId || !orderedLinkedIds.includes(linkedCursorId)) {
      setLinkedCursorId(orderedLinkedIds[0]);
    }
  }, [orderedLinkedIds, linkedCursorId]);

  // Re-centre after switching between full transcript and linked-only mode.
  useEffect(() => {
    const target = showLinkedOnly ? (linkedCursorId ?? orderedLinkedIds[0]) : (currentUnitId ?? linkedCursorId);
    const frame = requestAnimationFrame(() => scrollToUnit(target, "auto"));
    return () => cancelAnimationFrame(frame);
  }, [showLinkedOnly]);

  const moveLinked = (direction: -1 | 1) => {
    if (!orderedLinkedIds.length) return;
    const currentIndex = linkedCursorId ? orderedLinkedIds.indexOf(linkedCursorId) : -1;
    const nextIndex = nextLinkedIndex(currentIndex < 0 ? 0 : currentIndex, direction, orderedLinkedIds.length);
    const nextId = orderedLinkedIds[nextIndex];
    setLinkedCursorId(nextId);
    requestAnimationFrame(() => scrollToUnit(nextId, "smooth"));
  };

  const linkedPosition = linkedCursorId ? orderedLinkedIds.indexOf(linkedCursorId) + 1 : 0;

  return <div className={`transcript-viewer-shell ${compact ? "compact" : ""}`}>
    <div className="transcript-viewer-toolbar">
      <strong>Transcript context</strong>
      {orderedLinkedIds.length > 0 && <label className="linked-only-toggle">
        <input type="checkbox" checked={showLinkedOnly} onChange={(event) => setShowLinkedOnly(event.target.checked)} />
        Show linked evidence only
      </label>}
    </div>

    {orderedLinkedIds.length === 1 && <button className="compact-button" onClick={() => scrollToUnit(orderedLinkedIds[0], "smooth")}>Jump to linked evidence</button>}
    {orderedLinkedIds.length > 1 && <div className="linked-navigation">
      <button className="compact-button" onClick={() => moveLinked(-1)}>↑ Previous linked evidence</button>
      <span>{Math.max(1, linkedPosition)} / {orderedLinkedIds.length}</span>
      <button className="compact-button" onClick={() => moveLinked(1)}>↓ Next linked evidence</button>
    </div>}

    <div className="transcript-context-viewer" ref={viewerRef} tabIndex={0} aria-label="Scrollable transcript context">
      {visibleChunks.map((unit) => {
        const linked = linkedUnitIds.includes(unit.id);
        const current = unit.id === currentUnitId;
        const linkedCursor = unit.id === linkedCursorId && linked;

        return <article
          key={unit.id}
          data-unit-id={unit.id}
          className={[
            "transcript-viewer-unit",
            current ? "current-unit" : "",
            linked ? "linked-unit" : "",
            linkedCursor ? "linked-cursor-unit" : ""
          ].filter(Boolean).join(" ")}
        >
          <div className="unit-heading">
            <small>{unit.id} · lines {unit.startLine}–{unit.endLine}</small>
            <span className="unit-badges">
              {linked && <span>✓ Linked</span>}
              {current && <span>Current</span>}
            </span>
          </div>
          <p>{unit.text}</p>
          {onToggleEvidence && <button className={linked ? "unlink-button" : "compact-button"} onClick={() => onToggleEvidence(unit.id)}>
            {linked ? "× Unlink evidence" : "Use this evidence"}
          </button>}
        </article>;
      })}
    </div>
  </div>;
}

export function nextLinkedIndex(current: number, direction: -1 | 1, total: number) {
  if (total <= 0) return 0;
  return (current + direction + total) % total;
}
