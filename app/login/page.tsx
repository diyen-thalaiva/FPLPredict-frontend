"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [managerId, setManagerId] = useState("");
  const [existingId, setExistingId] = useState<string | null>(null);
  const [teamName, setTeamName] = useState<string | null>(null); 
  const [isLoading, setIsLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  
  // Modal State
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    // Check if a team is already synced
    const savedId = localStorage.getItem("fpl_manager_id");
    const cachedName = localStorage.getItem("fpl_team_name");
    if (savedId) {
      setExistingId(savedId);
      if (cachedName) {
        setTeamName(cachedName);
      }
      // Fetch the Team Name using the FPL API
      fetch(`https://fplpredict-backend.onrender.com/manager/${savedId}/prediction`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.team_name) {
            setTeamName(data.team_name);
            localStorage.setItem("fpl_team_name", data.team_name);
          }
        })
        .catch((err) => {
          console.error("Error fetching team name:", err);
          if (!cachedName) setTeamName("Unknown Team");
        });
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!managerId) return;
    setIsLoading(true);
    localStorage.setItem("fpl_manager_id", managerId);
    setTimeout(() => router.push("/prediction"), 800);
  };

  const handleReset = () => {
    localStorage.removeItem("fpl_manager_id");
    localStorage.removeItem("fpl_team_name");
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith("planner_")) localStorage.removeItem(key);
    });
    setExistingId(null);
    setTeamName(null); 
    setManagerId("");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --dark: #02110c;
          --card: #05211a;
          --green: #00f76e;
          --green-dim: rgba(0, 247, 110, 0.15);
          --green-border: rgba(0, 247, 110, 0.3);
          --green-glow: rgba(0, 247, 110, 0.12);
          --text: #e8fff2;
          --text-muted: rgba(232, 255, 242, 0.45);
          --text-faint: rgba(232, 255, 242, 0.2);
          --red: #ff4b4b;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          background: var(--dark);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .login-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(0,247,110,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,247,110,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 100%);
        }

        .glow-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
        }
        .glow-blob-1 {
          width: 400px; height: 400px;
          top: -100px; left: -100px;
          background: rgba(0, 247, 110, 0.07);
        }
        .glow-blob-2 {
          width: 300px; height: 300px;
          bottom: -80px; right: -80px;
          background: rgba(0, 180, 80, 0.08);
        }

        .login-card {
          position: relative;
          width: 100%;
          max-width: 420px;
          margin: 1.5rem;
          background: var(--card);
          border: 1px solid var(--green-border);
          border-radius: 20px;
          padding: 2.5rem 2.5rem 2rem;
          box-shadow:
            0 0 0 1px rgba(0,247,110,0.05),
            0 24px 64px rgba(0,0,0,0.6),
            inset 0 1px 0 rgba(0,247,110,0.1);
          animation: cardIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .card-corner {
          position: absolute;
          top: -1px; right: -1px;
          width: 60px; height: 60px;
          border-top: 2px solid var(--green);
          border-right: 2px solid var(--green);
          border-radius: 0 20px 0 0;
          opacity: 0.6;
        }

        .login-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 4rem;
          line-height: 0.9;
          color: var(--text);
          letter-spacing: 0.02em;
          margin-bottom: 0.4rem;
        }

        .login-subtitle {
          color: var(--text-muted);
          font-size: 0.85rem;
          font-weight: 300;
          letter-spacing: 0.04em;
          margin-bottom: 2.2rem;
        }

        .synced-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 2rem;
          padding: 0 0.5rem;
        }
        .synced-stat-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 4px;
        }
        .synced-stat-value {
          font-family: 'DM Sans', sans-serif;
          font-size: 1.1rem;
          font-weight: 500;
          color: var(--text);
        }

        .reset-box {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
        }
        .reset-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem;
          font-weight: 500;
          color: var(--text);
          margin-bottom: 0.5rem;
        }
        .reset-warning {
          font-size: 0.75rem;
          color: var(--text-muted);
          line-height: 1.4;
          margin-bottom: 1.5rem;
        }

        .form-group { margin-bottom: 2rem; }

        .form-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--green);
          margin-bottom: 8px;
          font-weight: 500;
        }

        .form-label-num {
          display: inline-flex;
          width: 16px; height: 16px;
          align-items: center;
          justify-content: center;
          background: var(--green-dim);
          border-radius: 4px;
          color: var(--green);
          font-size: 9px;
        }

        .form-input {
          width: 100%;
          padding: 12px 16px;
          background: var(--dark);
          border: 1px solid var(--green-border);
          border-radius: 10px;
          color: var(--text);
          font-family: 'DM Mono', monospace;
          font-size: 1rem;
          transition: border-color 250ms, box-shadow 250ms;
          outline: none;
        }

        .form-input:focus {
          border-color: var(--green);
          box-shadow: 0 0 0 3px rgba(0,247,110,0.1), 0 0 16px rgba(0,247,110,0.08);
        }

        .login-btn {
          width: 100%;
          margin-top: 0.5rem;
          padding: 14px 2em;
          background: transparent;
          border: 1.5px solid var(--green);
          border-radius: 10px;
          color: var(--green);
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.2rem;
          letter-spacing: 0.12em;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: color 300ms, border-color 300ms;
        }

        .login-btn.btn-reset {
          border-color: #5d5dff;
          color: #5d5dff;
        }
        .login-btn.btn-reset::before, .login-btn.btn-reset::after {
          background: #5d5dff;
        }

        .login-btn span { position: relative; z-index: 1; display: flex; align-items: center; justify-content: center; gap: 8px; }

        .login-btn::before, .login-btn::after {
          content: ''; position: absolute; width: 10em; aspect-ratio: 1; background: var(--green); opacity: 0.5; border-radius: 50%; transition: transform 500ms, background 300ms;
        }
        .login-btn::before { left: 0; transform: translateX(-9em); }
        .login-btn::after { right: 0; transform: translateX(9em); }
        .login-btn:hover { color: var(--dark); border-color: inherit; }
        .login-btn:hover::before { transform: translateX(-1.5em); }
        .login-btn:hover::after { transform: translateX(1.5em); }

        .spinner { width: 14px; height: 14px; border: 2px solid rgba(2, 17, 12, 0.3); border-top-color: var(--dark); border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .login-footer { margin-top: 1.8rem; display: flex; align-items: center; gap: 10px; }
        .footer-line { flex: 1; height: 1px; background: var(--green-border); }
        .footer-text { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-faint); white-space: nowrap; }

        /* MODAL STYLES */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(2, 17, 12, 0.9);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1.5rem;
          animation: modalFade 0.25s ease-out;
        }
        .modal-content {
          background: var(--card);
          border: 1px solid var(--green-border);
          border-radius: 20px;
          width: 100%;
          max-width: 440px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 32px 64px rgba(0,0,0,0.6);
        }
        .modal-header {
          padding: 1.25rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--green-border);
          background: rgba(0, 247, 110, 0.03);
        }
        .modal-header h3 {
          font-family: 'DM Sans', sans-serif;
          color: var(--green);
          font-size: 1rem;
          font-weight: 500;
          letter-spacing: 0.05em;
        }
        .modal-body {
          padding: 1.5rem;
          font-family: 'DM Sans', sans-serif;
          color: var(--text);
          font-size: 0.9rem;
          line-height: 1.6;
        }
        .modal-step { margin-bottom: 1.25rem; }
        .modal-step b { 
          color: var(--green); 
          font-family: 'DM Mono', monospace; 
          font-size: 0.75rem; 
          display: block; 
          margin-bottom: 2px;
          opacity: 0.8;
        }
        .modal-url {
          background: var(--dark);
          padding: 12px;
          border-radius: 8px;
          border: 1px solid var(--green-border);
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          margin-top: 15px;
          word-break: break-all;
          color: var(--text-muted);
        }
        .modal-url u { color: var(--green); text-underline-offset: 3px; }
        
        @keyframes modalFade { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>

      <main className="login-root">
        <div className="glow-blob glow-blob-1" />
        <div className="glow-blob glow-blob-2" />

        {/* HELP MODAL */}
        {showHelp && (
          <div className="modal-overlay" onClick={() => setShowHelp(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Finding Your Team ID</h3>
                <button 
                   onClick={() => setShowHelp(false)}
                   style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '24px', cursor: 'pointer' }}
                >
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <div className="modal-step">
                  <b>STEP 1</b>
                  Visit <a href="https://fantasy.premierleague.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--green)', textDecoration: 'underline' }}>fantasy.premierleague.com</a> and login.
                </div>
                <div className="modal-step">
                  <b>STEP 2</b>
                  Click on the <strong>'Pick Team'</strong> tab.
                </div>
                <div className="modal-step">
                  <b>STEP 3</b>
                  Click on <strong>'Gameweek history'</strong> (bottom right on desktop).
                </div>
                <div className="modal-step">
                  <b>STEP 4</b>
                  Your ID is the number in the URL between 'entry/' and '/history'.
                </div>
                <div className="modal-url">
                  https://fantasy.premierleague.com/entry/<u>123456</u>/history
                </div>

                {/* YOUTUBE GUIDE BUTTON */}
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                  <a 
                    href="https://www.youtube.com/watch?v=yUfmhpNecTc" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 16px',
                      background: 'rgba(255, 0, 0, 0.1)',
                      border: '1px solid rgba(255, 0, 0, 0.3)',
                      borderRadius: '8px',
                      color: '#ff4b4b',
                      fontSize: '11px',
                      textDecoration: 'none',
                      fontFamily: 'DM Mono, monospace',
                      transition: 'all 0.2s ease',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                    </svg>
                    Watch Mobile Guide
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="login-card">
          <div className="card-corner" />

          {existingId ? (
            <>
              <div className="synced-header">
                <div>
                  <div className="synced-stat-label">Team ID</div>
                  <div className="synced-stat-value">{existingId}</div>
                  
                  <div className="synced-stat-label" style={{ marginTop: '12px' }}>Team Name</div>
                  <div className="synced-stat-value" style={{ color: 'var(--green)' }}>
                    {teamName ? teamName : "Fetching..."}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="synced-stat-label">Status</div>
                  <div className="synced-stat-value" style={{ color: 'var(--green)' }}>Synced</div>
                </div>
              </div>

              <div className="reset-box">
                <h2 className="reset-title">Change Team ID</h2>
                <p className="reset-warning">
                  Changing your synced Team ID will delete all stored data linked to your current team (incl. transfer plans).
                </p>
                
                <button onClick={handleReset} className="login-btn btn-reset">
                  <span>Reset Team ID</span>
                </button>
                
                <button 
                  onClick={() => router.push("/prediction")}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '1rem', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Keep current team and continue →
                </button>
              </div>
            </>
          ) : (
            <>
              <header>
                <h1 className="login-title">Login</h1>
                <p className="login-subtitle">Personalized AI Squad Analysis</p>
              </header>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">
                    <span className="form-label-num">01</span>
                    Manager ID
                  </label>
                  <input
                    type="number"
                    required
                    value={managerId}
                    onChange={(e) => setManagerId(e.target.value)}
                    onFocus={() => setFocused("manager")}
                    onBlur={() => setFocused(null)}
                    className="form-input"
                    placeholder="e.g. 8801835"
                    autoFocus
                  />
                  <button 
                    type="button"
                    onClick={() => setShowHelp(true)}
                    style={{ 
                      marginTop: '8px', 
                      background: 'none', 
                      border: 'none', 
                      fontSize: '11px', 
                      color: 'var(--green)', 
                      cursor: 'pointer', 
                      textDecoration: 'underline',
                      padding: 0,
                      fontStyle: 'italic',
                      opacity: 0.8
                    }}
                  >
                    How to find your Manager ID?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!managerId || isLoading}
                  className="login-btn"
                >
                  <span>
                    {isLoading ? (
                      <>
                        <span className="spinner" />
                        Analyzing Squad...
                      </>
                    ) : (
                      "View Predictions →"
                    )}
                  </span>
                </button>
              </form>
            </>
          )}

          <div className="login-footer">
            <div className="footer-line" />
            <span className="footer-text">Powered by XGBoost & FPL Live API</span>
            <div className="footer-line" />
          </div>
        </div>
      </main>
    </>
  );
}