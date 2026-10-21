
import { useEffect, useState } from "react";
import {
  ShieldCheck,
  Siren,
  FileText,
  BrainCircuit,
  MapPin,
  User,
  AlertTriangle,
  CheckCircle2,
  LayoutDashboard,
  FileWarning,
  Activity,
  Clock3,
  ArrowUpRight,
  Sparkles
} from "lucide-react";
import "./App.css";
import { submitConcern, getConcerns } from "./services/api";

const defaultForm = {
  category: "bullying",
  description: "",
  location: "",
  urgency: "medium",
  reporterName: ""
};

const fallbackConcerns = [
  {
    _id: "demo-1",
    category: "bullying",
    description: "A child was threatened online by a classmate after school hours.",
    location: "School bus stop",
    urgency: "high",
    status: "pending",
    reporterName: "Anonymous",
    createdAt: new Date().toISOString()
  },
  {
    _id: "demo-2",
    category: "neglect",
    description: "A family member repeatedly left a child unsupervised at night.",
    location: "Home address",
    urgency: "critical",
    status: "under-review",
    reporterName: "Teacher",
    createdAt: new Date(Date.now() - 3600000).toISOString()
  }
];

const categoryLabels = {
  bullying: "Bullying",
  abuse: "Abuse",
  "online-safety": "Online Safety",
  "missing-child": "Missing Child",
  neglect: "Neglect",
  other: "Other"
};

function analyzeConcernText(text) {
  const normalized = text.toLowerCase();
  const keywords = {
    bullying: ["threat", "hurt", "harass", "tease", "bully", "attack"],
    abuse: ["abuse", "violence", "hurt", "fear", "unsafe", "assault"],
    "online-safety": ["online", "social media", "message", "phone", "chat", "instagram", "text"],
    neglect: ["alone", "unsupervised", "neglect", "unsafe", "ignored", "left alone"],
    "missing-child": ["missing", "lost", "gone", "disappeared", "cannot find"]
  };

  let bestMatch = "other";
  let highestScore = 0;

  Object.entries(keywords).forEach(([key, list]) => {
    const score = list.reduce((total, word) => total + (normalized.includes(word) ? 1 : 0), 0);
    if (score > highestScore) {
      highestScore = score;
      bestMatch = key;
    }
  });

  const urgencyScore = {
    critical: /emergency|urgent|hurt|missing|attack|danger|abuse/.test(normalized) ? 3 : 0,
    high: /threat|unsafe|alone|violence|bully|harass/.test(normalized) ? 2 : 0,
    medium: /worried|concern|strange|problem/.test(normalized) ? 1 : 0
  };

  const level = urgencyScore.critical
    ? "critical"
    : urgencyScore.high
      ? "high"
      : urgencyScore.medium
        ? "medium"
        : "low";

  const summary = `${categoryLabels[bestMatch]} risk detected with ${level} urgency.`;

  return {
    category: bestMatch,
    empathy: level === "critical" ? "Immediate attention recommended." : "This should be reviewed soon.",
    summary,
    level
  };
}

