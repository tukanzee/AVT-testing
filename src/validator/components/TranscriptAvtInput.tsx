import { TRANSCRIPT_AVT_SECTIONS, type TranscriptAvtSection } from "../workflowTypes";

type Props = {
  transcript: string;
  onTranscriptChange: (value: string) => void;
  avtSections: Record<TranscriptAvtSection, string>;
  onSectionChange: (section: TranscriptAvtSection, value: string) => void;
  onStart: () => void;
  disabled: boolean;
};

export default function TranscriptAvtInput(props: Props) {
  const uploadTranscript = async (file?: File) => {
    if (!file) return;
    props.onTranscriptChange(await file.text());
  };

  return (
    <div className="transcript-input-layout">
      <section className="panel input-panel">
        <div className="eyebrow">A · Finished transcript</div>
        <h2>Paste an attributed transcript</h2>
        <p className="section-intro">Speaker labels are preserved exactly as supplied. Use C:, P:, or P/C: at the start of each turn.</p>
        <textarea
          className="large-input"
          rows={18}
          value={props.transcript}
          onChange={(event) => props.onTranscriptChange(event.target.value)}
          placeholder={"C: What brought you in today?\nP: I've been vomiting since yesterday."}
        />
        <label className="file-upload compact-upload">
          <input type="file" accept="text/plain,.txt" onChange={(event) => uploadTranscript(event.target.files?.[0])} />
          Upload .txt transcript
        </label>
      </section>

      <section className="panel input-panel">
        <div className="eyebrow">B · AVT output</div>
        <h2>Enter the generated note</h2>
        <div className="avt-section-grid compact-sections">
          {TRANSCRIPT_AVT_SECTIONS.map((section) => (
            <label key={section}>
              <span>{section}</span>
              <textarea rows={4} value={props.avtSections[section]} onChange={(event) => props.onSectionChange(section, event.target.value)} />
            </label>
          ))}
        </div>
      </section>

      <div className="start-comparison-row">
        <span>Local comparison — transcript and AVT content are not uploaded.</span>
        <button className="primary-button" onClick={props.onStart} disabled={props.disabled}>Start comparison</button>
      </div>
    </div>
  );
}
