import { useMemo, useState } from "react";
import type { GroundTruthExport } from "../utils/json";
import { mockValidationProvider } from "./mockValidator";
import {
  FIRSTNET_COMPONENTS,
  type AvtComponentContent,
  type FirstNetComponent,
  type ValidationResult
} from "./types";
import "./validator.css";

const emptyAvtOutput = Object.fromEntries(
  FIRSTNET_COMPONENTS.map((component) => [component, ""])
) as AvtComponentContent;

type Props = {
  onBack: () => void;
};

export default function ValidatorPage({ onBack }: Props) {
  const [groundTruth, setGroundTruth] = useState<GroundTruthExport | null>(null);
  const [groundTruthFileName, setGroundTruthFileName] = useState("");
  const [avtOutput, setAvtOutput] = useState<AvtComponentContent>(emptyAvtOutput);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [error, setError] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  const completedComponents = useMemo(
    () => FIRSTNET_COMPONENTS.filter((component) => avtOutput[component].trim()).length,
    [avtOutput]
  );

  const handleGroundTruthUpload = async (file?: File) => {
    if (!file) return;
    setError("");
    setResult(null);

    try {
      const parsed = JSON.parse(await file.text()) as GroundTruthExport;
      if (
        parsed.schemaVersion !== "1.0" ||
        !parsed.scenario?.id ||
        !Array.isArray(parsed.facts)
      ) {
        throw new Error("This does not look like a Ground Truth Runner JSON file.");
      }
      setGroundTruth(parsed);
      setGroundTruthFileName(file.name);
    } catch (uploadError) {
      setGroundTruth(null);
      setGroundTruthFileName("");
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Unable to read the ground truth file."
      );
    }
  };

  const updateComponent = (component: FirstNetComponent, value: string) => {
    setAvtOutput((current) => ({ ...current, [component]: value }));
    setResult(null);
  };

  const validate = async () => {
    if (!groundTruth) {
      setError("Upload the ground truth JSON file first.");
      return;
    }

    if (completedComponents === 0) {
      setError("Paste at least one AVT component before validating.");
      return;
    }

    setError("");
    setIsValidating(true);
    try {
      const nextResult = await mockValidationProvider.validate(groundTruth, avtOutput);
      setResult(nextResult);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <main className="shell validator-shell">
      <header className="topbar">
        <div>
          <button className="link-button" onClick={onBack}>
            ← Back to home
          </button>
          <div className="topbar-title">AVT validation</div>
        </div>
        <div className="role-badge">Validator MVP</div>
      </header>

      <section className="panel validator-intro">
        <div className="eyebrow">Synthetic testing workflow</div>
        <h1>Validate AVT output</h1>
        <p className="lead">
          Upload the machine-readable ground truth, then paste the AVT output into the same
          FirstNet components it was generated in.
        </p>
        <div className="notice">
          <strong>Prototype comparison only.</strong> The current Validate button uses a simple
          exact-text mock provider so the workflow can be tested before a real LLM is connected.
        </div>
      </section>

      <section className="panel validator-source-card">
        <div className="eyebrow">1 · Ground truth</div>
        <h2>Upload ground truth JSON</h2>
        <p className="section-intro">
          Use the JSON downloaded from the Patient / Ground Truth workflow. Keep the PDF alongside
          it for manual checking.
        </p>
        <label className="file-upload">
          <input
            type="file"
            accept="application/json,.json"
            onChange={(event) => handleGroundTruthUpload(event.target.files?.[0])}
          />
          <span>{groundTruthFileName || "Choose ground truth JSON"}</span>
        </label>
        {groundTruth && (
          <div className="loaded-source">
            <strong>{groundTruth.scenario.id} · {groundTruth.scenario.title}</strong>
            <span>{groundTruth.facts.length} spoken facts loaded</span>
          </div>
        )}
      </section>

      <section className="validator-workspace">
        <aside className="component-nav panel">
          <div className="eyebrow">2 · AVT record</div>
          <h3>FirstNet components</h3>
          <p className="subtle">Paste each writer block into the matching component.</p>
          <div className="component-nav-list">
            {FIRSTNET_COMPONENTS.map((component) => (
              <a href={`#${slugify(component)}`} key={component}>
                <span className={avtOutput[component].trim() ? "status-dot filled" : "status-dot"} />
                {component}
              </a>
            ))}
          </div>
          <div className="component-count">
            {completedComponents} / {FIRSTNET_COMPONENTS.length} components pasted
          </div>
        </aside>

        <div className="writer-blocks">
          {FIRSTNET_COMPONENTS.map((component) => (
            <section className="writer-block" id={slugify(component)} key={component}>
              <div className="writer-block-header">
                <strong>{component}</strong>
                <span>{avtOutput[component].trim() ? "Pasted" : "Empty"}</span>
              </div>
              <textarea
                value={avtOutput[component]}
                onChange={(event) => updateComponent(component, event.target.value)}
                placeholder={`Paste the AVT ${component} writer block here...`}
                rows={8}
              />
            </section>
          ))}

          {error && <div className="validator-error">{error}</div>}

          <button
            className="primary-button validate-button"
            onClick={validate}
            disabled={isValidating}
          >
            {isValidating ? "Validating…" : "Validate AVT output"}
          </button>
        </div>
      </section>

      {result && <FindingsResult result={result} />}
    </main>
  );
}

function FindingsResult({ result }: { result: ValidationResult }) {
  return (
    <section className="panel findings-panel">
      <div className="eyebrow">3 · Findings</div>
      <h2>Validation findings</h2>
      <div className="finding-stats">
        <div><strong>{result.sourceFacts}</strong><span>Source facts</span></div>
        <div><strong>{result.correctFacts}</strong><span>Exact matches</span></div>
        <div><strong>{result.findings.length}</strong><span>Proposed findings</span></div>
      </div>

      {result.findings.length === 0 ? (
        <div className="empty-state">No findings generated by the current mock provider.</div>
      ) : (
        <div className="findings-table-wrap">
          <table className="findings-table">
            <thead>
              <tr>
                <th>Component</th>
                <th>Category</th>
                <th>AVT documented</th>
                <th>Source says</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {result.findings.map((finding) => (
                <tr key={finding.id}>
                  <td>{finding.component}</td>
                  <td><span className="category-pill">{finding.category}</span></td>
                  <td>{finding.avtText || "—"}</td>
                  <td>{finding.sourceText || "—"}</td>
                  <td>{finding.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
