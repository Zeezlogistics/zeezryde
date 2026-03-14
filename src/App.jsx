import { useState, useEffect } from "react";

// ─── SUPABASE ─────────────────────────────────────────────────────────────────
import { createClient } from "@supabase/supabase-js";
const SUPABASE_URL  = "https://bkbpsobvhxxvlzlmzsmy.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrYnBzb2J2aHh4dmx6bG16c215Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0NzQ4MTUsImV4cCI6MjA4OTA1MDgxNX0.PLJyaouYk4FLfcZwVy_YsKMmny2a6DqrYOn_3jmpgMI";
const db = createClient(SUPABASE_URL, SUPABASE_ANON);

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const RIDES = [
  { id: "family",  label: "Family",  icon: "🚗", seats: "1-4", price: "CA$8-11",  base: 9.40  },
  { id: "friends", label: "Friends", icon: "🚐", seats: "5-8", price: "CA$18-24", base: 21.50 },
];
const AIRPORTS = [
  { code: "yyz", name: "Pearson International (YYZ)", fare: 55 },
  { code: "yhm", name: "Hamilton Airport (YHM)",      fare: 35 },
  { code: "ytz", name: "Billy Bishop (YTZ)",          fare: 28 },
];
const DEMO_TRIPS = [
  { id: "ST-001", route: "Hamilton GO to Pearson Airport", depart_date: "2026-03-20", depart_time: "06:00", seats_total: 12, seats_booked: 4, fare_per_seat: 28, status: "scheduled" },
  { id: "ST-002", route: "Niagara Falls to Downtown Hamilton", depart_date: "2026-03-21", depart_time: "09:00", seats_total: 8, seats_booked: 2, fare_per_seat: 18, status: "scheduled" },
  { id: "ST-003", route: "McMaster to Downtown Hamilton", depart_date: "2026-03-22", depart_time: "07:30", seats_total: 10, seats_booked: 7, fare_per_seat: 12, status: "scheduled" },
];
const DOC_TYPES = [
  { key: "licence",    label: "Driver's Licence (Ontario Class G)" },
  { key: "abstract",   label: "Abstract (3-Year Driver Record)" },
  { key: "criminal",   label: "Criminal Background Check" },
  { key: "reg",        label: "Vehicle Registration" },
  { key: "insurance",  label: "Automobile Insurance (rideshare)" },
  { key: "safety",     label: "Vehicle Safety Inspection" },
  { key: "tnc_driver", label: "Niagara Region TNC Driver Licence" },
  { key: "tnc_vehicle",label: "Niagara Region TNC Vehicle Permit" },
  { key: "work",       label: "Proof of Work Eligibility" },
  { key: "photo",      label: "Profile Photo" },
];

