import { useEffect, useMemo, useRef, useState } from "react";
import { cases, getCaseById } from "./data/cases";
import type { ClinicalCase, GroundTruthItem } from "./types";
import { exportGroundTruthPdf } from "./utils/pdf";
import { exportGroundTruthJson } from "./utils/json";
import ValidatorPage from "./validator/ValidatorPage";

type Role = "doctor" | "patient" | null;
type Workflow = "runner" | "validator" | null;

function makeSessionId() {
  const stamp = new Date().toISOString().replace(/\D/g, "").slice(0, 14);
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const suffix = Array.from(
    { length: 4 },
    () => alphabet[Math.floor(Math.random() * alphabet.length)]
  ).join("");
  return `${stamp}-${suffix}`;
}

function useQueryState() {
  const params = new URLSearchParams(window.location.search);
  const workflow = (params.get("workflow") as Workflow) ?? null;
  const role = (params.get("role") as Role) ?? null;
  const caseId = params.get("case");
  return { workflow, role, caseId };
}

function setRoute({
  workflow,
  role,
  caseId
}: {
  workflow?: Workflow;
  role?: Role;
  caseId?: string;
}) {
  const url = new URL(window.location.href);
  url.search = "";
  url.hash = "";
  if (workflow) url.searchParams.set("workflow", workflow);
  if (role) url.searchParams.set("role", role);
  if (caseId) url.searchParams.set("case", caseId);
  window.history.pushState({}, "", url);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function App() {
  const [routeVersion, setRouteVersion] = useState(0);

  useEffect(() => {
    const handler = () => setRouteVersion((value) => value + 1);
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  void routeVersion;
  const { workflow, role, caseId } = useQueryState();
  const clinicalCase = getCaseById(caseId);

  if (workflow === "validator") {
    return <ValidatorPage onBack={() => setRoute({})} />;
  }

  if (!workflow && !role && !caseId) {
    return <HomePage />;
  }

  if (!role || !clinicalCase) {
    return <RunnerLandingPage />;
  }

  if (role === "doctor") {
    return <DoctorView clinicalCase={clinicalCase} />;
  }

  return <PatientView clinicalCase={clinicalCase} />;
}

function HomePage() {
  return (
    <main className="shell landing-shell">
      <section className="hero-card home-card">
        <div className="eyebrow">Clinical AVT testing</div>
        <h1>Choose a workflow</h1>
        <p className="lead">
          Run a synthetic consultation to create ground truth, or validate an AVT-generated record against completed ground truth.
        </p>
        <div className="notice">
          <strong>For synthetic scenarios only.</strong> Do not enter real patient-identifiable information.
        </div>
        <div className="workflow-choice">
          <button className="workflow-card" onClick={() => setRoute({ workflow: "runner" })}>
            <span className="eyebrow">Workflow 1</span>
            <strong>Run a synthetic consultation</strong>
            <span>Create the doctor/patient role-play and capture exactly what was spoken.</span>
          </button>
          <button className="workflow-card" onClick={() => setRoute({ workflow: "validator" })}>
            <span className="eyebrow">Workflow 2</span>
            <strong>Validate AVT output</strong>
            <span>Upload ground truth and paste AVT writer blocks into matching FirstNet components.</span>
          </button>
        </div>
      </section>
    </main>
  );
}

function RunnerLandingPage() {
  const [selectedRole, setSelectedRole] = useState<Exclude<Role, null> | null>(null);
  const [selectedCase, setSelectedCase] = useState(cases[0]?.id ?? "");

  const continueToRole = () => {
    if (!selectedRole || !selectedCase) return;
    if (selectedRole === "patient") {
      const sessionId = makeSessionId();
      localStorage.setItem(`ground-truth:active-session:${selectedCase}`, sessionId);
    }
    setRoute({ workflow: "runner", role: selectedRole, caseId: selectedCase });
  };

  return (
    <main className="shell landing-shell">
      <section className="hero-card">
        <button className="link-button" onClick={() => setRoute({})}>← Back to home</button>
        <div className="eyebrow landing-eyebrow">Synthetic consultation testing</div>
        <h1>Clinical Ground Truth Runner</h1>
        <p className="lead">
          Run a standardised doctor–patient role-play and record exactly which predefined clinical facts were spoken aloud.
        </p>
        <div className="notice">
          <strong>For synthetic scenarios only.</strong> Do not enter real patient-identifiable information.
        </div>

        <fieldset className="role-fieldset">
          <legend className="field-label">Choose your role</legend>
          <div className="role-choice">
            <label className={`role-option ${selectedRole === "patient" ? "selected" : ""}`}>
              <input type="radio" name="role" value="patient" checked={selectedRole === "patient"} onChange={() => setSelectedRole("patient")} />
              <span className="role-option-content">
                <strong>Patient / Actor</strong>
                <span>Play the scripted patient and mark exactly what was spoken aloud.</span>
              </span>
            </label>
            <label className={`role-option ${selectedRole === "doctor" ? "selected" : ""}`}>
              <input type="radio" name="role" value="doctor" checked={selectedRole === "doctor"} onChange={() => setSelectedRole("doctor")} />
              <span className="role-option-content">
                <strong>Doctor</strong>
                <span>Open the doctor brief, prompts, findings and management plan.</span>
              </span>
            </label>
          </div>
        </fieldset>

        <label className="field-label" htmlFor="case-select">Choose a case</label>
        <select id="case-select" className="select" value={selectedCase} onChange={(event) => setSelectedCase(event.target.value)}>
          {cases.map((item) => <option key={item.id} value={item.id}>{item.id} — {item.title}</option>)}
        </select>

        <button className="primary-button large-button" onClick={continueToRole} disabled={!selectedRole}>Continue</button>
        <p className="subtle landing-help">Both participants can open this website independently. Choose the same case, then select the role you are playing.</p>
      </section>
    </main>
  );
}

function TopBar({ clinicalCase, role }: { clinicalCase: ClinicalCase; role: "doctor" | "patient" }) {
  return (
    <header className="topbar">
      <div>
        <button className="link-button" onClick={() => setRoute({ workflow: "runner" })}>← Choose role / case</button>
        <div className="topbar-title">{clinicalCase.id} · {clinicalCase.title}</div>
      </div>
      <div className="role-badge">{role === "doctor" ? "Doctor view" : "Patient / ground truth"}</div>
    </header>
  );
}

function DoctorView({ clinicalCase }: { clinicalCase: ClinicalCase }) {
  return (
    <main className="shell">
      <TopBar clinicalCase={clinicalCase} role="doctor" />
      <section className="panel doctor-brief">
        <div className="eyebrow">Doctor brief</div>
        <h1>{clinicalCase.title}</h1>
        <div className="meta-row"><span>{clinicalCase.setting}</span><span>{clinicalCase.specialty}</span></div>
        <p>{clinicalCase.doctorBrief}</p>
      </section>
      <div className="two-column">
        <section>
          <h2>Suggested history prompts</h2>
          <p className="section-intro">These are prompts only. Phrase them naturally and use as many or as few as needed.</p>
          {clinicalCase.doctorPromptSections.map((section) => (
            <details className="accordion" key={section.title} open>
              <summary>{section.title}</summary>
              <ul className="prompt-list">{section.prompts.map((prompt) => <li key={prompt}>{prompt}</li>)}</ul>
            </details>
          ))}
        </section>
        <section>
          <h2>Available examination findings</h2>
          <p className="section-intro">These are the simulated findings available to you. Read out whichever findings you would normally verbalise.</p>
          <DoctorFactGroup title="Observations & examination" items={clinicalCase.examinationItems} />
          <DoctorFactGroup title="Available bedside tests / initial results" items={clinicalCase.investigationItems} />
          <DoctorFactGroup title="Management / plan prompts" items={clinicalCase.planItems} />
        </section>
      </div>
    </main>
  );
}

function DoctorFactGroup({ title, items }: { title: string; items: GroundTruthItem[] }) {
  return <div className="doctor-fact-group"><h3>{title}</h3><ul className="fact-bullets">{items.map((item) => <li key={item.id}>{item.label}</li>)}</ul></div>;
}

function PatientView({ clinicalCase }: { clinicalCase: ClinicalCase }) {
  const activeSessionKey = `ground-truth:active-session:${clinicalCase.id}`;
  const [sessionId] = useState(() => {
    const existing = localStorage.getItem(activeSessionKey);
    if (existing) return existing;
    const created = makeSessionId();
    localStorage.setItem(activeSessionKey, created);
    return created;
  });

  const allItems = useMemo(() => [
    ...clinicalCase.historyItems,
    ...clinicalCase.examinationItems,
    ...clinicalCase.investigationItems,
    ...clinicalCase.planItems
  ], [clinicalCase]);

  const storageKey = `ground-truth:${clinicalCase.id}:${sessionId}`;
  const notesKey = `${storageKey}:notes`;
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return new Set(stored ? JSON.parse(stored) : []);
    } catch {
      return new Set();
    }
  });
  const [additionalNotes, setAdditionalNotes] = useState(() => localStorage.getItem(notesKey) ?? "");
  const [showSummary, setShowSummary] = useState(false);
  const groundTruthRef = useRef<HTMLElement | null>(null);

  useEffect(() => { localStorage.setItem(storageKey, JSON.stringify(Array.from(selectedIds))); }, [selectedIds, storageKey]);
  useEffect(() => { localStorage.setItem(notesKey, additionalNotes); }, [additionalNotes, notesKey]);

  const toggleItem = (id: string) => setSelectedIds((current) => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  const selectedItems = allItems.filter((item) => selectedIds.has(item.id));
  const exportArgs = { clinicalCase, sessionId, selectedItems, additionalNotes };

  const handleViewGroundTruth = () => {
    setShowSummary(true);
    window.setTimeout(() => groundTruthRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  };

  const resetSession = () => {
    if (!window.confirm("Clear all ticks and free text for this session?")) return;
    setSelectedIds(new Set());
    setAdditionalNotes("");
    setShowSummary(false);
    localStorage.removeItem(storageKey);
    localStorage.removeItem(notesKey);
  };

  return (
    <main className="shell">
      <TopBar clinicalCase={clinicalCase} role="patient" />
      <section className="panel patient-profile">
        <div className="eyebrow">Patient role</div>
        <h1>{clinicalCase.patientName}, {clinicalCase.patientAge}</h1>
        <p>{clinicalCase.patientPortrayal}</p>
        <div className="opening-line"><span>Opening line</span>“{clinicalCase.openingLine}”</div>
      </section>

      <div className="patient-layout">
        <section className="checklist-column">
          <h2>Patient history</h2>
          <p className="section-intro">Tick an item only after that information has actually been said aloud.</p>
          <Checklist items={clinicalCase.historyItems} selectedIds={selectedIds} onToggle={toggleItem} showPatientWording />
          <h2>Examination & observations</h2>
          <p className="section-intro">These are the same simulated findings visible to the doctor. Tick them when you hear the doctor say them aloud.</p>
          <Checklist items={clinicalCase.examinationItems} selectedIds={selectedIds} onToggle={toggleItem} />
          <h2>Investigations / initial results</h2>
          <Checklist items={clinicalCase.investigationItems} selectedIds={selectedIds} onToggle={toggleItem} />
          <h2>Plan / actions / teams</h2>
          <Checklist items={clinicalCase.planItems} selectedIds={selectedIds} onToggle={toggleItem} />
          <h2>Anything else that was said?</h2>
          <p className="section-intro">Use this only for clinically relevant spoken information that is not already represented above.</p>
          <textarea className="notes" rows={6} value={additionalNotes} onChange={(event) => setAdditionalNotes(event.target.value)} placeholder="e.g. The doctor said the patient would be admitted under acute medicine..." />
        </section>

        <aside className="sticky-summary">
          <div className="summary-card">
            <div className="eyebrow">Ground truth</div>
            <div className="big-number">{selectedItems.length}</div>
            <div className="subtle">predefined facts marked as spoken</div>
            <div className="autosave-note">Autosaved on this device</div>
            <button className="primary-button" onClick={handleViewGroundTruth}>View ground truth</button>
            <button className="secondary-button" onClick={() => exportGroundTruthPdf(exportArgs)}>Save ground truth PDF</button>
            <button className="secondary-button" onClick={() => exportGroundTruthJson(exportArgs)}>Save ground truth JSON</button>
            <button className="danger-link" onClick={resetSession}>Reset this session</button>
          </div>
        </aside>
      </div>

      {showSummary && (
        <section ref={groundTruthRef} className="panel ground-truth-panel">
          <h2>Ground truth preview</h2>
          <p className="section-intro">This is the subset of information recorded as having been spoken aloud during this session.</p>
          <GroundTruthPreview items={selectedItems} additionalNotes={additionalNotes} />
        </section>
      )}
    </main>
  );
}

function Checklist({ items, selectedIds, onToggle, showPatientWording = false }: {
  items: GroundTruthItem[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  showPatientWording?: boolean;
}) {
  const grouped = items.reduce<Record<string, GroundTruthItem[]>>((acc, item) => {
    (acc[item.domain] ??= []).push(item);
    return acc;
  }, {});

  return (
    <div className="checklist">
      {Object.entries(grouped).map(([domain, domainItems]) => (
        <div className="check-group" key={domain}>
          <h3>{domain}</h3>
          {domainItems.map((item) => {
            const checked = selectedIds.has(item.id);
            return (
              <label className={`check-row ${checked ? "checked" : ""}`} key={item.id}>
                <input type="checkbox" checked={checked} onChange={() => onToggle(item.id)} />
                <span className="check-content">
                  <strong>{item.label}</strong>
                  {showPatientWording && item.patientWording && <span className="example-wording">“{item.patientWording}”</span>}
                </span>
              </label>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function GroundTruthPreview({ items, additionalNotes }: { items: GroundTruthItem[]; additionalNotes: string }) {
  if (items.length === 0 && !additionalNotes.trim()) return <div className="empty-state">Nothing has been marked as spoken yet.</div>;
  const grouped = items.reduce<Record<string, GroundTruthItem[]>>((acc, item) => {
    (acc[item.domain] ??= []).push(item);
    return acc;
  }, {});

  return (
    <div className="preview-grid">
      {Object.entries(grouped).map(([domain, domainItems]) => (
        <div className="preview-group" key={domain}>
          <h3>{domain}</h3>
          <ul>{domainItems.map((item) => <li key={item.id}>{item.label}</li>)}</ul>
        </div>
      ))}
      {additionalNotes.trim() && <div className="preview-group"><h3>Additional spoken information</h3><p>{additionalNotes}</p></div>}
    </div>
  );
}

export default App;
