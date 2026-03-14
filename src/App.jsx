import { useState, useEffect } from "react";

// ─── SUPABASE CONFIG ──────────────────────────────────────────────────────────
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL  = "https://bkbpsobvhxxvlzlmzsmy.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrYnBzb2J2aHh4dmx6bG16c215Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0NzQ4MTUsImV4cCI6MjA4OTA1MDgxNX0.PLJyaouYk4FLfcZwVy_YsKMmny2a6DqrYOn_3jmpgMI";

const _sb = createClient(SUPABASE_URL, SUPABASE_ANON);
function getSb() { return Promise.resolve(_sb); }

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const RIDES = [
  { id: "family",  label: "Family",  icon: "🚗", price: "CA$8-11",  fare: 9.40  },
  { id: "friends", label: "Friends", icon: "🚐", price: "CA$18-24", fare: 21.50 },
];
const BLUE  = "#2563eb";
const DARK  = "#0f172a";
const GREEN = "#22c55e";

// ─── GLOBAL STYLES ─────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; margin: 0; padding: 0; }
  @keyframes spin    { to { transform: rotate(360deg); } }
  @keyframes fadeUp  { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pulse   { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
  @keyframes bounce  { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }
  .fade { animation: fadeUp 0.2s ease; }
  input, button, textarea { font-family: 'DM Sans', sans-serif; }
  input::placeholder { color: #94a3b8; }
`;

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
function Shell({ bg, children }) {
  return (
    <div style={{ width: "100%", minHeight: "100vh", background: bg || "#f8fafc", fontFamily: "'DM Sans', sans-serif", position: "relative", overflowX: "hidden" }}>
      <style>{STYLES}</style>
      {children}
    </div>
  );
}

function TopBar({ title, onBack, right }) {
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "14px 18px", background: "#fff", borderBottom: "1px solid #e2e8f0", gap: 10, position: "sticky", top: 0, zIndex: 10 }}>
      {onBack && (
        <button onClick={onBack} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: BLUE, lineHeight: 1, padding: "0 2px" }}>
          {"‹"}
        </button>
      )}
      <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: DARK, flex: 1 }}>{title}</span>
      {right || null}
    </div>
  );
}

function PrimaryBtn({ onClick, children, disabled, variant }) {
  const isSecondary = variant === "secondary";
  const isGreen     = variant === "green";
  return (
    <button onClick={onClick} disabled={!!disabled} style={{
      width: "100%", padding: "14px", borderRadius: 12, fontFamily: "'Syne', sans-serif",
      fontWeight: 700, fontSize: 15, cursor: disabled ? "not-allowed" : "pointer", border: "none",
      background: disabled ? "#e2e8f0" : isSecondary ? "transparent" : isGreen ? GREEN : BLUE,
      color: disabled ? "#94a3b8" : isSecondary ? BLUE : "#fff",
      outline: isSecondary ? "1.5px solid " + BLUE : "none",
    }}>
      {children}
    </button>
  );
}

function Field({ label, value, onChange, type, placeholder, min }) {
  return (
    <div style={{ marginBottom: 13 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 5 }}>{label}</div>
      <input value={value} onChange={onChange} type={type || "text"} placeholder={placeholder || ""} min={min}
        style={{ width: "100%", padding: "11px 13px", borderRadius: 10, border: "1.5px solid #bfdbfe", background: "#eff6ff", fontSize: 14, color: DARK, outline: "none" }} />
    </div>
  );
}

function Err({ msg }) {
  if (!msg) return null;
  return <div style={{ color: "#ef4444", fontSize: 12, marginBottom: 10, textAlign: "center", padding: "6px 12px", background: "#fef2f2", borderRadius: 8 }}>{msg}</div>;
}

function Load() {
  return <div style={{ width: 22, height: 22, border: "3px solid #bfdbfe", borderTopColor: BLUE, borderRadius: "50%", animation: "spin 0.75s linear infinite", margin: "0 auto" }} />;
}

function Avatar({ letter, color }) {
  return (
    <div style={{ width: 44, height: 44, borderRadius: "50%", background: color || BLUE, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18 }}>
      {letter}
    </div>
  );
}

// ─── BOTTOM NAVS ──────────────────────────────────────────────────────────────
function RiderNav({ tab, onTab }) {
  const items = [["home","🏠","Home"],["trips","🗺️","Trips"],["account","👤","Me"]];
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid #e2e8f0", display: "flex", paddingBottom: 8 }}>
      {items.map(([id, icon, label]) => (
        <button key={id} onClick={() => onTab(id)} style={{ flex: 1, background: "none", border: "none", cursor: "pointer", padding: "8px 0 4px", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
          <span style={{ fontSize: 20 }}>{icon}</span>
          <span style={{ fontSize: 10, fontWeight: tab === id ? 700 : 400, color: tab === id ? BLUE : "#94a3b8" }}>{label}</span>
        </button>
      ))}
    </div>
  );
}

function DriverNav({ tab, onTab }) {
  const items = [["home","🏠","Home"],["earnings","💰","Earnings"],["account","👤","Me"]];
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid #e2e8f0", display: "flex", paddingBottom: 8 }}>
      {items.map(([id, icon, label]) => (
        <button key={id} onClick={() => onTab(id)} style={{ flex: 1, background: "none", border: "none", cursor: "pointer", padding: "8px 0 4px", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
          <span style={{ fontSize: 20 }}>{icon}</span>
          <span style={{ fontSize: 10, fontWeight: tab === id ? 700 : 400, color: tab === id ? GREEN : "#94a3b8" }}>{label}</span>
        </button>
      ))}
    </div>
  );
}

// ─── RIDER APP ────────────────────────────────────────────────────────────────
function RiderApp() {
  const [scr, setScr]       = useState("splash");
  const [tab, setTab]       = useState("home");
  const [user, setUser]     = useState(null);
  const [email, setEmail]   = useState("");
  const [pass, setPass]     = useState("");
  const [name, setName]     = useState("");
  const [phone, setPhone]   = useState("");
  const [pc, setPc]         = useState("");
  const [err, setErr]       = useState("");
  const [busy, setBusy]     = useState(false);
  const [ride, setRide]     = useState("family");
  const [dest, setDest]     = useState("");
  const [finding, setFinding] = useState(false);
  const [tripHistory, setTripHistory] = useState([]);

  const go = (s) => { setErr(""); setScr(s); };

  useEffect(() => {
    getSb().then(client => client.auth.getSession()).then(({ data }) => {
      if (data.session) { setUser(data.session.user); go("dash"); }
      else setTimeout(() => go("login"), 1600);
    }).catch(() => setTimeout(() => go("login"), 1600));
  }, []);

  async function doLogin() {
    if (!email || !pass) { setErr("Email and password required"); return; }
    setBusy(true); setErr("");
    try {
      const client = await getSb();
      const { data, error } = await client.auth.signInWithPassword({ email, password: pass });
      if (error) throw error;
      setUser(data.user);
      go("dash");
    } catch(e) { setErr(e.message || "Login failed"); }
    finally { setBusy(false); }
  }

  async function doRegister() {
    if (!name || !email || !pass) { setErr("Please fill in all fields"); return; }
    if (pass !== pc) { setErr("Passwords do not match"); return; }
    if (pass.length < 8) { setErr("Password needs 8+ characters"); return; }
    setBusy(true); setErr("");
    try {
      const client = await getSb();
      const { data, error } = await client.auth.signUp({ email, password: pass, options: { data: { name, role: "rider" } } });
      if (error) throw error;
      await client.from("riders").insert({ id: data.user.id, name, email, phone: phone || null });
      setUser(data.user);
      go("dash");
    } catch(e) { setErr(e.message || "Registration failed"); }
    finally { setBusy(false); }
  }

  async function doLogout() {
    const client = await getSb();
    await client.auth.signOut();
    setUser(null); setEmail(""); setPass(""); go("login");
  }

  function bookRide() {
    if (!dest.trim()) { setErr("Where are you going?"); return; }
    const chosen = RIDES.find(r => r.id === ride);
    setFinding(true);
    setTimeout(() => {
      setFinding(false);
      setTripHistory(h => [{ id: Date.now(), dest, type: chosen.label, fare: "CA$" + chosen.fare.toFixed(2), date: new Date().toLocaleDateString("en-CA") }, ...h]);
      setDest("");
      setErr("");
    }, 3500);
  }

  // SPLASH
  if (scr === "splash") return (
    <Shell bg={DARK}>
      <div className="fade" style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
        <div style={{ fontSize: 56 }}>🚗</div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 38, color: "#fff", letterSpacing: -1 }}>ZeezRyde</div>
        <div style={{ color: "#475569", fontSize: 13 }}>Your ride, on demand</div>
        <div style={{ marginTop: 24, animation: "pulse 1.2s ease infinite" }}><Load /></div>
      </div>
    </Shell>
  );

  // LOGIN
  if (scr === "login") return (
    <Shell>
      <div className="fade" style={{ padding: "52px 24px 24px" }}>
        <div style={{ marginBottom: 30, textAlign: "center" }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 30, color: DARK }}>Welcome back</div>
          <div style={{ color: "#64748b", fontSize: 13, marginTop: 5 }}>Sign in to your rider account</div>
        </div>
        <Field label="Email" value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@email.com" />
        <Field label="Password" value={pass} onChange={e => setPass(e.target.value)} type="password" placeholder="Your password" />
        <Err msg={err} />
        <div style={{ marginTop: 6 }}>
          {busy ? <Load /> : <PrimaryBtn onClick={doLogin}>Sign In</PrimaryBtn>}
        </div>
        <p style={{ textAlign: "center", marginTop: 18, fontSize: 13, color: "#64748b" }}>
          New rider?{" "}
          <span onClick={() => go("register")} style={{ color: BLUE, fontWeight: 700, cursor: "pointer" }}>Create account</span>
        </p>
      </div>
    </Shell>
  );

  // REGISTER
  if (scr === "register") return (
    <Shell>
      <TopBar title="Create Account" onBack={() => go("login")} />
      <div className="fade" style={{ padding: "20px 24px 100px" }}>
        <Field label="Full Name" value={name} onChange={e => setName(e.target.value)} placeholder="Alex Smith" />
        <Field label="Email" value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@email.com" />
        <Field label="Phone" value={phone} onChange={e => setPhone(e.target.value)} type="tel" placeholder="+1 905 000 0000" />
        <Field label="Password" value={pass} onChange={e => setPass(e.target.value)} type="password" placeholder="Min 8 characters" />
        <Field label="Confirm Password" value={pc} onChange={e => setPc(e.target.value)} type="password" placeholder="Re-enter password" />
        <Err msg={err} />
        {busy ? <Load /> : <PrimaryBtn onClick={doRegister}>Create Account</PrimaryBtn>}
      </div>
    </Shell>
  );

  // DASHBOARD
  if (scr === "dash") {
    const displayName = user?.user_metadata?.name || name || "Rider";
    const chosen = RIDES.find(r => r.id === ride);
    return (
      <Shell>
        {/* Header */}
        {tab === "home" && (
          <div style={{ background: DARK, padding: "20px 20px 28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ color: "#475569", fontSize: 12 }}>Good to see you</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 22, color: "#fff" }}>{displayName}</div>
              </div>
              <Avatar letter={displayName[0].toUpperCase()} />
            </div>

            <div style={{ marginTop: 18, background: "#fff", borderRadius: 14, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 18 }}>📍</span>
              <input value={dest} onChange={e => { setDest(e.target.value); setErr(""); }} placeholder="Where to?"
                style={{ flex: 1, border: "none", outline: "none", fontSize: 15, color: DARK, background: "transparent" }} />
            </div>
          </div>
        )}

        {tab === "home" && (
          <div className="fade" style={{ padding: "20px 20px 100px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 12 }}>Choose ride type</div>
            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              {RIDES.map(r => (
                <button key={r.id} onClick={() => setRide(r.id)} style={{
                  flex: 1, padding: "14px 10px", borderRadius: 14, cursor: "pointer", textAlign: "left",
                  border: "2px solid " + (ride === r.id ? BLUE : "#e2e8f0"),
                  background: ride === r.id ? "#eff6ff" : "#fff",
                }}>
                  <div style={{ fontSize: 30, marginBottom: 6 }}>{r.icon}</div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 14, color: DARK }}>{r.label}</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{r.price}</div>
                </button>
              ))}
            </div>

            <Err msg={err} />

            {finding ? (
              <div style={{ background: "#eff6ff", borderRadius: 14, padding: "20px", textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 10, animation: "bounce 0.8s ease infinite" }}>🔍</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: DARK }}>Finding your driver...</div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>To: {dest}</div>
                <div style={{ marginTop: 12 }}><Load /></div>
                <button onClick={() => { setFinding(false); setErr(""); }} style={{ marginTop: 14, background: "none", border: "1px solid #e2e8f0", borderRadius: 8, padding: "8px 16px", color: "#64748b", fontSize: 12, cursor: "pointer" }}>
                  Cancel
                </button>
              </div>
            ) : (
              <PrimaryBtn onClick={bookRide} disabled={!dest.trim()}>
                {"Book " + (chosen ? chosen.label + " - CA$" + chosen.fare.toFixed(2) : "")}
              </PrimaryBtn>
            )}
          </div>
        )}

        {tab === "trips" && (
          <div className="fade" style={{ padding: "16px 16px 100px" }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: DARK, padding: "8px 4px 16px" }}>Trip History</div>
            {tripHistory.length === 0 ? (
              <div style={{ textAlign: "center", paddingTop: 50, color: "#94a3b8" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🗺️</div>
                <div style={{ fontWeight: 600 }}>No trips yet</div>
              </div>
            ) : (
              tripHistory.map(t => (
                <div key={t.id} style={{ background: "#fff", borderRadius: 12, padding: "14px 16px", marginBottom: 10, border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: DARK }}>{t.dest}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 3 }}>{t.type} · {t.date}</div>
                  </div>
                  <div style={{ fontWeight: 700, color: BLUE }}>{t.fare}</div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "account" && (
          <div className="fade" style={{ padding: "20px 20px 100px" }}>
            <div style={{ background: "#fff", borderRadius: 16, padding: "20px", marginBottom: 14, border: "1px solid #e2e8f0", display: "flex", gap: 14, alignItems: "center" }}>
              <Avatar letter={displayName[0].toUpperCase()} />
              <div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 17, color: DARK }}>{displayName}</div>
                <div style={{ color: "#64748b", fontSize: 13, marginTop: 2 }}>{user?.email}</div>
              </div>
            </div>
            <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", border: "1px solid #e2e8f0", marginBottom: 14 }}>
              {[["🚗","My Trips"],["💳","Payment"],["⭐","Favourites"],["🔔","Notifications"]].map(([ic, lb]) => (
                <div key={lb} style={{ padding: "14px 18px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                  <span style={{ fontSize: 18 }}>{ic}</span>
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: DARK }}>{lb}</span>
                  <span style={{ color: "#cbd5e1", fontSize: 18 }}>›</span>
                </div>
              ))}
            </div>
            <PrimaryBtn onClick={doLogout} variant="secondary">Sign Out</PrimaryBtn>
          </div>
        )}

        <RiderNav tab={tab} onTab={setTab} />
      </Shell>
    );
  }

  return <Shell><div style={{ padding: 30, textAlign: "center" }}><Load /></div></Shell>;
}

// ─── DRIVER APP ───────────────────────────────────────────────────────────────
function DriverApp() {
  const [scr, setScr]       = useState("splash");
  const [tab, setTab]       = useState("home");
  const [user, setUser]     = useState(null);
  const [email, setEmail]   = useState("");
  const [pass, setPass]     = useState("");
  const [name, setName]     = useState("");
  const [phone, setPhone]   = useState("");
  const [vehicle, setVeh]   = useState("");
  const [plate, setPlate]   = useState("");
  const [pc, setPc]         = useState("");
  const [err, setErr]       = useState("");
  const [busy, setBusy]     = useState(false);
  const [online, setOnline] = useState(false);
  const [trips, setTrips]   = useState([]);
  const [earned, setEarned] = useState(0);
  const [inReq, setInReq]   = useState(null);
  const [countdown, setCountdown] = useState(15);

  const go = (s) => { setErr(""); setScr(s); };

  useEffect(() => {
    getSb().then(client => client.auth.getSession()).then(({ data }) => {
      if (data.session) {
        setUser(data.session.user);
        setName(data.session.user.user_metadata?.name || "");
        go("dash");
      } else { setTimeout(() => go("login"), 1600); }
    }).catch(() => setTimeout(() => go("login"), 1600));
  }, []);

  // Simulate incoming request when online
  useEffect(() => {
    if (!online) return;
    const t = setTimeout(() => {
      setInReq({ id: "TRP-" + String(Date.now()).slice(-5), rider: "Alex M.", dest: "Hamilton GO Station", fare: "CA$9.40" });
      go("request");
    }, 4000);
    return () => clearTimeout(t);
  }, [online]);

  // Request timer
  useEffect(() => {
    if (scr !== "request") return;
    setCountdown(15);
    const t = setInterval(() => {
      setCountdown(v => {
        if (v <= 1) { clearInterval(t); setInReq(null); go("dash"); return 0; }
        return v - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [scr]);

  async function doLogin() {
    if (!email || !pass) { setErr("Email and password required"); return; }
    setBusy(true); setErr("");
    try {
      const client = await getSb();
      const { data, error } = await client.auth.signInWithPassword({ email, password: pass });
      if (error) throw error;
      setUser(data.user);
      setName(data.user.user_metadata?.name || "");
      go("dash");
    } catch(e) { setErr(e.message || "Login failed"); }
    finally { setBusy(false); }
  }

  async function doRegister() {
    if (!name || !email || !pass || !vehicle || !plate) { setErr("All fields required"); return; }
    if (pass !== pc) { setErr("Passwords do not match"); return; }
    if (pass.length < 8) { setErr("Password needs 8+ characters"); return; }
    setBusy(true); setErr("");
    try {
      const client = await getSb();
      const { data, error } = await client.auth.signUp({ email, password: pass, options: { data: { name, role: "driver" } } });
      if (error) throw error;
      await client.from("drivers").insert({ id: data.user.id, name, email, phone: phone || null, vehicle, plate, status: "pending" });
      setUser(data.user);
      go("dash");
    } catch(e) { setErr(e.message || "Registration failed"); }
    finally { setBusy(false); }
  }

  async function doLogout() {
    const client = await getSb();
    await client.auth.signOut();
    setUser(null); setEmail(""); setPass(""); go("login");
  }

  async function toggleOnline() {
    const next = !online;
    setOnline(next);
    try {
      const client = await getSb();
      const { data: { user: u } } = await client.auth.getUser();
      if (u) await client.from("drivers").update({ online: next }).eq("id", u.id);
    } catch(_) {}
  }

  function acceptRide() {
    if (!inReq) return;
    setTrips(t => [{ id: inReq.id, dest: inReq.dest, fare: inReq.fare, date: new Date().toLocaleDateString("en-CA") }, ...t]);
    setEarned(e => e + 9.40);
    setInReq(null);
    go("enroute");
    setTimeout(() => go("dash"), 5000);
  }

  const displayName = user?.user_metadata?.name || name || "Driver";

  // SPLASH
  if (scr === "splash") return (
    <Shell bg={DARK}>
      <div className="fade" style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
        <div style={{ fontSize: 56 }}>🚙</div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 38, color: "#fff", letterSpacing: -1 }}>ZeezRyde</div>
        <div style={{ color: "#475569", fontSize: 13 }}>Driver Portal</div>
        <div style={{ marginTop: 24, animation: "pulse 1.2s ease infinite" }}><Load /></div>
      </div>
    </Shell>
  );

  // LOGIN
  if (scr === "login") return (
    <Shell>
      <div className="fade" style={{ padding: "52px 24px 24px" }}>
        <div style={{ marginBottom: 30, textAlign: "center" }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 30, color: DARK }}>Driver Sign In</div>
          <div style={{ color: "#64748b", fontSize: 13, marginTop: 5 }}>Welcome back to ZeezRyde</div>
        </div>
        <Field label="Email" value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="driver@email.com" />
        <Field label="Password" value={pass} onChange={e => setPass(e.target.value)} type="password" placeholder="Your password" />
        <Err msg={err} />
        <div style={{ marginTop: 6 }}>
          {busy ? <Load /> : <PrimaryBtn onClick={doLogin}>Sign In</PrimaryBtn>}
        </div>
        <p style={{ textAlign: "center", marginTop: 18, fontSize: 13, color: "#64748b" }}>
          New driver?{" "}
          <span onClick={() => go("register")} style={{ color: BLUE, fontWeight: 700, cursor: "pointer" }}>Register here</span>
        </p>
      </div>
    </Shell>
  );

  // REGISTER
  if (scr === "register") return (
    <Shell>
      <TopBar title="Driver Registration" onBack={() => go("login")} />
      <div className="fade" style={{ padding: "20px 24px 100px" }}>
        <Field label="Full Name" value={name} onChange={e => setName(e.target.value)} placeholder="Marcus Thompson" />
        <Field label="Email" value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="driver@email.com" />
        <Field label="Phone" value={phone} onChange={e => setPhone(e.target.value)} type="tel" placeholder="+1 905 000 0000" />
        <Field label="Vehicle (Year Make Model)" value={vehicle} onChange={e => setVeh(e.target.value)} placeholder="2021 Toyota Camry" />
        <Field label="License Plate" value={plate} onChange={e => setPlate(e.target.value)} placeholder="ABCD 123" />
        <Field label="Password" value={pass} onChange={e => setPass(e.target.value)} type="password" placeholder="Min 8 characters" />
        <Field label="Confirm Password" value={pc} onChange={e => setPc(e.target.value)} type="password" placeholder="Re-enter password" />
        <Err msg={err} />
        {busy ? <Load /> : <PrimaryBtn onClick={doRegister}>Create Driver Account</PrimaryBtn>}
        <p style={{ textAlign: "center", marginTop: 10, fontSize: 11, color: "#94a3b8" }}>Account pending admin approval after sign-up</p>
      </div>
    </Shell>
  );

  // DASHBOARD
  if (scr === "dash") return (
    <Shell>
      {tab === "home" && (
        <div>
          <div style={{ background: DARK, padding: "20px 20px 30px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ color: "#475569", fontSize: 12 }}>Driver Dashboard</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 22, color: "#fff" }}>{displayName}</div>
              </div>
              <button onClick={toggleOnline} style={{ padding: "8px 16px", borderRadius: 20, border: "none", cursor: "pointer", background: online ? GREEN : "#334155", color: "#fff", fontWeight: 700, fontSize: 13, fontFamily: "'Syne', sans-serif" }}>
                {online ? "Online" : "Offline"}
              </button>
            </div>
            <div style={{ marginTop: 18, background: "rgba(255,255,255,0.06)", borderRadius: 14, padding: "16px" }}>
              <div style={{ color: "#475569", fontSize: 11, fontWeight: 600, letterSpacing: 1 }}>THIS WEEK</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 34, color: "#fff", marginTop: 4 }}>{"CA$" + earned.toFixed(2)}</div>
              <div style={{ color: "#64748b", fontSize: 12, marginTop: 3 }}>{trips.length} trip{trips.length !== 1 ? "s" : ""} completed</div>
            </div>
          </div>

          <div className="fade" style={{ padding: "20px 20px 100px" }}>
            {online ? (
              <div style={{ background: "#f0fdf4", border: "1.5px solid #86efac", borderRadius: 14, padding: "20px", textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 10, animation: "pulse 1.5s ease infinite" }}>📡</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, color: "#166534" }}>Waiting for ride requests</div>
                <div style={{ fontSize: 12, color: "#16a34a", marginTop: 4 }}>A demo request will arrive shortly</div>
              </div>
            ) : (
              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 14, padding: "20px", textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>😴</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, color: DARK }}>You are offline</div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>Tap Online to start receiving trips</div>
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 16 }}>
              {[["⭐","Rating","5.0"],["🚗","All Trips",trips.length]].map(([ic,lb,val]) => (
                <div key={lb} style={{ background: "#fff", borderRadius: 12, padding: "14px", border: "1px solid #e2e8f0", textAlign: "center" }}>
                  <div style={{ fontSize: 22 }}>{ic}</div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, color: DARK, marginTop: 4 }}>{val}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>{lb}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "earnings" && (
        <div className="fade" style={{ paddingBottom: 100 }}>
          <div style={{ background: DARK, padding: "24px 20px", textAlign: "center" }}>
            <div style={{ color: "#475569", fontSize: 12, fontWeight: 600 }}>WEEK TOTAL</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 44, color: "#fff", marginTop: 6 }}>{"CA$" + earned.toFixed(2)}</div>
          </div>
          <div style={{ padding: 16 }}>
            {trips.length === 0 ? (
              <div style={{ textAlign: "center", paddingTop: 50, color: "#94a3b8" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>💸</div>
                <div style={{ fontWeight: 600 }}>No earnings yet</div>
                <div style={{ fontSize: 13, marginTop: 4 }}>Go online to start earning</div>
              </div>
            ) : (
              trips.map((t, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 12, padding: "14px 16px", marginBottom: 10, border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: DARK }}>{t.dest}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 3 }}>{t.date}</div>
                  </div>
                  <div style={{ fontWeight: 700, color: GREEN, fontSize: 15 }}>{t.fare}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {tab === "account" && (
        <div className="fade" style={{ padding: "20px 20px 100px" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: "20px", marginBottom: 14, border: "1px solid #e2e8f0", display: "flex", gap: 14, alignItems: "center" }}>
            <Avatar letter={displayName[0].toUpperCase()} color={GREEN} />
            <div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 17, color: DARK }}>{displayName}</div>
              <div style={{ color: "#64748b", fontSize: 13, marginTop: 2 }}>{user?.email}</div>
              <div style={{ marginTop: 6, display: "inline-block", background: "#fef9c3", color: "#a16207", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20 }}>PENDING APPROVAL</div>
            </div>
          </div>
          <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", border: "1px solid #e2e8f0", marginBottom: 14 }}>
            {[["📄","Documents"],["🚗","My Vehicle"],["💳","Payout Settings"]].map(([ic,lb]) => (
              <div key={lb} style={{ padding: "14px 18px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                <span style={{ fontSize: 18 }}>{ic}</span>
                <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: DARK }}>{lb}</span>
                <span style={{ color: "#cbd5e1", fontSize: 18 }}>›</span>
              </div>
            ))}
          </div>
          <PrimaryBtn onClick={doLogout} variant="secondary">Sign Out</PrimaryBtn>
        </div>
      )}

      <DriverNav tab={tab} onTab={setTab} />
    </Shell>
  );

  // INCOMING REQUEST
  if (scr === "request" && inReq) return (
    <Shell bg={DARK}>
      <div className="fade" style={{ height: "100vh", display: "flex", flexDirection: "column", padding: 24 }}>
        <div style={{ textAlign: "center", paddingTop: 40 }}>
          <div style={{ fontSize: 50, animation: "bounce 0.7s ease infinite" }}>📡</div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 26, color: "#fff", marginTop: 12 }}>New Ride Request</div>
          <div style={{ color: "#94a3b8", marginTop: 4, fontSize: 13 }}>Expires in {countdown}s</div>
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 20, padding: 24, width: "100%" }}>
            {[["RIDER",inReq.rider],["DESTINATION",inReq.dest],["FARE",inReq.fare]].map(([k,v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <span style={{ color: "#475569", fontSize: 11, fontWeight: 600, letterSpacing: 1 }}>{k}</span>
                <span style={{ color: k === "FARE" ? GREEN : "#fff", fontWeight: 700, fontSize: k === "FARE" ? 22 : 15 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => { setInReq(null); go("dash"); }} style={{ flex: 1, padding: 15, borderRadius: 12, border: "1.5px solid rgba(255,255,255,0.12)", background: "transparent", color: "#64748b", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Syne', sans-serif" }}>
            Decline
          </button>
          <button onClick={acceptRide} style={{ flex: 2, padding: 15, borderRadius: 12, border: "none", background: GREEN, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Syne', sans-serif" }}>
            Accept Trip
          </button>
        </div>
      </div>
    </Shell>
  );

  // EN ROUTE
  if (scr === "enroute") return (
    <Shell bg={DARK}>
      <div className="fade" style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: 24 }}>
        <div style={{ fontSize: 64, animation: "bounce 1s ease infinite" }}>🚙</div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 26, color: "#fff", textAlign: "center" }}>Trip in Progress</div>
        <div style={{ background: "rgba(34,197,94,0.15)", border: "1.5px solid " + GREEN, borderRadius: 14, padding: "16px 32px", textAlign: "center" }}>
          <div style={{ color: "#475569", fontSize: 11 }}>EARNING</div>
          <div style={{ color: GREEN, fontWeight: 900, fontSize: 30, fontFamily: "'Syne', sans-serif" }}>CA$9.40</div>
        </div>
        <PrimaryBtn onClick={() => go("dash")} variant="green">Complete Trip</PrimaryBtn>
      </div>
    </Shell>
  );

  return <Shell><div style={{ padding: 30, textAlign: "center" }}><Load /></div></Shell>;
}

// ─── ROOT — ROLE SELECTOR ─────────────────────────────────────────────────────
export default function App() {
  const [role, setRole] = useState(null);

  if (!role) return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #0f172a 0%, #1e3a6e 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{STYLES}</style>
      <div className="fade" style={{ textAlign: "center", padding: 24 }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 42, color: "#fff", letterSpacing: -2 }}>ZeezRyde</div>
        <div style={{ color: "#475569", fontSize: 13, marginTop: 4, marginBottom: 40 }}>Hamilton and Niagara Region</div>
        <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
          <button onClick={() => setRole("rider")} style={{ width: 148, padding: "26px 14px", borderRadius: 20, border: "1.5px solid rgba(96,165,250,0.25)", background: "rgba(37,99,235,0.12)", color: "#fff", cursor: "pointer" }}>
            <div style={{ fontSize: 42, marginBottom: 10 }}>🚗</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18 }}>Rider</div>
            <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>Book a ride</div>
          </button>
          <button onClick={() => setRole("driver")} style={{ width: 148, padding: "26px 14px", borderRadius: 20, border: "1.5px solid rgba(52,211,153,0.25)", background: "rgba(16,185,129,0.12)", color: "#fff", cursor: "pointer" }}>
            <div style={{ fontSize: 42, marginBottom: 10 }}>🚙</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18 }}>Driver</div>
            <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>Start earning</div>
          </button>
        </div>
      </div>
    </div>
  );

  return role === "rider" ? <RiderApp /> : <DriverApp />;
}