// ─── THEME ────────────────────────────────────────────────────────────────────
const C = {
  blue:   "#2563eb",
  blight: "#eff6ff",
  dark:   "#0f172a",
  green:  "#22c55e",
  red:    "#ef4444",
  yellow: "#f59e0b",
  slate:  "#64748b",
  border: "#e2e8f0",
};

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; margin: 0; padding: 0; }
  @keyframes spin   { to { transform: rotate(360deg); } }
  @keyframes fadeUp { from { opacity:0;transform:translateY(8px); } to { opacity:1;transform:translateY(0); } }
  @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:0.3} }
  @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
  @keyframes ping   { 0%{transform:scale(1);opacity:1} 75%,100%{transform:scale(2);opacity:0} }
  .fade { animation: fadeUp 0.2s ease; }
  input, button, textarea, select { font-family: 'DM Sans', sans-serif; }
  input::placeholder, textarea::placeholder { color: #94a3b8; }
  ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
`;

// ─── SHARED UI ────────────────────────────────────────────────────────────────
function Shell({ bg, children, pb }) {
  return (
    <div style={{ width: "100%", minHeight: "100vh", background: bg || "#f8fafc", fontFamily: "'DM Sans', sans-serif", overflowX: "hidden", paddingBottom: pb || 0 }}>
      <style>{STYLES}</style>
      {children}
    </div>
  );
}

function TopBar({ title, onBack, right, dark }) {
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "14px 18px", background: dark ? C.dark : "#fff", borderBottom: "1px solid " + (dark ? "rgba(255,255,255,0.06)" : C.border), gap: 10, position: "sticky", top: 0, zIndex: 20 }}>
      {onBack && (
        <button onClick={onBack} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: dark ? "#fff" : C.blue, lineHeight: 1, padding: "0 2px 2px" }}>{"‹"}</button>
      )}
      <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: dark ? "#fff" : C.dark, flex: 1 }}>{title}</span>
      {right || null}
    </div>
  );
}

function Btn({ onClick, children, disabled, variant, small }) {
  const bg = disabled ? "#e2e8f0" : variant === "green" ? C.green : variant === "red" ? C.red : variant === "ghost" ? "transparent" : variant === "outline" ? "transparent" : C.blue;
  const color = disabled ? "#94a3b8" : variant === "ghost" ? C.slate : variant === "outline" ? C.blue : "#fff";
  const border = variant === "outline" ? "1.5px solid " + C.blue : variant === "ghost" ? "1px solid " + C.border : "none";
  return (
    <button onClick={onClick} disabled={!!disabled} style={{ width: "100%", padding: small ? "10px" : "14px", borderRadius: 12, fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: small ? 13 : 15, cursor: disabled ? "not-allowed" : "pointer", border, background: bg, color }}>
      {children}
    </button>
  );
}

function Field({ label, value, onChange, type, placeholder, min, max }) {
  return (
    <div style={{ marginBottom: 13 }}>
      {label && <div style={{ fontSize: 10, fontWeight: 700, color: C.slate, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 5 }}>{label}</div>}
      <input value={value} onChange={onChange} type={type || "text"} placeholder={placeholder || ""} min={min} max={max}
        style={{ width: "100%", padding: "11px 13px", borderRadius: 10, border: "1.5px solid #bfdbfe", background: C.blight, fontSize: 14, color: C.dark, outline: "none" }} />
    </div>
  );
}

function Err({ msg }) {
  if (!msg) return null;
  return <div style={{ color: C.red, fontSize: 12, marginBottom: 10, textAlign: "center", padding: "7px 12px", background: "#fef2f2", borderRadius: 8, border: "1px solid #fecaca" }}>{msg}</div>;
}

function Spin() {
  return <div style={{ width: 22, height: 22, border: "3px solid #bfdbfe", borderTopColor: C.blue, borderRadius: "50%", animation: "spin 0.75s linear infinite", margin: "0 auto" }} />;
}

function Badge({ label, color }) {
  const colors = { green: ["#f0fdf4","#16a34a"], yellow: ["#fefce8","#a16207"], red: ["#fef2f2","#dc2626"], blue: ["#eff6ff","#2563eb"], gray: ["#f8fafc","#64748b"] };
  const [bg, fg] = colors[color] || colors.gray;
  return <span style={{ background: bg, color: fg, fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20, letterSpacing: 0.5 }}>{label}</span>;
}

function Card({ children, style }) {
  return <div style={{ background: "#fff", borderRadius: 14, border: "1px solid " + C.border, padding: "16px", ...style }}>{children}</div>;
}

function Avatar({ letter, color, size }) {
  const sz = size || 44;
  return (
    <div style={{ width: sz, height: sz, borderRadius: "50%", background: color || C.blue, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: sz * 0.4, flexShrink: 0 }}>
      {letter}
    </div>
  );
}

// ─── BOTTOM NAVS ──────────────────────────────────────────────────────────────
function RiderNav({ tab, onTab }) {
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid " + C.border, display: "flex", paddingBottom: 8, zIndex: 50 }}>
      {[["home","🏠","Home"],["shuttle","🚌","Shuttle"],["trips","🗺️","Trips"],["account","👤","Me"]].map(([id,icon,label]) => (
        <button key={id} onClick={() => onTab(id)} style={{ flex: 1, background: "none", border: "none", cursor: "pointer", padding: "8px 0 2px", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <span style={{ fontSize: 20 }}>{icon}</span>
          <span style={{ fontSize: 10, fontWeight: tab === id ? 700 : 400, color: tab === id ? C.blue : "#94a3b8" }}>{label}</span>
        </button>
      ))}
    </div>
  );
}

function DriverNav({ tab, onTab }) {
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid " + C.border, display: "flex", paddingBottom: 8, zIndex: 50 }}>
      {[["home","🏠","Home"],["earnings","💰","Earnings"],["docs","📄","Docs"],["account","👤","Me"]].map(([id,icon,label]) => (
        <button key={id} onClick={() => onTab(id)} style={{ flex: 1, background: "none", border: "none", cursor: "pointer", padding: "8px 0 2px", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <span style={{ fontSize: 20 }}>{icon}</span>
          <span style={{ fontSize: 10, fontWeight: tab === id ? 700 : 400, color: tab === id ? C.green : "#94a3b8" }}>{label}</span>
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RIDER APP
// ─────────────────────────────────────────────────────────────────────────────
function RiderApp() {
  const [scr, setScr]       = useState("splash");
  const [tab, setTab]       = useState("home");
  const [user, setUser]     = useState(null);
  // Auth
  const [email, setEmail]   = useState("");
  const [pass, setPass]     = useState("");
  const [name, setName]     = useState("");
  const [phone, setPhone]   = useState("");
  const [pc, setPc]         = useState("");
  const [err, setErr]       = useState("");
  const [busy, setBusy]     = useState(false);
  // Ride booking
  const [ride, setRide]     = useState("family");
  const [dest, setDest]     = useState("");
  const [destInput, setDestInput] = useState("");
  const [finding, setFinding] = useState(false);
  const [tripHistory, setTripHistory] = useState([]);
  const [rating, setRating] = useState(0);
  const [pendingRating, setPendingRating] = useState(false);
  // Airport
  const [airportCode, setAirportCode] = useState("yyz");
  const [airportDate, setAirportDate] = useState("");
  const [airportTime, setAirportTime] = useState("");
  const [airportPax, setAirportPax]   = useState(1);
  const [airportNotes, setAirportNotes] = useState("");
  const [airportSubmitted, setAirportSubmitted] = useState(false);
  // Shuttle
  const [shuttleTrips] = useState(DEMO_TRIPS);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [seats, setSeats] = useState(1);
  const [myBookings, setMyBookings] = useState([]);
  const [newBooking, setNewBooking] = useState(null);

  const go = (s) => { setErr(""); setScr(s); };

  useEffect(() => {
    db.auth.getSession().then(({ data }) => {
      if (data.session) { setUser(data.session.user); setName(data.session.user.user_metadata?.name || ""); go("dash"); }
      else setTimeout(() => go("login"), 1600);
    }).catch(() => setTimeout(() => go("login"), 1600));
  }, []);

  async function doLogin() {
    if (!email || !pass) { setErr("Email and password required"); return; }
    setBusy(true); setErr("");
    try {
      const { data, error } = await db.auth.signInWithPassword({ email, password: pass });
      if (error) throw error;
      setUser(data.user);
      setName(data.user.user_metadata?.name || "");
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
      const { data, error } = await db.auth.signUp({ email, password: pass, options: { data: { name, role: "rider" } } });
      if (error) throw error;
      await db.from("riders").insert({ id: data.user.id, name, email, phone: phone || null });
      setUser(data.user);
      go("dash");
    } catch(e) { setErr(e.message || "Registration failed"); }
    finally { setBusy(false); }
  }

  async function doLogout() {
    await db.auth.signOut();
    setUser(null); setEmail(""); setPass(""); go("login");
  }

  function bookRide() {
    if (!dest.trim()) { setErr("Please enter a destination"); return; }
    const chosen = RIDES.find(r => r.id === ride);
    setFinding(true);
    setTimeout(() => {
      setFinding(false);
      setTripHistory(h => [{ id: Date.now(), dest, type: chosen.label, fare: "CA$" + chosen.base.toFixed(2), date: new Date().toLocaleDateString("en-CA"), status: "completed" }, ...h]);
      setPendingRating(true);
      setDest(""); setDestInput("");
      go("complete");
    }, 3500);
    go("finding");
  }

  function submitAirport() {
    if (!airportDate || !airportTime) { setErr("Please select date and time"); return; }
    setAirportSubmitted(true);
  }

  function bookShuttle() {
    const booking = { id: "ZS-" + String(Date.now()).slice(-5), trip: selectedTrip, seats, total: seats * selectedTrip.fare_per_seat, ref: "ZS-" + String(Date.now()).slice(-5) };
    setNewBooking(booking);
    setMyBookings(b => [...b, booking]);
    go("shuttle-booked");
  }

  const displayName = user?.user_metadata?.name || name || "Rider";

  // ── SCREENS ──────────────────────────────────────────────────────────────────

  if (scr === "splash") return (
    <Shell bg={C.dark}>
      <div className="fade" style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
        <div style={{ fontSize: 56 }}>🚗</div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 38, color: "#fff", letterSpacing: -1 }}>ZeezRyde</div>
        <div style={{ color: "#475569", fontSize: 13 }}>Hamilton and Niagara Region</div>
        <div style={{ marginTop: 24, animation: "pulse 1.2s ease infinite" }}><Spin /></div>
      </div>
    </Shell>
  );

  if (scr === "login") return (
    <Shell>
      <div className="fade" style={{ padding: "52px 24px 24px" }}>
        <div style={{ marginBottom: 30, textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>👋</div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 28, color: C.dark }}>Welcome back</div>
          <div style={{ color: C.slate, fontSize: 13, marginTop: 4 }}>Sign in to your rider account</div>
        </div>
        <Field label="Email" value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@email.com" />
        <Field label="Password" value={pass} onChange={e => setPass(e.target.value)} type="password" placeholder="Your password" />
        <Err msg={err} />
        <div style={{ marginTop: 6 }}>{busy ? <Spin /> : <Btn onClick={doLogin}>Sign In</Btn>}</div>
        <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: C.slate }}>
          New rider?{" "}<span onClick={() => go("register")} style={{ color: C.blue, fontWeight: 700, cursor: "pointer" }}>Create account</span>
        </p>
      </div>
    </Shell>
  );

  if (scr === "register") return (
    <Shell>
      <TopBar title="Create Account" onBack={() => go("login")} />
      <div className="fade" style={{ padding: "20px 24px 40px" }}>
        <Field label="Full Name" value={name} onChange={e => setName(e.target.value)} placeholder="Alex Smith" />
        <Field label="Email" value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@email.com" />
        <Field label="Phone" value={phone} onChange={e => setPhone(e.target.value)} type="tel" placeholder="+1 905 000 0000" />
        <Field label="Password" value={pass} onChange={e => setPass(e.target.value)} type="password" placeholder="Min 8 characters" />
        <Field label="Confirm Password" value={pc} onChange={e => setPc(e.target.value)} type="password" placeholder="Re-enter password" />
        <Err msg={err} />
        {busy ? <Spin /> : <Btn onClick={doRegister}>Create Account</Btn>}
      </div>
    </Shell>
  );

  if (scr === "finding") return (
    <Shell bg={C.dark}>
      <div className="fade" style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: 24 }}>
        <div style={{ position: "relative" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(37,99,235,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, animation: "bounce 1s ease infinite" }}>🔍</div>
        </div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 24, color: "#fff", textAlign: "center" }}>Finding your driver...</div>
        <div style={{ color: "#475569", fontSize: 13, textAlign: "center" }}>To: {dest}</div>
        <Spin />
        <div style={{ marginTop: 10, width: "100%" }}>
          <Btn onClick={() => { setFinding(false); go("dash"); }} variant="ghost">Cancel Request</Btn>
        </div>
      </div>
    </Shell>
  );

  if (scr === "complete") return (
    <Shell bg={C.dark}>
      <div className="fade" style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: 24 }}>
        <div style={{ fontSize: 60 }}>🎉</div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 26, color: "#fff", textAlign: "center" }}>Trip Complete!</div>
        <div style={{ color: "#94a3b8", fontSize: 14 }}>{"CA$" + (RIDES.find(r => r.id === ride)?.base.toFixed(2) || "0.00")}</div>
        {pendingRating && (
          <Card style={{ width: "100%", textAlign: "center" }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, color: C.dark, marginBottom: 12 }}>Rate your driver</div>
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 14 }}>
              {[1,2,3,4,5].map(s => (
                <button key={s} onClick={() => setRating(s)} style={{ fontSize: 28, background: "none", border: "none", cursor: "pointer", opacity: s <= rating ? 1 : 0.3 }}>{"★"}</button>
              ))}
            </div>
            <Btn onClick={() => { setPendingRating(false); setRating(0); go("dash"); }} disabled={rating === 0} small>Submit Rating</Btn>
          </Card>
        )}
        {!pendingRating && <Btn onClick={() => go("dash")}>Back to Home</Btn>}
      </div>
    </Shell>
  );

  if (scr === "shuttle-booked" && newBooking) return (
    <Shell>
      <div className="fade" style={{ padding: 24, textAlign: "center", paddingTop: 60 }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>🎟️</div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 24, color: C.dark, marginBottom: 8 }}>Booking Confirmed!</div>
        <div style={{ color: C.slate, fontSize: 14, marginBottom: 24 }}>Your shuttle is booked</div>
        <Card style={{ textAlign: "left", marginBottom: 20 }}>
          {[["Route", newBooking.trip.route], ["Date", newBooking.trip.depart_date], ["Time", newBooking.trip.depart_time], ["Seats", newBooking.seats], ["Total", "CA$" + newBooking.total.toFixed(2)], ["Ref", newBooking.ref]].map(([k,v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid " + C.border }}>
              <span style={{ color: C.slate, fontSize: 13 }}>{k}</span>
              <span style={{ fontWeight: 600, color: C.dark, fontSize: 13 }}>{v}</span>
            </div>
          ))}
        </Card>
        <Btn onClick={() => { setSelectedTrip(null); setSeats(1); setTab("shuttle"); go("dash"); }}>View My Bookings</Btn>
      </div>
    </Shell>
  );

  if (scr === "airport") return (
    <Shell>
      <TopBar title="Airport Rides" onBack={() => go("dash")} />
      <div className="fade" style={{ padding: "20px 20px 40px" }}>
        {airportSubmitted ? (
          <div style={{ textAlign: "center", paddingTop: 40 }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>✈️</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 22, color: C.dark, marginBottom: 8 }}>Booking Requested!</div>
            <div style={{ color: C.slate, fontSize: 14, marginBottom: 24 }}>Admin will confirm your airport ride within 2 hours</div>
            <Card style={{ textAlign: "left", marginBottom: 20 }}>
              {[
                ["Airport", AIRPORTS.find(a => a.code === airportCode)?.name],
                ["Date", airportDate],
                ["Time", airportTime],
                ["Passengers", airportPax],
                ["Fare", "CA$" + ((AIRPORTS.find(a => a.code === airportCode)?.fare || 0) * airportPax).toFixed(2)],
              ].map(([k,v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid " + C.border }}>
                  <span style={{ color: C.slate, fontSize: 13 }}>{k}</span>
                  <span style={{ fontWeight: 600, color: C.dark, fontSize: 13 }}>{v}</span>
                </div>
              ))}
            </Card>
            <Btn onClick={() => { setAirportSubmitted(false); go("dash"); }}>Back to Home</Btn>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.slate, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8 }}>Select Airport</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {AIRPORTS.map(a => (
                  <button key={a.code} onClick={() => setAirportCode(a.code)} style={{ padding: "12px 14px", borderRadius: 10, border: "2px solid " + (airportCode === a.code ? C.blue : C.border), background: airportCode === a.code ? C.blight : "#fff", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left" }}>
                    <span style={{ fontWeight: 600, color: C.dark, fontSize: 14 }}>{a.name}</span>
                    <span style={{ fontWeight: 700, color: C.blue }}>{"CA$" + a.fare}</span>
                  </button>
                ))}
              </div>
            </div>
            <Field label="Pickup Date" value={airportDate} onChange={e => setAirportDate(e.target.value)} type="date" />
            <Field label="Pickup Time" value={airportTime} onChange={e => setAirportTime(e.target.value)} type="time" />
            <div style={{ marginBottom: 13 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.slate, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 5 }}>Passengers</div>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <button onClick={() => setAirportPax(Math.max(1, airportPax - 1))} style={{ width: 36, height: 36, borderRadius: "50%", border: "1.5px solid " + C.border, background: "#fff", fontSize: 18, cursor: "pointer", color: C.dark }}>-</button>
                <span style={{ fontSize: 18, fontWeight: 700, color: C.dark, minWidth: 24, textAlign: "center" }}>{airportPax}</span>
                <button onClick={() => setAirportPax(Math.min(8, airportPax + 1))} style={{ width: 36, height: 36, borderRadius: "50%", border: "1.5px solid " + C.border, background: "#fff", fontSize: 18, cursor: "pointer", color: C.dark }}>+</button>
              </div>
            </div>
            <div style={{ background: C.blight, borderRadius: 10, padding: "12px 14px", marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: C.slate, fontSize: 14 }}>Estimated Total</span>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, color: C.blue }}>{"CA$" + ((AIRPORTS.find(a => a.code === airportCode)?.fare || 0) * airportPax).toFixed(2)}</span>
            </div>
            <Err msg={err} />
            <Btn onClick={submitAirport}>Request Airport Ride</Btn>
          </div>
        )}
      </div>
    </Shell>
  );

  // ── MAIN DASHBOARD ───────────────────────────────────────────────────────────
  if (scr === "dash") return (
    <Shell pb={72}>
      {tab === "home" && (
        <div>
          <div style={{ background: C.dark, padding: "20px 20px 28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div>
                <div style={{ color: "#475569", fontSize: 12 }}>Good to see you</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 22, color: "#fff" }}>{displayName}</div>
              </div>
              <Avatar letter={displayName[0].toUpperCase()} />
            </div>
            <div style={{ background: "#fff", borderRadius: 14, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 18 }}>📍</span>
              <input value={destInput} onChange={e => { setDestInput(e.target.value); setDest(e.target.value); setErr(""); }} placeholder="Where to?"
                style={{ flex: 1, border: "none", outline: "none", fontSize: 15, color: C.dark, background: "transparent" }} />
            </div>
          </div>

          <div className="fade" style={{ padding: "20px 20px 10px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10 }}>Choose ride</div>
            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              {RIDES.map(r => (
                <button key={r.id} onClick={() => setRide(r.id)} style={{ flex: 1, padding: "14px 10px", borderRadius: 14, cursor: "pointer", textAlign: "left", border: "2px solid " + (ride === r.id ? C.blue : C.border), background: ride === r.id ? C.blight : "#fff" }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{r.icon}</div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 14, color: C.dark }}>{r.label}</div>
                  <div style={{ fontSize: 12, color: C.slate, marginTop: 2 }}>{r.price} · {r.seats} seats</div>
                </button>
              ))}
            </div>
            <Err msg={err} />
            <Btn onClick={bookRide} disabled={!destInput.trim()}>{"Book " + (RIDES.find(r => r.id === ride)?.label || "") + " — CA$" + (RIDES.find(r => r.id === ride)?.base.toFixed(2) || "")}</Btn>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 16 }}>
              <button onClick={() => go("airport")} style={{ padding: "16px 12px", borderRadius: 14, border: "1px solid " + C.border, background: "#fff", cursor: "pointer", textAlign: "left" }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>✈️</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, color: C.dark }}>Airport Rides</div>
                <div style={{ fontSize: 11, color: C.slate, marginTop: 2 }}>YYZ YHM YTZ</div>
              </button>
              <button onClick={() => setTab("shuttle")} style={{ padding: "16px 12px", borderRadius: 14, border: "1px solid " + C.border, background: "#fff", cursor: "pointer", textAlign: "left" }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>🚌</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, color: C.dark }}>Shuttle</div>
                <div style={{ fontSize: 11, color: C.slate, marginTop: 2 }}>Shared trips</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === "shuttle" && (
        <div className="fade">
          <div style={{ background: C.dark, padding: "20px 20px 24px" }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 22, color: "#fff" }}>Shuttle Trips</div>
            <div style={{ color: "#475569", fontSize: 13, marginTop: 4 }}>Shared rides across the region</div>
          </div>
          <div style={{ padding: "16px 16px 10px" }}>
            {myBookings.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>My Bookings</div>
                {myBookings.map(b => (
                  <Card key={b.id} style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: C.dark }}>{b.trip.route}</div>
                      <div style={{ fontSize: 12, color: C.slate, marginTop: 2 }}>{b.trip.depart_date} · {b.seats} seat{b.seats > 1 ? "s" : ""}</div>
                    </div>
                    <Badge label="Confirmed" color="green" />
                  </Card>
                ))}
              </div>
            )}
            <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Available Trips</div>
            {shuttleTrips.map(t => (
              <button key={t.id} onClick={() => { setSelectedTrip(t); setSeats(1); go("shuttle-detail"); }} style={{ width: "100%", textAlign: "left", background: "#fff", borderRadius: 14, padding: "14px 16px", marginBottom: 10, border: "1px solid " + C.border, cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: C.dark, marginBottom: 4 }}>{t.route}</div>
                    <div style={{ fontSize: 12, color: C.slate }}>{t.depart_date} at {t.depart_time}</div>
                    <div style={{ fontSize: 12, color: C.slate, marginTop: 2 }}>{t.seats_total - t.seats_booked} seats available</div>
                  </div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, color: C.blue, fontSize: 16 }}>{"CA$" + t.fare_per_seat}</div>
                </div>
                <div style={{ marginTop: 10, background: C.border, borderRadius: 4, height: 4, overflow: "hidden" }}>
                  <div style={{ width: (t.seats_booked / t.seats_total * 100) + "%", background: C.blue, height: "100%", borderRadius: 4 }} />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {tab === "trips" && (
        <div className="fade" style={{ padding: "16px 16px 10px" }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 20, color: C.dark, padding: "8px 4px 16px" }}>Trip History</div>
          {tripHistory.length === 0 ? (
            <div style={{ textAlign: "center", paddingTop: 50, color: "#94a3b8" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🗺️</div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>No trips yet</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>Your completed rides will appear here</div>
            </div>
          ) : (
            tripHistory.map(t => (
              <Card key={t.id} style={{ marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: C.dark }}>{t.dest}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 3 }}>{t.type} · {t.date}</div>
                </div>
                <div style={{ fontWeight: 700, color: C.blue }}>{t.fare}</div>
              </Card>
            ))
          )}
        </div>
      )}

      {tab === "account" && (
        <div className="fade" style={{ padding: "20px 20px 10px" }}>
          <Card style={{ marginBottom: 14, display: "flex", gap: 14, alignItems: "center" }}>
            <Avatar letter={displayName[0].toUpperCase()} size={52} />
            <div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: C.dark }}>{displayName}</div>
              <div style={{ color: C.slate, fontSize: 13, marginTop: 2 }}>{user?.email}</div>
              <Badge label="Active Rider" color="green" />
            </div>
          </Card>
          <Card style={{ overflow: "hidden", padding: 0, marginBottom: 14 }}>
            {[["🚗","My Trips",() => setTab("trips")],["✈️","Airport Rides",() => go("airport")],["🚌","Shuttle",() => setTab("shuttle")],["💳","Payment Methods",() => {}],["🔔","Notifications",() => {}]].map(([ic,lb,action]) => (
              <button key={lb} onClick={action} style={{ width: "100%", padding: "14px 18px", background: "none", border: "none", borderBottom: "1px solid " + C.border, display: "flex", alignItems: "center", gap: 12, cursor: "pointer", textAlign: "left" }}>
                <span style={{ fontSize: 18 }}>{ic}</span>
                <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: C.dark }}>{lb}</span>
                <span style={{ color: "#cbd5e1", fontSize: 20 }}>{"›"}</span>
              </button>
            ))}
          </Card>
          <Btn onClick={doLogout} variant="outline">Sign Out</Btn>
        </div>
      )}

      <RiderNav tab={tab} onTab={setTab} />
    </Shell>
  );

  // Shuttle detail screen
  if (scr === "shuttle-detail" && selectedTrip) return (
    <Shell>
      <TopBar title="Shuttle Details" onBack={() => go("dash")} />
      <div className="fade" style={{ padding: "20px 20px 40px" }}>
        <Card style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: C.dark, marginBottom: 12 }}>{selectedTrip.route}</div>
          {[["Date", selectedTrip.depart_date], ["Departure", selectedTrip.depart_time], ["Available", (selectedTrip.seats_total - selectedTrip.seats_booked) + " seats"], ["Price", "CA$" + selectedTrip.fare_per_seat + " / seat"]].map(([k,v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid " + C.border }}>
              <span style={{ color: C.slate, fontSize: 13 }}>{k}</span>
              <span style={{ fontWeight: 600, color: C.dark, fontSize: 13 }}>{v}</span>
            </div>
          ))}
        </Card>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.slate, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>Number of Seats</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button onClick={() => setSeats(Math.max(1, seats - 1))} style={{ width: 40, height: 40, borderRadius: "50%", border: "1.5px solid " + C.border, background: "#fff", fontSize: 20, cursor: "pointer" }}>-</button>
            <span style={{ fontSize: 22, fontWeight: 800, color: C.dark, minWidth: 30, textAlign: "center" }}>{seats}</span>
            <button onClick={() => setSeats(Math.min(4, selectedTrip.seats_total - selectedTrip.seats_booked, seats + 1))} style={{ width: 40, height: 40, borderRadius: "50%", border: "1.5px solid " + C.border, background: "#fff", fontSize: 20, cursor: "pointer" }}>+</button>
          </div>
        </div>
        <div style={{ background: C.blight, borderRadius: 10, padding: "12px 16px", marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: C.slate }}>Total</span>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, color: C.blue, fontSize: 18 }}>{"CA$" + (seats * selectedTrip.fare_per_seat).toFixed(2)}</span>
        </div>
        <Btn onClick={bookShuttle} variant="green">Confirm Booking</Btn>
      </div>
    </Shell>
  );

  return <Shell><div style={{ padding: 30, textAlign: "center", paddingTop: 60 }}><Spin /></div></Shell>;
}

// ─────────────────────────────────────────────────────────────────────────────
// DRIVER APP
// ─────────────────────────────────────────────────────────────────────────────
function DriverApp() {
  const [scr, setScr]       = useState("splash");
  const [tab, setTab]       = useState("home");
  const [user, setUser]     = useState(null);
  // Auth
  const [email, setEmail]   = useState("");
  const [pass, setPass]     = useState("");
  const [name, setName]     = useState("");
  const [phone, setPhone]   = useState("");
  const [vehicle, setVeh]   = useState("");
  const [plate, setPlate]   = useState("");
  const [pc, setPc]         = useState("");
  const [err, setErr]       = useState("");
  const [busy, setBusy]     = useState(false);
  // Dashboard
  const [online, setOnline] = useState(false);
  const [trips, setTrips]   = useState([]);
  const [earned, setEarned] = useState(0);
  const [inReq, setInReq]   = useState(null);
  const [countdown, setCountdown] = useState(15);
  // Subscription
  const [subPaid, setSubPaid] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  // Documents
  const [docs, setDocs] = useState(
    DOC_TYPES.map(d => ({ ...d, status: "missing", file: null }))
  );

  const go = (s) => { setErr(""); setScr(s); };
  const displayName = user?.user_metadata?.name || name || "Driver";

  useEffect(() => {
    db.auth.getSession().then(({ data }) => {
      if (data.session) {
        setUser(data.session.user);
        setName(data.session.user.user_metadata?.name || "");
        go("dash");
      } else { setTimeout(() => go("login"), 1600); }
    }).catch(() => setTimeout(() => go("login"), 1600));
  }, []);

  // Simulate incoming request when online and subscribed
  useEffect(() => {
    if (!online || !subPaid) return;
    const t = setTimeout(() => {
      setInReq({ id: "TRP-" + String(Date.now()).slice(-5), rider: "Alex M.", dest: "Hamilton GO Station", fare: "CA$9.40", distance: "3.2 km", type: "Family" });
      go("request");
    }, 4000);
    return () => clearTimeout(t);
  }, [online, subPaid]);

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
      const { data, error } = await db.auth.signInWithPassword({ email, password: pass });
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
      const { data, error } = await db.auth.signUp({ email, password: pass, options: { data: { name, role: "driver" } } });
      if (error) throw error;
      await db.from("drivers").insert({ id: data.user.id, name, email, phone: phone || null, vehicle, plate, status: "pending" });
      setUser(data.user);
      go("subscription");
    } catch(e) { setErr(e.message || "Registration failed"); }
    finally { setBusy(false); }
  }

  async function doLogout() {
    await db.auth.signOut();
    setUser(null); setEmail(""); setPass(""); go("login");
  }

  async function toggleOnline() {
    if (!subPaid) { setErr("You must pay your weekly subscription before going online"); return; }
    const next = !online;
    setOnline(next);
    setErr("");
    try {
      const { data: { user: u } } = await db.auth.getUser();
      if (u) await db.from("drivers").update({ online: next }).eq("id", u.id);
    } catch(_) {}
  }

  function acceptRide() {
    if (!inReq) return;
    setTrips(t => [{ id: inReq.id, dest: inReq.dest, fare: inReq.fare, type: inReq.type, date: new Date().toLocaleDateString("en-CA") }, ...t]);
    setEarned(e => e + 9.40);
    setInReq(null);
    go("enroute");
    setTimeout(() => go("dash"), 5000);
  }

  function paySubscription() {
    setSubPaid(true);
    go("dash");
  }

  function uploadDoc(key) {
    setDocs(d => d.map(doc => doc.key === key ? { ...doc, status: "pending" } : doc));
  }

  const approvedDocs  = docs.filter(d => d.status === "approved").length;
  const pendingDocs   = docs.filter(d => d.status === "pending").length;
  const missingDocs   = docs.filter(d => d.status === "missing" || d.status === "rejected").length;
  const docsComplete  = approvedDocs === DOC_TYPES.length;
  const subFee        = promoApplied ? 0 : 25;

  // ── SCREENS ──────────────────────────────────────────────────────────────────

  if (scr === "splash") return (
    <Shell bg={C.dark}>
      <div className="fade" style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
        <div style={{ fontSize: 56 }}>🚙</div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 38, color: "#fff", letterSpacing: -1 }}>ZeezRyde</div>
        <div style={{ color: "#475569", fontSize: 13 }}>Driver Portal</div>
        <div style={{ marginTop: 24, animation: "pulse 1.2s ease infinite" }}><Spin /></div>
      </div>
    </Shell>
  );

  if (scr === "login") return (
    <Shell>
      <div className="fade" style={{ padding: "52px 24px 24px" }}>
        <div style={{ marginBottom: 30, textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🚙</div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 28, color: C.dark }}>Driver Sign In</div>
          <div style={{ color: C.slate, fontSize: 13, marginTop: 4 }}>Welcome back to ZeezRyde</div>
        </div>
        <Field label="Email" value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="driver@email.com" />
        <Field label="Password" value={pass} onChange={e => setPass(e.target.value)} type="password" placeholder="Your password" />
        <Err msg={err} />
        <div style={{ marginTop: 6 }}>{busy ? <Spin /> : <Btn onClick={doLogin}>Sign In</Btn>}</div>
        <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: C.slate }}>
          New driver?{" "}<span onClick={() => go("register")} style={{ color: C.blue, fontWeight: 700, cursor: "pointer" }}>Register here</span>
        </p>
      </div>
    </Shell>
  );

  if (scr === "register") return (
    <Shell>
      <TopBar title="Driver Registration" onBack={() => go("login")} />
      <div className="fade" style={{ padding: "20px 24px 40px" }}>
        <Field label="Full Name" value={name} onChange={e => setName(e.target.value)} placeholder="Marcus Thompson" />
        <Field label="Email" value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="driver@email.com" />
        <Field label="Phone" value={phone} onChange={e => setPhone(e.target.value)} type="tel" placeholder="+1 905 000 0000" />
        <Field label="Vehicle (Year Make Model)" value={vehicle} onChange={e => setVeh(e.target.value)} placeholder="2021 Toyota Camry" />
        <Field label="License Plate" value={plate} onChange={e => setPlate(e.target.value)} placeholder="ABCD 123" />
        <Field label="Password" value={pass} onChange={e => setPass(e.target.value)} type="password" placeholder="Min 8 characters" />
        <Field label="Confirm Password" value={pc} onChange={e => setPc(e.target.value)} type="password" placeholder="Re-enter password" />
        <Err msg={err} />
        {busy ? <Spin /> : <Btn onClick={doRegister}>Create Driver Account</Btn>}
        <p style={{ textAlign: "center", marginTop: 10, fontSize: 11, color: "#94a3b8" }}>Account requires admin approval</p>
      </div>
    </Shell>
  );

  if (scr === "subscription") return (
    <Shell>
      <TopBar title="Weekly Subscription" />
      <div className="fade" style={{ padding: "24px 24px 40px" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>💳</div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 22, color: C.dark }}>Pay Weekly Subscription</div>
          <div style={{ color: C.slate, fontSize: 13, marginTop: 6 }}>Required to go online and receive trips</div>
        </div>
        <Card style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{ color: C.slate, fontSize: 13 }}>Weekly Fee</div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 44, color: C.dark, margin: "8px 0" }}>{"CA$" + subFee}</div>
          <div style={{ color: C.slate, fontSize: 12 }}>Unlocks full driving access for 7 days</div>
        </Card>
        <div style={{ marginBottom: 16 }}>
          <Field label="Promo Code (optional)" value={promoCode} onChange={e => setPromoCode(e.target.value.toUpperCase())} placeholder="Enter code" />
          {promoCode === "NEWDRIVER" && !promoApplied && (
            <Btn onClick={() => setPromoApplied(true)} variant="outline" small>Apply Code — 100% off</Btn>
          )}
          {promoApplied && <p style={{ color: C.green, fontSize: 13, fontWeight: 600, textAlign: "center", marginTop: 6 }}>Promo applied — this week is free!</p>}
        </div>
        <Btn onClick={paySubscription} variant="green">{"Pay CA$" + subFee + " and Go Live"}</Btn>
      </div>
    </Shell>
  );

  if (scr === "request" && inReq) return (
    <Shell bg={C.dark}>
      <div className="fade" style={{ height: "100vh", display: "flex", flexDirection: "column", padding: 24 }}>
        <div style={{ textAlign: "center", paddingTop: 36 }}>
          <div style={{ fontSize: 50, animation: "bounce 0.7s ease infinite" }}>📡</div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 26, color: "#fff", marginTop: 12 }}>New Ride Request</div>
          <div style={{ marginTop: 8 }}>
            <span style={{ background: countdown <= 5 ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.1)", color: countdown <= 5 ? C.red : "#fff", padding: "4px 14px", borderRadius: 20, fontSize: 14, fontWeight: 700 }}>
              {countdown}s
            </span>
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 20, padding: 24, width: "100%" }}>
            {[["RIDER", inReq.rider], ["DESTINATION", inReq.dest], ["DISTANCE", inReq.distance], ["RIDE TYPE", inReq.type], ["YOUR EARNINGS", inReq.fare]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <span style={{ color: "#475569", fontSize: 11, fontWeight: 600, letterSpacing: 1 }}>{k}</span>
                <span style={{ color: k === "YOUR EARNINGS" ? C.green : "#fff", fontWeight: 700, fontSize: k === "YOUR EARNINGS" ? 22 : 15 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => { setInReq(null); go("dash"); }} style={{ flex: 1, padding: 15, borderRadius: 12, border: "1.5px solid rgba(255,255,255,0.12)", background: "transparent", color: "#64748b", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Syne', sans-serif" }}>
            Decline
          </button>
          <button onClick={acceptRide} style={{ flex: 2, padding: 15, borderRadius: 12, border: "none", background: C.green, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Syne', sans-serif" }}>
            Accept Trip
          </button>
        </div>
      </div>
    </Shell>
  );

  if (scr === "enroute") return (
    <Shell bg={C.dark}>
      <div className="fade" style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: 24 }}>
        <div style={{ fontSize: 64, animation: "bounce 1s ease infinite" }}>🚙</div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 26, color: "#fff", textAlign: "center" }}>Trip in Progress</div>
        <div style={{ background: "rgba(34,197,94,0.15)", border: "1.5px solid " + C.green, borderRadius: 14, padding: "16px 32px", textAlign: "center" }}>
          <div style={{ color: "#475569", fontSize: 11, fontWeight: 600 }}>EARNING</div>
          <div style={{ color: C.green, fontWeight: 900, fontSize: 32, fontFamily: "'Syne', sans-serif" }}>CA$9.40</div>
        </div>
        <Btn onClick={() => go("dash")} variant="green">Complete Trip</Btn>
      </div>
    </Shell>
  );

  // MAIN DRIVER DASHBOARD
  if (scr === "dash") return (
    <Shell pb={72}>
      {tab === "home" && (
        <div>
          <div style={{ background: C.dark, padding: "20px 20px 28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ color: "#475569", fontSize: 12 }}>Driver Dashboard</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 22, color: "#fff" }}>{displayName}</div>
              </div>
              <button onClick={toggleOnline} style={{ padding: "8px 18px", borderRadius: 20, border: "none", cursor: "pointer", background: online ? C.green : "#334155", color: "#fff", fontWeight: 700, fontSize: 13, fontFamily: "'Syne', sans-serif" }}>
                {online ? "● Online" : "○ Offline"}
              </button>
            </div>
            <div style={{ marginTop: 18, background: "rgba(255,255,255,0.06)", borderRadius: 14, padding: "16px" }}>
              <div style={{ color: "#475569", fontSize: 11, fontWeight: 600, letterSpacing: 1 }}>THIS WEEK</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 34, color: "#fff", marginTop: 4 }}>{"CA$" + earned.toFixed(2)}</div>
              <div style={{ color: "#64748b", fontSize: 12, marginTop: 3 }}>{trips.length} trip{trips.length !== 1 ? "s" : ""} completed</div>
            </div>
          </div>

          <div className="fade" style={{ padding: "16px 16px 10px" }}>
            {err && <Err msg={err} />}
            {!subPaid ? (
              <div style={{ background: "#fefce8", border: "1.5px solid #fde68a", borderRadius: 14, padding: "16px", marginBottom: 14, textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>💳</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, color: "#92400e" }}>Subscription Required</div>
                <div style={{ fontSize: 12, color: "#a16207", marginTop: 4, marginBottom: 12 }}>Pay CA$25/week to start receiving trips</div>
                <Btn onClick={() => go("subscription")} small>Pay Now</Btn>
              </div>
            ) : online ? (
              <div style={{ background: "#f0fdf4", border: "1.5px solid #86efac", borderRadius: 14, padding: "20px", textAlign: "center", marginBottom: 14 }}>
                <div style={{ fontSize: 32, marginBottom: 10, animation: "pulse 1.5s ease infinite" }}>📡</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, color: "#166534" }}>Waiting for ride requests</div>
                <div style={{ fontSize: 12, color: "#16a34a", marginTop: 4 }}>A demo request will arrive in a few seconds</div>
              </div>
            ) : (
              <div style={{ background: "#f8fafc", border: "1px solid " + C.border, borderRadius: 14, padding: "20px", textAlign: "center", marginBottom: 14 }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>😴</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, color: C.dark }}>You are offline</div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>Tap Online above to start receiving trips</div>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[["⭐","Rating","5.0"],["🚗","All Trips",trips.length],["📄","Docs",approvedDocs + "/" + DOC_TYPES.length],["💳","Sub", subPaid ? "Paid" : "Unpaid"]].map(([ic,lb,val]) => (
                <Card key={lb} style={{ textAlign: "center", padding: "14px 10px" }}>
                  <div style={{ fontSize: 22 }}>{ic}</div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: C.dark, marginTop: 4 }}>{val}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>{lb}</div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "earnings" && (
        <div className="fade">
          <div style={{ background: C.dark, padding: "24px 20px", textAlign: "center" }}>
            <div style={{ color: "#475569", fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>WEEK TOTAL</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 44, color: "#fff", marginTop: 6 }}>{"CA$" + earned.toFixed(2)}</div>
          </div>
          <div style={{ padding: "16px 16px 10px" }}>
            {trips.length === 0 ? (
              <div style={{ textAlign: "center", paddingTop: 50, color: "#94a3b8" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>💸</div>
                <div style={{ fontWeight: 600 }}>No earnings yet</div>
                <div style={{ fontSize: 13, marginTop: 4 }}>Go online to start earning</div>
              </div>
            ) : (
              trips.map((t, i) => (
                <Card key={i} style={{ marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: C.dark }}>{t.dest}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 3 }}>{t.type} · {t.date}</div>
                  </div>
                  <div style={{ fontWeight: 700, color: C.green, fontSize: 15 }}>{t.fare}</div>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {tab === "docs" && (
        <div className="fade" style={{ padding: "16px 16px 10px" }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 20, color: C.dark, marginBottom: 4 }}>My Documents</div>
          <div style={{ fontSize: 13, color: C.slate, marginBottom: 16 }}>All 10 documents must be approved to go online</div>
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            {[["✅", approvedDocs, "Approved", "green"], ["⏳", pendingDocs, "Pending", "yellow"], ["❌", missingDocs, "Missing", "red"]].map(([ic, count, lb, color]) => (
              <Card key={lb} style={{ flex: 1, textAlign: "center", padding: "12px 8px" }}>
                <div style={{ fontSize: 18 }}>{ic}</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, color: C.dark, marginTop: 4 }}>{count}</div>
                <div style={{ fontSize: 10, color: "#94a3b8" }}>{lb}</div>
              </Card>
            ))}
          </div>
          {docs.map(d => (
            <Card key={d.key} style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 12, padding: "12px 14px" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.dark }}>{d.label}</div>
                <div style={{ marginTop: 4 }}>
                  <Badge label={d.status.charAt(0).toUpperCase() + d.status.slice(1)} color={d.status === "approved" ? "green" : d.status === "pending" ? "yellow" : "red"} />
                </div>
              </div>
              {d.status === "missing" && (
                <button onClick={() => uploadDoc(d.key)} style={{ background: C.blight, border: "1px solid #bfdbfe", borderRadius: 8, padding: "6px 12px", color: C.blue, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                  Upload
                </button>
              )}
            </Card>
          ))}
        </div>
      )}

      {tab === "account" && (
        <div className="fade" style={{ padding: "20px 20px 10px" }}>
          <Card style={{ marginBottom: 14, display: "flex", gap: 14, alignItems: "center" }}>
            <Avatar letter={displayName[0].toUpperCase()} color={C.green} size={52} />
            <div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: C.dark }}>{displayName}</div>
              <div style={{ color: C.slate, fontSize: 13, marginTop: 2 }}>{user?.email}</div>
              <div style={{ marginTop: 6 }}>
                <Badge label={subPaid ? "Subscribed" : "Pending"} color={subPaid ? "green" : "yellow"} />
              </div>
            </div>
          </Card>
          {vehicle && (
            <Card style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>My Vehicle</div>
              <div style={{ fontWeight: 600, color: C.dark }}>{vehicle}</div>
              {plate && <div style={{ color: C.slate, fontSize: 13, marginTop: 2 }}>Plate: {plate}</div>}
            </Card>
          )}
          <Card style={{ overflow: "hidden", padding: 0, marginBottom: 14 }}>
            {[["💳","Subscription",() => go("subscription")],["📄","Documents",() => setTab("docs")],["💰","Earnings",() => setTab("earnings")],["🔔","Notifications",() => {}]].map(([ic,lb,action]) => (
              <button key={lb} onClick={action} style={{ width: "100%", padding: "14px 18px", background: "none", border: "none", borderBottom: "1px solid " + C.border, display: "flex", alignItems: "center", gap: 12, cursor: "pointer", textAlign: "left" }}>
                <span style={{ fontSize: 18 }}>{ic}</span>
                <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: C.dark }}>{lb}</span>
                <span style={{ color: "#cbd5e1", fontSize: 20 }}>{"›"}</span>
              </button>
            ))}
          </Card>
          <Btn onClick={doLogout} variant="outline">Sign Out</Btn>
        </div>
      )}

      <DriverNav tab={tab} onTab={setTab} />
    </Shell>
  );

  return <Shell><div style={{ padding: 30, textAlign: "center", paddingTop: 60 }}><Spin /></div></Shell>;
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT — ROLE SELECTOR
// ─────────────────────────────────────────────────────────────────────────────
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