export default function App() {
  const [page, setPage] = useState("Home");
  const [form, setForm] = useState(defaultForm);
  const [concerns, setConcerns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    getConcerns()
      .then((data) => setConcerns(Array.isArray(data) ? data : fallbackConcerns))
      .catch(() => {
        setConcerns(fallbackConcerns);
        setError("Backend is offline. Showing demo concerns for preview.");
      });
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const payload = {
        ...form,
        reporterName: form.reporterName.trim() || "Anonymous"
      };

      const result = await submitConcern(payload);
      setForm(defaultForm);
      setMessage("Concern submitted successfully. A case has been created.");
      setConcerns((current) => [result.concern, ...current].slice(0, 6));
      setPage("Home");
    } catch (submitError) {
      setError(submitError.message || "Unable to submit concern right now.");
    } finally {
      setLoading(false);
    }
  }

  function runAnalysis() {
    const result = analyzeConcernText(form.description || "A child was threatened online by a classmate.");
    setAnalysis(result);
    setPage("AI Analysis");
  }

  const openCases = concerns.filter((concern) => concern.status !== "resolved").length;
  const urgentCases = concerns.filter((concern) => ["high", "critical"].includes(concern.urgency)).length;
  const resolvedCases = concerns.filter((concern) => concern.status === "resolved").length;
  const navigation = [
    { label: "Home", icon: LayoutDashboard },
    { label: "Report Concern", icon: FileWarning },
    { label: "SOS Emergency", icon: Siren },
    { label: "AI Analysis", icon: BrainCircuit }
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <ShieldCheck size={28} />
          <div>
            <h2>SafeChild AI</h2>
            <p>Child Safety Platform</p>
          </div>
        </div>

        <div className="nav-label">WORKSPACE</div>
        <nav className="sidebar-nav" aria-label="Main navigation">
          {navigation.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={page === label ? 'nav-button active' : 'nav-button'}
              onClick={() => setPage(label)}
              type="button"
            >
              <Icon size={18} />
              <span>{label}</span>
              {page === label && <span className="nav-indicator" />}
            </button>
          ))}
        </nav>

        <div className="sidebar-note">
          <span className="online-dot" />
          <div><strong>Safety workspace</strong><small>Ready to support</small></div>
        </div>
      </aside>

      <main className="main-panel">
        <header className="page-header">
          <span>CHILD SAFETY & PROTECTION</span>
          <h1>{page}</h1>
          <p>A safer environment starts with listening, documenting, and responding.</p>
        </header>

        {message && <div className="status success">{message}</div>}
        {error && <div className="status danger">{error}</div>}

        {page === 'Home' && (
          <section className="dashboard-content">
            <div className="welcome-banner">
              <div className="welcome-copy">
                <span className="welcome-kicker"><Sparkles size={14} /> A calmer way to stay attentive</span>
                <h2>Every concern deserves<br />a thoughtful response.</h2>
                <p>Bring reports together, notice what needs attention, and help keep children safer.</p>
                <button type="button" className="welcome-action" onClick={() => setPage('Report Concern')}>
                  Create a report <ArrowUpRight size={16} />
                </button>
              </div>
              <div className="welcome-visual" aria-hidden="true">
                <div className="visual-frame frame-one" />
                <div className="visual-frame frame-two" />
                <div className="visual-shield"><ShieldCheck size={50} strokeWidth={1.5} /></div>
                <span className="visual-spark spark-one" />
                <span className="visual-spark spark-two" />
              </div>
              <div className="banner-index">01 <span>/ 03</span></div>
            </div>

            <div className="section-heading">
              <div><span className="section-overline">YOUR OVERVIEW</span><h2>Cases at a glance</h2></div>
              <span className="updated-label"><span className="online-dot" /> Live case data</span>
            </div>

            <div className="stats-grid">
              <article className="stat-card stat-open">
                <div className="stat-icon"><FileText size={19} /></div>
                <span>Open cases</span><strong>{openCases}</strong>
                <small>Awaiting follow-up</small>
              </article>
              <article className="stat-card stat-urgent">
                <div className="stat-icon"><AlertTriangle size={19} /></div>
                <span>Needs attention</span><strong>{urgentCases}</strong>
                <small>High or critical urgency</small>
              </article>
              <article className="stat-card stat-resolved">
                <div className="stat-icon"><CheckCircle2 size={19} /></div>
                <span>Resolved</span><strong>{resolvedCases}</strong>
                <small>Cases marked complete</small>
              </article>
            </div>

            <div className="dashboard-lower">
              <section className="recent-panel">
                <div className="section-heading compact-heading">
                  <div><span className="section-overline">LATEST UPDATES</span><h2>Recent reports</h2></div>
                  <button type="button" className="text-action" onClick={() => setPage('Report Concern')}>View reports <ArrowUpRight size={15} /></button>
                </div>
                {concerns.length === 0 ? (
                  <div className="empty-reports"><FileWarning size={21} /><p>No reports yet. New concerns will appear here.</p></div>
                ) : (
                  <ul className="recent-list">
                    {concerns.slice(0, 3).map((concern) => (
                      <li key={concern._id || `${concern.category}-${concern.createdAt}`}>
                        <span className={`case-mark urgency-${concern.urgency}`}><FileWarning size={17} /></span>
                        <div className="case-copy"><strong>{categoryLabels[concern.category] || concern.category}</strong><small>{concern.location || 'Location not provided'}</small></div>
                        <span className={`urgency-label urgency-text-${concern.urgency}`}>{concern.urgency}</span>
                        <time><Clock3 size={13} /> {concern.createdAt ? new Date(concern.createdAt).toLocaleDateString() : 'Today'}</time>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <aside className="quick-panel">
                <div className="quick-panel-icon"><Activity size={19} /></div>
                <span className="section-overline">QUICK ACCESS</span>
                <h3>Need help prioritizing?</h3>
                <p>Review a concern with the AI triage preview before deciding next steps.</p>
                <button type="button" onClick={runAnalysis}>Open AI review <ArrowUpRight size={15} /></button>
              </aside>
            </div>
          </section>
        )}

        {page === 'Report Concern' && (
          <section className="panel">
            <h2>Report a Safety Concern</h2>
            <form className="report-form" onSubmit={handleSubmit}>
              <div className="input-row">
                <label>
                  <span>Category</span>
                  <select name="category" value={form.category} onChange={handleChange}>
                    <option value="bullying">Bullying</option>
                    <option value="abuse">Abuse</option>
                    <option value="online-safety">Online Safety</option>
                    <option value="missing-child">Missing Child</option>
                    <option value="neglect">Neglect</option>
                    <option value="other">Other</option>
                  </select>
                </label>

                <label>
                  <span>Urgency</span>
                  <select name="urgency" value={form.urgency} onChange={handleChange}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </label>
              </div>

              <label>
                <span>Reporter Name</span>
                <div className="icon-input">
                  <User size={18} />
                  <input
                    type="text"
                    name="reporterName"
                    placeholder="Optional name or Anonymous"
                    value={form.reporterName}
                    onChange={handleChange}
                  />
                </div>
              </label>

              <label>
                <span>Location</span>
                <div className="icon-input">
                  <MapPin size={18} />
                  <input
                    type="text"
                    name="location"
                    placeholder="School, home, park, online platform"
                    value={form.location}
                    onChange={handleChange}
                  />
                </div>
              </label>

              <label>
                <span>Description</span>
                <textarea
                  name="description"
                  rows="6"
                  placeholder="Describe what happened, where it happened, and any immediate concerns."
                  value={form.description}
                  onChange={handleChange}
                  required
                  maxLength={3000}
                />
                <span className="character-count">{form.description.length} / 3000</span>
              </label>

              <div className="form-actions">
                <button type="button" className="secondary" onClick={runAnalysis}>Run AI Review</button>
                <button type="submit" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Concern'}
                </button>
              </div>
            </form>

            <div className="list-box">
              <h3>Recent Cases</h3>
              {concerns.length === 0 ? (
                <p>No concerns yet.</p>
              ) : (
                <ul>
                  {concerns.slice(0, 5).map((concern) => (
                    <li key={concern._id || `${concern.category}-${concern.createdAt}`}>
                      <strong>{categoryLabels[concern.category] || concern.category}</strong>
                      <span>{concern.urgency}</span>
                      <small>{concern.location || 'Location not provided'}</small>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}

        {page === 'SOS Emergency' && (
          <section className="panel emergency-panel">
            <h2>Emergency Assistance</h2>
            <div className="alert-box">
              <AlertTriangle />
              <div>
                <h3>Immediate response checklist</h3>
                <ol>
                  <li>Call emergency services if the child is in immediate danger.</li>
                  <li>Move the child to a safe place and keep them with trusted adults.</li>
                  <li>Contact the designated guardian or school safety officer.</li>
                  <li>Document time, location, and details for follow-up.</li>
                </ol>
              </div>
            </div>
            <button type="button" className="sos-button" onClick={() => setMessage('Emergency protocol started. Contact local authorities and move to safety immediately.')}>Trigger Emergency Workflow</button>
          </section>
        )}

        {page === 'AI Analysis' && (
          <section className="panel ai-panel">
            <h2>AI-Powered Safety Analysis</h2>
            <p className="muted">Smart triage model preview based on text signal detection.</p>
            {analysis ? (
              <div className="ai-result">
                <div className="ai-badge">{analysis.level.toUpperCase()}</div>
                <h3>{analysis.summary}</h3>
                <p>{analysis.empathy}</p>
                <div className="risk-tags">
                  <span>{categoryLabels[analysis.category] || analysis.category}</span>
                  <span>{analysis.level}</span>
                </div>
              </div>
            ) : (
              <div className="empty-analysis">
                <CheckCircle2 />
                <p>Use the report form to review a concern and trigger AI classification.</p>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
