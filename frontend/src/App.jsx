
import { useEffect, useMemo, useState } from "react";
import {
  Search, MapPin, BriefcaseBusiness, Bookmark,
  ArrowUpRight, Sparkles, GraduationCap, Clock3,
  SlidersHorizontal, Code2, Menu, X, RefreshCw
} from "lucide-react";
import "./App.css";

const API = "http://localhost:5000/api/opportunities";

function App() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
   const [saved, setSaved] = useState([]);
const [showSaved, setShowSaved] = useState(false);
 const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
const [authMode, setAuthMode] = useState("login");
const [authName, setAuthName] = useState("");
const [authEmail, setAuthEmail] = useState("");
const [authPassword, setAuthPassword] = useState("");
const [authLoading, setAuthLoading] = useState(false);
const [authError, setAuthError] = useState("");
const [showProfileMenu, setShowProfileMenu] = useState(false);

const [user, setUser] = useState(() => {
  return JSON.parse(localStorage.getItem("startupscout_user") || "null");
});

  useEffect(() => {
    async function loadJobs() { 
      try {
        setLoading(true);
        const response = await fetch(API);
        if (!response.ok) throw new Error("API request failed");

        const result = await response.json();
        setJobs(result.data || []);
        setError("");
      } catch {
        setError("Unable to connect to StartupScout server.");
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, []);

  
const handleAuth = async (e) => {
  e.preventDefault();
  setAuthError("");
  setAuthLoading(true);

  try {
    const endpoint =
      authMode === "login" ? "login" : "register";

    const response = await fetch(
      `http://localhost:5000/api/auth/${endpoint}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: authName,
          email: authEmail,
          password: authPassword
        })
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Authentication failed");
    }

    localStorage.setItem("startupscout_token", result.token);
    localStorage.setItem("startupscout_user", JSON.stringify(result.user));

    setUser(result.user);
    setShowAuth(false);
    setAuthName("");
    setAuthEmail("");
    setAuthPassword("");

    alert(result.message);

  } catch (error) {
    setAuthError(error.message);
  } finally {
    setAuthLoading(false);
  }
};

const handleLogout = () => {
  localStorage.removeItem("startupscout_token");
  localStorage.removeItem("startupscout_user");

  setUser(null);
  setSaved([]);
  setShowSaved(false);
  setShowAuth(false);

  alert("Logged out successfully!");
};

useEffect(() => {
  async function loadSavedJobs() {
    if (!user) {
      setSaved([]);
      return;
    }

    try {
      const token = localStorage.getItem("startupscout_token");

      const response = await fetch(
        "http://localhost:5000/api/saved-jobs",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      setSaved(
        (result.data || []).map(job =>
          Number(job.opportunity_id)
        )
      );
    } catch (error) {
      console.error("Load saved jobs:", error);
    }
  }

  loadSavedJobs();
}, [user]);
  
const filteredJobs = useMemo(() => {
  return jobs.filter((job) => {
    const text = `${job.title} ${job.company} ${(job.skills || []).join(" ")}`.toLowerCase();

    const matchesSearch = text.includes(search.toLowerCase());
    const matchesCategory = category === "All" || job.type === category;
    const matchesSaved = !showSaved || saved.includes(Number(job.dbId));

    return matchesSearch && matchesCategory && matchesSaved;
  });
}, [jobs, search, category, showSaved, saved]);


  const toggleSave = async (id) => {
  if (!user) {
    setAuthMode("login");
    setShowAuth(true);
    return;
  }

  const token = localStorage.getItem("startupscout_token");
  const opportunityId = Number(id);
  const isSaved = saved.includes(opportunityId);

  try {
    const response = await fetch(
      `http://localhost:5000/api/saved-jobs/${opportunityId}`,
      {
        method: isSaved ? "DELETE" : "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }

    setSaved(previous =>
      isSaved
        ? previous.filter(item => item !== opportunityId)
        : [...previous, opportunityId]
    );
  } catch (error) {
    alert(error.message);
  }
};

  return (
    <div className="app">
      <header className="navbar">
        <a className="brand" href="#">
          <span className="brand-icon"><Code2 size={22} /></span>
          <span>Startup<span className="brand-highlight">Scout</span></span>
          <span className="brand-dot">.</span>
        </a>

        <nav className={mobileMenu ? "nav-links open" : "nav-links"}>
          <a className="active" href="#discover">Discover</a>
          <a href="#opportunities">Opportunities</a>
          <a href="#about">About</a>
        </nav>

        <div className="nav-actions">
          <span className="live-status">
            <span className="live-dot"></span> Live discovery
          </span>
          <div className="profile-wrapper">
  <button
    className="profile-button"
    onClick={() => {
      if (user) {
        setShowProfileMenu(!showProfileMenu);
      } else {
        setAuthMode("login");
        setShowAuth(true);
      }
    }}
    title="Profile"
  >
    {user?.name?.charAt(0).toUpperCase() || "S"}
  </button>

  {user && showProfileMenu && (
    <div className="profile-dropdown">
      <p>{user.name}</p>
      <button
        onClick={() => {
          handleLogout();
          setShowProfileMenu(false);
        }}
      >
        Logout
      </button>
    </div>
  )}
</div>
        </div>

        <button className="menu-button" onClick={() => setMobileMenu(!mobileMenu)}>
          {mobileMenu ? <X /> : <Menu />}
        </button>
      </header>
      {showAuth && (
  <div className="auth-overlay">
    <div className="auth-modal">
      <button
        className="auth-close"
        onClick={() => setShowAuth(false)}
      >
        <X size={22} />
      </button>

      <div className="auth-logo">
        <Code2 size={25} />
      </div>

      <h2>
        {authMode === "login" ? "Welcome Back!" : "Create Account"}
      </h2>

      <p>
        {authMode === "login"
          ? "Login to continue your journey."
          : "Join StartupScout and discover opportunities."}
      </p>

      <form onSubmit={handleAuth}>
  {authMode === "signup" && (
    <input
      type="text"
      placeholder="Full Name"
      value={authName}
      onChange={(e) => setAuthName(e.target.value)}
      required
    />
  )}

  <input
    type="email"
    placeholder="Email Address"
    value={authEmail}
    onChange={(e) => setAuthEmail(e.target.value)}
    required
  />

  <input
    type="password"
    placeholder="Password"
    value={authPassword}
    onChange={(e) => setAuthPassword(e.target.value)}
    required
  />

  {authError && (
    <p style={{ color: "red" }}>{authError}</p>
  )}

  <button
    type="submit"
    className="auth-submit"
    disabled={authLoading}
  >
    {authLoading
      ? "Please wait..."
      : authMode === "login"
      ? "Login"
      : "Create Account"}
  </button>
</form>

      <div className="auth-switch">
        {authMode === "login"
          ? "Don't have an account?"
          : "Already have an account?"}

        <button
          onClick={() =>
            setAuthMode(authMode === "login" ? "signup" : "login")
          }
        >
          {authMode === "login" ? "Sign Up" : "Login"}
        </button>
      </div>
    </div>
  </div>
)}
      <main>
        <section className="hero" id="discover">
          <div className="hero-content">
            <div className="eyebrow">
              <Sparkles size={15} /> YOUR NEXT OPPORTUNITY STARTS HERE
            </div>

            <h1>
              Find opportunities.<br />
              <span>Build your future.</span>
            </h1>

            <p className="hero-description">
              Stop searching everywhere. Discover jobs and internships
              from multiple sources, all in one place.
            </p>

            <div className="search-box">
              <Search size={21} />
              <input
                type="text"
                placeholder="Search jobs, internships, skills..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button onClick={() => document.getElementById("opportunities")?.scrollIntoView({ behavior: "smooth" })}>
                Search <ArrowUpRight size={17} />
              </button>
            </div>

            <div className="popular">
              <span>Popular:</span>
              {["Python", "React", "AI/ML", "Remote"].map((item) => (
                <button key={item} onClick={() => setSearch(item)}>{item}</button>
              ))}
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-card">
              <div className="visual-top">
                <span className="visual-label">OPPORTUNITY MATCH</span>
                <Sparkles size={18} />
              </div>
              <div className="visual-score">92<span>%</span></div>
              <p>You're closer than you think.</p>
              <div className="score-line"><span></span></div>
              <div className="visual-bottom">
                <span>Python Developer Intern</span>
                <span className="match-tag">Strong match</span>
              </div>
            </div>
            <div className="floating-icon icon-one"><BriefcaseBusiness /></div>
            <div className="floating-icon icon-two"><GraduationCap /></div>
          </div>
        </section>

        <section className="stats">
          <div><strong>{jobs.length}+</strong><span>Opportunities loaded</span></div>
          <div><strong>Multiple</strong><span>Discovery sources</span></div>
          <div><strong>One place</strong><span>For your next move</span></div>
        </section>

        <section className="opportunities" id="opportunities">
          <div className="section-heading">
            <div>
              <div className="eyebrow"><Sparkles size={14} /> EXPLORE POSSIBILITIES</div>
              <h2>{showSaved ? "Your saved opportunities" : "Discover opportunities"}</h2>
              <p>Find something that matches your ambitions.</p>
            </div>
            <button className="refresh-button" onClick={() => window.location.reload()}>
              <RefreshCw size={16} /> Refresh
            </button>
          </div>

          <div className="filters">
            <div className="filter-label"><SlidersHorizontal size={17} /> Filter by</div>
            
{["All", "Internship", "Job"].map((item) => (
  <button
    key={item}
    className={!showSaved && category === item ? "filter active-filter" : "filter"}
    onClick={() => {
      setCategory(item);
      setShowSaved(false);
    }}
  >
    {item}
  </button>
))}

<button
  className={showSaved ? "filter active-filter" : "filter"}
  onClick={() => setShowSaved(!showSaved)}
>
  <Bookmark size={13} />
  Saved ({saved.length})
</button>
 
            <span className="result-count">{filteredJobs.length} results</span>
          </div>

          {loading ? (
            <div className="empty-state">Loading opportunities...</div>
          ) : error ? (
            <div className="empty-state error-state">
              {error}<br />Make sure your backend server is running on port 5000.
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="empty-state">No opportunities found. Try another search.</div>
          ) : (
            <div className="job-grid">
              {filteredJobs.map((job) => (
                <article className="job-card" key={job.id}>
                  <div className="card-top">
                    <div className="company-logo">
                      <BriefcaseBusiness size={23} />
                    </div>
                    <button
                      className={
                        saved.includes(Number(job.dbId))
                          ? "save-button saved"
                          : "save-button"
                      }
                      onClick={() => toggleSave(job.dbId)}
                      aria-label="Save opportunity"
                    >
                      <Bookmark
                        size={19}
                        fill={
                          saved.includes(Number(job.dbId))
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </button>
                  </div>

                  <div className="job-type">{job.type}</div>
                  <h3>{job.title}</h3>
                  <p className="company-name">{job.company}</p>

                  <div className="job-meta">
                    <span><MapPin size={15} /> {job.location}</span>
                    <span><Clock3 size={15} /> {job.type}</span>
                  </div>

                  <div className="skills">
                    {(job.skills || []).map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>

                  <div className="card-footer">
                    <span className="source">{job.source}</span>
                    <a href={job.url} target="_blank" rel="noopener noreferrer">
                      Apply Now <ArrowUpRight size={16} />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="bottom-cta" id="about">
          <div className="cta-icon"><GraduationCap size={28} /></div>
          <div>
            <h2>Your next opportunity is out there.</h2>
            <p>Let StartupScout help you find it.</p>
          </div>
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            Explore now <ArrowUpRight size={17} />
          </button>
        </section>
      </main>

      <footer>
        <a className="brand footer-brand" href="#">Startup<span className="brand-highlight">Scout</span>.</a>
        <p>Discover smarter. Apply faster. Grow further.</p>
        <span>© 2026 StartupScout</span>
      </footer>
    </div>
  );
}
export default App;
