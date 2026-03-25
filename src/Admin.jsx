import React, { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

// ─────────────────────────────────────────────────────────────────────────────
// SUPABASE CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const SUPABASE_URL  = "https://bkbpsobvhxxvlzlmzsmy.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrYnBzb2J2aHh4dmx6bG16c215Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0NzQ4MTUsImV4cCI6MjA4OTA1MDgxNX0.PLJyaouYk4FLfcZwVy_YsKMmny2a6DqrYOn_3jmpgMI";

// Supabase client using npm package (same as App.jsx)
const _supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

// ── Car makes & models (for fleet vehicle form) ──────────────────────────────
const CAR_MAKES = [
  { make:"Acura",       models:["ILX","MDX","RDX","TLX","RLX","NSX","Integra"] },
  { make:"Audi",        models:["A3","A4","A5","A6","A7","A8","Q3","Q5","Q7","Q8","e-tron","TT","R8"] },
  { make:"BMW",         models:["1 Series","2 Series","3 Series","4 Series","5 Series","7 Series","8 Series","X1","X2","X3","X4","X5","X6","X7","Z4","i3","i4","iX"] },
  { make:"Buick",       models:["Encore","Encore GX","Envision","Enclave"] },
  { make:"Cadillac",    models:["CT4","CT5","XT4","XT5","XT6","Escalade","LYRIQ"] },
  { make:"Chevrolet",   models:["Spark","Sonic","Cruze","Malibu","Camaro","Corvette","Equinox","Trax","Blazer","Traverse","Tahoe","Suburban","Colorado","Silverado 1500","Silverado 2500","Bolt EV","Trailblazer"] },
  { make:"Chrysler",    models:["300","Pacifica","Voyager"] },
  { make:"Dodge",       models:["Charger","Challenger","Durango","Hornet","Grand Caravan"] },
  { make:"Ford",        models:["Fiesta","Focus","Fusion","Mustang","EcoSport","Escape","Edge","Explorer","Expedition","Ranger","F-150","F-250","F-350","Bronco","Bronco Sport","Maverick","Mach-E","Transit"] },
  { make:"Genesis",     models:["G70","G80","G90","GV70","GV80","GV60"] },
  { make:"GMC",         models:["Terrain","Acadia","Yukon","Yukon XL","Canyon","Sierra 1500","Sierra 2500","Sierra 3500"] },
  { make:"Honda",       models:["Fit","Civic","Accord","Insight","HR-V","CR-V","Pilot","Passport","Ridgeline","Odyssey"] },
  { make:"Hyundai",     models:["Accent","Elantra","Sonata","Venue","Kona","Tucson","Santa Fe","Palisade","IONIQ 5","IONIQ 6","Santa Cruz","Veloster"] },
  { make:"Infiniti",    models:["Q50","Q60","QX50","QX55","QX60","QX80"] },
  { make:"Jaguar",      models:["XE","XF","XJ","F-Type","E-Pace","F-Pace","I-Pace"] },
  { make:"Jeep",        models:["Renegade","Compass","Cherokee","Grand Cherokee","Wrangler","Gladiator","Wagoneer"] },
  { make:"Kia",         models:["Rio","Forte","K5","Stinger","Soul","Seltos","Sportage","Sorento","Telluride","Carnival","EV6","Niro"] },
  { make:"Land Rover",  models:["Defender","Discovery","Discovery Sport","Range Rover","Range Rover Sport","Range Rover Velar","Range Rover Evoque"] },
  { make:"Lexus",       models:["IS","ES","GS","LS","RC","LC","UX","NX","RX","GX","LX","RZ"] },
  { make:"Lincoln",     models:["Corsair","Nautilus","Aviator","Navigator","Continental"] },
  { make:"Mazda",       models:["Mazda3","Mazda6","CX-30","CX-5","CX-50","CX-9","MX-5 Miata","MX-30"] },
  { make:"Mercedes-Benz",models:["A-Class","C-Class","E-Class","S-Class","CLA","CLS","GLA","GLB","GLC","GLE","GLS","G-Class","EQA","EQB","EQC","EQE","EQS"] },
  { make:"Mitsubishi",  models:["Mirage","Eclipse Cross","Outlander","Outlander Sport"] },
  { make:"Nissan",      models:["Versa","Sentra","Altima","Maxima","370Z","GT-R","Kicks","Rogue Sport","Rogue","Murano","Pathfinder","Armada","Frontier","Titan","LEAF","Ariya"] },
  { make:"Porsche",     models:["718 Boxster","718 Cayman","911","Panamera","Macan","Cayenne","Taycan"] },
  { make:"Ram",         models:["1500","2500","3500","ProMaster","ProMaster City"] },
  { make:"Subaru",      models:["Impreza","Legacy","Outback","Forester","Crosstrek","Ascent","BRZ","WRX","Solterra"] },
  { make:"Tesla",       models:["Model 3","Model S","Model X","Model Y","Cybertruck","Roadster"] },
  { make:"Toyota",      models:["Yaris","Corolla","Camry","Avalon","GR86","Supra","C-HR","RAV4","RAV4 Prime","Venza","Highlander","4Runner","Sequoia","Tacoma","Tundra","Prius","Prius Prime","bZ4X","Sienna"] },
  { make:"Volkswagen",  models:["Golf","Jetta","Passat","Arteon","Tiguan","Atlas","ID.4","Taos"] },
  { make:"Volvo",       models:["S60","S90","V60","V90","XC40","XC60","XC90","C40 Recharge"] },
  { make:"Other",       models:["Other / Not Listed"] },
];
async function getSupabase() {
  return _supabase;
}

// ── Supabase DB helpers (replicate old apiGet/Post/Patch/Del pattern) ─────────
const sbGet    = async (table, filters={}) => {
  const sb = await getSupabase();
  let q = sb.from(table).select("*");
  Object.entries(filters).forEach(([k,v]) => { q = q.eq(k, v); });
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return data;
};
const sbInsert = async (table, row) => {
  const sb = await getSupabase();
  const { data, error } = await sb.from(table).insert(row).select().single();
  if (error) throw new Error(error.message);
  return data;
};
const sbUpdate = async (table, id, patch) => {
  const sb = await getSupabase();
  const { data, error } = await sb.from(table).update(patch).eq("id", id).select().single();
  if (error) throw new Error(error.message);
  return data;
};
const sbDelete = async (table, id) => {
  const sb = await getSupabase();
  const { error } = await sb.from(table).delete().eq("id", id);
  if (error) throw new Error(error.message);
  return { deleted: true };
};


// ─────────────────────────────────────────────────────────────────────────────
// SEED DATA
// ─────────────────────────────────────────────────────────────────────────────
const INIT_DRIVERS = [];

const INIT_RIDERS = [];

const ALL_TRIPS = [];
const ALL_SUBS = [];

// ─────────────────────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────────────────────
// ── Error Boundary — shows error instead of blank white page ─────
class AdminErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(e) { return { error: e }; }
  componentDidCatch(e, info) { console.error("AdminApp crash:", e, info); }
  render() {
    if (this.state.error) return (
      <div style={{ minHeight:"100vh", background:"#080e1a", display:"flex", alignItems:"center",
        justifyContent:"center", flexDirection:"column", gap:16, padding:40, color:"#f0f9ff" }}>
        <div style={{ fontSize:32 }}>⚠️</div>
        <div style={{ fontSize:18, fontWeight:700, color:"#ef4444" }}>Admin Portal Error</div>
        <div style={{ fontSize:13, color:"#94a3b8", maxWidth:500, textAlign:"center" }}>
          {this.state.error.message}
        </div>
        <pre style={{ fontSize:11, color:"#475569", background:"rgba(255,255,255,0.05)",
          padding:16, borderRadius:8, maxWidth:600, overflow:"auto", maxHeight:200 }}>
          {this.state.error.stack?.slice(0,400)}
        </pre>
        <button onClick={() => this.setState({ error:null })}
          style={{ padding:"10px 24px", background:"#2563eb", color:"#fff", border:"none",
            borderRadius:8, cursor:"pointer", fontSize:14, fontWeight:600 }}>
          Try Again
        </button>
      </div>
    );
    return this.props.children;
  }
}

export default function AdminApp() {
  // ── Supabase Auth state ───────────────────────────────────────────────────
  const [authed,     setAuthed]     = useState(false);
  const [viewOnly,   setViewOnly]   = useState(false);
  const [authEmail,  setAuthEmail]  = useState("");
  const [authPass,   setAuthPass]   = useState("");
  const [authError,  setAuthError]  = useState("");
  const [authLoading,setAuthLoading]= useState(false);

  // Check existing session on mount
  useEffect(() => {
    (async () => {
      const sb = await getSupabase();
      const { data: { session } } = await sb.auth.getSession();
      if (session) setAuthed(true);
      sb.auth.onAuthStateChange((_e, s) => setAuthed(!!s));
    })();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError(""); setAuthLoading(true);
    try {
      const sb = await getSupabase();
      const { error } = await sb.auth.signInWithPassword({ email: authEmail, password: authPass });
      if (error) throw error;
      setViewOnly(authEmail.toLowerCase() === "viewer@zeezryde.com");
      setAuthed(true);
    } catch (err) {
      setAuthError(err.message || "Login failed");
    } finally { setAuthLoading(false); }
  };

  const handleLogout = async () => {
    const sb = await getSupabase();
    await sb.auth.signOut();
    setAuthed(false);
    dataLoadedRef.current = false; // reset so next login reloads data
    setViewOnly(false);
  };

  // ── Login screen ──────────────────────────────────────────────────────────

  // ── API connection state ──────────────────────────────────────────────────
  const [page, setPage]       = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [promos, setPromos]   = useState([]);
  const MAX_DRIVERS = 50;
  // ── Live demo integration ────────────────────────────────────────────────
  const [liveTrips,    setLiveTrips]    = useState([]);      // trips from live rider/driver demo
  const [liveDriverOn, setLiveDriverOn] = useState(false);   // driver online status from live demo
  // ── Pricing settings (also passed to live demo) ─────────────────────────
  const [riderDelayFee,    setRiderDelayFee]    = useState("3.00");   // CA$ per min after 2 min free
  const [driverCancelFee,  setDriverCancelFee]  = useState("5.00");   // CA$ fee charged when driver cancels after 5min
  // Surge settings
  const [surgeEnabled,     setSurgeEnabled]     = useState(true);
  const [surgeRadiusKm,    setSurgeRadiusKm]    = useState("5");
  const [baseFare,    setBaseFare]    = useState("2.50");
  const [dispatchEmail, setDispatchEmail] = useState("info@zeezlogistics.com");  // airport trip notifications
  const [ratePerKm,   setRatePerKm]   = useState("1.20");
  const [ratePerMin,  setRatePerMin]  = useState("0.25");
  const [minimumFare, setMinimumFare] = useState("5.00");
  const [drivers, setDrivers] = useState(INIT_DRIVERS);
  const [riders,  setRiders]  = useState(INIT_RIDERS);





  // ── Expose setters for live demo integration ─────────────────────────────
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.__zeezAdmin = {
        pushTrip:        (trip) => setLiveTrips(prev => [trip, ...prev]),
        updateTrip:      (id, patch) => setLiveTrips(prev => prev.map(t => t.id===id ? {...t,...patch} : t)),
        setDriverOnline: (v) => setLiveDriverOn(v),
        setSubFee:       setSubFee,
        setCommPct:      setCommPct,
        setBaseFare:     setBaseFare,
        setRatePerKm:    setRatePerKm,
        setRatePerMin:   setRatePerMin,
        setSurgeEnabled: setSurgeEnabled,
        setSurgeRadius:  setSurgeRadiusKm,
        getRiderDelayFee:() => riderDelayFee,
        getDriverCancelFee:() => driverCancelFee,
        // ── Shuttle bridge ── admin trips/vehicles → rider app ──────────
        getShuttleTrips:    () => shuttleTrips,
        getShuttleVehicles: () => shuttleVehicles,
        setShuttleTrips:    setShuttleTrips,
        setShuttleVehicles: setShuttleVehicles,
        // Called by rider app when a seat is booked
        riderBookShuttle: (tripId, seats) => {
          setShuttleTrips(prev => prev.map(t =>
            t.id === tripId ? { ...t, booked: (t.booked || 0) + seats } : t
          ));
        },
        // Airport pricing getters — read by rider app
        getDispatchEmail: () => dispatchEmail,
      getAirportFare: (airportId) => {
          if (airportId === "yyz") return airportFareYYZ;
          if (airportId === "yhm") return airportFareYHM;
          if (airportId === "ytz") return airportFareYTZ;
          return "0";
        },
        getAirportBookingFee: () => airportBookingFee,
        // Shuttle pricing getters
        getShuttleBaseFare:   () => shuttleBaseFare,
        getShuttlePeakMult:   () => shuttlePeakMult,
        getShuttleBookingFee: () => shuttleBookingFee,
        getShuttlePeakOn:     () => shuttlePeakOn,
        // ── Pricing engine getters — read by live app ────────────────────────
        getBaseFare:       () => baseFare,
        getRatePerKm:      () => ratePerKm,
        getRatePerMin:     () => ratePerMin,
        getMinimumFare:    () => minimumFare,
        getSubFee:         () => subFee,
        getCommPct:        () => commPct,
        // ── Enforcement & dispatch getters ───────────────────────────────────
        getCountdown:      () => countdown,
        getReqSub:         () => reqSub,
        getSurgeEnabled:   () => surgeEnabled,
        getWaitFeeOn:      () => waitFeeOn,
        getWaitFeeRate:    () => waitFeeRate,
        getWaitFeeMinutes: () => waitFeeMinutes,
        getPickupFeeOn:    () => pickupFeeOn,
        getPickupFeeKm:    () => pickupFeeKm,
        // ── Airport extras ───────────────────────────────────────────────
        getAirportMinNotice: () => airportMinNotice,
        // ── Dispatch settings ────────────────────────────────────────────
        getDispatchMode:  () => dispatchMode,
        getMaxPickupKm:   () => maxPickupKm,
        getAutoSusp:      () => autoSusp,
        getAdminAlert:    () => adminAlert,
        // ── Beyond-cap & surge radius (needed by live sync) ──────────────
        getBeyondFeeOn:   () => beyondFeeOn,
        getBeyondCapKm:   () => beyondCapKm,
        getBeyondFeeFlat: () => beyondFeeFlat,
        getSurgeRadius:   () => surgeRadiusKm,
      };
    }
  });

// ── Load data + subscribe to real-time changes ───────────────
  const dataLoadedRef = React.useRef(false);
  useEffect(() => {
    if (!authed) return;
    if (dataLoadedRef.current) return; // prevent double-load on re-render
    dataLoadedRef.current = true;
    let channels = [];

    // ── Restore saved settings ─────────────────────────────────
    try {
      const saved = JSON.parse(localStorage.getItem("zeez_settings") || "{}");
      if (saved.baseFare)        setBaseFare(saved.baseFare);
      if (saved.ratePerKm)       setRatePerKm(saved.ratePerKm);
      if (saved.ratePerMin)      setRatePerMin(saved.ratePerMin);
      if (saved.minimumFare)     setMinimumFare(saved.minimumFare);
      if (saved.familyMult)      setFamilyMult(saved.familyMult);
      if (saved.friendsMult)     setFriendsMult(saved.friendsMult);
      if (saved.commPct)         setCommPct(saved.commPct);
      if (saved.subFee)          setSubFee(saved.subFee);
      if (saved.countdown)       setCountdown(saved.countdown);
      if (saved.reqSub !== undefined)        setReqSub(saved.reqSub);
      if (saved.surgeEnabled !== undefined)  setSurgeEnabled(saved.surgeEnabled);
      if (saved.surgeRadiusKm)   setSurgeRadiusKm(saved.surgeRadiusKm);
      if (saved.demandTier)      setDemandTier(saved.demandTier);
      if (saved.maxPickupKm)     setMaxPickupKm(saved.maxPickupKm);
      if (saved.pickupFeeKm)     setPickupFeeKm(saved.pickupFeeKm);
      if (saved.pickupFeeOn !== undefined)   setPickupFeeOn(saved.pickupFeeOn);
      if (saved.beyondCapKm)     setBeyondCapKm(saved.beyondCapKm);
      if (saved.beyondFeeFlat)   setBeyondFeeFlat(saved.beyondFeeFlat);
      if (saved.beyondFeeOn !== undefined)   setBeyondFeeOn(saved.beyondFeeOn);
      if (saved.waitFeeOn !== undefined)     setWaitFeeOn(saved.waitFeeOn);
      if (saved.waitFeeRate)     setWaitFeeRate(saved.waitFeeRate);
      if (saved.waitFeeMinutes)  setWaitFeeMinutes(saved.waitFeeMinutes);
      if (saved.riderDelayFee)   setRiderDelayFee(saved.riderDelayFee);
      if (saved.driverCancelFee) setDriverCancelFee(saved.driverCancelFee);
      if (saved.dispatchMode)    setDispatchMode(saved.dispatchMode);
      if (saved.autoSusp !== undefined)      setAutoSusp(saved.autoSusp);
      if (saved.adminAlert !== undefined)    setAdminAlert(saved.adminAlert);
      if (saved.airportFareYYZ)  setAirportFareYYZ(saved.airportFareYYZ);
      if (saved.airportFareYHM)  setAirportFareYHM(saved.airportFareYHM);
      if (saved.airportFareYTZ)  setAirportFareYTZ(saved.airportFareYTZ);
      if (saved.airportBookingFee) setAirportBookingFee(saved.airportBookingFee);
      if (saved.airportMinNotice)  setAirportMinNotice(saved.airportMinNotice);
      if (saved.shuttleBaseFare)   setShuttleBaseFare(saved.shuttleBaseFare);
      if (saved.shuttleBookingFee) setShuttleBookingFee(saved.shuttleBookingFee);
      if (saved.shuttlePeakOn !== undefined) setShuttlePeakOn(saved.shuttlePeakOn);
      if (saved.shuttlePeakMult)   setShuttlePeakMult(saved.shuttlePeakMult);
    } catch(e) {}

    (async () => {
      try {
        const sb = await getSupabase();

        // ── 1. Initial full load ──────────────────────────────
        const [{ data: drv }, { data: trp }, { data: sub }, { data: rdr }] = await Promise.all([
          sb.from("drivers").select("*").neq("status","archived").order("joined",{ascending:false}),
          sb.from("trips").select("*").order("requested_at",{ascending:false}).limit(200),
          sb.from("subscriptions").select("*").order("created_at",{ascending:false}),
          sb.from("riders").select("*").order("created_at",{ascending:false}),
        ]);
        if (drv) setDrivers(drv);
        if (rdr) setRiders(rdr.map(r => ({
          ...r,
          status:  r.status || "active",
          joined:  r.created_at ? new Date(r.created_at).toLocaleDateString("en-CA", {month:"short", day:"numeric", year:"numeric"}) : "—",
          trips:   r.trips || 0,
          payment: r.payment || "—",
        })));
        if (trp) setLiveTrips(trp.map(t => ({
          id: t.id, rider: t.rider||"Rider", driver: t.driver||"-",
          origin: t.origin||"-", dest: t.dest||"-",
          fare: t.fare ? "CA$"+t.fare : "-",
          status: t.status||"completed", time: t.requested_at ? new Date(t.requested_at).toLocaleTimeString("en-CA",{hour:"2-digit",minute:"2-digit"}) : "-",
          rideType: t.rideType||"Family", seats: t.seats||null,
        })));

        // ── Load promos from Supabase ──────────────────────────────
        try {
          const { data: promoData } = await sb.from("promos").select("*").order("created_at",{ascending:false});
          if (promoData && promoData.length > 0) setPromos(promoData.map(p=>({
            ...p,
            discountType: p.discount_type || p.discountType || "pct",
            maxUses:      p.max_uses      ?? p.maxUses      ?? null,
          })));
        } catch(e) { console.log("Promos load:", e.message); }

        // ── Load shuttle vehicles, trips, drivers and settings ──
        try {
          const [{ data: sv }, { data: st }, { data: sd }, { data: cfg }] = await Promise.all([
            sb.from("shuttle_vehicles").select("*").order("created_at",{ascending:false}),
            sb.from("shuttle_trips").select("*").order("created_at",{ascending:false}),
            sb.from("shuttle_drivers").select("*").order("created_at",{ascending:true}),
            sb.from("settings").select("*").eq("key","admin_settings").maybeSingle(),
          ]);
          if (sv) setShuttleVehicles(sv);
          if (st) setShuttleTrips(st);
          if (sd) setShuttleDrivers(sd);
        if (cfg?.value) {
          const s = cfg.value;
          const applyIfSet = (key, fn) => { if (s[key] !== undefined) fn(s[key]); };
          applyIfSet("baseFare",        setBaseFare);
          applyIfSet("ratePerKm",       setRatePerKm);
          applyIfSet("ratePerMin",      setRatePerMin);
          applyIfSet("minimumFare",     setMinimumFare);
          applyIfSet("commPct",         setCommPct);
          applyIfSet("subFee",          setSubFee);
          applyIfSet("countdown",       setCountdown);
          applyIfSet("reqSub",          setReqSub);
          applyIfSet("surgeEnabled",    setSurgeEnabled);
          applyIfSet("surgeRadiusKm",   setSurgeRadiusKm);
          applyIfSet("airportFareYYZ",  setAirportFareYYZ);
          applyIfSet("airportFareYHM",  setAirportFareYHM);
          applyIfSet("airportFareYTZ",  setAirportFareYTZ);
          applyIfSet("airportBookingFee", setAirportBookingFee);
          applyIfSet("airportMinNotice",  setAirportMinNotice);
          applyIfSet("shuttleBaseFare",   setShuttleBaseFare);
          applyIfSet("shuttleBookingFee", setShuttleBookingFee);
          applyIfSet("shuttlePeakMult",   setShuttlePeakMult);
          applyIfSet("shuttlePeakOn",     setShuttlePeakOn);
          applyIfSet("dispatchMode",      setDispatchMode);
          applyIfSet("maxPickupKm",       setMaxPickupKm);
          applyIfSet("pickupFeeKm",       setPickupFeeKm);
          applyIfSet("pickupFeeOn",       setPickupFeeOn);
          applyIfSet("beyondCapKm",       setBeyondCapKm);
          applyIfSet("beyondFeeFlat",     setBeyondFeeFlat);
          applyIfSet("beyondFeeOn",       setBeyondFeeOn);
          applyIfSet("waitFeeOn",         setWaitFeeOn);
          applyIfSet("waitFeeRate",       setWaitFeeRate);
          applyIfSet("waitFeeMinutes",    setWaitFeeMinutes);
          applyIfSet("riderDelayFee",     setRiderDelayFee);
          applyIfSet("driverCancelFee",   setDriverCancelFee);
          applyIfSet("autoSusp",          setAutoSusp);
          applyIfSet("adminAlert",        setAdminAlert);
          applyIfSet("familyMult",        setFamilyMult);
          applyIfSet("friendsMult",       setFriendsMult);
        }

        } catch(shuttleErr) {
          console.error("Shuttle data load error:", shuttleErr.message);
          // Non-fatal — main admin data already loaded above
        }

        // ── 2. Real-time subscriptions ────────────────────────
        // DRIVERS: any change in Supabase → update admin instantly
        const driversCh = sb.channel("realtime-drivers")
          .on("postgres_changes", { event: "*", schema: "public", table: "drivers" },
            (payload) => {
              if (payload.eventType === "INSERT") {
                setDrivers(prev => [payload.new, ...prev.filter(d => d.id !== payload.new.id)]);
              } else if (payload.eventType === "UPDATE") {
                setDrivers(prev => prev.map(d => d.id === payload.new.id ? { ...d, ...payload.new } : d));
              } else if (payload.eventType === "DELETE") {
                setDrivers(prev => prev.filter(d => d.id !== payload.old.id));
              }
            })
          .subscribe();
        channels.push(driversCh);

        // RIDERS: any change in Supabase → update admin instantly
        const ridersCh = sb.channel("realtime-riders")
          .on("postgres_changes", { event: "*", schema: "public", table: "riders" },
            (payload) => {
              const fmt = (r) => ({
                ...r,
                status:  r.status || "active",
                joined:  r.created_at ? new Date(r.created_at).toLocaleDateString("en-CA", {month:"short", day:"numeric", year:"numeric"}) : "—",
                trips:   r.trips || 0,
                payment: r.payment || "—",
              });
              if (payload.eventType === "INSERT") {
                setRiders(prev => [fmt(payload.new), ...prev.filter(r => r.id !== payload.new.id)]);
              } else if (payload.eventType === "UPDATE") {
                setRiders(prev => prev.map(r => r.id === payload.new.id ? fmt({ ...r, ...payload.new }) : r));
              } else if (payload.eventType === "DELETE") {
                setRiders(prev => prev.filter(r => r.id !== payload.old.id));
              }
            })
          .subscribe();
        channels.push(ridersCh);

        // TRIPS: any change in Supabase → update admin instantly
        const tripsCh = sb.channel("realtime-trips")
          .on("postgres_changes", { event: "*", schema: "public", table: "trips" },
            (payload) => {
              const fmt = (t) => ({
                id: t.id, rider: t.rider||"Rider", driver: t.driver||"-",
                origin: t.origin||"-", dest: t.dest||"-",
                fare: t.fare ? "CA$"+t.fare : "-",
                status: t.status||"completed",
                time: t.requested_at ? new Date(t.requested_at).toLocaleTimeString("en-CA",{hour:"2-digit",minute:"2-digit"}) : "-",
                rideType: t.rideType||"Family", seats: t.seats||null,
              });
              if (payload.eventType === "INSERT") {
                setLiveTrips(prev => [fmt(payload.new), ...prev.filter(t => t.id !== payload.new.id)]);
              } else if (payload.eventType === "UPDATE") {
                setLiveTrips(prev => prev.map(t => t.id === payload.new.id ? fmt({ ...t, ...payload.new }) : t));
              } else if (payload.eventType === "DELETE") {
                setLiveTrips(prev => prev.filter(t => t.id !== payload.old.id));
              }
            })
          .subscribe();
        channels.push(tripsCh);

        // SUBSCRIPTIONS: any change → update admin instantly
        const subsCh = sb.channel("realtime-subs")
          .on("postgres_changes", { event: "*", schema: "public", table: "subscriptions" },
            (payload) => {
              // Re-fetch subs on any change (simpler given ALL_SUBS pattern)
              sb.from("subscriptions").select("*").order("created_at",{ascending:false})
                .then(({ data }) => { if (data) { /* update via setAllSubs if available */ } });
            })
          .subscribe();
        channels.push(subsCh);

      } catch (err) { console.error("AdminApp Supabase load:", err.message); }
    })();

    // ── Cleanup: unsubscribe when admin logs out ──────────────
    return () => {
      channels.forEach(ch => { try { ch.unsubscribe(); } catch(e) {} });
    };
  }, [authed]);

  const [search,  setSearch]  = useState("");
  const [modal,   setModal]   = useState(null);
  const [toast,   setToast]   = useState(null);
  const [dFilter, setDFilter] = useState("all");
  const [rFilter, setRFilter] = useState("all");
  const [subFee,  setSubFee]  = useState("25");
  const [commPct, setCommPct] = useState("10");
  const [countdown, setCountdown] = useState("15");
  const [reqSub,    setReqSub]    = useState(true);
  const [autoSusp,  setAutoSusp]  = useState(true);
  const [adminAlert,setAdminAlert]= useState(true);
  const [maxPickupKm,   setMaxPickupKm]   = useState("10");
  const [pickupFeeKm,   setPickupFeeKm]   = useState("0.50");
  const [dispatchMode,  setDispatchMode]  = useState("closest");  // closest | manual
  const [pickupFeeOn,   setPickupFeeOn]   = useState(true);
  const [beyondCapKm,   setBeyondCapKm]   = useState("30");   // max km beyond radius before fee is capped
  const [beyondFeeFlat, setBeyondFeeFlat] = useState("2.00"); // flat fee for any over-radius dispatch
  const [beyondFeeOn,   setBeyondFeeOn]   = useState(true);
  const [waitFeeOn,     setWaitFeeOn]     = useState(true);   // wait-time > ride surcharge
  const [waitFeeRate,   setWaitFeeRate]   = useState("0.20"); // CA$ per minute over threshold
  const [waitFeeMinutes,setWaitFeeMinutes]= useState("5");    // grace minutes before fee kicks in

  // ── Airport pricing ───────────────────────────────────────────────────────
  const [airportFareYYZ,    setAirportFareYYZ]    = useState("55.00");  // CA$ flat rate to/from YYZ
  const [airportFareYHM,    setAirportFareYHM]    = useState("35.00");  // CA$ flat rate to/from YHM
  const [airportFareYTZ,    setAirportFareYTZ]    = useState("28.00");  // CA$ flat rate to/from YTZ
  const [airportBookingFee, setAirportBookingFee] = useState("3.00");   // CA$ platform booking fee
  const [airportMinNotice,  setAirportMinNotice]  = useState("2");      // hours notice required

  // ── Shuttle pricing ───────────────────────────────────────────────────────
  const [shuttleBaseFare,   setShuttleBaseFare]   = useState("12.00");  // CA$ base fare per seat
  const [shuttlePeakMult,   setShuttlePeakMult]   = useState("1.25");   // peak hour multiplier
  const [shuttleBookingFee, setShuttleBookingFee] = useState("1.50");   // CA$ booking fee per seat
  const [shuttlePeakOn,     setShuttlePeakOn]     = useState(true);

  // ── Shuttle Service state ─────────────────────────────────────────────────
  const [shuttleVehicles, setShuttleVehicles] = useState([]);
  const [shuttleTrips,    setShuttleTrips]    = useState([]);
  const [shuttleDrivers,  setShuttleDrivers]  = useState([]);

  // ── Payment state ─────────────────────────────────────────────────────────
  // ── Stripe configuration (persisted to Settings in real backend) ──────────
  const [stripePublishableKey, setStripePublishableKey] = useState("");
  const [stripeSecretKey,      setStripeSecretKey]      = useState("");
  const [stripeWebhookSecret,  setStripeWebhookSecret]  = useState("");
  const [stripeAccountId,      setStripeAccountId]      = useState("");
  const [stripeMode,           setStripeMode]           = useState("test"); // test | live
  const [stripeConnected,      setStripeConnected]      = useState(false);
  const [payoutSchedule,       setPayoutSchedule]       = useState("weekly"); // daily | weekly | manual
  const [autoPayoutEnabled,    setAutoPayoutEnabled]    = useState(true);
  const [lastAutoPayoutDate,   setLastAutoPayoutDate]   = useState("");
  const [nextAutoPayoutDate,   setNextAutoPayoutDate]   = useState("");
  const [cashoutRequests,      setCashoutRequests]      = useState([]);
  const [payoutDay,            setPayoutDay]            = useState("monday");
  const [stripeAutoCapture,    setStripeAutoCapture]    = useState(true);
  // ── Business account details ──────────────────────────────────────────────
  const [businessName,         setBusinessName]         = useState("");
  const [businessEmail,        setBusinessEmail]        = useState("");
  const [businessPhone,        setBusinessPhone]        = useState("");
  const [businessAddress,      setBusinessAddress]      = useState("");
  const [businessBankName,     setBusinessBankName]     = useState("");
  const [businessBankLast4,    setBusinessBankLast4]    = useState("");
  const [businessTransitNo,    setBusinessTransitNo]    = useState("");
  const [businessInstNo,       setBusinessInstNo]       = useState("");
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [payoutRequests, setPayoutRequests] = useState([]);

  function flash(msg, ok = true) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  }

  function patchDriver(id, delta) {
    const stampedDelta = { ...delta };
    setDrivers(prev => prev.map(d => {
      if (d.id !== id) return d;
      const updated = { ...d, ...delta };
      if (delta.status && delta.status !== d.status) {
        updated.statusSince = new Date().toISOString().slice(0,10);
        stampedDelta.statusSince = updated.statusSince;
      }
      return updated;
    }));
    try { (async () => { const sb = await getSupabase(); await sb.from("drivers").update(stampedDelta).eq("id", id); })(); } catch(_) {}
    flash("Driver updated");
  }

  function patchRider(id, delta) {
    setRiders(prev => prev.map(r => r.id === id ? { ...r, ...delta } : r));
    try { (async () => { const sb = await getSupabase(); await sb.from("riders").update(delta).eq("id", id); })(); } catch(_) {}
    flash("Rider updated");
  }


  if (!authed) return (
    <div style={{ minHeight:"100vh", background:"#080e1a", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ width:380, background:"rgba(15,23,42,0.9)", border:"1px solid rgba(99,179,237,0.15)",
        borderRadius:16, padding:40, boxShadow:"0 25px 50px rgba(0,0,0,0.5)" }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ fontSize:32, fontWeight:800, color:"#60a5fa", letterSpacing:-1 }}>ZeezRyde</div>
          <div style={{ fontSize:13, color:"#475569", marginTop:4 }}>Admin Portal</div>
        </div>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:11, color:"#64748b", marginBottom:6, fontWeight:600 }}>EMAIL</div>
            <input type="email" value={authEmail} onChange={e => setAuthEmail(e.target.value)}
              placeholder="admin@zeezryde.com" required
              style={{ width:"100%", background:"rgba(99,179,237,0.05)", border:"1px solid rgba(99,179,237,0.2)",
                borderRadius:8, padding:"10px 14px", color:"#f0f9ff", fontSize:13, outline:"none", boxSizing:"border-box" }} />
          </div>
          <div style={{ marginBottom:24 }}>
            <div style={{ fontSize:11, color:"#64748b", marginBottom:6, fontWeight:600 }}>PASSWORD</div>
            <input type="password" value={authPass} onChange={e => setAuthPass(e.target.value)}
              placeholder="••••••••" required
              style={{ width:"100%", background:"rgba(99,179,237,0.05)", border:"1px solid rgba(99,179,237,0.2)",
                borderRadius:8, padding:"10px 14px", color:"#f0f9ff", fontSize:13, outline:"none", boxSizing:"border-box" }} />
          </div>
          {authError && <div style={{ color:"#ef4444", fontSize:12, marginBottom:16, textAlign:"center" }}>{authError}</div>}
          <button type="submit" disabled={authLoading}
            style={{ width:"100%", padding:"12px", borderRadius:8, border:"none", cursor:"pointer",
              background:"linear-gradient(135deg,#2563eb,#1d4ed8)", color:"#fff", fontSize:14, fontWeight:700 }}>
            {authLoading ? "Signing in…" : "Sign In"}
          </button>
        </form>
        <div style={{ marginTop:24, padding:"14px 16px", background:"rgba(99,179,237,0.06)", border:"1px dashed rgba(99,179,237,0.2)", borderRadius:10 }}>
          <div style={{ fontSize:10, fontWeight:700, color:"#64748b", letterSpacing:1.2, textTransform:"uppercase", marginBottom:8 }}>Credentials</div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            <div>
              <div style={{ fontSize:9, color:"#f59e0b", fontWeight:700, letterSpacing:1, marginBottom:3 }}>SUPER ADMIN</div>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <span style={{ fontSize:11, color:"#64748b" }}>Email</span>
                <span style={{ fontSize:11, color:"#93c5fd", fontFamily:"monospace" }}>admin@zeezryde.com</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <span style={{ fontSize:11, color:"#64748b" }}>Password</span>
                <span style={{ fontSize:11, color:"#93c5fd", fontFamily:"monospace" }}>admin123</span>
              </div>
            </div>
            <div style={{ borderTop:"1px solid rgba(99,179,237,0.12)", paddingTop:8 }}>
              <div style={{ fontSize:9, color:"#94a3b8", fontWeight:700, letterSpacing:1, marginBottom:3 }}>VIEW ONLY</div>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <span style={{ fontSize:11, color:"#64748b" }}>Email</span>
                <span style={{ fontSize:11, color:"#93c5fd", fontFamily:"monospace" }}>viewer@zeezryde.com</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <span style={{ fontSize:11, color:"#64748b" }}>Password</span>
                <span style={{ fontSize:11, color:"#93c5fd", fontFamily:"monospace" }}>viewer123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  // Stats
  const completedTrips = ALL_TRIPS.filter(t => t.status === "completed");
  const tripRev = completedTrips.reduce((s, t) => s + parseFloat(t.platform.replace("CA$", "") || 0), 0);
  const subRev  = ALL_SUBS.filter(s => s.status === "paid").length * 25;
  const totalRev = (tripRev + subRev).toFixed(2);
  const onlineCount = drivers.filter(d => d.online).length + (liveDriverOn ? 1 : 0); // +1 if Marcus (live demo) is online
  const todayTrips  = ALL_TRIPS.filter(t => t.date === "Mar 7 2026");
  const unpaidSubs  = ALL_SUBS.filter(s => s.status !== "paid").length;
  const pendingDocs = drivers.reduce((n, d) => n + (d.docFiles||[]).filter(f => f.status === "pending").length, 0);

  const NAV = [
    { id:"overview",  icon:"◈", label:"Overview"       },
    { id:"drivers",   icon:"⊙", label:"Drivers"        },
    { id:"riders",    icon:"◉", label:"Riders"         },
    { id:"trips",     icon:"⊛", label:"Trips"          },
    { id:"subs",      icon:"⊠", label:"Subscriptions", badge: unpaidSubs },
    { id:"docs",      icon:"⊟", label:"Documents",     badge: pendingDocs },
    { id:"promos",    icon:"⊕", label:"Promos"          },
    { id:"zones",     icon:"⬡", label:"Zone Control"   },
    { id:"shuttle",   icon:"⊞", label:"Shuttle / Airport" },
    { id:"payment",   icon:"⊟", label:"Payment"         },
    { id:"settings",  icon:"◎", label:"Settings"       },
    { id:"data",      icon:"🗑", label:"Data Management" },
  { id:"users",     icon:"👤", label:"Users"            },
  ];

  return (<AdminErrorBoundary>
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", background:"#080c14", fontFamily:"'Space Grotesk',sans-serif", color:"#e2e8f0" }}>
      <Styles />

      {/* ── SIDEBAR ─────────────────────────── */}
      <aside style={{ width:sidebarOpen?220:56, background:"#080c14", borderRight:"1px solid rgba(99,179,237,0.08)", display:"flex", flexDirection:"column", flexShrink:0, transition:"width 0.22s cubic-bezier(.4,0,.2,1)", overflow:"hidden" }}>
        {/* Brand + collapse toggle */}
        <div style={{ padding:"22px 12px 18px", borderBottom:"1px solid rgba(99,179,237,0.08)", display:"flex", alignItems:"center", justifyContent:"space-between", minWidth:0 }}>
          {sidebarOpen && (
            <div style={{ display:"flex", alignItems:"center", gap:9, minWidth:0 }}>
              <div style={{ width:32, height:32, borderRadius:8, background:"linear-gradient(135deg,#3b82f6,#1d4ed8)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <span style={{ color:"#fff", fontWeight:900, fontSize:14, fontFamily:"'JetBrains Mono',monospace" }}>Z</span>
              </div>
              <div style={{ minWidth:0 }}>
                <div style={{ color:"#f0f9ff", fontWeight:700, fontSize:14, letterSpacing:0.3, whiteSpace:"nowrap" }}>ZeezRyde</div>
                <div style={{ color:"#3b82f6", fontSize:8, fontWeight:600, letterSpacing:2.5, textTransform:"uppercase", whiteSpace:"nowrap" }}>ADMIN</div>
              </div>
            </div>
          )}
          {!sidebarOpen && (
            <div style={{ width:32, height:32, borderRadius:8, background:"linear-gradient(135deg,#3b82f6,#1d4ed8)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto" }}>
              <span style={{ color:"#fff", fontWeight:900, fontSize:14, fontFamily:"'JetBrains Mono',monospace" }}>Z</span>
            </div>
          )}
          {sidebarOpen && (
            <button onClick={()=>setSidebarOpen(false)}
              title="Collapse sidebar"
              style={{ background:"none", border:"none", cursor:"pointer", color:"#334155", fontSize:16, padding:"2px 4px", flexShrink:0, lineHeight:1 }}>
              {"◀"}
            </button>
          )}
        </div>

        {/* Nav links */}
        <nav style={{ flex:1, padding:"14px 6px", display:"flex", flexDirection:"column", gap:2, overflowY:"auto" }}>
          {sidebarOpen && <div style={{ color:"rgba(99,179,237,0.3)", fontSize:8, fontWeight:700, letterSpacing:2.5, textTransform:"uppercase", padding:"0 8px 8px" }}>Navigation</div>}
          {NAV.filter(n => !viewOnly || !["settings","data","subs","docs","promos","payment","users"].includes(n.id)).map(n => {
            const active = page === n.id;
            return (
              <button key={n.id} onClick={() => { setPage(n.id); setSearch(""); }}
                title={!sidebarOpen ? n.label : ""}
                style={{ display:"flex", alignItems:"center", gap:sidebarOpen?10:0, padding:sidebarOpen?"8px 10px":"10px 0",
                  justifyContent:sidebarOpen?"flex-start":"center",
                  borderRadius:8, border:"none", cursor:"pointer", width:"100%", textAlign:"left",
                  background:active?"rgba(59,130,246,0.12)":"transparent", transition:"background 0.15s" }}>
                <span style={{ fontSize:15, color:active?"#60a5fa":"rgba(148,163,184,0.5)", width:18, flexShrink:0, fontFamily:"'JetBrains Mono',monospace", textAlign:"center" }}>{n.icon}</span>
                {sidebarOpen && <span style={{ color:active?"#93c5fd":"#64748b", fontSize:12, fontWeight:active?600:400, flex:1, whiteSpace:"nowrap" }}>{n.label}</span>}
                {sidebarOpen && n.badge > 0 && <span style={{ background:"#ef4444", color:"#fff", fontSize:9, fontWeight:700, padding:"1px 5px", borderRadius:10 }}>{n.badge}</span>}
                {sidebarOpen && active && <div style={{ width:3, height:14, borderRadius:2, background:"#3b82f6", flexShrink:0 }} />}
              </button>
            );
          })}
        </nav>

        {/* Admin user */}
        <div style={{ padding:"12px 8px 18px", borderTop:"1px solid rgba(99,179,237,0.08)" }}>
          {sidebarOpen ? (
            <>
              <div style={{ display:"flex", alignItems:"center", gap:9, padding:"9px 10px", background:"rgba(255,255,255,0.03)", borderRadius:8, marginBottom:8 }}>
                <div style={{ width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,#3b82f6,#7c3aed)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <span style={{ color:"#fff", fontSize:11, fontWeight:700 }}>{viewOnly?"V":"A"}</span>
                </div>
                <div style={{ minWidth:0 }}>
                  <div style={{ color:"#cbd5e1", fontSize:12, fontWeight:600 }}>{viewOnly ? "Viewer" : "Super Admin"}</div>
                  {viewOnly && <div style={{ fontSize:9, color:"#f59e0b", fontWeight:700, letterSpacing:1 }}>VIEW ONLY</div>}
                  <div style={{ color:"#334155", fontSize:10, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{authEmail}</div>
                </div>
              </div>
              <button onClick={handleLogout}
                style={{ width:"100%", padding:"7px 10px", borderRadius:7, border:"1px solid rgba(239,68,68,0.2)", background:"rgba(239,68,68,0.05)", color:"#ef4444", fontSize:11, fontWeight:600, cursor:"pointer", textAlign:"left" }}>
                {"⏻ Sign Out"}
              </button>
            </>
          ) : (
            <button onClick={handleLogout} title="Sign Out"
              style={{ width:"100%", padding:"9px 0", borderRadius:7, border:"1px solid rgba(239,68,68,0.2)", background:"rgba(239,68,68,0.05)", color:"#ef4444", fontSize:14, cursor:"pointer", textAlign:"center" }}>
              {"⏻"}
            </button>
          )}
        </div>

      </aside>
      {/* ── MAIN ───────────────────────────── */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>

        {/* Topbar */}
        <header style={{ height:54, background:"rgba(8,12,20,0.92)", backdropFilter:"blur(12px)", borderBottom:"1px solid rgba(99,179,237,0.08)", display:"flex", alignItems:"center", padding:"0 24px", gap:14, flexShrink:0 }}>

          {!sidebarOpen && (
            <button onClick={()=>setSidebarOpen(true)} title="Expand sidebar"
              style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(99,179,237,0.1)", borderRadius:7,
                color:"#64748b", fontSize:14, cursor:"pointer", padding:"6px 10px", flexShrink:0, lineHeight:1 }}>
              {"▶"}
            </button>
          )}
          <div style={{ display:"flex", alignItems:"center", gap:7, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(99,179,237,0.1)", borderRadius:7, padding:"6px 12px", flex:1, maxWidth:320 }}>
            <span style={{ color:"#334155", fontSize:12 }}>⌕</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder={`Search ${page}…`} style={{ background:"none", border:"none", outline:"none", fontSize:12, color:"#94a3b8", width:"100%", fontFamily:"inherit" }} />
            {search && <button onClick={() => setSearch("")} style={{ background:"none", border:"none", color:"#334155", cursor:"pointer", fontSize:12, padding:0 }}>✕</button>}
          </div>
          <div style={{ flex:1 }} />
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:"#22c55e", boxShadow:"0 0 8px #22c55e" }} />
            <span style={{ color:"#334155", fontSize:11, fontFamily:"'JetBrains Mono',monospace" }}>LIVE</span>
          </div>
          <div style={{ width:1, height:20, background:"rgba(99,179,237,0.1)" }} />
          <span style={{ color:"#334155", fontSize:11, fontFamily:"'JetBrains Mono',monospace" }}>SAT MAR 07 2026</span>
        </header>

        {/* Page scroll area */}
        <main style={{ flex:1, overflowY:"auto", padding:"24px 28px 40px" }}>
          {page === "overview"  && <PageOverview  drivers={drivers} trips={ALL_TRIPS} subs={ALL_SUBS} onlineCount={onlineCount} totalRev={totalRev} tripRev={tripRev} subRev={subRev} todayTrips={todayTrips} maxDrivers={MAX_DRIVERS}
              setDrivers={setDrivers} setRiders={setRiders} setTrips={setLiveTrips} setAllSubs={() => {}} />}
          {page === "drivers"   && <PageDrivers viewOnly={viewOnly}   drivers={drivers} search={search} filter={dFilter} setFilter={setDFilter} patchDriver={patchDriver} setModal={setModal} maxDrivers={MAX_DRIVERS}  setDrivers={setDrivers} />}
          {page === "riders"    && <PageRiders viewOnly={viewOnly}    riders={riders}   search={search} filter={rFilter} setFilter={setRFilter} patchRider={patchRider}   setModal={setModal} />}
          {page === "trips"     && <PageTrips     trips={[...liveTrips.map(t => ({ id:t.id, rider:t.rider, driver:t.driver, from:t.origin, to:t.dest, fare:t.fare, status:t.status, time:t.time, rideType:t.rideType, _live:true })), ...ALL_TRIPS]} search={search} />}
          {page === "subs"      && <PageSubs      subs={ALL_SUBS}   drivers={drivers} />}
          {page === "docs"      && <PageDocs viewOnly={viewOnly}       drivers={drivers} patchDriver={patchDriver} setModal={setModal} />}
          {page === "promos"    && <PagePromos viewOnly={viewOnly} promos={promos} setPromos={setPromos} />}
          {page === "zones"     && <PageZones     drivers={drivers} patchDriver={patchDriver} />}
          {page === "shuttle"   && <PageShuttle viewOnly={viewOnly} flash={flash} shuttleDrivers={shuttleDrivers} setShuttleDrivers={setShuttleDrivers} shuttleBaseFare={shuttleBaseFare} setShuttleBaseFare={setShuttleBaseFare} shuttleBookingFee={shuttleBookingFee} setShuttleBookingFee={setShuttleBookingFee} shuttlePeakOn={shuttlePeakOn} setShuttlePeakOn={setShuttlePeakOn} shuttlePeakMult={shuttlePeakMult} setShuttlePeakMult={setShuttlePeakMult} vehicles={shuttleVehicles} setVehicles={setShuttleVehicles} drivers={drivers} trips={shuttleTrips} setTrips={setShuttleTrips} airportFareYYZ={airportFareYYZ} setAirportFareYYZ={setAirportFareYYZ} airportFareYHM={airportFareYHM} setAirportFareYHM={setAirportFareYHM} airportFareYTZ={airportFareYTZ} setAirportFareYTZ={setAirportFareYTZ} airportBookingFee={airportBookingFee} setAirportBookingFee={setAirportBookingFee} dispatchEmail={dispatchEmail} setDispatchEmail={setDispatchEmail} airportMinNotice={airportMinNotice} setAirportMinNotice={setAirportMinNotice} />}
          {page === "payment"   && <PagePayment viewOnly={viewOnly}   methods={paymentMethods} setMethods={setPaymentMethods} payouts={payoutRequests} setPayouts={setPayoutRequests} trips={ALL_TRIPS} subs={ALL_SUBS} stripePublishableKey={stripePublishableKey} setStripePublishableKey={setStripePublishableKey} stripeSecretKey={stripeSecretKey} setStripeSecretKey={setStripeSecretKey} stripeWebhookSecret={stripeWebhookSecret} setStripeWebhookSecret={setStripeWebhookSecret} stripeAccountId={stripeAccountId} setStripeAccountId={setStripeAccountId} stripeMode={stripeMode} setStripeMode={setStripeMode} stripeConnected={stripeConnected} setStripeConnected={setStripeConnected} payoutSchedule={payoutSchedule} setPayoutSchedule={setPayoutSchedule} payoutDay={payoutDay} setPayoutDay={setPayoutDay} stripeAutoCapture={stripeAutoCapture} setStripeAutoCapture={setStripeAutoCapture} businessName={businessName} setBusinessName={setBusinessName} businessEmail={businessEmail} setBusinessEmail={setBusinessEmail} businessPhone={businessPhone} setBusinessPhone={setBusinessPhone} businessAddress={businessAddress} setBusinessAddress={setBusinessAddress} businessBankName={businessBankName} setBusinessBankName={setBusinessBankName} businessBankLast4={businessBankLast4} setBusinessBankLast4={setBusinessBankLast4} businessTransitNo={businessTransitNo} setBusinessTransitNo={setBusinessTransitNo} businessInstNo={businessInstNo} setBusinessInstNo={setBusinessInstNo} autoPayoutEnabled={autoPayoutEnabled} setAutoPayoutEnabled={setAutoPayoutEnabled} lastAutoPayoutDate={lastAutoPayoutDate} nextAutoPayoutDate={nextAutoPayoutDate} cashoutRequests={cashoutRequests} setCashoutRequests={setCashoutRequests} />}
          {page === "data"      && <PageDataManagement viewOnly={viewOnly} />}
          {page === "users"     && <PageUsers viewOnly={viewOnly} />}
          {page === "settings"  && <PageSettings viewOnly={viewOnly}  airportFareYYZ={airportFareYYZ} setAirportFareYYZ={setAirportFareYYZ} airportFareYHM={airportFareYHM} setAirportFareYHM={setAirportFareYHM} airportFareYTZ={airportFareYTZ} setAirportFareYTZ={setAirportFareYTZ} airportBookingFee={airportBookingFee} setAirportBookingFee={setAirportBookingFee} airportMinNotice={airportMinNotice} setAirportMinNotice={setAirportMinNotice} shuttleBaseFare={shuttleBaseFare} setShuttleBaseFare={setShuttleBaseFare} shuttlePeakMult={shuttlePeakMult} setShuttlePeakMult={setShuttlePeakMult} shuttleBookingFee={shuttleBookingFee} setShuttleBookingFee={setShuttleBookingFee} shuttlePeakOn={shuttlePeakOn} setShuttlePeakOn={setShuttlePeakOn} riderDelayFee={riderDelayFee} setRiderDelayFee={setRiderDelayFee} driverCancelFee={driverCancelFee} setDriverCancelFee={setDriverCancelFee} surgeEnabled={surgeEnabled} setSurgeEnabled={setSurgeEnabled} surgeRadiusKm={surgeRadiusKm} setSurgeRadiusKm={setSurgeRadiusKm} subFee={subFee} setSubFee={setSubFee} commPct={commPct} setCommPct={setCommPct} countdown={countdown} setCountdown={setCountdown} reqSub={reqSub} setReqSub={setReqSub} autoSusp={autoSusp} setAutoSusp={setAutoSusp} adminAlert={adminAlert} setAdminAlert={setAdminAlert} flash={flash} trips={ALL_TRIPS} drivers={drivers} subs={ALL_SUBS} maxPickupKm={maxPickupKm} setMaxPickupKm={setMaxPickupKm} pickupFeeKm={pickupFeeKm} setPickupFeeKm={setPickupFeeKm} dispatchMode={dispatchMode} setDispatchMode={setDispatchMode} pickupFeeOn={pickupFeeOn} setPickupFeeOn={setPickupFeeOn} baseFare={baseFare} setBaseFare={setBaseFare} ratePerKm={ratePerKm} setRatePerKm={setRatePerKm} ratePerMin={ratePerMin} setRatePerMin={setRatePerMin} minimumFare={minimumFare} setMinimumFare={setMinimumFare} beyondCapKm={beyondCapKm} setBeyondCapKm={setBeyondCapKm} beyondFeeFlat={beyondFeeFlat} setBeyondFeeFlat={setBeyondFeeFlat} beyondFeeOn={beyondFeeOn} setBeyondFeeOn={setBeyondFeeOn} waitFeeOn={waitFeeOn} setWaitFeeOn={setWaitFeeOn} waitFeeRate={waitFeeRate} setWaitFeeRate={setWaitFeeRate} waitFeeMinutes={waitFeeMinutes} setWaitFeeMinutes={setWaitFeeMinutes} />}
        </main>
      </div>

      {/* Modal */}
      {modal && <Modal viewOnly={viewOnly} modal={modal} setModal={setModal} patchDriver={patchDriver} patchRider={patchRider} />}

      {/* Toast */}
      {toast && (
        <div style={{ position:"fixed", bottom:24, right:24, background:toast.ok?"#166534":"#991b1b", border:`1px solid ${toast.ok?"#22c55e":"#ef4444"}`, color:toast.ok?"#86efac":"#fca5a5", padding:"11px 18px", borderRadius:9, fontSize:12, fontWeight:600, fontFamily:"'JetBrains Mono',monospace", letterSpacing:0.5, zIndex:9999, boxShadow:"0 8px 32px rgba(0,0,0,0.5)", animation:"fadeUp 0.25s ease" }}>
          {toast.ok ? "✓" : "✗"} {toast.msg}
        </div>
      )}
    </div>
  </AdminErrorBoundary>);
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE: OVERVIEW
// ─────────────────────────────────────────────────────────────────────────────
function PageOverview({ drivers, trips, subs, onlineCount, totalRev, tripRev, subRev, todayTrips, maxDrivers=50, setDrivers, setTrips, setAllSubs, setRiders }) {
  const completed = trips.filter(t => t.status === "completed");
  const cancelled = trips.filter(t => t.status === "cancelled");
  const paidSubs  = subs.filter(s => s.status === "paid").length;
  const unpaidSubs= subs.filter(s => s.status !== "paid").length;

  // Data loaded by AdminApp on login

  const KPIS = [
    { label:"PLATFORM REVENUE",  value:`CA$${totalRev}`,    sub:"Trips + subscriptions",         accent:"#3b82f6" },
    { label:"DRIVERS ONLINE",    value:`${onlineCount}/${drivers.length}`, sub:"Available right now", accent:"#22c55e" },
    { label:"DRIVER CAPACITY",   value:`${drivers.length}/${maxDrivers}`, sub: drivers.length>=maxDrivers ? "⚠ At capacity — registrations paused" : `${maxDrivers-drivers.length} spots remaining`, accent: drivers.length>=maxDrivers?"#ef4444":drivers.length>=maxDrivers*0.9?"#f59e0b":"#3b82f6" },
    { label:"TRIPS TODAY",       value:todayTrips.length,   sub:`${todayTrips.filter(t=>t.status==="completed").length} completed`, accent:"#f59e0b" },
    { label:"UNPAID SUBS",       value:unpaidSubs,          sub:"Drivers blocked from going live", accent: unpaidSubs > 0 ? "#ef4444" : "#22c55e" },
  ];

  const weekBars = [
    { d:"MON", v:62 }, { d:"TUE", v:45 }, { d:"WED", v:78 }, { d:"THU", v:91 },
    { d:"FRI", v:55 }, { d:"SAT", v:100 }, { d:"SUN", v:34 },
  ];

  return (
    <div>
      <SectionHdr title="Overview" sub="Platform health · Mar 7, 2026" />

      {/* KPI row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
        {KPIS.map((k, i) => (
          <div key={k.label} className="kpi-card" style={{ background:"#0d1220", border:"1px solid rgba(99,179,237,0.1)", borderRadius:12, padding:"18px 20px", position:"relative", overflow:"hidden", animationDelay:`${i*0.06}s` }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,${k.accent}aa,${k.accent}00)` }} />
            <div style={{ color:"rgba(148,163,184,0.5)", fontSize:8, fontWeight:700, letterSpacing:2, textTransform:"uppercase", fontFamily:"'JetBrains Mono',monospace", marginBottom:8 }}>{k.label}</div>
            <div style={{ color:k.accent, fontSize:30, fontWeight:700, letterSpacing:-1, fontFamily:"'JetBrains Mono',monospace", lineHeight:1, marginBottom:5 }}>{k.value}</div>
            <div style={{ color:"#334155", fontSize:11 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Middle row */}
      <div style={{ display:"grid", gridTemplateColumns:"1.5fr 1fr", gap:12, marginBottom:12 }}>
        {/* Recent trips */}
        <Panel title="RECENT TRIPS" sub={`${completed.length} completed · ${cancelled.length} cancelled`}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr>{["ID","RIDER","DRIVER","FARE","STATUS"].map(h=><Th key={h}>{h}</Th>)}</tr></thead>
            <tbody>
              {trips.slice(0,7).map(t => (
                <tr key={t.id} className="trow">
                  <Td><Mono small>{t.id}</Mono></Td>
                  <Td muted>{t.rider}</Td>
                  <Td muted>{t.driver}</Td>
                  <Td><span style={{ color:"#f0f9ff", fontWeight:600, fontFamily:"'JetBrains Mono',monospace" }}>{t.fare}</span></Td>
                  <Td><StatusBadge s={t.status} /></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        {/* Right column */}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {/* Revenue breakdown */}
          <Panel title="REVENUE SPLIT">
            {[
              ["Trip commissions (10%)", `CA$${tripRev.toFixed(2)}`, "#3b82f6"],
              ["Weekly subscriptions",   `CA$${subRev}`,             "#a78bfa"],
              ["Total platform earnings",`CA$${(tripRev+subRev).toFixed(2)}`, "#22c55e"],
            ].map(([l, v, c]) => (
              <div key={l} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:"1px solid rgba(99,179,237,0.06)" }}>
                <span style={{ color:"#4b5563", fontSize:11 }}>{l}</span>
                <span style={{ color:c, fontWeight:700, fontSize:12, fontFamily:"'JetBrains Mono',monospace" }}>{v}</span>
              </div>
            ))}
          </Panel>

          {/* Sub status */}
          <Panel title="SUBSCRIPTION STATUS">
            <div style={{ display:"flex", gap:8 }}>
              <div style={{ flex:1, background:"rgba(34,197,94,0.07)", border:"1px solid rgba(34,197,94,0.15)", borderRadius:8, padding:"12px", textAlign:"center" }}>
                <div style={{ color:"#22c55e", fontSize:26, fontWeight:700, fontFamily:"'JetBrains Mono',monospace" }}>{paidSubs}</div>
                <div style={{ color:"#374151", fontSize:10, marginTop:3 }}>PAID</div>
              </div>
              <div style={{ flex:1, background:"rgba(239,68,68,0.07)", border:"1px solid rgba(239,68,68,0.15)", borderRadius:8, padding:"12px", textAlign:"center" }}>
                <div style={{ color:"#ef4444", fontSize:26, fontWeight:700, fontFamily:"'JetBrains Mono',monospace" }}>{unpaidSubs}</div>
                <div style={{ color:"#374151", fontSize:10, marginTop:3 }}>UNPAID</div>
              </div>
            </div>
          </Panel>
        </div>
      </div>

      {/* Weekly bar chart */}
      <Panel title="WEEKLY TRIP VOLUME" sub="Mar 1–7, 2026">
        <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:80, marginTop:8 }}>
          {weekBars.map(b => (
            <div key={b.d} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4, height:"100%", justifyContent:"flex-end" }}>
              <div style={{ width:"100%", height:`${b.v}%`, background:`linear-gradient(180deg, rgba(59,130,246,0.9) 0%, rgba(29,78,216,0.6) 100%)`, borderRadius:"3px 3px 0 0", border:"1px solid rgba(59,130,246,0.3)", transition:"height 0.4s ease" }} />
              <div style={{ fontSize:8, color:"#334155", fontFamily:"'JetBrains Mono',monospace" }}>{b.d}</div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE: DRIVERS
// ─────────────────────────────────────────────────────────────────────────────
function PageDrivers({ viewOnly, drivers, search, filter, setFilter, patchDriver, setModal, maxDrivers=50, setDrivers }) {
  // Reload drivers from Supabase on mount
  useEffect(() => {
    (async () => {
      try {
        const sb = await getSupabase();
        const { data } = await sb.from("drivers").select("*").neq("status","archived").order("joined",{ascending:false});
        if (data && setDrivers) setDrivers(data);
      } catch (err) { console.error("Drivers load:", err.message); }
    })();
  }, []);
  const ARCHIVE_DAYS = 28; // 4 weeks
  const TODAY = new Date("2026-03-08");
  const [reminderTarget, setReminderTarget] = useState(null);
  const [reminderSent, setReminderSent]     = useState({});

  const daysSince = (dateStr) => {
    if (!dateStr) return 0;
    return Math.floor((TODAY - new Date(dateStr)) / (1000*60*60*24));
  };

  const shouldArchive = (d) =>
    (d.status === "suspended" || d.status === "inactive") &&
    daysSince(d.statusSince) >= ARCHIVE_DAYS;

  const activeDrivers   = drivers.filter(d => !shouldArchive(d));
  const archivedDrivers = drivers.filter(d => shouldArchive(d));

  const counts = {
    all:       activeDrivers.length,
    pending:   activeDrivers.filter(d => d.status === "pending").length,
    active:    activeDrivers.filter(d => d.status === "active").length,
    suspended: activeDrivers.filter(d => d.status === "suspended").length,
    inactive:  activeDrivers.filter(d => d.status === "inactive").length,
  };

  const visible = activeDrivers
    .filter(d => filter === "all" || d.status === filter)
    .filter(d => !search || [d.name, d.email, d.id, d.plate].some(f => f.toLowerCase().includes(search.toLowerCase())));

  return (
    <div>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:22 }}>
        <div>
          <h1 style={{ color:"#f0f9ff", fontSize:20, fontWeight:600, fontFamily:"'Space Grotesk',sans-serif", letterSpacing:-0.3 }}>Drivers</h1>
          <p style={{ color:"#334155", fontSize:12, marginTop:4, fontFamily:"'JetBrains Mono',monospace" }}>{drivers.length} registered · {drivers.filter(d=>d.online).length} online now</p>
        </div>
        {/* Capacity indicator */}
        <div style={{ background:"#0d1220", border:`1px solid ${drivers.length>=maxDrivers?"rgba(239,68,68,0.3)":drivers.length>=maxDrivers*0.9?"rgba(245,158,11,0.3)":"rgba(99,179,237,0.1)"}`, borderRadius:10, padding:"10px 16px", textAlign:"right", minWidth:140 }}>
          <div style={{ color:"rgba(148,163,184,0.4)", fontSize:8, fontWeight:700, letterSpacing:2, fontFamily:"'JetBrains Mono',monospace", marginBottom:4 }}>DRIVER CAPACITY</div>
          <div style={{ color:drivers.length>=maxDrivers?"#ef4444":drivers.length>=maxDrivers*0.9?"#f59e0b":"#3b82f6", fontSize:22, fontWeight:700, fontFamily:"'JetBrains Mono',monospace", lineHeight:1 }}>
            {drivers.length}<span style={{ color:"#334155", fontSize:13 }}>/{maxDrivers}</span>
          </div>
          {/* Progress bar */}
          <div style={{ marginTop:6, height:3, borderRadius:3, background:"rgba(255,255,255,0.05)", overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${Math.min(100, drivers.length/maxDrivers*100)}%`, background:drivers.length>=maxDrivers?"#ef4444":drivers.length>=maxDrivers*0.9?"#f59e0b":"#3b82f6", borderRadius:3, transition:"width 0.4s ease" }} />
          </div>
          {drivers.length >= maxDrivers && (
            <div style={{ color:"#ef4444", fontSize:8, fontWeight:700, letterSpacing:1, fontFamily:"'JetBrains Mono',monospace", marginTop:4 }}>AT CAPACITY</div>
          )}
          {drivers.length >= maxDrivers*0.9 && drivers.length < maxDrivers && (
            <div style={{ color:"#f59e0b", fontSize:8, fontWeight:700, letterSpacing:1, fontFamily:"'JetBrains Mono',monospace", marginTop:4 }}>{maxDrivers - drivers.length} SPOTS LEFT</div>
          )}
        </div>
      </div>

      {/* Filter pills */}
      <div style={{ display:"flex", gap:6, marginBottom:16 }}>
        {Object.entries(counts).map(([k, v]) => (
          <FilterPill key={k} label={k} count={v} active={filter === k} onClick={() => setFilter(k)} accent="#3b82f6" />
        ))}
      </div>

      <Panel>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr>{["DRIVER","CONTACT","VEHICLE","STATUS","ONLINE","SUB","RATING","TRIPS","ACTIONS"].map(h=><Th key={h}>{h}</Th>)}</tr></thead>
          <tbody>
            {visible.map(d => (
              <tr key={d.id} className="trow">
                <Td>
                  <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                    <Avi name={d.name} seed={d.id} />
                    <div>
                      <div style={{ color:"#e2e8f0", fontSize:13, fontWeight:500 }}>{d.name}</div>
                      <Mono small>{d.id}</Mono>
                    </div>
                  </div>
                </Td>
                <Td>
                  <div style={{ color:"#64748b", fontSize:11 }}>{d.email}</div>
                  <div style={{ color:"#334155", fontSize:10, marginTop:1 }}>{d.phone}</div>
                </Td>
                <Td>
                  <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                    <div style={{ color:"#94a3b8", fontSize:12 }}>{d.vehicle}</div>
                    {vehicleYearWarning(d.vehicleYear) && (
                      <span title={vehicleYearWarning(d.vehicleYear)} style={{ background: d.vehicleYear < MIN_VEHICLE_YEAR ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)", border: d.vehicleYear < MIN_VEHICLE_YEAR ? "1px solid rgba(239,68,68,0.3)" : "1px solid rgba(245,158,11,0.3)", color: d.vehicleYear < MIN_VEHICLE_YEAR ? "#ef4444" : "#f59e0b", fontSize:8, fontWeight:700, padding:"1px 5px", borderRadius:4, fontFamily:"'JetBrains Mono',monospace", cursor:"help", flexShrink:0 }}>
                        {d.vehicleYear < MIN_VEHICLE_YEAR ? "OVER AGE" : "⚠ AGE"}
                      </span>
                    )}
                  </div>
                  <Mono small>{d.plate}</Mono>
                </Td>
                <Td><StatusBadge s={d.status} /></Td>
                <Td>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <div style={{ width:6, height:6, borderRadius:"50%", background:d.online?"#22c55e":"#1e293b", boxShadow:d.online?"0 0 6px #22c55e":"none" }} />
                    <span style={{ color:d.online?"#22c55e":"#334155", fontSize:11, fontFamily:"'JetBrains Mono',monospace" }}>{d.online?"ONLINE":"OFFLINE"}</span>
                  </div>
                </Td>
                <Td>
                  <span style={{ background:d.subPaid?"rgba(34,197,94,0.08)":"rgba(239,68,68,0.08)", border:`1px solid ${d.subPaid?"rgba(34,197,94,0.2)":"rgba(239,68,68,0.2)"}`, color:d.subPaid?"#22c55e":"#ef4444", fontSize:9, fontWeight:700, padding:"2px 8px", borderRadius:4, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1 }}>
                    {d.subPaid ? "PAID" : "UNPAID"}
                  </span>
                </Td>
                <Td><span style={{ color:"#f59e0b", fontWeight:700, fontSize:12, fontFamily:"'JetBrains Mono',monospace" }}>★ {d.rating.toFixed(2)}</span></Td>
                <Td><span style={{ color:"#e2e8f0", fontWeight:600, fontFamily:"'JetBrains Mono',monospace" }}>{d.trips.toLocaleString()}</span></Td>
                <Td>
                  <div style={{ display:"flex", gap:5 }}>
                    <ActBtn onClick={() => setModal({ type:"driver", data:d })}>View</ActBtn>
                    {!viewOnly && (d.status === "active"
                      ? <ActBtn danger onClick={() => patchDriver(d.id, { status:"suspended" })}>Suspend</ActBtn>
                      : <ActBtn success onClick={() => patchDriver(d.id, { status:"active" })}>Reinstate</ActBtn>
                    )}
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
        {visible.length === 0 && <EmptyRow text="No drivers match your filter." />}
      </Panel>

      {/* ── Archived Drivers ── */}
      {archivedDrivers.length > 0 && (
        <div style={{ marginTop:32 }}>
          {/* Section divider */}
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
            <div style={{ flex:1, height:1, background:"linear-gradient(90deg,rgba(239,68,68,0.25),transparent)" }} />
            <div style={{ display:"flex", alignItems:"center", gap:8, background:"rgba(239,68,68,0.07)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:20, padding:"5px 14px" }}>
              <div style={{ width:7, height:7, borderRadius:"50%", background:"#ef4444", boxShadow:"0 0 8px #ef4444" }} />
              <span style={{ color:"#ef4444", fontSize:10, fontWeight:700, letterSpacing:2, fontFamily:"'JetBrains Mono',monospace", textTransform:"uppercase" }}>Archived · {archivedDrivers.length}</span>
            </div>
            <div style={{ flex:1, height:1, background:"linear-gradient(90deg,transparent,rgba(239,68,68,0.25))" }} />
          </div>
          <div style={{ color:"#475569", fontSize:11, fontFamily:"'Space Grotesk',sans-serif", marginBottom:12 }}>
            Drivers suspended or inactive for <strong style={{ color:"#64748b" }}>4+ weeks</strong> — send a reminder to bring them back.
          </div>
          <div style={{ background:"#080c14", border:"1px solid rgba(239,68,68,0.12)", borderRadius:12, overflow:"hidden" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr>
                  {["DRIVER","CONTACT","VEHICLE","STATUS","DAYS","ARCHIVED DATE","TRIPS","ACTIONS"].map(h => (
                    <th key={h} style={{ padding:"11px 14px", textAlign:"left", fontSize:8, fontWeight:700, color:"rgba(100,116,139,0.6)", letterSpacing:2, textTransform:"uppercase", fontFamily:"'JetBrains Mono',monospace", borderBottom:"1px solid rgba(71,85,105,0.2)", background:"rgba(0,0,0,0.3)", whiteSpace:"nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {archivedDrivers.map(d => {
                  const days = daysSince(d.statusSince);
                  const archiveDate = d.statusSince ? new Date(new Date(d.statusSince).getTime() + ARCHIVE_DAYS*24*60*60*1000).toLocaleDateString("en-CA",{month:"short",day:"numeric",year:"numeric"}) : "—";
                  return (
                    <tr key={d.id} style={{ borderBottom:"1px solid rgba(71,85,105,0.08)" }}>
                      <td style={{ padding:"11px 14px", borderBottom:"1px solid rgba(71,85,105,0.1)" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                          <Avi name={d.name} seed={d.id} />
                          <div>
                            <div style={{ color:"#64748b", fontSize:13, fontWeight:500 }}>{d.name}</div>
                            <span style={{ background:"rgba(59,130,246,0.07)", border:"1px solid rgba(59,130,246,0.12)", color:"#475569", fontSize:9, fontWeight:500, padding:"1px 5px", borderRadius:4, fontFamily:"'JetBrains Mono',monospace", display:"inline-block" }}>{d.id}</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding:"11px 14px", borderBottom:"1px solid rgba(71,85,105,0.1)" }}>
                        <div style={{ color:"#475569", fontSize:11 }}>{d.email}</div>
                        <div style={{ color:"#334155", fontSize:10, marginTop:1 }}>{d.phone}</div>
                      </td>
                      <td style={{ padding:"11px 14px", borderBottom:"1px solid rgba(71,85,105,0.1)" }}>
                        <div style={{ color:"#475569", fontSize:12 }}>{d.vehicle}</div>
                        <span style={{ background:"rgba(59,130,246,0.07)", border:"1px solid rgba(59,130,246,0.12)", color:"#475569", fontSize:9, fontWeight:500, padding:"1px 5px", borderRadius:4, fontFamily:"'JetBrains Mono',monospace", display:"inline-block" }}>{d.plate}</span>
                      </td>
                      <td style={{ padding:"11px 14px", borderBottom:"1px solid rgba(71,85,105,0.1)" }}>
                        <span style={{ background:d.status==="suspended"?"rgba(239,68,68,0.06)":"rgba(100,116,139,0.06)", border:`1px solid ${d.status==="suspended"?"rgba(239,68,68,0.15)":"rgba(100,116,139,0.15)"}`, color:d.status==="suspended"?"#7f1d1d":"#475569", fontSize:9, fontWeight:700, padding:"2px 9px", borderRadius:4, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1, textTransform:"uppercase" }}>
                          {d.status}
                        </span>
                      </td>
                      <td style={{ padding:"11px 14px", borderBottom:"1px solid rgba(71,85,105,0.1)" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                          <div style={{ background:"rgba(71,85,105,0.15)", borderRadius:5, padding:"3px 8px" }}>
                            <span style={{ color:"#94a3b8", fontSize:12, fontWeight:700, fontFamily:"'JetBrains Mono',monospace" }}>{days}</span>
                            <span style={{ color:"#475569", fontSize:9, marginLeft:3 }}>days</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding:"11px 14px", borderBottom:"1px solid rgba(71,85,105,0.1)" }}>
                        <span style={{ color:"#475569", fontSize:11, fontFamily:"'JetBrains Mono',monospace" }}>{archiveDate}</span>
                      </td>
                      <td style={{ padding:"11px 14px", borderBottom:"1px solid rgba(71,85,105,0.1)" }}>
                        <span style={{ color:"#475569", fontFamily:"'JetBrains Mono',monospace", fontWeight:600 }}>{d.trips.toLocaleString()}</span>
                      </td>
                      <td style={{ padding:"11px 14px", borderBottom:"1px solid rgba(71,85,105,0.1)" }}>
                        <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                          <button onClick={() => setModal({ type:"driver", data:d })} style={{ background:"rgba(71,85,105,0.1)", border:"1px solid rgba(71,85,105,0.2)", color:"#64748b", borderRadius:6, padding:"4px 10px", fontSize:9, fontWeight:700, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace", letterSpacing:0.5 }}>View</button>
                          <button
                            onClick={() => setReminderTarget(d)}
                            disabled={!!reminderSent[d.id]}
                            style={{ background: reminderSent[d.id] ? "rgba(34,197,94,0.07)" : "linear-gradient(135deg,#2563eb,#7c3aed)", border: reminderSent[d.id] ? "1px solid rgba(34,197,94,0.2)" : "1px solid rgba(124,58,237,0.4)", color: reminderSent[d.id] ? "#22c55e" : "#fff", borderRadius:7, padding:"5px 13px", fontSize:10, fontWeight:700, cursor: reminderSent[d.id] ? "default" : "pointer", fontFamily:"'Space Grotesk',sans-serif", letterSpacing:0.3, boxShadow: reminderSent[d.id] ? "none" : "0 2px 12px rgba(37,99,235,0.35)", transition:"all 0.2s" }}
                          >
                            {reminderSent[d.id] ? "✓ Sent" : "✦ Remind"}
                          </button>
                          <button onClick={() => patchDriver(d.id, { status:"active" })} style={{ background:"rgba(34,197,94,0.07)", border:"1px solid rgba(34,197,94,0.2)", color:"#22c55e", borderRadius:6, padding:"4px 10px", fontSize:9, fontWeight:700, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace", letterSpacing:0.5 }}>Reinstate</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* ── Reminder Modal ── */}
      {reminderTarget && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", backdropFilter:"blur(6px)", zIndex:9000, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}
          onClick={() => setReminderTarget(null)}
        >
          <div style={{ background:"linear-gradient(160deg,#0d1220,#0f172a)", border:"1px solid rgba(99,179,237,0.15)", borderRadius:18, width:"100%", maxWidth:500, overflow:"hidden", boxShadow:"0 32px 80px rgba(0,0,0,0.7)" }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header gradient bar */}
            <div style={{ height:4, background:"linear-gradient(90deg,#2563eb,#7c3aed,#ec4899)" }} />

            <div style={{ padding:"28px 32px 24px" }}>
              {/* Icon + title */}
              <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:22 }}>
                <div style={{ width:44, height:44, borderRadius:12, background:"linear-gradient(135deg,rgba(37,99,235,0.2),rgba(124,58,237,0.2))", border:"1px solid rgba(99,179,237,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>✦</div>
                <div>
                  <div style={{ color:"#f0f9ff", fontSize:15, fontWeight:700, fontFamily:"'Space Grotesk',sans-serif", letterSpacing:-0.3 }}>Re-engagement Reminder</div>
                  <div style={{ color:"#334155", fontSize:11, fontFamily:"'JetBrains Mono',monospace", marginTop:2 }}>Sending to {reminderTarget.name} · {reminderTarget.email}</div>
                </div>
              </div>

              {/* Message preview card */}
              <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(99,179,237,0.08)", borderRadius:12, padding:"20px 22px", marginBottom:20, position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", right:-20, top:-20, width:100, height:100, borderRadius:"50%", background:"radial-gradient(circle,rgba(37,99,235,0.08),transparent)" }} />

                <div style={{ color:"rgba(148,163,184,0.4)", fontSize:8, letterSpacing:2, fontFamily:"'JetBrains Mono',monospace", marginBottom:12, textTransform:"uppercase" }}>Message Preview</div>

                <div style={{ color:"#e2e8f0", fontSize:13, lineHeight:1.85, fontFamily:"'Space Grotesk',sans-serif" }}>
                  <p style={{ margin:"0 0 12px" }}>Hey <strong style={{ color:"#60a5fa" }}>{reminderTarget.name.split(" ")[0]}</strong> 👋</p>
                  <p style={{ margin:"0 0 12px" }}>
                    We've been keeping your seat warm. You built something real here: <strong style={{ color:"#a5f3fc" }}>{reminderTarget.trips.toLocaleString()} trips</strong>, a <strong style={{ color:"#fde68a" }}>★ {reminderTarget.rating.toFixed(2)}</strong> rating, and a reputation riders trust.
                  </p>
                  <p style={{ margin:"0 0 12px" }}>
                    Why not reactivate your <strong style={{ color:"#c4b5fd" }}>Zeez Ryde</strong> and get back on the road...?
                  </p>
                  <p style={{ margin:"0 0 16px" }}>
                    The platform is growing. The rides are waiting.{" "}
                    <strong style={{ color:"#f9a8d4" }}>We are waiting for you...!</strong>
                  </p>
                  <p style={{ margin:0, color:"#64748b", fontSize:12 }}>
                    — The Zeez Ryde Team 🚀
                  </p>
                </div>
              </div>

              {/* Delivery channels */}
              <div style={{ display:"flex", gap:8, marginBottom:22 }}>
                {[["📧","Email",reminderTarget.email],["📱","SMS",reminderTarget.phone]].map(([icon,label,val])=>(
                  <div key={label} style={{ flex:1, background:"rgba(255,255,255,0.02)", border:"1px solid rgba(99,179,237,0.08)", borderRadius:9, padding:"10px 12px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3 }}>
                      <span style={{ fontSize:13 }}>{icon}</span>
                      <span style={{ color:"rgba(148,163,184,0.5)", fontSize:8, fontWeight:700, letterSpacing:2, fontFamily:"'JetBrains Mono',monospace", textTransform:"uppercase" }}>{label}</span>
                    </div>
                    <div style={{ color:"#475569", fontSize:10, fontFamily:"'JetBrains Mono',monospace" }}>{val}</div>
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div style={{ display:"flex", gap:10 }}>
                <button
                  onClick={() => setReminderTarget(null)}
                  style={{ flex:1, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(99,179,237,0.1)", color:"#64748b", borderRadius:10, padding:"12px", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"'Space Grotesk',sans-serif" }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setReminderSent(prev => ({ ...prev, [reminderTarget.id]: true }));
                    setReminderTarget(null);
                    flash("Reminder sent to " + reminderTarget.name);
                  }}
                  style={{ flex:2, background:"linear-gradient(135deg,#2563eb,#7c3aed)", border:"none", color:"#fff", borderRadius:10, padding:"12px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"'Space Grotesk',sans-serif", letterSpacing:0.3, boxShadow:"0 4px 20px rgba(37,99,235,0.35)" }}
                >
                  ✦ Send Reminder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE: RIDERS
// ─────────────────────────────────────────────────────────────────────────────
function PageRiders({ viewOnly, riders, search, filter, setFilter, patchRider, setModal }) {
  const counts = {
    all:       riders.length,
    active:    riders.filter(r => r.status === "active").length,
    suspended: riders.filter(r => r.status === "suspended").length,
    inactive:  riders.filter(r => r.status === "inactive").length,
  };

  const visible = riders
    .filter(r => filter === "all" || r.status === filter)
    .filter(r => !search || [r.name, r.email, r.id].some(f => f.toLowerCase().includes(search.toLowerCase())));

  return (
    <div>
      <SectionHdr title="Riders" sub={`${riders.length} registered · ${riders.filter(r=>r.status==="active").length} active`} />

      <div style={{ display:"flex", gap:6, marginBottom:16 }}>
        {Object.entries(counts).map(([k, v]) => (
          <FilterPill key={k} label={k} count={v} active={filter === k} onClick={() => setFilter(k)} accent="#a78bfa" />
        ))}
      </div>

      <Panel>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr>{["RIDER","CONTACT","STATUS","RATING","TRIPS","TOTAL SPENT","PAYMENT","JOINED","ACTIONS"].map(h=><Th key={h}>{h}</Th>)}</tr></thead>
          <tbody>
            {visible.map(r => (
              <tr key={r.id} className="trow">
                <Td>
                  <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                    <Avi name={r.name} seed={r.id} hue={260} />
                    <div>
                      <div style={{ color:"#e2e8f0", fontSize:13, fontWeight:500 }}>{r.name}</div>
                      <Mono small>{r.id}</Mono>
                    </div>
                  </div>
                </Td>
                <Td>
                  <div style={{ color:"#64748b", fontSize:11 }}>{r.email}</div>
                  <div style={{ color:"#334155", fontSize:10, marginTop:1 }}>{r.phone}</div>
                </Td>
                <Td><StatusBadge s={r.status} /></Td>
                <Td><span style={{ color:"#f59e0b", fontWeight:700, fontSize:12, fontFamily:"'JetBrains Mono',monospace" }}>★ {r.rating.toFixed(2)}</span></Td>
                <Td><span style={{ color:"#e2e8f0", fontWeight:600, fontFamily:"'JetBrains Mono',monospace" }}>{r.trips}</span></Td>
                <Td><span style={{ color:"#22c55e", fontWeight:700, fontFamily:"'JetBrains Mono',monospace", fontSize:12 }}>{r.spent}</span></Td>
                <Td><span style={{ color:"#64748b", fontSize:11 }}>{r.payment}</span></Td>
                <Td><span style={{ color:"#334155", fontSize:11, fontFamily:"'JetBrains Mono',monospace" }}>{r.joined}</span></Td>
                <Td>
                  <div style={{ display:"flex", gap:5 }}>
                    <ActBtn onClick={() => setModal({ type:"rider", data:r })}>View</ActBtn>
                    {!viewOnly && (r.status === "active"
                      ? <ActBtn danger onClick={() => patchRider(r.id, { status:"suspended" })}>Suspend</ActBtn>
                      : <ActBtn success onClick={() => patchRider(r.id, { status:"active" })}>Reinstate</ActBtn>
                    )}
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
        {visible.length === 0 && <EmptyRow text="No riders match your filter." />}
      </Panel>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE: TRIPS
// ─────────────────────────────────────────────────────────────────────────────
function PageTrips({ trips, search }) {
  const visible = trips.filter(t =>
    !search || [t.id, t.rider, t.driver, t.to, t.from].some(f => f.toLowerCase().includes(search.toLowerCase()))
  );
  const done   = visible.filter(t => t.status === "completed");
  const canc   = visible.filter(t => t.status === "cancelled");
  const grossFare = done.reduce((s, t) => s + parseFloat(t.fare.replace("CA$","") || 0), 0);
  const grossPlat = done.reduce((s, t) => s + parseFloat(t.platform.replace("CA$","") || 0), 0);

  return (
    <div>
      <SectionHdr title="Trips" sub={`${trips.length} total records`} />

      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10, marginBottom:18 }}>
        {[
          ["TOTAL",     visible.length,              "#93c5fd"],
          ["COMPLETED", done.length,                 "#22c55e"],
          ["CANCELLED", canc.length,                 "#ef4444"],
          ["GROSS FARE",`CA$${grossFare.toFixed(2)}`, "#f59e0b"],
        ].map(([l, v, c]) => (
          <div key={l} style={{ background:"#0d1220", border:"1px solid rgba(99,179,237,0.08)", borderRadius:10, padding:"14px 16px" }}>
            <div style={{ color:"rgba(148,163,184,0.4)", fontSize:8, fontWeight:700, letterSpacing:2, fontFamily:"'JetBrains Mono',monospace", marginBottom:6 }}>{l}</div>
            <div style={{ color:c, fontSize:22, fontWeight:700, fontFamily:"'JetBrains Mono',monospace" }}>{v}</div>
          </div>
        ))}
      </div>

      <Panel>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr>{["TRIP ID","DATE","RIDER","DRIVER","ROUTE","TYPE","FARE","DRIVER EARNED","PLATFORM","STATUS"].map(h=><Th key={h}>{h}</Th>)}</tr></thead>
          <tbody>
            {visible.map(t => (
              <tr key={t.id} className="trow">
                <Td><Mono small>{t.id}</Mono></Td>
                <Td>
                  <div style={{ color:"#64748b", fontSize:11, fontFamily:"'JetBrains Mono',monospace" }}>{t.date}</div>
                  <div style={{ color:"#334155", fontSize:10, fontFamily:"'JetBrains Mono',monospace" }}>{t.time}</div>
                </Td>
                <Td muted>{t.rider}</Td>
                <Td muted>{t.driver}</Td>
                <Td>
                  <div style={{ color:"#475569", fontSize:10, maxWidth:130 }}>{t.from}</div>
                  <div style={{ color:"#334155", fontSize:10 }}>→ {t.to}</div>
                </Td>
                <Td><span style={{ color:"#64748b", fontSize:11 }}>{t.type}</span></Td>
                <Td><span style={{ color:"#f0f9ff", fontWeight:600, fontFamily:"'JetBrains Mono',monospace", fontSize:12 }}>{t.fare}</span></Td>
                <Td><span style={{ color:"#22c55e", fontWeight:600, fontFamily:"'JetBrains Mono',monospace", fontSize:12 }}>{t.driverCut}</span></Td>
                <Td><span style={{ color:"#a78bfa", fontWeight:600, fontFamily:"'JetBrains Mono',monospace", fontSize:12 }}>{t.platform}</span></Td>
                <Td><StatusBadge s={t.status} /></Td>
              </tr>
            ))}
          </tbody>
        </table>
        {visible.length === 0 && <EmptyRow text="No trips match your search." />}
      </Panel>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE: SUBSCRIPTIONS
// ─────────────────────────────────────────────────────────────────────────────
function PageSubs({ subs, drivers }) {
  const paid   = subs.filter(s => s.status === "paid");
  const notPaid= subs.filter(s => s.status !== "paid");

  return (
    <div>
      <SectionHdr title="Subscriptions" sub="Weekly CA$25 driver pass · renews every Monday" />

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:18 }}>
        {[
          ["ACTIVE PASSES",   paid.length,              "rgba(34,197,94,0.07)",  "rgba(34,197,94,0.15)",  "#22c55e"],
          ["UNPAID / FAILED", notPaid.length,            "rgba(239,68,68,0.07)",  "rgba(239,68,68,0.15)",  "#ef4444"],
          ["WEEKLY REVENUE",  `CA$${paid.length * 25}`,  "rgba(245,158,11,0.07)", "rgba(245,158,11,0.15)", "#f59e0b"],
        ].map(([l, v, bg, border, c]) => (
          <div key={l} style={{ background:bg, border:`1px solid ${border}`, borderRadius:10, padding:"16px 20px" }}>
            <div style={{ color:"rgba(148,163,184,0.4)", fontSize:8, fontWeight:700, letterSpacing:2, fontFamily:"'JetBrains Mono',monospace", marginBottom:8 }}>{l}</div>
            <div style={{ color:c, fontSize:28, fontWeight:700, fontFamily:"'JetBrains Mono',monospace" }}>{v}</div>
          </div>
        ))}
      </div>

      <Panel title="ALL SUBSCRIPTION RECORDS" style={{ marginBottom:14 }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr>{["PAYMENT ID","DRIVER","AMOUNT","DATE","METHOD","STATUS"].map(h=><Th key={h}>{h}</Th>)}</tr></thead>
          <tbody>
            {subs.map(s => (
              <tr key={s.id} className="trow">
                <Td><Mono small>{s.id}</Mono></Td>
                <Td><span style={{ color:"#cbd5e1", fontSize:13 }}>{s.driver}</span></Td>
                <Td><span style={{ color:"#f0f9ff", fontWeight:600, fontFamily:"'JetBrains Mono',monospace" }}>{s.amount}</span></Td>
                <Td><span style={{ color:"#64748b", fontSize:11, fontFamily:"'JetBrains Mono',monospace" }}>{s.date}</span></Td>
                <Td><span style={{ color:"#64748b", fontSize:11 }}>{s.method}</span></Td>
                <Td>
                  <span style={{ background:s.status==="paid"?"rgba(34,197,94,0.08)":s.status==="failed"?"rgba(239,68,68,0.08)":"rgba(245,158,11,0.08)", border:`1px solid ${s.status==="paid"?"rgba(34,197,94,0.2)":s.status==="failed"?"rgba(239,68,68,0.2)":"rgba(245,158,11,0.2)"}`, color:s.status==="paid"?"#22c55e":s.status==="failed"?"#ef4444":"#f59e0b", fontSize:9, fontWeight:700, padding:"2px 9px", borderRadius:4, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1, textTransform:"uppercase" }}>
                    {s.status}
                  </span>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      {notPaid.length > 0 && (
        <div style={{ background:"rgba(239,68,68,0.04)", border:"1px solid rgba(239,68,68,0.15)", borderRadius:12, overflow:"hidden" }}>
          <div style={{ padding:"12px 18px", background:"rgba(239,68,68,0.07)", borderBottom:"1px solid rgba(239,68,68,0.12)", display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ color:"#ef4444", fontSize:12 }}>⚠</span>
            <span style={{ color:"#ef4444", fontSize:12, fontWeight:600, fontFamily:"'JetBrains Mono',monospace" }}>DRIVERS BLOCKED — subscription not paid</span>
          </div>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr>{["DRIVER ID","DRIVER NAME","REASON","ACTION"].map(h=><Th key={h}>{h}</Th>)}</tr></thead>
            <tbody>
              {notPaid.map(s => (
                <tr key={s.id} className="trow">
                  <Td><Mono small>{s.dId}</Mono></Td>
                  <Td><span style={{ color:"#e2e8f0", fontSize:13 }}>{s.driver}</span></Td>
                  <Td>
                    <span style={{ background:s.status==="failed"?"rgba(239,68,68,0.1)":"rgba(245,158,11,0.1)", color:s.status==="failed"?"#ef4444":"#f59e0b", fontSize:10, fontWeight:600, padding:"2px 8px", borderRadius:4 }}>
                      {s.status==="failed"?"Payment failed":"No payment made"}
                    </span>
                  </Td>
                  <Td><ActBtn>Send Reminder</ActBtn></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// UBER BENCHMARK RATES — GTA / Toronto (source: taxifarefinder.com, 2026)
// ─────────────────────────────────────────────────────────────────────────────
// UberX Toronto:  CA$2.50 base | CA$0.81/km | CA$0.18/min | CA$5.25 minimum
// UberXL Toronto: CA$5.00 base | CA$1.20/km | CA$0.25/min | CA$8.00 minimum
// (UberXL is the closest equivalent to ZeezRyde "Friends" ride type)
//
// UNDERCUT ENGINE:
//   Given a target undercut margin (e.g. 10%), it solves for ZeezRyde rates
//   such that: zeezFare(km, min) = uberFare(km, min) x (1 − margin/100)
//
//   To keep the ratio constant across all trip lengths we solve each component:
//     zeezBase   = uberBase   x (1 − margin/100)
//     zeezPerKm  = uberPerKm  x (1 − margin/100)
//     zeezPerMin = uberPerMin x (1 − margin/100)
//     zeezMin    = uberMin    x (1 − margin/100)
//
//   This guarantees ZeezRyde is always exactly `margin`% cheaper than Uber
//   regardless of trip distance or duration.

const UBER_RATES = {
  uberX: {
    label:       "UberX",
    baseFare:    2.50,
    ratePerKm:   0.81,
    ratePerMin:  0.18,
    minimumFare: 5.25,
  },
  uberXL: {
    label:       "UberXL",
    baseFare:    5.00,
    ratePerKm:   1.20,
    ratePerMin:  0.25,
    minimumFare: 8.00,
  },
};

// Calculate what Uber charges for a given trip
function calcUberFare(product, distKm, durationMin) {
  const r = UBER_RATES[product];
  return Math.max(r.baseFare + distKm * r.ratePerKm + durationMin * r.ratePerMin, r.minimumFare);
}

// Given a desired undercut margin %, return ZeezRyde rates that guarantee we're cheaper
function deriveUndercutRates(uberProduct, marginPct) {
  const r      = UBER_RATES[uberProduct];
  const factor = 1 - (marginPct / 100);
  return {
    baseFare:    Math.round(r.baseFare    * factor * 100) / 100,
    ratePerKm:   Math.round(r.ratePerKm  * factor * 100) / 100,
    ratePerMin:  Math.round(r.ratePerMin * factor * 100) / 100,
    minimumFare: Math.round(r.minimumFare* factor * 100) / 100,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// PRICING ENGINE
// ─────────────────────────────────────────────────────────────────────────────
//
// Formula:
//   subtotal  = baseFare + (distKm x ratePerKm) + (durationMin x ratePerMin)
//   subtotal  = max(subtotal, minimumFare)
//   surged    = subtotal x surgeMultiplier
//   typed     = surged  x rideTypeMultiplier
//   total     = round(typed, 2)
//   driverCut = total x (1 − commissionPct / 100)
//   platform  = total x (commissionPct / 100)
//
// Surge multiplier is determined by demand tier:
//   Low  (0–39% online drivers busy)  → 1.0x
//   Med  (40–69%)                     → 1.2x
//   High (70–89%)                     → 1.5x
//   Peak (90–100%)                    → 2.0x

function calcFare(cfg, distKm, durationMin) {
  const { baseFare, ratePerKm, ratePerMin, minimumFare, surgeMultiplier, commPct } = cfg;
  const subtotal  = Math.max(baseFare + distKm * ratePerKm + durationMin * ratePerMin, minimumFare);
  const surged    = subtotal * surgeMultiplier;
  const total     = Math.round(surged * 100) / 100;
  const platform  = Math.round(total * (commPct / 100) * 100) / 100;
  const driverCut = Math.round((total - platform) * 100) / 100;
  return { total, platform, driverCut };
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE: SETTINGS
// ─────────────────────────────────────────────────────────────────────────────
// ─── PAGE: DATA MANAGEMENT ───────────────────────────────────────────────────
function PageDataManagement({ viewOnly }) {
  if (viewOnly) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:400, gap:16 }}>
      <div style={{ fontSize:48 }}>🔒</div>
      <div style={{ color:"#f59e0b", fontSize:16, fontWeight:700 }}>Access Restricted</div>
      <div style={{ color:"#64748b", fontSize:13, textAlign:"center", maxWidth:300 }}>Data Management is not available for View Only accounts. Contact the Super Admin for access.</div>
    </div>
  );
  const SUPABASE_URL  = "https://bkbpsobvhxxvlzlmzsmy.supabase.co";
  const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrYnBzb2J2aHh4dmx6bG16c215Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0NzQ4MTUsImV4cCI6MjA4OTA1MDgxNX0.PLJyaouYk4FLfcZwVy_YsKMmny2a6DqrYOn_3jmpgMI";

  const TABLES = [
    { id:"auth_users",       label:"Auth Users (Login Accounts)", desc:"Deletes all registered user accounts",       danger:true  },
    { id:"riders",           label:"Riders",                       desc:"All rider profiles",                        danger:false },
    { id:"drivers",          label:"Drivers",                      desc:"All driver profiles",                       danger:false },
    { id:"trips",            label:"Trips",                        desc:"All completed and active trips",            danger:false },
    { id:"subscriptions",    label:"Subscriptions",                desc:"All driver subscription records",          danger:false },
    { id:"driver_documents", label:"Driver Documents",             desc:"All uploaded document records",            danger:false },
    { id:"promos",           label:"Promo Codes",                  desc:"All promo/discount codes",                 danger:false },
  ];

  const [checked, setChecked]     = useState({});
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy]           = useState(false);
  const [results, setResults]     = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  function toggleAll(val) {
    setSelectAll(val);
    const next = {};
    TABLES.forEach(t => { next[t.id] = val; });
    setChecked(next);
  }

  function toggle(id) {
    setChecked(prev => {
      const next = { ...prev, [id]: !prev[id] };
      setSelectAll(TABLES.every(t => next[t.id]));
      return next;
    });
  }

  const selected = TABLES.filter(t => checked[t.id]);

  async function doDelete() {
    if (selected.length === 0) return;
    setBusy(true);
    setResults([]);
    const logs = [];

    // Use npm Supabase client
    const db = createClient(SUPABASE_URL, SUPABASE_ANON);

    for (const t of selected) {
      try {
        if (t.id === "auth_users") {
          // Auth users — call sign out for current session only (anon key can't mass-delete auth)
          const { error } = await db.auth.admin ? db.auth.admin.deleteUser("") : { error: { message: "Use Supabase SQL Editor: DELETE FROM auth.users" } };
          if (error) {
            logs.push({ id: t.id, label: t.label, status: "info", msg: "Run in SQL Editor: DELETE FROM auth.users;" });
          } else {
            logs.push({ id: t.id, label: t.label, status: "ok", msg: "Deleted" });
          }
        } else {
          const { error } = await db.from(t.id).delete().neq("id", "00000000-0000-0000-0000-000000000000");
          if (error) throw error;
          logs.push({ id: t.id, label: t.label, status: "ok", msg: "All records deleted" });
        }
      } catch (e) {
        logs.push({ id: t.id, label: t.label, status: "error", msg: e.message || "Failed" });
      }
    }

    setResults(logs);
    setBusy(false);
    setConfirming(false);
    setChecked({});
    setSelectAll(false);
  }

  return (
    <div style={{ padding:32, maxWidth:700 }}>
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:22, fontWeight:800, color:"#f1f5f9", marginBottom:6 }}>🗑 Data Management</div>
        <div style={{ fontSize:13, color:"#64748b" }}>Select the tables you want to clear. This action is permanent and cannot be undone.</div>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div style={{ marginBottom:24, background:"#0f172a", borderRadius:12, padding:16, border:"1px solid #1e293b" }}>
          <div style={{ fontSize:12, fontWeight:700, color:"#94a3b8", letterSpacing:1, textTransform:"uppercase", marginBottom:10 }}>Results</div>
          {results.map(r => (
            <div key={r.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"7px 0", borderBottom:"1px solid #1e293b" }}>
              <span style={{ fontSize:16 }}>{r.status==="ok"?"✅":r.status==="info"?"ℹ️":"❌"}</span>
              <span style={{ flex:1, fontSize:13, color:"#e2e8f0" }}>{r.label}</span>
              <span style={{ fontSize:12, color:r.status==="ok"?"#22c55e":r.status==="info"?"#f59e0b":"#ef4444" }}>{r.msg}</span>
            </div>
          ))}
          <button onClick={()=>setResults([])} style={{ marginTop:10, background:"none", border:"none", color:"#64748b", fontSize:12, cursor:"pointer" }}>Dismiss</button>
        </div>
      )}

      {/* Select All */}
      <div style={{ background:"#0f172a", borderRadius:14, border:"1px solid #1e293b", overflow:"hidden", marginBottom:20 }}>
        <div style={{ padding:"12px 20px", borderBottom:"1px solid #1e293b", display:"flex", alignItems:"center", gap:12, background:"#0d1117" }}>
          <input type="checkbox" checked={selectAll} onChange={e=>toggleAll(e.target.checked)}
            style={{ width:18, height:18, cursor:"pointer", accentColor:"#ef4444" }} />
          <span style={{ fontSize:13, fontWeight:700, color:"#94a3b8" }}>Select All Tables</span>
        </div>

        {TABLES.map((t, i) => (
          <div key={t.id} style={{ padding:"14px 20px", borderBottom: i<TABLES.length-1?"1px solid #1e293b":"none", display:"flex", alignItems:"center", gap:14, background: checked[t.id]?"rgba(239,68,68,0.05)":"transparent", transition:"background 0.15s" }}>
            <input type="checkbox" checked={!!checked[t.id]} onChange={()=>toggle(t.id)}
              style={{ width:18, height:18, cursor:"pointer", accentColor:"#ef4444", flexShrink:0 }} />
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:600, color: checked[t.id]?"#fca5a5":"#e2e8f0" }}>{t.label}</div>
              <div style={{ fontSize:12, color:"#475569", marginTop:2 }}>{t.desc}</div>
            </div>
            {t.danger && (
              <span style={{ background:"rgba(239,68,68,0.15)", color:"#ef4444", fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:20, border:"1px solid rgba(239,68,68,0.3)" }}>HIGH RISK</span>
            )}
          </div>
        ))}
      </div>

      {/* Action buttons */}
      {viewOnly && <div style={{ padding:"12px 16px", background:"rgba(245,158,11,0.1)", border:"1px solid rgba(245,158,11,0.2)", borderRadius:8, color:"#f59e0b", fontSize:12, fontWeight:600 }}>👁 View Only — you cannot delete or download data</div>}
      {!viewOnly && !confirming ? (
        <div style={{ display:"flex", gap:10 }}>
          <button
            onClick={() => {
              if (selected.length === 0) return;
              const SB_URL = "https://bkbpsobvhxxvlzlmzsmy.supabase.co";
              const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrYnBzb2J2aHh4dmx6bG16c215Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0NzQ4MTUsImV4cCI6MjA4OTA1MDgxNX0.PLJyaouYk4FLfcZwVy_YsKMmny2a6DqrYOn_3jmpgMI";
              selected.forEach(async (tbl) => {
                try {
                  const res = await fetch(`${SB_URL}/rest/v1/${tbl.id}?select=*`, {
                    headers:{ apikey:SB_KEY, Authorization:`Bearer ${SB_KEY}` }
                  });
                  const rows = await res.json();
                  if (!rows||!rows.length){ alert(`No data in ${tbl.label}`); return; }
                  const cols = Object.keys(rows[0]);
                  const csv = [cols.join(","),...rows.map(r=>cols.map(c=>JSON.stringify(r[c]??'')).join(","))].join("\n");
                  const blob = new Blob([csv],{type:"text/csv"});
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href=url; a.download=`${tbl.id}_${new Date().toISOString().slice(0,10)}.csv`;
                  a.click(); URL.revokeObjectURL(url);
                } catch(e){ console.error("CSV:",e); }
              });
            }}
            disabled={selected.length===0}
            style={{ padding:"12px 20px", borderRadius:10, border:"none",
              cursor:selected.length>0?"pointer":"not-allowed",
              background:selected.length>0?"#22c55e":"#1e293b",
              color:selected.length>0?"#fff":"#475569",
              fontSize:13, fontWeight:700 }}>
            ↓ Download CSV
          </button>
          <button
            onClick={()=>setConfirming(true)}
            disabled={selected.length===0}
            style={{ padding:"12px 28px", borderRadius:10, border:"none",
              background:selected.length>0?"#ef4444":"#334155",
              color:"#fff", fontWeight:700, fontSize:14,
              cursor:selected.length>0?"pointer":"not-allowed",
              opacity:selected.length>0?1:0.5 }}>
            {selected.length===0 ? "Delete" : `Delete ${selected.length} table${selected.length>1?"s":""}`}
          </button>
        </div>
      ) : null}
      {!viewOnly && confirming && (
        <div style={{ background:"rgba(239,68,68,0.1)", border:"1.5px solid #ef4444", borderRadius:12, padding:20 }}>
          <div style={{ fontSize:14, fontWeight:700, color:"#fca5a5", marginBottom:8 }}>⚠️ Are you sure?</div>
          <div style={{ fontSize:13, color:"#94a3b8", marginBottom:16 }}>
            You are about to permanently delete all data in: <strong style={{ color:"#fca5a5" }}>{selected.map(t=>t.label).join(", ")}</strong>. This cannot be undone.
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={()=>setConfirming(false)} style={{ flex:1, padding:"10px", borderRadius:8, border:"1px solid #334155", background:"transparent", color:"#94a3b8", fontWeight:600, fontSize:13, cursor:"pointer" }}>
              Cancel
            </button>
            <button onClick={doDelete} disabled={busy} style={{ flex:2, padding:"10px", borderRadius:8, border:"none", background:"#ef4444", color:"#fff", fontWeight:700, fontSize:13, cursor:busy?"not-allowed":"pointer" }}>
              {busy ? "Deleting..." : "Yes, Delete Permanently"}
            </button>
          </div>
        </div>
      )}

      {/* Auth users note */}
      {checked["auth_users"] && (
        <div style={{ marginTop:16, background:"rgba(245,158,11,0.1)", border:"1px solid rgba(245,158,11,0.3)", borderRadius:10, padding:14 }}>
          <div style={{ fontSize:12, color:"#fcd34d", fontWeight:600, marginBottom:4 }}>ℹ️ Auth Users require manual SQL</div>
          <div style={{ fontSize:12, color:"#94a3b8" }}>Due to Supabase security, auth users must be deleted via SQL Editor. After clicking delete, also run this in your Supabase SQL Editor:</div>
          <div style={{ fontFamily:"monospace", fontSize:12, color:"#22c55e", background:"#0f172a", borderRadius:6, padding:"8px 12px", marginTop:8 }}>DELETE FROM auth.users;</div>
        </div>
      )}
    </div>
  );
}

function PageSettings({ viewOnly, airportFareYYZ, setAirportFareYYZ, airportFareYHM, setAirportFareYHM, airportFareYTZ, setAirportFareYTZ, airportBookingFee, setAirportBookingFee, airportMinNotice, setAirportMinNotice, shuttleBaseFare, setShuttleBaseFare, shuttlePeakMult, setShuttlePeakMult, shuttleBookingFee, setShuttleBookingFee, shuttlePeakOn, setShuttlePeakOn, riderDelayFee, setRiderDelayFee, driverCancelFee, setDriverCancelFee, surgeEnabled, setSurgeEnabled, surgeRadiusKm, setSurgeRadiusKm, subFee, setSubFee, commPct, setCommPct, countdown, setCountdown, reqSub, setReqSub, autoSusp, setAutoSusp, adminAlert, setAdminAlert, flash, trips, drivers, subs, maxPickupKm, setMaxPickupKm, pickupFeeKm, setPickupFeeKm, dispatchMode, setDispatchMode, pickupFeeOn, setPickupFeeOn, baseFare, setBaseFare, ratePerKm, setRatePerKm, ratePerMin, setRatePerMin, minimumFare, setMinimumFare, beyondCapKm, setBeyondCapKm, beyondFeeFlat, setBeyondFeeFlat, beyondFeeOn, setBeyondFeeOn, waitFeeOn, setWaitFeeOn, waitFeeRate, setWaitFeeRate, waitFeeMinutes, setWaitFeeMinutes }) {

  // ── Pricing state (lifted to App — received as props) ────────────────────
  const [demandTier,  setDemandTier]  = useState("low");   // low | med | high | peak
  const [familyMult,  setFamilyMult]  = useState("1.00");
  const [friendsMult, setFriendsMult] = useState("2.10");

  // ── Fare calculator preview inputs ───────────────────────────────────────
  const [previewKm,  setPreviewKm]  = useState("8");
  const [previewMin, setPreviewMin] = useState("14");
  const [previewType, setPreviewType] = useState("family");

  const SURGE_MAP = { low:1.0, med:1.2, high:1.5, peak:2.0 };
  const surgeMultiplier = SURGE_MAP[demandTier];
  const typeMult = previewType === "family" ? parseFloat(familyMult)||1 : parseFloat(friendsMult)||1;

  const cfg = {
    baseFare:       parseFloat(baseFare)    || 0,
    ratePerKm:      parseFloat(ratePerKm)   || 0,
    ratePerMin:     parseFloat(ratePerMin)  || 0,
    minimumFare:    parseFloat(minimumFare) || 0,
    surgeMultiplier,
    commPct:        parseFloat(commPct)     || 0,
  };

  // Apply ride-type multiplier on top of engine output
  const raw = calcFare(cfg, parseFloat(previewKm)||0, parseFloat(previewMin)||0);
  const previewBase = Math.round(raw.total * typeMult * 100) / 100;
  const preview = {
    total:     Math.round(previewBase * 1.13 * 100) / 100,
    platform:  Math.round(previewBase * (cfg.commPct/100) * 100) / 100,
    driverCut: Math.round(previewBase * (1 - cfg.commPct/100) * 100) / 100,
    tax:       Math.round(previewBase * 0.13 * 100) / 100,
  };

  // Fare breakdown steps for the explainer
  const subtotalRaw   = Math.max(cfg.baseFare + (parseFloat(previewKm)||0)*cfg.ratePerKm + (parseFloat(previewMin)||0)*cfg.ratePerMin, cfg.minimumFare);
  const afterSurge    = Math.round(subtotalRaw * surgeMultiplier * 100) / 100;
  const afterType     = Math.round(afterSurge * typeMult * 100) / 100;

  const TIER_LABELS = { low:"Low (1.0x)", med:"Medium (1.2x)", high:"High (1.5x)", peak:"Peak (2.0x)" };
  const TIER_COLORS = { low:"#22c55e", med:"#f59e0b", high:"#f97316", peak:"#ef4444" };

  async function handleSave() {
    const errors = [];
    if (isNaN(parseFloat(baseFare))   || parseFloat(baseFare)   < 0) errors.push("Base fare");
    if (isNaN(parseFloat(ratePerKm))  || parseFloat(ratePerKm)  < 0) errors.push("Rate/km");
    if (isNaN(parseFloat(ratePerMin)) || parseFloat(ratePerMin) < 0) errors.push("Rate/min");
    if (isNaN(parseFloat(minimumFare))|| parseFloat(minimumFare)< 0) errors.push("Min fare");
    if (isNaN(parseFloat(commPct))    || parseFloat(commPct) < 0 || parseFloat(commPct) > 100) errors.push("Commission %");
    if (errors.length) { flash(`Invalid values: ${errors.join(", ")}`, false); return; }
    // Persist to localStorage so settings survive page refresh
    const settings = {
      baseFare, ratePerKm, ratePerMin, minimumFare, familyMult, friendsMult,
      commPct, subFee, countdown, reqSub, surgeEnabled, surgeRadiusKm,
      demandTier, maxPickupKm, pickupFeeKm, pickupFeeOn,
      beyondCapKm, beyondFeeFlat, beyondFeeOn, waitFeeOn, waitFeeRate, waitFeeMinutes,
      riderDelayFee, driverCancelFee, dispatchMode, autoSusp, adminAlert,
      airportFareYYZ, airportFareYHM, airportFareYTZ, airportBookingFee, airportMinNotice,
      shuttleBaseFare, shuttleBookingFee, shuttlePeakOn, shuttlePeakMult,
    };
    try {
      const clean = Object.fromEntries(
        Object.entries(settings).filter(([,v]) => typeof v !== "object" || v === null)
      );
      localStorage.setItem("zeez_settings", JSON.stringify(clean));
    } catch(e) {
      // Quota exceeded - clear old bloat and try again with minimal data
      try {
        localStorage.removeItem("zeez_settings");
        localStorage.setItem("zeez_settings", JSON.stringify(settings));
      } catch(e2) { console.error("localStorage quota:", e2); }
    }
    // Also save to Supabase settings table for cross-device persistence
    try {
      const sb = await getSupabase();
      await sb.from("settings").upsert({ key:"admin_settings", value:settings, updated_at:new Date().toISOString() });
    } catch(e) { console.error("Settings Supabase save:", e); }
    // Push live to rider/driver app via bridge
    try {
      if (window.__zeezAdmin) {
        if (window.__zeezAdmin.setBaseFare)    window.__zeezAdmin.setBaseFare(baseFare);
        if (window.__zeezAdmin.setRatePerKm)   window.__zeezAdmin.setRatePerKm(ratePerKm);
        if (window.__zeezAdmin.setRatePerMin)  window.__zeezAdmin.setRatePerMin(ratePerMin);
        if (window.__zeezAdmin.setCommPct)     window.__zeezAdmin.setCommPct(commPct);
        if (window.__zeezAdmin.setSubFee)      window.__zeezAdmin.setSubFee(subFee);
        if (window.__zeezAdmin.setSurgeEnabled) window.__zeezAdmin.setSurgeEnabled(surgeEnabled);
      }
    } catch(e) {}
    flash("Settings saved successfully ✓");
  }

  const inp = (val, set, w=80) => (
    <input value={val} onChange={e => set(e.target.value)} style={{ width:w, padding:"6px 10px", background:"#0d1220", border:"1px solid rgba(99,179,237,0.15)", borderRadius:6, fontSize:13, fontWeight:700, color:"#60a5fa", fontFamily:"'JetBrains Mono',monospace", outline:"none", textAlign:"center" }} />
  );

  return (
    <div style={{ maxWidth:860 }}>
      <SectionHdr title="Settings" sub="Pricing engine, platform fees, and enforcement rules" />
      {viewOnly && (
        <div style={{ marginBottom:16, padding:"12px 16px", background:"rgba(245,158,11,0.1)", border:"1px solid rgba(245,158,11,0.3)", borderRadius:10, color:"#f59e0b", fontSize:12, fontWeight:600 }}>
          👁 View Only — you can read all settings but cannot make changes
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, alignItems:"start", pointerEvents:viewOnly?"none":"auto", userSelect:viewOnly?"none":"auto" }}>

        {/* ── LEFT COLUMN ── */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

          {/* Base fare structure */}
          <SettingsPanel title="BASE FARE STRUCTURE">
            <div style={{ color:"#334155", fontSize:10, marginBottom:14, lineHeight:1.6 }}>
              Every trip starts with a base fare, then adds per-kilometre and per-minute charges. The minimum fare applies if the calculated amount falls below it.
            </div>
            {[
              { label:"Base Fare",       sub:"Fixed charge every trip starts with",           prefix:"CA$", val:baseFare,    set:setBaseFare    },
              { label:"Rate per km",     sub:"Charged for every kilometre driven",             prefix:"CA$", val:ratePerKm,   set:setRatePerKm   },
              { label:"Rate per minute", sub:"Charged for every minute of trip duration",      prefix:"CA$", val:ratePerMin,  set:setRatePerMin  },
              { label:"Minimum Fare",    sub:"Floor price — no trip can be charged below this",prefix:"CA$", val:minimumFare, set:setMinimumFare },
            ].map(f => (
              <div key={f.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:"1px solid rgba(99,179,237,0.07)" }}>
                <div>
                  <div style={{ color:"#cbd5e1", fontSize:12, fontWeight:500 }}>{f.label}</div>
                  <div style={{ color:"#334155", fontSize:10, marginTop:1 }}>{f.sub}</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                  <span style={{ color:"#475569", fontSize:12, fontFamily:"'JetBrains Mono',monospace" }}>{f.prefix}</span>
                  {inp(f.val, f.set)}
                </div>
              </div>
            ))}
          </SettingsPanel>

          {/* Ride type multipliers */}
          <SettingsPanel title="RIDE TYPE MULTIPLIERS">
            <div style={{ color:"#334155", fontSize:10, marginBottom:14, lineHeight:1.6 }}>
              Multiplied against the base fare calculation. 1.00 = no change. Friends rides carry more passengers so they are priced higher.
            </div>
            {[
              { label:"🚗 Family", sub:"Standard single-family ride", val:familyMult,  set:setFamilyMult  },
              { label:"🚐 Friends",sub:"Multi-passenger group ride",   val:friendsMult, set:setFriendsMult },
            ].map(f => (
              <div key={f.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:"1px solid rgba(99,179,237,0.07)" }}>
                <div>
                  <div style={{ color:"#cbd5e1", fontSize:12, fontWeight:500 }}>{f.label}</div>
                  <div style={{ color:"#334155", fontSize:10, marginTop:1 }}>{f.sub}</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                  <span style={{ color:"#475569", fontSize:12, fontFamily:"'JetBrains Mono',monospace" }}>x</span>
                  {inp(f.val, f.set)}
                </div>
              </div>
            ))}
          </SettingsPanel>

          {/* Commission + subscription */}
          <SettingsPanel title="PLATFORM FEES">
            {[
              { label:"Platform Commission", sub:"% kept from every completed fare",   prefix:"", val:commPct, set:setCommPct, suffix:"%" },
              { label:"Weekly Driver Pass",  sub:"Subscription charged every Monday",  prefix:"CA$", val:subFee, set:setSubFee, suffix:"/wk" },
              { label:"Request Countdown",   sub:"Seconds before a request auto-expires",prefix:"", val:countdown, set:setCountdown, suffix:"sec" },
            ].map(f => (
              <div key={f.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:"1px solid rgba(99,179,237,0.07)" }}>
                <div>
                  <div style={{ color:"#cbd5e1", fontSize:12, fontWeight:500 }}>{f.label}</div>
                  <div style={{ color:"#334155", fontSize:10, marginTop:1 }}>{f.sub}</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                  {f.prefix && <span style={{ color:"#475569", fontSize:12, fontFamily:"'JetBrains Mono',monospace" }}>{f.prefix}</span>}
                  {inp(f.val, f.set)}
                  {f.suffix && <span style={{ color:"#334155", fontSize:11 }}>{f.suffix}</span>}
                </div>
              </div>
            ))}
          </SettingsPanel>

          {/* Enforcement */}
          <SettingsPanel title="ENFORCEMENT RULES">
            {[
              { label:"Require subscription to go online",   sub:"Drivers cannot go online without an active weekly pass",        val:reqSub,     set:setReqSub     },
              { label:"Auto-suspend on failed payment",      sub:"Suspend driver accounts when subscription payment fails",       val:autoSusp,   set:setAutoSusp   },
              { label:"Admin alerts on new registrations",   sub:"Notify admin when a new driver or rider account is created",    val:adminAlert, set:setAdminAlert },
            ].map(s => (
              <div key={s.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"11px 0", borderBottom:"1px solid rgba(99,179,237,0.07)" }}>
                <div style={{ flex:1, paddingRight:20 }}>
                  <div style={{ color:"#cbd5e1", fontSize:12, fontWeight:500 }}>{s.label}</div>
                  <div style={{ color:"#334155", fontSize:10, marginTop:1 }}>{s.sub}</div>
                </div>
                <Toggle val={s.val} set={s.set} />
              </div>
            ))}
          </SettingsPanel>


          {/* ── DISPATCH POLICY ── */}
          <DispatchPolicyPanel
            viewOnly={viewOnly}
            maxPickupKm={maxPickupKm}       setMaxPickupKm={setMaxPickupKm}
            pickupFeeKm={pickupFeeKm}       setPickupFeeKm={setPickupFeeKm}
            dispatchMode={dispatchMode}     setDispatchMode={setDispatchMode}
            pickupFeeOn={pickupFeeOn}       setPickupFeeOn={setPickupFeeOn}
            beyondCapKm={beyondCapKm}       setBeyondCapKm={setBeyondCapKm}
            beyondFeeFlat={beyondFeeFlat}   setBeyondFeeFlat={setBeyondFeeFlat}
            beyondFeeOn={beyondFeeOn}       setBeyondFeeOn={setBeyondFeeOn}
            waitFeeOn={waitFeeOn}           setWaitFeeOn={setWaitFeeOn}
            waitFeeRate={waitFeeRate}        setWaitFeeRate={setWaitFeeRate}
            waitFeeMinutes={waitFeeMinutes} setWaitFeeMinutes={setWaitFeeMinutes}
          />

          {/* ── UBER UNDERCUT ENGINE ── */}
          <UberUndercutPanel
            onApply={(rates) => {
              setBaseFare(String(rates.baseFare));
              setRatePerKm(String(rates.ratePerKm));
              setRatePerMin(String(rates.ratePerMin));
              setMinimumFare(String(rates.minimumFare));
              flash("Undercut rates applied — always cheaper than Uber ✓");
            }}
          />

          {/* ── CANCELLATION & DELAY FEES ── */}
          <SettingsPanel title="CANCELLATION &amp; DELAY FEES">
            <div style={{ color:"#334155", fontSize:10, marginBottom:14, lineHeight:1.6 }}>
              Riders are charged a delay fee after 2 minutes of free wait time. Drivers may cancel after 5 minutes with a fixed fee charged to the rider.
            </div>
            {[
              { label:"Rider Delay Fee",    sub:`CA$ per minute after ${2}-min free wait`,    prefix:"CA$", val:riderDelayFee,   set:setRiderDelayFee,   suffix:"/min" },
              { label:"Driver Cancel Fee",  sub:`Fixed fee if driver cancels after ${5} min`, prefix:"CA$", val:driverCancelFee, set:setDriverCancelFee, suffix:"flat" },
            ].map(f => (
              <div key={f.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:11, paddingBottom:11, borderBottom:"1px solid rgba(148,163,184,0.15)" }}>
                <div>
                  <div style={{ color:"#f1f5f9", fontSize:12, fontWeight:600 }}>{f.label}</div>
                  <div style={{ color:"#64748b", fontSize:10 }}>{f.sub}</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                  <span style={{ color:"#64748b", fontSize:11 }}>{f.prefix}</span>
                  <input value={f.val} onChange={e=>f.set(e.target.value)}
                    style={{ width:60, background:"rgba(148,163,184,0.1)", border:"1px solid rgba(148,163,184,0.25)", borderRadius:6, padding:"5px 7px", color:"#f1f5f9", fontSize:12, textAlign:"right", outline:"none" }} />
                  <span style={{ color:"#64748b", fontSize:9 }}>{f.suffix}</span>
                </div>
              </div>
            ))}
          </SettingsPanel>

          {/* ── SURGE PRICING ── */}
          <SettingsPanel title="SURGE PRICING">
            <div style={{ color:"#334155", fontSize:10, marginBottom:12, lineHeight:1.6 }}>
              Automatically applies fare multipliers when rider demand exceeds driver supply within a {surgeRadiusKm}km radius.
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12, paddingBottom:12, borderBottom:"1px solid rgba(148,163,184,0.15)" }}>
              <div>
                <div style={{ color:"#f1f5f9", fontSize:12, fontWeight:600 }}>Surge Pricing</div>
                <div style={{ color:"#64748b", fontSize:10 }}>Enable automatic demand-based multipliers</div>
              </div>
              <div onClick={()=>{ if(!viewOnly) setSurgeEnabled(v=>!v); }} style={{ width:36,height:20,cursor:viewOnly?"not-allowed":"pointer",opacity:viewOnly?0.6:1,borderRadius:100,background:surgeEnabled?"#3b82f6":"rgba(148,163,184,0.25)",position:"relative",cursor:"pointer",transition:"background 0.2s" }}>
                <div style={{ position:"absolute",top:2,width:16,height:16,background:"#fff",borderRadius:"50%",transition:"left 0.2s",left:surgeEnabled?18:2,boxShadow:"0 1px 4px rgba(0,0,0,0.3)" }} />
              </div>
            </div>
            {surgeEnabled && (
              <>
                <div style={{ marginBottom:12 }}>
                  <div style={{ color:"#94a3b8", fontSize:9, letterSpacing:1, textTransform:"uppercase", marginBottom:8 }}>Surge Tiers (riders:drivers ratio)</div>
                  {[
                    { tier:"Low",  ratio:"2:1", mult:"1.25x", color:"#f59e0b" },
                    { tier:"Mid",  ratio:"3:1", mult:"1.50x", color:"#f97316" },
                    { tier:"High", ratio:"4:1", mult:"1.75x", color:"#ef4444" },
                    { tier:"Peak", ratio:"5:1", mult:"2.00x", color:"#dc2626" },
                  ].map(t => (
                    <div key={t.tier} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 0", borderBottom:"1px solid rgba(148,163,184,0.1)" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ width:10, height:10, borderRadius:"50%", background:t.color, display:"inline-block" }} />
                        <span style={{ color:"#f1f5f9", fontSize:11, fontWeight:600 }}>{t.tier} Surge</span>
                        <span style={{ color:"#64748b", fontSize:10 }}>({t.ratio} ratio)</span>
                      </div>
                      <span style={{ color:t.color, fontWeight:800, fontSize:12 }}>{t.mult}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <div style={{ color:"#f1f5f9", fontSize:12, fontWeight:600 }}>Surge Radius</div>
                    <div style={{ color:"#64748b", fontSize:10 }}>Max area per surge zone (km)</div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                    <input value={surgeRadiusKm} onChange={e=>setSurgeRadiusKm(e.target.value)}
                      style={{ width:50, background:"rgba(148,163,184,0.1)", border:"1px solid rgba(148,163,184,0.25)", borderRadius:6, padding:"5px 7px", color:"#f1f5f9", fontSize:12, textAlign:"right", outline:"none" }} />
                    <span style={{ color:"#64748b", fontSize:10 }}>km</span>
                  </div>
                </div>
              </>
            )}
          </SettingsPanel>

          {!viewOnly && <button onClick={handleSave} style={{ background:"linear-gradient(135deg,#3b82f6,#1d4ed8)", color:"#fff", border:"none", borderRadius:8, padding:"12px 28px", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit", letterSpacing:0.5, alignSelf:"flex-start", width:"100%", marginTop:8 }}>
            💾 SAVE ALL SETTINGS
          </button>}
        </div>

        {/* ── RIGHT COLUMN — AI Advisor + Pricing preview ── */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

          {/* ── AI PRICING ADVISOR ── */}
          <AIPricingAdvisor
            trips={trips} drivers={drivers} subs={subs}
            currentSettings={{ subFee, commPct, countdown }}
            pricingState={{ baseFare, ratePerKm, ratePerMin, minimumFare, familyMult, friendsMult, demandTier }}
            dispatchState={{ maxPickupKm, pickupFeeKm, pickupFeeOn, beyondCapKm, beyondFeeFlat, beyondFeeOn, waitFeeOn, waitFeeRate, waitFeeMinutes }}
            onApply={(patch) => {
              if (patch.baseFare    !== undefined) setBaseFare(String(patch.baseFare));
              if (patch.ratePerKm   !== undefined) setRatePerKm(String(patch.ratePerKm));
              if (patch.ratePerMin  !== undefined) setRatePerMin(String(patch.ratePerMin));
              if (patch.minimumFare !== undefined) setMinimumFare(String(patch.minimumFare));
              if (patch.familyMult  !== undefined) setFamilyMult(String(patch.familyMult));
              if (patch.friendsMult !== undefined) setFriendsMult(String(patch.friendsMult));
              if (patch.demandTier  !== undefined) setDemandTier(patch.demandTier);
              if (patch.commPct     !== undefined) setCommPct(String(patch.commPct));
              if (patch.subFee      !== undefined) setSubFee(String(patch.subFee));
              if (patch.pickupFeeKm !== undefined) setPickupFeeKm(String(patch.pickupFeeKm));
              if (patch.maxPickupKm !== undefined) setMaxPickupKm(String(patch.maxPickupKm));
              if (patch.pickupFeeOn !== undefined) setPickupFeeOn(Boolean(patch.pickupFeeOn));
              flash("AI recommendation applied ✓");
            }}
          />

          {/* Live Uber vs ZeezRyde comparison */}
          <UberComparisonPanel cfg={cfg} familyMult={familyMult} friendsMult={friendsMult} />

          {/* Surge control */}
          <SettingsPanel title="DEMAND SURGE CONTROL">
            <div style={{ color:"#334155", fontSize:10, marginBottom:12, lineHeight:1.6 }}>
              Set the current demand tier. This multiplies the base fare to balance supply and demand in real time.
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
              {Object.entries(TIER_LABELS).map(([k, label]) => (
                <button key={k} disabled={viewOnly} onClick={() => !viewOnly && setDemandTier(k)} style={{ padding:"9px 8px", borderRadius:7, border:`1px solid ${demandTier===k ? TIER_COLORS[k] : "rgba(99,179,237,0.1)"}`, background:demandTier===k ? `${TIER_COLORS[k]}15` : "transparent", cursor:"pointer", fontFamily:"'JetBrains Mono',monospace", color:demandTier===k ? TIER_COLORS[k] : "#334155", fontSize:10, fontWeight:700, transition:"all 0.15s", textAlign:"center" }}>
                  {label}
                </button>
              ))}
            </div>
            <div style={{ marginTop:10, padding:"8px 12px", background:`${TIER_COLORS[demandTier]}10`, border:`1px solid ${TIER_COLORS[demandTier]}30`, borderRadius:7, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ color:"#64748b", fontSize:11 }}>Active surge multiplier</span>
              <span style={{ color:TIER_COLORS[demandTier], fontWeight:700, fontSize:16, fontFamily:"'JetBrains Mono',monospace" }}>{surgeMultiplier.toFixed(1)}x</span>
            </div>
          </SettingsPanel>

          {/* Live fare calculator */}
          <SettingsPanel title="FARE CALCULATOR PREVIEW">
            <div style={{ color:"#334155", fontSize:10, marginBottom:14, lineHeight:1.6 }}>
              Enter a trip scenario to see exactly how the pricing engine calculates the final fare using your current settings.
            </div>

            {/* Inputs */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
              {[
                { label:"Distance (km)", val:previewKm,  set:setPreviewKm  },
                { label:"Duration (min)",val:previewMin, set:setPreviewMin },
              ].map(f => (
                <div key={f.label}>
                  <div style={{ color:"#475569", fontSize:9, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1, marginBottom:4 }}>{f.label}</div>
                  {inp(f.val, f.set, "100%")}
                </div>
              ))}
            </div>

            {/* Ride type toggle */}
            <div style={{ display:"flex", gap:6, marginBottom:14 }}>
              {[["family","🚗 Family"],["friends","🚐 Friends"]].map(([id, label]) => (
                <button key={id} onClick={() => setPreviewType(id)} style={{ flex:1, padding:"7px", borderRadius:6, border:`1px solid ${previewType===id?"#3b82f6":"rgba(99,179,237,0.1)"}`, background:previewType===id?"rgba(59,130,246,0.12)":"transparent", color:previewType===id?"#60a5fa":"#334155", fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
                  {label}
                </button>
              ))}
            </div>

            {/* Step-by-step breakdown */}
            <div style={{ background:"rgba(0,0,0,0.3)", border:"1px solid rgba(99,179,237,0.08)", borderRadius:8, padding:"12px 14px", marginBottom:12 }}>
              <div style={{ color:"rgba(148,163,184,0.4)", fontSize:8, fontWeight:700, letterSpacing:2, fontFamily:"'JetBrains Mono',monospace", marginBottom:10 }}>CALCULATION BREAKDOWN</div>
              {[
                [`Base fare`,                                        `CA$${cfg.baseFare.toFixed(2)}`,                                                                  "#94a3b8"],
                [`${previewKm} km x CA$${cfg.ratePerKm.toFixed(2)}/km`, `CA$${((parseFloat(previewKm)||0)*cfg.ratePerKm).toFixed(2)}`,                                "#94a3b8"],
                [`${previewMin} min x CA$${cfg.ratePerMin.toFixed(2)}/min`,`CA$${((parseFloat(previewMin)||0)*cfg.ratePerMin).toFixed(2)}`,                            "#94a3b8"],
                [`Subtotal (min: CA$${cfg.minimumFare.toFixed(2)})`, `CA$${subtotalRaw.toFixed(2)}`,                                                                   "#cbd5e1"],
                [`Surge ${surgeMultiplier.toFixed(1)}x (${TIER_LABELS[demandTier]})`, `CA$${afterSurge.toFixed(2)}`,                                                  TIER_COLORS[demandTier]],
                [`${previewType==="family"?"Family":"Friends"} x${typeMult.toFixed(2)}`, `CA$${afterType.toFixed(2)}`,                                                "#60a5fa"],
                [`HST (13%)`, `CA$${preview.tax.toFixed(2)}`, `CA$${preview.tax.toFixed(2)}`],
              ].map(([step, val, color], i, arr) => (
                <div key={step} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"5px 0", borderBottom: i < arr.length-1 ? "1px solid rgba(99,179,237,0.06)" : "none" }}>
                  <span style={{ color:"#334155", fontSize:10, fontFamily:"'JetBrains Mono',monospace" }}>{step}</span>
                  <span style={{ color, fontSize:11, fontWeight:700, fontFamily:"'JetBrains Mono',monospace" }}>{val}</span>
                </div>
              ))}
            </div>

            {/* Final fare card */}
            <div style={{ background:"linear-gradient(135deg,rgba(59,130,246,0.1),rgba(29,78,216,0.05))", border:"1px solid rgba(59,130,246,0.25)", borderRadius:10, padding:"14px 16px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                <div>
                  <div style={{ color:"rgba(148,163,184,0.5)", fontSize:8, fontWeight:700, letterSpacing:2, fontFamily:"'JetBrains Mono',monospace" }}>RIDER PAYS</div>
                  <div style={{ color:"#f0f9ff", fontSize:30, fontWeight:700, fontFamily:"'JetBrains Mono',monospace", letterSpacing:-1, marginTop:2 }}>CA${preview.total.toFixed(2)}</div>
                </div>
                <div style={{ padding:"3px 9px", borderRadius:20, background:`${TIER_COLORS[demandTier]}20`, border:`1px solid ${TIER_COLORS[demandTier]}40`, color:TIER_COLORS[demandTier], fontSize:9, fontWeight:700, fontFamily:"'JetBrains Mono',monospace" }}>
                  {demandTier.toUpperCase()} DEMAND
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                <div style={{ background:"rgba(34,197,94,0.07)", border:"1px solid rgba(34,197,94,0.15)", borderRadius:7, padding:"8px 10px" }}>
                  <div style={{ color:"#4b5563", fontSize:8, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1 }}>DRIVER EARNS</div>
                  <div style={{ color:"#22c55e", fontSize:16, fontWeight:700, fontFamily:"'JetBrains Mono',monospace", marginTop:2 }}>CA${preview.driverCut.toFixed(2)}</div>
                  <div style={{ color:"#374151", fontSize:9, marginTop:1 }}>{(100 - parseFloat(commPct)).toFixed(0)}% of fare</div>
                </div>
                <div style={{ background:"rgba(167,139,250,0.07)", border:"1px solid rgba(167,139,250,0.15)", borderRadius:7, padding:"8px 10px" }}>
                  <div style={{ color:"#4b5563", fontSize:8, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1 }}>PLATFORM EARNS</div>
                  <div style={{ color:"#a78bfa", fontSize:16, fontWeight:700, fontFamily:"'JetBrains Mono',monospace", marginTop:2 }}>CA${preview.platform.toFixed(2)}</div>
                  <div style={{ color:"#374151", fontSize:9, marginTop:1 }}>{parseFloat(commPct).toFixed(0)}% commission</div>
                </div>
              </div>
            </div>
          </SettingsPanel>

          {/* Fare range reference */}
          <SettingsPanel title="FARE RANGE REFERENCE">
            <div style={{ color:"#334155", fontSize:10, marginBottom:12 }}>Estimated fares at current settings, no surge, for common trip lengths.</div>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr>{["TRIP","DIST","TIME","FAMILY","FRIENDS"].map(h => <th key={h} style={{ padding:"6px 8px", textAlign:"left", fontSize:8, color:"rgba(148,163,184,0.35)", fontFamily:"'JetBrains Mono',monospace", letterSpacing:1.5, fontWeight:700, borderBottom:"1px solid rgba(99,179,237,0.07)" }}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {[
                  ["Short",   3,  6],
                  ["Medium",  8, 14],
                  ["Long",   18, 28],
                  ["Airport",35, 45],
                ].map(([label, km, min]) => {
                  const noSurge = { ...cfg, surgeMultiplier:1.0 };
                  const fam  = calcFare(noSurge, km, min);
                  const fam2 = { total: Math.round(fam.total * (parseFloat(familyMult)||1)  * 100)/100 };
                  const fri2 = { total: Math.round(fam.total * (parseFloat(friendsMult)||1) * 100)/100 };
                  return (
                    <tr key={label} className="trow">
                      <td style={{ padding:"7px 8px", color:"#94a3b8", fontSize:11 }}>{label}</td>
                      <td style={{ padding:"7px 8px", color:"#475569", fontSize:10, fontFamily:"'JetBrains Mono',monospace" }}>{km}km</td>
                      <td style={{ padding:"7px 8px", color:"#475569", fontSize:10, fontFamily:"'JetBrains Mono',monospace" }}>{min}m</td>
                      <td style={{ padding:"7px 8px", color:"#60a5fa", fontSize:11, fontWeight:700, fontFamily:"'JetBrains Mono',monospace" }}>CA${fam2.total.toFixed(2)}</td>
                      <td style={{ padding:"7px 8px", color:"#a78bfa", fontSize:11, fontWeight:700, fontFamily:"'JetBrains Mono',monospace" }}>CA${fri2.total.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </SettingsPanel>

        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// UBER UNDERCUT PANEL
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// DISPATCH POLICY PANEL
// ─────────────────────────────────────────────────────────────────────────────
function DispatchPolicyPanel({
  viewOnly,
  maxPickupKm, setMaxPickupKm,
  pickupFeeKm, setPickupFeeKm,
  dispatchMode, setDispatchMode,
  pickupFeeOn, setPickupFeeOn,
  beyondCapKm, setBeyondCapKm,
  beyondFeeFlat, setBeyondFeeFlat,
  beyondFeeOn, setBeyondFeeOn,
  waitFeeOn, setWaitFeeOn,
  waitFeeRate, setWaitFeeRate,
  waitFeeMinutes, setWaitFeeMinutes,
}) {
  const maxKm       = parseFloat(maxPickupKm)  || 10;
  const feePerKm    = parseFloat(pickupFeeKm)  || 0.50;
  const capKm       = parseFloat(beyondCapKm)  || 30;
  const flatFee     = parseFloat(beyondFeeFlat)|| 2.00;
  const waitRate    = parseFloat(waitFeeRate)  || 0.20;
  const graceMins   = parseInt(waitFeeMinutes) || 5;

  const exampleDistances = [5, 8, 10, 12, 15, 20];

  // Over-radius fee: per-km charge on distance beyond radius, capped at beyondCapKm,
  // plus optional flat fee for any over-radius dispatch
  function calcPickupFee(driverDistKm) {
    if (!pickupFeeOn || driverDistKm <= maxKm) return 0;
    const overKm     = Math.min(driverDistKm - maxKm, capKm - maxKm);
    const perKmTotal = Math.round(Math.max(0, overKm) * feePerKm * 100) / 100;
    const flat       = beyondFeeOn ? flatFee : 0;
    return Math.round((perKmTotal + flat) * 100) / 100;
  }

  // Wait-time fee: when pickup ETA (minutes) > ride distance (km)
  // e.g. driver is 12 min away for a 7 km ride → 5 min over → fee
  function calcWaitFee(etaMin, rideKm) {
    if (!waitFeeOn) return 0;
    const excess = etaMin - rideKm - graceMins;
    if (excess <= 0) return 0;
    return Math.round(excess * waitRate * 100) / 100;
  }

  const Row = ({ label, val, c = "#f0f9ff" }) => (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"7px 0", borderBottom:"1px solid rgba(99,179,237,0.05)" }}>
      <span style={{ color:"#475569", fontSize:11 }}>{label}</span>
      <span style={{ color:c, fontWeight:700, fontSize:12, fontFamily:"'JetBrains Mono',monospace" }}>{val}</span>
    </div>
  );

  return (
    <SettingsPanel title="DISPATCH POLICY">
      <div style={{ color:"#475569", fontSize:11, lineHeight:1.6, marginBottom:16 }}>
        Controls how ride requests are routed to drivers. Configure the pickup radius, the fees applied when drivers exceed it, and the wait-time surcharge for slow pickups.
      </div>

      {/* ── Dispatch mode ── */}
      <div style={{ marginBottom:18 }}>
        <div style={{ color:"#475569", fontSize:9, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1, marginBottom:8 }}>DISPATCH MODE</div>
        <div style={{ display:"flex", gap:8 }}>
          {[
            { id:"closest", icon:"◎", label:"Closest Driver First", sub:"Auto-dispatch to nearest available driver" },
            { id:"manual",  icon:"◈", label:"Manual Dispatch",      sub:"Admin assigns each ride manually" },
          ].map(m => (
            <button key={m.id} disabled={viewOnly} onClick={() => !viewOnly && setDispatchMode(m.id)} style={{ flex:1, padding:"11px 12px", borderRadius:8, border:`1px solid ${dispatchMode===m.id?"rgba(59,130,246,0.4)":"rgba(99,179,237,0.08)"}`, background:dispatchMode===m.id?"rgba(59,130,246,0.07)":"transparent", cursor:"pointer", textAlign:"left" }}>
              <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:4 }}>
                <span style={{ color:dispatchMode===m.id?"#60a5fa":"#475569", fontSize:14 }}>{m.icon}</span>
                <span style={{ color:dispatchMode===m.id?"#e2e8f0":"#94a3b8", fontSize:11, fontWeight:600 }}>{m.label}</span>
              </div>
              <div style={{ color:"#334155", fontSize:9, lineHeight:1.4, paddingLeft:21 }}>{m.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Max pickup radius ── */}
      <div style={{ marginBottom:18 }}>
        <div style={{ color:"#475569", fontSize:9, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1, marginBottom:8 }}>MAX PICKUP RADIUS</div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ flex:1 }}>
            <input type="range" min="1" max="25" step="0.5"
              value={maxPickupKm} onChange={e => setMaxPickupKm(e.target.value)}
              style={{ width:"100%", accentColor:"#3b82f6", cursor:"pointer" }}
            />
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:2 }}>
              <span style={{ color:"#334155", fontSize:8, fontFamily:"'JetBrains Mono',monospace" }}>1 km</span>
              <span style={{ color:"#334155", fontSize:8, fontFamily:"'JetBrains Mono',monospace" }}>25 km</span>
            </div>
          </div>
          <div style={{ background:"rgba(59,130,246,0.1)", border:"1px solid rgba(59,130,246,0.25)", borderRadius:8, padding:"8px 14px", textAlign:"center", minWidth:58 }}>
            <div style={{ color:"#60a5fa", fontSize:22, fontWeight:700, fontFamily:"'JetBrains Mono',monospace", lineHeight:1 }}>{maxKm}</div>
            <div style={{ color:"#475569", fontSize:9, marginTop:2 }}>km</div>
          </div>
        </div>
        <div style={{ marginTop:6, color:"#334155", fontSize:10, lineHeight:1.5 }}>
          Requests only go to drivers within <strong style={{ color:"#60a5fa" }}>{maxKm} km</strong> of the rider. Drivers beyond this radius are only dispatched if no closer driver is available and the over-radius fee is enabled.
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* OVER-RADIUS FEE                                           */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div style={{ background:"rgba(0,0,0,0.2)", border:"1px solid rgba(245,158,11,0.15)", borderRadius:12, padding:"16px 18px", marginBottom:14 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
          <div>
            <div style={{ color:"#f59e0b", fontSize:13, fontWeight:700 }}>Over-Radius Pickup Fee</div>
            <div style={{ color:"#334155", fontSize:10, marginTop:2 }}>Applied when a driver is dispatched beyond the {maxKm} km radius</div>
          </div>
          <Toggle val={pickupFeeOn} set={setPickupFeeOn} />
        </div>

        {pickupFeeOn && (
          <>
            {/* Per-km rate */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
              <div>
                <div style={{ color:"rgba(148,163,184,0.5)", fontSize:9, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", fontFamily:"'JetBrains Mono',monospace", marginBottom:7 }}>Rate Per km Beyond Radius</div>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{ color:"#334155", fontSize:12 }}>CA$</span>
                  <input type="number" step="0.05" min="0" max="5" value={pickupFeeKm} onChange={e => setPickupFeeKm(e.target.value)}
                    style={{ width:80, padding:"8px 10px", background:"#080c14", border:"1px solid rgba(99,179,237,0.2)", borderRadius:7, color:"#f0f9ff", fontSize:13, fontFamily:"'JetBrains Mono',monospace", outline:"none" }}
                  />
                  <span style={{ color:"#334155", fontSize:12 }}>/km</span>
                </div>
                <div style={{ display:"flex", gap:5, marginTop:7 }}>
                  {[0.25, 0.50, 0.75, 1.00].map(v => (
                    <button key={v} disabled={viewOnly} onClick={() => !viewOnly && setPickupFeeKm(String(v))}
                      style={{ padding:"3px 9px", borderRadius:4, border:`1px solid ${Math.abs(parseFloat(pickupFeeKm)-v)<0.001?"rgba(245,158,11,0.4)":"rgba(99,179,237,0.1)"}`, background:Math.abs(parseFloat(pickupFeeKm)-v)<0.001?"rgba(245,158,11,0.08)":"transparent", color:Math.abs(parseFloat(pickupFeeKm)-v)<0.001?"#f59e0b":"#475569", fontSize:9, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace" }}>
                      ${v.toFixed(2)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cap km */}
              <div>
                <div style={{ color:"rgba(148,163,184,0.5)", fontSize:9, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", fontFamily:"'JetBrains Mono',monospace", marginBottom:7 }}>Per-km Fee Cap Distance</div>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <input type="range" min={maxKm} max="50" step="1" value={capKm} onChange={e => setBeyondCapKm(e.target.value)}
                    style={{ flex:1, accentColor:"#f59e0b", cursor:"pointer" }}
                  />
                  <div style={{ background:"rgba(245,158,11,0.1)", border:"1px solid rgba(245,158,11,0.25)", borderRadius:7, padding:"5px 10px", minWidth:46, textAlign:"center" }}>
                    <div style={{ color:"#f59e0b", fontSize:16, fontWeight:700, fontFamily:"'JetBrains Mono',monospace", lineHeight:1 }}>{capKm}</div>
                    <div style={{ color:"#475569", fontSize:8, marginTop:1 }}>km</div>
                  </div>
                </div>
                <div style={{ color:"#334155", fontSize:9, marginTop:5, lineHeight:1.5 }}>
                  Per-km charge stops accumulating after <strong style={{ color:"#f59e0b" }}>{capKm} km</strong>. Rides beyond this still dispatch but the fee is capped.
                </div>
              </div>
            </div>

            {/* Flat dispatch fee */}
            <div style={{ background:"rgba(0,0,0,0.2)", border:"1px solid rgba(99,179,237,0.08)", borderRadius:10, padding:"12px 14px", marginBottom:14 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                <div>
                  <div style={{ color:"#cbd5e1", fontSize:11, fontWeight:600 }}>Flat Dispatch Fee</div>
                  <div style={{ color:"#334155", fontSize:9, marginTop:1 }}>One-time fee added any time an over-radius driver is dispatched, on top of the per-km charge</div>
                </div>
                <Toggle val={beyondFeeOn} set={setBeyondFeeOn} />
              </div>
              {beyondFeeOn && (
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ color:"#334155", fontSize:12 }}>CA$</span>
                  <input type="number" step="0.25" min="0" max="20" value={beyondFeeFlat} onChange={e => setBeyondFeeFlat(e.target.value)}
                    style={{ width:80, padding:"7px 10px", background:"#080c14", border:"1px solid rgba(99,179,237,0.2)", borderRadius:7, color:"#f0f9ff", fontSize:13, fontFamily:"'JetBrains Mono',monospace", outline:"none" }}
                  />
                  <span style={{ color:"#64748b", fontSize:11 }}>flat per over-radius dispatch</span>
                  <div style={{ marginLeft:"auto", display:"flex", gap:5 }}>
                    {[1.00, 1.50, 2.00, 3.00].map(v => (
                      <button key={v} disabled={viewOnly} onClick={() => !viewOnly && setBeyondFeeFlat(String(v))}
                        style={{ padding:"3px 8px", borderRadius:4, border:`1px solid ${Math.abs(parseFloat(beyondFeeFlat)-v)<0.01?"rgba(59,130,246,0.4)":"rgba(99,179,237,0.1)"}`, background:Math.abs(parseFloat(beyondFeeFlat)-v)<0.01?"rgba(59,130,246,0.08)":"transparent", color:Math.abs(parseFloat(beyondFeeFlat)-v)<0.01?"#60a5fa":"#475569", fontSize:9, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace" }}>
                        ${v.toFixed(2)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Fee table */}
            <div style={{ marginBottom:10 }}>
              <div style={{ color:"rgba(148,163,184,0.3)", fontSize:8, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1.5, textTransform:"uppercase", marginBottom:6 }}>PICKUP FEE PREVIEW — DRIVER DISTANCE</div>
              <div style={{ display:"grid", gridTemplateColumns:`repeat(${exampleDistances.length}, 1fr)`, gap:4 }}>
                {exampleDistances.map(d => {
                  const fee = calcPickupFee(d);
                  const overRadius = d > maxKm;
                  const capped = d > capKm;
                  return (
                    <div key={d} style={{ background:overRadius?"rgba(245,158,11,0.06)":"rgba(34,197,94,0.04)", border:`1px solid ${overRadius?"rgba(245,158,11,0.2)":"rgba(34,197,94,0.15)"}`, borderRadius:7, padding:"7px 6px", textAlign:"center" }}>
                      <div style={{ color:overRadius?"#f59e0b":"#22c55e", fontSize:11, fontWeight:700, fontFamily:"'JetBrains Mono',monospace" }}>{d} km</div>
                      <div style={{ color:overRadius?"#f59e0b":"#22c55e", fontSize:9, marginTop:3, fontFamily:"'JetBrains Mono',monospace" }}>
                        {fee > 0 ? `+CA$${fee.toFixed(2)}` : "✓ free"}
                      </div>
                      <div style={{ color:"#334155", fontSize:7, marginTop:2 }}>{capped ? "fee capped" : overRadius ? "over limit" : "in range"}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ padding:"8px 12px", background:"rgba(59,130,246,0.05)", border:"1px solid rgba(59,130,246,0.15)", borderRadius:8 }}>
              <div style={{ color:"#60a5fa", fontSize:10, fontWeight:600, marginBottom:3 }}>How the fee works</div>
              <div style={{ color:"#334155", fontSize:10, lineHeight:1.6 }}>
                When a driver beyond <strong style={{ color:"#60a5fa" }}>{maxKm} km</strong> is dispatched, the rider sees the breakdown at booking. The per-km charge applies up to <strong style={{ color:"#f59e0b" }}>{capKm} km</strong>{beyondFeeOn ? `, plus a CA$${parseFloat(beyondFeeFlat).toFixed(2)} flat dispatch fee` : ""}. Total over-radius fee goes to the platform, not the driver.
              </div>
            </div>
          </>
        )}

        {!pickupFeeOn && (
          <div style={{ padding:"8px 12px", background:"rgba(239,68,68,0.05)", border:"1px solid rgba(239,68,68,0.15)", borderRadius:8 }}>
            <div style={{ color:"#ef4444", fontSize:10, lineHeight:1.5 }}>
              ⚠ Over-radius fee is <strong>off</strong> — if no driver is within {maxKm} km, the request will simply time out with no fee collected.
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* WAIT-TIME SURCHARGE                                        */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div style={{ background:"rgba(0,0,0,0.2)", border:"1px solid rgba(167,139,250,0.15)", borderRadius:12, padding:"16px 18px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
          <div>
            <div style={{ color:"#a78bfa", fontSize:13, fontWeight:700 }}>Wait-Time Surcharge</div>
            <div style={{ color:"#334155", fontSize:10, marginTop:2 }}>Added to the fare when pickup ETA (minutes) exceeds ride distance (km)</div>
          </div>
          <Toggle val={waitFeeOn} set={setWaitFeeOn} />
        </div>

        {waitFeeOn && (
          <>
            <div style={{ color:"#475569", fontSize:10, lineHeight:1.6, marginBottom:14, background:"rgba(167,139,250,0.05)", border:"1px solid rgba(167,139,250,0.1)", borderRadius:8, padding:"9px 12px" }}>
              <strong style={{ color:"#a78bfa" }}>Example:</strong> A rider books a <strong style={{ color:"#e2e8f0" }}>6 km</strong> ride. Driver ETA is <strong style={{ color:"#e2e8f0" }}>14 min</strong>. Since 14 min &gt; 6 km, the wait exceeds the ride — a surcharge applies after a <strong style={{ color:"#a78bfa" }}>{graceMins}-minute</strong> grace period: <strong style={{ color:"#e2e8f0" }}>{Math.max(0,(14-6-graceMins))} min x CA${parseFloat(waitFeeRate).toFixed(2)} = CA${calcWaitFee(14,6).toFixed(2)}</strong>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
              {/* Rate per minute */}
              <div>
                <div style={{ color:"rgba(148,163,184,0.5)", fontSize:9, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", fontFamily:"'JetBrains Mono',monospace", marginBottom:7 }}>Rate Per Extra Minute</div>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{ color:"#334155", fontSize:12 }}>CA$</span>
                  <input type="number" step="0.05" min="0" max="2" value={waitFeeRate} onChange={e => setWaitFeeRate(e.target.value)}
                    style={{ width:80, padding:"8px 10px", background:"#080c14", border:"1px solid rgba(167,139,250,0.2)", borderRadius:7, color:"#f0f9ff", fontSize:13, fontFamily:"'JetBrains Mono',monospace", outline:"none" }}
                  />
                  <span style={{ color:"#334155", fontSize:12 }}>/min</span>
                </div>
                <div style={{ display:"flex", gap:5, marginTop:7 }}>
                  {[0.10, 0.15, 0.20, 0.25].map(v => (
                    <button key={v} disabled={viewOnly} onClick={() => !viewOnly && setWaitFeeRate(String(v))}
                      style={{ padding:"3px 8px", borderRadius:4, border:`1px solid ${Math.abs(parseFloat(waitFeeRate)-v)<0.001?"rgba(167,139,250,0.4)":"rgba(99,179,237,0.1)"}`, background:Math.abs(parseFloat(waitFeeRate)-v)<0.001?"rgba(167,139,250,0.08)":"transparent", color:Math.abs(parseFloat(waitFeeRate)-v)<0.001?"#a78bfa":"#475569", fontSize:9, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace" }}>
                      ${v.toFixed(2)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grace period */}
              <div>
                <div style={{ color:"rgba(148,163,184,0.5)", fontSize:9, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", fontFamily:"'JetBrains Mono',monospace", marginBottom:7 }}>Grace Period (free minutes)</div>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <input type="range" min="0" max="15" step="1" value={graceMins} onChange={e => setWaitFeeMinutes(e.target.value)}
                    style={{ flex:1, accentColor:"#a78bfa", cursor:"pointer" }}
                  />
                  <div style={{ background:"rgba(167,139,250,0.1)", border:"1px solid rgba(167,139,250,0.25)", borderRadius:7, padding:"5px 10px", minWidth:46, textAlign:"center" }}>
                    <div style={{ color:"#a78bfa", fontSize:16, fontWeight:700, fontFamily:"'JetBrains Mono',monospace", lineHeight:1 }}>{graceMins}</div>
                    <div style={{ color:"#475569", fontSize:8, marginTop:1 }}>min</div>
                  </div>
                </div>
                <div style={{ color:"#334155", fontSize:9, marginTop:5, lineHeight:1.5 }}>
                  Surcharge only starts after <strong style={{ color:"#a78bfa" }}>{graceMins} min</strong> of wait exceeding the ride distance. Zero = charges from the first minute over.
                </div>
              </div>
            </div>

            {/* Wait-time preview table */}
            <div style={{ marginBottom:10 }}>
              <div style={{ color:"rgba(148,163,184,0.3)", fontSize:8, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1.5, textTransform:"uppercase", marginBottom:6 }}>WAIT SURCHARGE PREVIEW — ETA vs 8 KM RIDE</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:4 }}>
                {[4, 6, 8, 10, 14, 18].map(eta => {
                  const rideKm = 8;
                  const fee = calcWaitFee(eta, rideKm);
                  const triggered = fee > 0;
                  return (
                    <div key={eta} style={{ background:triggered?"rgba(167,139,250,0.06)":"rgba(34,197,94,0.04)", border:`1px solid ${triggered?"rgba(167,139,250,0.2)":"rgba(34,197,94,0.15)"}`, borderRadius:7, padding:"7px 6px", textAlign:"center" }}>
                      <div style={{ color:triggered?"#a78bfa":"#22c55e", fontSize:10, fontWeight:700, fontFamily:"'JetBrains Mono',monospace" }}>{eta} min</div>
                      <div style={{ color:triggered?"#a78bfa":"#22c55e", fontSize:9, marginTop:2, fontFamily:"'JetBrains Mono',monospace" }}>
                        {fee > 0 ? `+CA$${fee.toFixed(2)}` : "✓ no fee"}
                      </div>
                      <div style={{ color:"#334155", fontSize:7, marginTop:1 }}>{triggered ? "surcharge" : "within limit"}</div>
                    </div>
                  );
                })}
              </div>
              <div style={{ color:"#334155", fontSize:9, marginTop:6 }}>Preview assumes 8 km ride. Surcharge = (ETA − ride km − {graceMins} grace) x CA${parseFloat(waitFeeRate).toFixed(2)}/min</div>
            </div>

            <div style={{ padding:"8px 12px", background:"rgba(167,139,250,0.05)", border:"1px solid rgba(167,139,250,0.12)", borderRadius:8 }}>
              <div style={{ color:"#a78bfa", fontSize:10, fontWeight:600, marginBottom:3 }}>Rider experience</div>
              <div style={{ color:"#334155", fontSize:10, lineHeight:1.6 }}>
                When a wait surcharge applies, the rider sees it broken out as a separate line item before confirming. Drivers are not penalized — this is a platform fee collected at booking. The grace period protects riders from minor ETA inaccuracies.
              </div>
            </div>
          </>
        )}

        {!waitFeeOn && (
          <div style={{ padding:"8px 12px", background:"rgba(100,116,139,0.05)", border:"1px solid rgba(100,116,139,0.15)", borderRadius:8 }}>
            <div style={{ color:"#64748b", fontSize:10, lineHeight:1.5 }}>
              Wait-time surcharge is <strong>off</strong> — rides where the pickup ETA greatly exceeds the ride distance are not charged extra.
            </div>
          </div>
        )}
      </div>

    </SettingsPanel>
  );
}

function UberUndercutPanel({ onApply }) {
  const [margin,     setMargin]     = useState("10");
  const [uberProduct,setUberProduct]= useState("uberX");
  const [locked,     setLocked]     = useState(false);

  const marginNum = Math.max(1, Math.min(50, parseFloat(margin) || 10));
  const derived   = deriveUndercutRates(uberProduct, marginNum);
  const uber      = UBER_RATES[uberProduct];

  const rows = [
    { label:"Base Fare",    uber: uber.baseFare,    zeez: derived.baseFare,    fmt: v => `CA$${v.toFixed(2)}` },
    { label:"Per km",       uber: uber.ratePerKm,   zeez: derived.ratePerKm,   fmt: v => `CA$${v.toFixed(2)}` },
    { label:"Per minute",   uber: uber.ratePerMin,  zeez: derived.ratePerMin,  fmt: v => `CA$${v.toFixed(2)}` },
    { label:"Min Fare",     uber: uber.minimumFare, zeez: derived.minimumFare, fmt: v => `CA$${v.toFixed(2)}` },
  ];

  return (
    <SettingsPanel title="UBER UNDERCUT ENGINE">
      <div style={{ color:"#334155", fontSize:10, lineHeight:1.6, marginBottom:14 }}>
        Automatically set your rates to always be cheaper than Uber by a fixed margin. The engine scales every rate component proportionally so the saving holds for <em style={{ color:"#60a5fa" }}>every trip length</em> — short or long.
      </div>

      {/* Product + margin selector */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
        <div>
          <div style={{ color:"#475569", fontSize:9, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1, marginBottom:5 }}>UBER PRODUCT TO BEAT</div>
          <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
            {Object.entries(UBER_RATES).map(([k, r]) => (
              <button key={k} onClick={() => setUberProduct(k)} style={{ padding:"7px 10px", borderRadius:6, border:`1px solid ${uberProduct===k?"#f97316":"rgba(99,179,237,0.1)"}`, background:uberProduct===k?"rgba(249,115,22,0.08)":"transparent", color:uberProduct===k?"#f97316":"#475569", fontSize:10, fontWeight:700, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace", textAlign:"left" }}>
                {r.label} — CA${r.ratePerKm}/km
              </button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ color:"#475569", fontSize:9, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1, marginBottom:5 }}>UNDERCUT MARGIN</div>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
            <input value={margin} onChange={e => setMargin(e.target.value)} style={{ width:60, padding:"8px 10px", background:"#0d1220", border:"1px solid rgba(99,179,237,0.15)", borderRadius:6, fontSize:16, fontWeight:700, color:"#22c55e", fontFamily:"'JetBrains Mono',monospace", outline:"none", textAlign:"center" }} />
            <span style={{ color:"#334155", fontSize:14 }}>% cheaper</span>
          </div>
          {/* Preset buttons */}
          <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
            {[5,10,15,20].map(p => (
              <button key={p} onClick={() => setMargin(String(p))} style={{ padding:"3px 8px", borderRadius:4, border:`1px solid ${margin===String(p)?"#22c55e":"rgba(99,179,237,0.1)"}`, background:margin===String(p)?"rgba(34,197,94,0.1)":"transparent", color:margin===String(p)?"#22c55e":"#334155", fontSize:9, fontWeight:700, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace" }}>{p}%</button>
            ))}
          </div>
        </div>
      </div>

      {/* Rate comparison table */}
      <div style={{ background:"rgba(0,0,0,0.25)", border:"1px solid rgba(99,179,237,0.08)", borderRadius:8, overflow:"hidden", marginBottom:12 }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", background:"rgba(255,255,255,0.02)", padding:"6px 12px", borderBottom:"1px solid rgba(99,179,237,0.07)" }}>
          {["RATE","UBER","ZEEZRYDE","SAVING"].map(h => <div key={h} style={{ fontSize:8, color:"rgba(148,163,184,0.35)", fontFamily:"'JetBrains Mono',monospace", letterSpacing:1.5, fontWeight:700 }}>{h}</div>)}
        </div>
        {rows.map((r, i) => {
          const saving = ((r.uber - r.zeez) / r.uber * 100).toFixed(1);
          return (
            <div key={r.label} style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", padding:"8px 12px", borderBottom:i<rows.length-1?"1px solid rgba(99,179,237,0.05)":"none", alignItems:"center" }}>
              <span style={{ color:"#64748b", fontSize:11 }}>{r.label}</span>
              <span style={{ color:"#ef4444", fontSize:11, fontFamily:"'JetBrains Mono',monospace", textDecoration:"line-through", opacity:0.7 }}>{r.fmt(r.uber)}</span>
              <span style={{ color:"#22c55e", fontSize:12, fontWeight:700, fontFamily:"'JetBrains Mono',monospace" }}>{r.fmt(r.zeez)}</span>
              <span style={{ color:"#f59e0b", fontSize:10, fontFamily:"'JetBrains Mono',monospace" }}>−{saving}%</span>
            </div>
          );
        })}
      </div>

      {/* Lock toggle + apply */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <Toggle val={locked} set={setLocked} />
          <div>
            <div style={{ color:"#cbd5e1", fontSize:11, fontWeight:500 }}>Auto-lock to Uber</div>
            <div style={{ color:"#334155", fontSize:9 }}>Re-apply rates whenever Uber prices change</div>
          </div>
        </div>
      </div>

      {locked && (
        <div style={{ background:"rgba(34,197,94,0.06)", border:"1px solid rgba(34,197,94,0.2)", borderRadius:7, padding:"8px 12px", marginBottom:10, display:"flex", alignItems:"center", gap:7 }}>
          <span style={{ color:"#22c55e", fontSize:13 }}>🔒</span>
          <span style={{ color:"#22c55e", fontSize:11, fontWeight:600 }}>Locked — ZeezRyde will always be {marginNum}% cheaper than {UBER_RATES[uberProduct].label}</span>
        </div>
      )}

      <button onClick={() => onApply(derived)} style={{ width:"100%", background:"linear-gradient(135deg,#22c55e,#16a34a)", color:"#fff", border:"none", borderRadius:8, padding:"10px", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace", letterSpacing:0.5 }}>
        ✓ APPLY — SET RATES {marginNum}% BELOW {UBER_RATES[uberProduct].label.toUpperCase()}
      </button>
    </SettingsPanel>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// UBER vs ZEEZRYDE LIVE COMPARISON PANEL
// ─────────────────────────────────────────────────────────────────────────────
function UberComparisonPanel({ cfg, familyMult, friendsMult }) {
  const TRIPS = [
    { label:"Short trip",   km:3,  min:6  },
    { label:"Medium trip",  km:8,  min:14 },
    { label:"Long trip",    km:18, min:28 },
    { label:"Airport run",  km:35, min:45 },
  ];

  const noSurgeCfg = { ...cfg, surgeMultiplier: 1.0 };

  return (
    <SettingsPanel title="LIVE PRICE COMPARISON — vs UBER">
      <div style={{ color:"#334155", fontSize:10, marginBottom:12 }}>
        Real-time comparison at current settings. Green = cheaper. Red = more expensive than Uber.
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr", background:"rgba(255,255,255,0.02)", padding:"6px 10px", borderBottom:"1px solid rgba(99,179,237,0.07)", borderRadius:"6px 6px 0 0" }}>
        {["TRIP","UBERX","ZEEZ FAMILY","UBERXL","ZEEZ FRIENDS"].map(h => <div key={h} style={{ fontSize:7.5, color:"rgba(148,163,184,0.35)", fontFamily:"'JetBrains Mono',monospace", letterSpacing:1, fontWeight:700 }}>{h}</div>)}
      </div>
      {TRIPS.map((t, i) => {
        const uberX   = calcUberFare("uberX",  t.km, t.min);
        const uberXL  = calcUberFare("uberXL", t.km, t.min);
        const zeezFam = Math.round(calcFare(noSurgeCfg, t.km, t.min).total * (parseFloat(familyMult)||1) * 100) / 100;
        const zeezFri = Math.round(calcFare(noSurgeCfg, t.km, t.min).total * (parseFloat(friendsMult)||1) * 100) / 100;
        const famCheaper = zeezFam < uberX;
        const friCheaper = zeezFri < uberXL;
        return (
          <div key={t.label} style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr", padding:"8px 10px", borderBottom:i<TRIPS.length-1?"1px solid rgba(99,179,237,0.05)":"none", alignItems:"center" }}>
            <span style={{ color:"#64748b", fontSize:10 }}>{t.label}</span>
            <span style={{ color:"#ef4444", fontSize:11, fontFamily:"'JetBrains Mono',monospace", opacity:0.7 }}>CA${uberX.toFixed(2)}</span>
            <div style={{ display:"flex", flexDirection:"column", gap:1 }}>
              <span style={{ color:famCheaper?"#22c55e":"#ef4444", fontSize:11, fontWeight:700, fontFamily:"'JetBrains Mono',monospace" }}>CA${zeezFam.toFixed(2)}</span>
              <span style={{ fontSize:8, color:famCheaper?"#16a34a":"#dc2626", fontFamily:"'JetBrains Mono',monospace" }}>
                {famCheaper ? `−${((uberX-zeezFam)/uberX*100).toFixed(1)}% ✓` : `+${((zeezFam-uberX)/uberX*100).toFixed(1)}% ⚠`}
              </span>
            </div>
            <span style={{ color:"#ef4444", fontSize:11, fontFamily:"'JetBrains Mono',monospace", opacity:0.7 }}>CA${uberXL.toFixed(2)}</span>
            <div style={{ display:"flex", flexDirection:"column", gap:1 }}>
              <span style={{ color:friCheaper?"#22c55e":"#ef4444", fontSize:11, fontWeight:700, fontFamily:"'JetBrains Mono',monospace" }}>CA${zeezFri.toFixed(2)}</span>
              <span style={{ fontSize:8, color:friCheaper?"#16a34a":"#dc2626", fontFamily:"'JetBrains Mono',monospace" }}>
                {friCheaper ? `−${((uberXL-zeezFri)/uberXL*100).toFixed(1)}% ✓` : `+${((zeezFri-uberXL)/uberXL*100).toFixed(1)}% ⚠`}
              </span>
            </div>
          </div>
        );
      })}
      {/* Overall status badge */}
      {(() => {
        const allCheaper = TRIPS.every(t => {
          const uberX  = calcUberFare("uberX",  t.km, t.min);
          const uberXL = calcUberFare("uberXL", t.km, t.min);
          const zeezFam = Math.round(calcFare(noSurgeCfg, t.km, t.min).total * (parseFloat(familyMult)||1) * 100) / 100;
          const zeezFri = Math.round(calcFare(noSurgeCfg, t.km, t.min).total * (parseFloat(friendsMult)||1) * 100) / 100;
          return zeezFam < uberX && zeezFri < uberXL;
        });
        return (
          <div style={{ marginTop:10, padding:"8px 12px", background:allCheaper?"rgba(34,197,94,0.06)":"rgba(239,68,68,0.06)", border:`1px solid ${allCheaper?"rgba(34,197,94,0.2)":"rgba(239,68,68,0.2)"}`, borderRadius:7, display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:14 }}>{allCheaper?"✅":"⚠️"}</span>
            <span style={{ color:allCheaper?"#22c55e":"#ef4444", fontSize:11, fontWeight:600 }}>
              {allCheaper
                ? "ZeezRyde is cheaper than Uber across all trip lengths"
                : "Warning: ZeezRyde is MORE expensive than Uber on some trips — use the Undercut Engine to fix this"}
            </span>
          </div>
        );
      })()}
    </SettingsPanel>
  );
}



// ─────────────────────────────────────────────────────────────────────────────
// PAGE: ZONE CONTROL
// ─────────────────────────────────────────────────────────────────────────────
//
// GTA zone map — canvas-rendered SVG-style polygons representing operational
// zones. Admin can: create zones, set status (active/restricted/blocked),
// assign/unassign drivers per zone, set surge overrides per zone, and see
// which drivers are currently operating in each area.
//

// ─────────────────────────────────────────────────────────────────────────────
// PAGE: ZONE CONTROL — Hamilton / Niagara Region
// ─────────────────────────────────────────────────────────────────────────────
//
// Map schematic covers the Hamilton–Niagara axis along the western end of
// the Niagara Peninsula: Hamilton (lower city + Mountain), Burlington,
// Dundas/Ancaster, Stoney Creek/Grimsby, St. Catharines, Niagara Falls,
// Niagara-on-the-Lake, Welland, Fort Erie, and the QEW corridor.
//
// Canvas dimensions: 600 x 420
// Geographic orientation: West (Hamilton) → East (Niagara Falls)
//                         North (Lake Ontario shoreline) → South (Lake Erie)

const INIT_ZONES = [
  {
    id: "ZN-001", name: "Downtown Hamilton", color: "#3b82f6",
    status: "active",
    // Lower city core — harbourfront to escarpment foot
    polygon: [[100,140],[180,140],[185,175],[180,210],[100,215],[90,180]],
    surgeOverride: null,
    notes: "Hamilton core — GO station, Jackson Square, Copps Coliseum area. High demand zone.",
    maxDrivers: 15,
  },
  {
    id: "ZN-002", name: "Hamilton Mountain", color: "#8b5cf6",
    status: "active",
    // Upper city above the escarpment
    polygon: [[70,215],[185,215],[190,260],[180,300],[80,305],[60,265]],
    surgeOverride: null,
    notes: "Upper Hamilton — Mohawk College, Limeridge Mall, Concession St. residential suburbs.",
    maxDrivers: 10,
  },
  {
    id: "ZN-003", name: "Dundas / Ancaster / Flamborough", color: "#06b6d4",
    status: "active",
    // West Hamilton suburbs
    polygon: [[20,160],[100,140],[90,180],[100,215],[70,215],[60,265],[20,260],[10,200]],
    surgeOverride: null,
    notes: "Western Hamilton suburbs — McMaster University, Dundas Valley, Ancaster town centre.",
    maxDrivers: 8,
  },
  {
    id: "ZN-004", name: "Burlington", color: "#22c55e",
    status: "active",
    // North-east of Hamilton along Lake Ontario
    polygon: [[180,95],[270,90],[280,140],[190,140],[185,175],[180,140]],
    surgeOverride: null,
    notes: "Burlington — Joseph Brant Hospital, Mapleview Mall, GO station. Bridge zone to Niagara.",
    maxDrivers: 10,
  },
  {
    id: "ZN-005", name: "Stoney Creek / Grimsby", color: "#f59e0b",
    status: "active",
    // East Hamilton/Stoney Creek corridor
    polygon: [[185,140],[280,140],[290,175],[285,215],[180,215],[185,175]],
    surgeOverride: null,
    notes: "Stoney Creek, Winona, Grimsby — growing residential, QEW on-ramp corridor.",
    maxDrivers: 8,
  },
  {
    id: "ZN-006", name: "St. Catharines", color: "#f97316",
    status: "active",
    polygon: [[285,120],[380,115],[395,160],[390,205],[285,210],[280,165]],
    surgeOverride: null,
    notes: "Largest Niagara city — Brock University, Pen Centre, downtown core. Strong demand.",
    maxDrivers: 12,
  },
  {
    id: "ZN-007", name: "Niagara Falls", color: "#ec4899",
    status: "active",
    polygon: [[390,115],[470,110],[490,160],[485,210],[390,210],[385,160]],
    surgeOverride: "1.5",
    notes: "Tourist surge zone — Clifton Hill, Casino Niagara, falls area. Permanent 1.5x surge.",
    maxDrivers: 14,
  },
  {
    id: "ZN-008", name: "Niagara-on-the-Lake", color: "#a78bfa",
    status: "active",
    polygon: [[390,70],[470,65],[490,115],[470,115],[390,115],[375,85]],
    surgeOverride: "1.2",
    notes: "Wine country, Shaw Festival, historic town. Seasonal surge — high summer demand.",
    maxDrivers: 6,
  },
  {
    id: "ZN-009", name: "Welland / Thorold / Port Colborne", color: "#64748b",
    status: "restricted",
    polygon: [[300,210],[400,210],[410,285],[395,320],[295,325],[285,280]],
    surgeOverride: null,
    notes: "Welland Canal corridor — restricted pending driver recruitment in south Niagara.",
    maxDrivers: 5,
  },
  {
    id: "ZN-010", name: "Fort Erie / Ridgeway", color: "#ef4444",
    status: "blocked",
    polygon: [[400,285],[490,280],[510,340],[500,370],[400,375],[390,330]],
    surgeOverride: null,
    notes: "US border zone — blocked pending cross-border regulatory review with CRTC and CBSA.",
    maxDrivers: 0,
  },
  {
    id: "ZN-011", name: "Lincoln / Beamsville / Vineland", color: "#10b981",
    status: "active",
    polygon: [[270,140],[290,140],[285,210],[270,215],[260,280],[240,285],[230,215],[250,145]],
    surgeOverride: null,
    notes: "Niagara wine route — Lincoln, Beamsville, Twenty Valley. Moderate weekend demand.",
    maxDrivers: 5,
  },
  {
    id: "ZN-012", name: "Hamilton Airport (YHM) Corridor", color: "#fbbf24",
    status: "active",
    polygon: [[60,265],[180,265],[185,215],[190,260],[80,305],[60,300]],
    surgeOverride: "1.3",
    notes: "John C. Munro International Airport — Mount Hope. Dedicated airport pickup zone 1.3x.",
    maxDrivers: 8,
  },
];

const DRIVER_ZONE_DEFAULTS = {};

const ZONE_STATUS_META = {
  active:     { label:"Active",     color:"#22c55e", bg:"rgba(34,197,94,0.1)",    border:"rgba(34,197,94,0.25)",    desc:"Drivers can pick up and drop off freely" },
  restricted: { label:"Restricted", color:"#f59e0b", bg:"rgba(245,158,11,0.1)",   border:"rgba(245,158,11,0.25)",   desc:"Limited operation — assigned drivers only" },
  blocked:    { label:"Blocked",    color:"#ef4444", bg:"rgba(239,68,68,0.1)",     border:"rgba(239,68,68,0.25)",    desc:"No pickups or drop-offs permitted" },
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE: DOCUMENTS
// ─────────────────────────────────────────────────────────────────────────────
const MAX_VEHICLE_AGE  = 10;
const CUR_YEAR         = 2026;
const MIN_VEHICLE_YEAR = CUR_YEAR - MAX_VEHICLE_AGE; // 2016

// Returns null if ok, or a warning string if vehicle year violates the policy
function vehicleYearWarning(year) {
  if (!year) return null;
  const y = parseInt(year);
  if (isNaN(y)) return null;
  if (y < MIN_VEHICLE_YEAR) return `Vehicle is ${CUR_YEAR - y} years old — exceeds the ${MAX_VEHICLE_AGE}-year maximum. Registration must be rejected.`;
  if (y < MIN_VEHICLE_YEAR + 2) return `Vehicle is ${CUR_YEAR - y} years old — approaching the ${MAX_VEHICLE_AGE}-year limit. Verify carefully.`;
  return null;
}

const DOC_ICONS = {
  "Driver's Licence (Ontario Class G)":   "🪪",
  "Abstract (3-Year Driver Record)":       "📋",
  "Criminal Background Check":             "🔍",
  "Vehicle Registration":                  "📄",
  "Automobile Insurance (rideshare)":      "🛡️",
  "Vehicle Safety Inspection Certificate": "🔧",
  "Niagara Region TNC Driver's Licence":   "🏅",
  "Niagara Region TNC Vehicle Permit":     "🚖",
  "Proof of Work Eligibility":             "📑",
  "Profile Photo":                         "📷",
};

const DOC_META = {
  approved: { label:"Approved", color:"#22c55e", bg:"rgba(34,197,94,0.1)",   border:"rgba(34,197,94,0.25)"  },
  pending:  { label:"Pending",  color:"#f59e0b", bg:"rgba(245,158,11,0.1)",  border:"rgba(245,158,11,0.25)" },
  rejected: { label:"Rejected", color:"#ef4444", bg:"rgba(239,68,68,0.1)",   border:"rgba(239,68,68,0.25)"  },
  missing:  { label:"Missing",  color:"#475569", bg:"rgba(71,85,105,0.1)",   border:"rgba(71,85,105,0.2)"   },
};



// Simulate a document "image" preview with a realistic-looking placeholder
function DocViewer({ doc, driverName, driverVehicle="" }) {
  if (!doc) return (
    <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12, color:"#334155" }}>
      <div style={{ fontSize:32 }}>⊟</div>
      <div style={{ fontSize:12 }}>Select a document to preview</div>
    </div>
  );

  if (doc.status === "missing" || !doc.file) return (
    <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12 }}>
      <div style={{ fontSize:32 }}>○</div>
      <div style={{ color:"#475569", fontSize:12 }}>No file uploaded yet</div>
      <div style={{ color:"#334155", fontSize:10 }}>Driver has not submitted this document</div>
    </div>
  );

  const isPdf = doc.file.endsWith(".pdf");
  const icon  = DOC_ICONS[doc.type] || "📄";

  // Extract year from vehicle string for registration docs
  const vehYearMatch = driverVehicle ? driverVehicle.match(/\b(20\d{2}|19\d{2})\b/) : null;
  const vehYear      = vehYearMatch ? parseInt(vehYearMatch[1]) : null;
  const vehWarning   = doc.type === "Vehicle Registration" ? vehicleYearWarning(vehYear) : null;

  // Simulate a rendered document preview
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      {/* Vehicle age warning banner */}
      {vehWarning && (
        <div style={{ marginBottom:10, background: vehYear < MIN_VEHICLE_YEAR ? "rgba(239,68,68,0.08)" : "rgba(245,158,11,0.07)", border: vehYear < MIN_VEHICLE_YEAR ? "1px solid rgba(239,68,68,0.3)" : "1px solid rgba(245,158,11,0.3)", borderRadius:9, padding:"10px 13px", display:"flex", alignItems:"flex-start", gap:9 }}>
          <span style={{ fontSize:16, flexShrink:0 }}>{vehYear < MIN_VEHICLE_YEAR ? "🚫" : "⚠️"}</span>
          <div>
            <div style={{ color: vehYear < MIN_VEHICLE_YEAR ? "#ef4444" : "#f59e0b", fontSize:11, fontWeight:700, marginBottom:2 }}>
              {vehYear < MIN_VEHICLE_YEAR ? "Vehicle Too Old — Reject Registration" : "Vehicle Age Warning"}
            </div>
            <div style={{ color:"#64748b", fontSize:10, lineHeight:1.5 }}>{vehWarning}</div>
            <div style={{ color:"rgba(148,163,184,0.4)", fontSize:9, fontFamily:"'JetBrains Mono',monospace", marginTop:4 }}>
              POLICY: Vehicles must be {CUR_YEAR} model year {MIN_VEHICLE_YEAR} or newer · Max age {MAX_VEHICLE_AGE} years
            </div>
          </div>
        </div>
      )}
      {/* Mock document canvas */}
      <div style={{ flex:1, background:"rgba(255,255,255,0.02)", border:"1px solid rgba(99,179,237,0.1)", borderRadius:10, margin:"0 0 12px", overflow:"hidden", position:"relative", minHeight:300 }}>
        {/* Document header bar */}
        <div style={{ background:"rgba(59,130,246,0.06)", borderBottom:"1px solid rgba(99,179,237,0.1)", padding:"10px 14px", display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:16 }}>{icon}</span>
          <div>
            <div style={{ color:"#cbd5e1", fontSize:11, fontWeight:600 }}>{doc.type}</div>
            <div style={{ color:"#334155", fontSize:9, fontFamily:"'JetBrains Mono',monospace" }}>{doc.file}</div>
          </div>
          <div style={{ marginLeft:"auto", background:"rgba(99,179,237,0.08)", border:"1px solid rgba(99,179,237,0.15)", borderRadius:4, padding:"3px 8px" }}>
            <span style={{ color:"#475569", fontSize:8, fontFamily:"'JetBrains Mono',monospace" }}>{isPdf ? "PDF" : "IMAGE"}</span>
          </div>
        </div>

        {/* Simulated document body */}
        <div style={{ padding:20, display:"flex", flexDirection:"column", gap:10 }}>
          {/* Government header */}
          <div style={{ display:"flex", alignItems:"center", gap:10, paddingBottom:10, borderBottom:"2px solid rgba(99,179,237,0.08)" }}>
            <div style={{ width:36, height:36, borderRadius:6, background:"rgba(59,130,246,0.1)", border:"1px solid rgba(59,130,246,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>
              {doc.type === "Driver's Licence (Ontario Class G)" ? "🍁" : doc.type === "Automobile Insurance (rideshare)" ? "🏛" : doc.type === "Criminal Background Check" ? "🔍" : doc.type === "Profile Photo" ? "📷" : "🏛"}
            </div>
            <div>
              <div style={{ color:"#94a3b8", fontSize:10, fontWeight:700, letterSpacing:1 }}>
                {doc.type === "Driver's Licence (Ontario Class G)" ? "ONTARIO — CLASS G DRIVER'S LICENCE" :
                 doc.type === "Automobile Insurance (rideshare)" ? "CERTIFICATE OF AUTOMOBILE INSURANCE" :
                 doc.type === "Criminal Background Check" ? "CRIMINAL RECORD CHECK — RCMP" :
                 doc.type === "Abstract (3-Year Driver Record)" ? "ONTARIO DRIVER'S ABSTRACT — 3 YEAR" :
                 doc.type === "Vehicle Registration" ? "ONTARIO — VEHICLE PERMIT" :
                 doc.type === "Vehicle Safety Inspection Certificate" ? "ONTARIO SAFETY STANDARDS CERTIFICATE" :
                 doc.type === "Profile Photo" ? "DRIVER PROFILE PHOTO" :
                 "ONTARIO — OFFICIAL DOCUMENT"}
              </div>
              <div style={{ color:"#334155", fontSize:8, marginTop:1 }}>Province of Ontario · Government of Canada</div>
            </div>
          </div>

          {/* Document fields */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            {[
              ["NAME", driverName],
              ["DOCUMENT #", doc.file.replace(/[^0-9]/g,"").slice(0,8) || "ON" + Math.floor(Math.random()*9000000+1000000)],
              ["ISSUED", doc.uploaded || "—"],
              ["CLASS", doc.type === "Driver's Licence (Ontario Class G)" ? "G — Full" : "N/A"],
            ].map(([l, v]) => (
              <div key={l} style={{ background:"rgba(255,255,255,0.02)", borderRadius:6, padding:"7px 10px" }}>
                <div style={{ color:"rgba(148,163,184,0.3)", fontSize:7, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1.5, marginBottom:2 }}>{l}</div>
                <div style={{ color:"#94a3b8", fontSize:11, fontWeight:500 }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Simulated barcode / watermark */}
          <div style={{ display:"flex", gap:2, justifyContent:"center", opacity:0.15, marginTop:8 }}>
            {Array.from({length:40}).map((_, i) => (
              <div key={i} style={{ width: i%3===0?3:1, height:28, background:"#94a3b8" }} />
            ))}
          </div>
          <div style={{ textAlign:"center", color:"rgba(148,163,184,0.2)", fontSize:7, fontFamily:"'JetBrains Mono',monospace", letterSpacing:3 }}>
            GOVERNMENT ISSUED DOCUMENT — SIMULATED PREVIEW
          </div>
        </div>
      </div>

      {/* File metadata */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
        {[
          ["UPLOADED",   doc.uploaded || "—"],
          ["FILE",       doc.file],
          ["TYPE",       isPdf ? "PDF Document" : "Image File"],
          ["STATUS",     (DOC_META[doc.status]||DOC_META.missing).label],
        ].map(([l,v]) => (
          <div key={l} style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(99,179,237,0.07)", borderRadius:7, padding:"7px 10px" }}>
            <div style={{ color:"rgba(148,163,184,0.3)", fontSize:7, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1.5, marginBottom:2 }}>{l}</div>
            <div style={{ color:"#94a3b8", fontSize:10, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DocStatusPill({ status }) {
  const m = DOC_META[status] || DOC_META.missing;
  return (
    <span style={{ background:m.bg, border:`1px solid ${m.border}`, color:m.color, borderRadius:5, padding:"2px 8px", fontSize:9, fontWeight:700, fontFamily:"'JetBrains Mono',monospace", letterSpacing:0.5, flexShrink:0 }}>
      {m.label.toUpperCase()}
    </span>
  );
}

function PageDocs({ viewOnly, drivers, patchDriver, setModal }) {
  const [expandedDriver, setExpandedDriver] = useState(
    // Auto-expand first driver with pending docs
    drivers.find(d => d.docFiles?.some(f => f.status === "pending"))?.id || null
  );
  const [selectedDoc,    setSelectedDoc]    = useState(null); // { driverId, docIndex }
  const [filterStatus,   setFilterStatus]   = useState("all");
  const [rejectNote,     setRejectNote]     = useState("");
  const [rejectTarget,   setRejectTarget]   = useState(null);

  const selDriverObj = selectedDoc ? drivers.find(d => d.id === selectedDoc.driverId) : null;
  const selDocObj    = selDriverObj ? selDriverObj.docFiles?.[selectedDoc.docIndex] : null;

  function patchDoc(driverId, docIndex, patch) {
    const d = drivers.find(d => d.id === driverId);
    if (!d) return;
    const newFiles = d.docFiles.map((f, i) => i === docIndex ? { ...f, ...patch } : f);
    const statuses = newFiles.map(f => f.status);
    const topDocs  = statuses.every(s => s === "approved") ? "approved" : "pending";
    patchDriver(driverId, { docFiles: newFiles, docs: topDocs });
    // Keep selection in sync
    if (selectedDoc?.driverId === driverId && selectedDoc?.docIndex === docIndex) {
      setSelectedDoc({ driverId, docIndex }); // force re-render
    }
  }

  function approveDoc(driverId, docIndex) {
    patchDoc(driverId, docIndex, { status:"approved", note:"" });
  }
  function approveAll(driverId) {
    const d = drivers.find(d => d.id === driverId);
    if (!d) return;
    const newFiles = d.docFiles.map(f => f.status === "pending" ? { ...f, status:"approved", note:"" } : f);
    patchDriver(driverId, { docFiles: newFiles, docs: newFiles.every(f => f.status==="approved") ? "approved" : "pending" });
  }

  const counts = drivers.reduce((acc, d) => {
    (d.docFiles||[]).forEach(f => { acc[f.status] = (acc[f.status]||0) + 1; });
    return acc;
  }, {});
  const totalPending = counts.pending || 0;

  // Filter drivers to show
  const visibleDrivers = filterStatus === "all"
    ? drivers
    : drivers.filter(d => (d.docFiles||[]).some(f => f.status === filterStatus));

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:0, height:"100%" }}>

      {/* ── Header ── */}
      <div style={{ marginBottom:20 }}>
        <div style={{ color:"#f0f9ff", fontSize:20, fontWeight:700, letterSpacing:-0.5 }}>Document Review</div>
        <div style={{ color:"#475569", fontSize:12, marginTop:3 }}>
          Verify driver onboarding documents · set expiry dates · approve or reject
        </div>
      </div>

      {/* ── Summary bar ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:20 }}>
        {[
          ["PENDING",  counts.pending||0,  "#f59e0b","⏳"],
          ["APPROVED", counts.approved||0, "#22c55e","✓" ],
          ["REJECTED", counts.rejected||0, "#ef4444","✗" ],
          ["MISSING",  counts.missing||0,  "#475569","○" ],
        ].map(([label, val, color, icon]) => (
          <div key={label} onClick={() => setFilterStatus(s => s === label.toLowerCase() ? "all" : label.toLowerCase())} style={{ background:"#080c14", border:`1px solid ${filterStatus===label.toLowerCase()?"rgba(99,179,237,0.3)":"rgba(99,179,237,0.1)"}`, borderRadius:10, padding:"12px 16px", display:"flex", alignItems:"center", gap:10, cursor:"pointer", transition:"all 0.15s" }}>
            <span style={{ color, fontSize:16 }}>{icon}</span>
            <div>
              <div style={{ color, fontSize:20, fontWeight:700, fontFamily:"'JetBrains Mono',monospace", lineHeight:1 }}>{val}</div>
              <div style={{ color:"rgba(148,163,184,0.3)", fontSize:8, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1.5, marginTop:2 }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main layout: accordion list + doc viewer ── */}
      <div style={{ display:"flex", gap:16, alignItems:"flex-start", flex:1, minHeight:0 }}>

        {/* ── LEFT: driver accordion ── */}
        <div style={{ flex:"0 0 320px", display:"flex", flexDirection:"column", gap:0, background:"#080c14", border:"1px solid rgba(99,179,237,0.1)", borderRadius:12, overflow:"hidden" }}>

          {/* List header */}
          <div style={{ padding:"11px 16px", borderBottom:"1px solid rgba(99,179,237,0.08)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <span style={{ color:"rgba(148,163,184,0.4)", fontSize:9, fontFamily:"'JetBrains Mono',monospace", letterSpacing:2, fontWeight:700 }}>DRIVERS ({visibleDrivers.length})</span>
            <div style={{ display:"flex", gap:4 }}>
              {["all","pending","rejected"].map(s => (
                <button key={s} onClick={() => setFilterStatus(f => f===s?"all":s)} style={{ padding:"2px 7px", borderRadius:3, border:`1px solid ${filterStatus===s?"rgba(59,130,246,0.4)":"rgba(99,179,237,0.08)"}`, background:filterStatus===s?"rgba(59,130,246,0.1)":"transparent", color:filterStatus===s?"#60a5fa":"#334155", fontSize:7, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace", textTransform:"uppercase" }}>{s}</button>
              ))}
            </div>
          </div>

          {/* Driver rows */}
          <div style={{ overflowY:"auto", maxHeight:680 }}>
            {visibleDrivers.map(d => {
              const isExpanded = expandedDriver === d.id;
              const dPending   = (d.docFiles||[]).filter(f => f.status==="pending").length;
              const dApproved  = (d.docFiles||[]).filter(f => f.status==="approved").length;
              const dRejected  = (d.docFiles||[]).filter(f => f.status==="rejected").length;
              const dTotal     = (d.docFiles||[]).length;
              const allOk      = dApproved === dTotal && dTotal > 0;

              return (
                <div key={d.id} style={{ borderBottom:"1px solid rgba(99,179,237,0.06)" }}>

                  {/* Driver row header */}
                  <div
                    onClick={() => {
                      setExpandedDriver(v => v === d.id ? null : d.id);
                      // Auto-select first pending doc when expanding
                      if (expandedDriver !== d.id) {
                        const firstPending = (d.docFiles||[]).findIndex(f => f.status === "pending");
                        const firstIdx     = firstPending >= 0 ? firstPending : 0;
                        if ((d.docFiles||[]).length > 0) setSelectedDoc({ driverId:d.id, docIndex:firstIdx });
                      }
                    }}
                    style={{ padding:"11px 14px", display:"flex", alignItems:"center", gap:10, cursor:"pointer", background:isExpanded?"rgba(59,130,246,0.05)":"transparent", transition:"background 0.12s" }}
                  >
                    <Avi name={d.name} seed={d.id} size={28} hue={220} />
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ color:"#cbd5e1", fontSize:12, fontWeight:500, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{d.name}</div>
                      <div style={{ color:"#334155", fontSize:9, fontFamily:"'JetBrains Mono',monospace", marginTop:1 }}>{d.vehicle}</div>
                    </div>
                    {/* Mini status dots */}
                    <div style={{ display:"flex", alignItems:"center", gap:4, flexShrink:0 }}>
                      {dPending  > 0 && <span style={{ background:"rgba(245,158,11,0.15)", color:"#f59e0b", borderRadius:10, padding:"1px 6px", fontSize:8, fontWeight:700 }}>{dPending}⏳</span>}
                      {dRejected > 0 && <span style={{ background:"rgba(239,68,68,0.1)",  color:"#ef4444", borderRadius:10, padding:"1px 6px", fontSize:8, fontWeight:700 }}>{dRejected}✗</span>}
                      {allOk         && <span style={{ color:"#22c55e", fontSize:11 }}>✓</span>}
                    </div>
                    <span style={{ color:"#334155", fontSize:10, transition:"transform 0.2s", display:"inline-block", transform:isExpanded?"rotate(90deg)":"rotate(0deg)" }}>›</span>
                  </div>

                  {/* Expanded doc list */}
                  {isExpanded && (
                    <div style={{ background:"rgba(0,0,0,0.2)", borderTop:"1px solid rgba(99,179,237,0.05)" }}>
                      {(d.docFiles||[]).map((f, i) => {
                        const m       = DOC_META[f.status] || DOC_META.missing;
                        const isSel   = selectedDoc?.driverId === d.id && selectedDoc?.docIndex === i;
                        const expiring = f.expiresOn && new Date(f.expiresOn) < new Date(Date.now() + 30*24*60*60*1000);
                        return (
                          <div
                            key={i}
                            onClick={() => setSelectedDoc({ driverId:d.id, docIndex:i })}
                            style={{ padding:"9px 14px 9px 22px", display:"flex", alignItems:"center", gap:9, cursor:"pointer", background:isSel?"rgba(59,130,246,0.1)":"transparent", borderLeft:isSel?"3px solid #3b82f6":"3px solid transparent", transition:"all 0.12s" }}
                          >
                            <span style={{ fontSize:15, flexShrink:0 }}>{DOC_ICONS[f.type]||"📄"}</span>
                            <div style={{ flex:1, minWidth:0 }}>
                              <div style={{ color:isSel?"#93c5fd":"#94a3b8", fontSize:11, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{f.type}</div>
                              {f.expiresOn
                                ? <div style={{ color:expiring?"#f59e0b":"#334155", fontSize:8, fontFamily:"'JetBrains Mono',monospace", marginTop:1 }}>
                                    {expiring?"⚠ ":""}exp. {f.expiresOn}
                                  </div>
                                : <div style={{ color:"#1e293b", fontSize:8, marginTop:1 }}>no expiry set</div>
                              }
                            </div>
                            <DocStatusPill status={f.status} />
                          </div>
                        );
                      })}

                      {/* Approve all pending shortcut */}
                      {dPending > 0 && !viewOnly && (
                        <div style={{ padding:"7px 14px 10px" }}>
                          <button onClick={e => { e.stopPropagation(); approveAll(d.id); }} style={{ width:"100%", padding:"6px", borderRadius:6, background:"rgba(34,197,94,0.07)", border:"1px solid rgba(34,197,94,0.2)", color:"#22c55e", fontSize:9, fontWeight:700, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace" }}>
                            ✓ APPROVE ALL PENDING
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT: doc viewer + actions ── */}
        <div style={{ flex:1, minWidth:0, display:"flex", flexDirection:"column", gap:12 }}>

          {selDocObj && selDriverObj ? (() => {
            const m          = DOC_META[selDocObj.status] || DOC_META.missing;
            const isRejectOpen = rejectTarget !== null;
            const expiring   = selDocObj.expiresOn && new Date(selDocObj.expiresOn) < new Date(Date.now() + 30*24*60*60*1000);
            const expired    = selDocObj.expiresOn && new Date(selDocObj.expiresOn) < new Date();

            return (
              <>
                {/* Doc viewer panel */}
                <div style={{ background:"#080c14", border:"1px solid rgba(99,179,237,0.1)", borderRadius:12, overflow:"hidden" }}>
                  {/* Viewer header */}
                  <div style={{ padding:"12px 16px", borderBottom:"1px solid rgba(99,179,237,0.08)", background:"rgba(59,130,246,0.04)", display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{ fontSize:18 }}>{DOC_ICONS[selDocObj.type]||"📄"}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ color:"#e2e8f0", fontSize:13, fontWeight:600 }}>{selDocObj.type}</div>
                      <div style={{ color:"#334155", fontSize:9, fontFamily:"'JetBrains Mono',monospace", marginTop:1 }}>{selDriverObj.name} · {selDriverObj.id}</div>
                    </div>
                    <DocStatusPill status={selDocObj.status} />
                  </div>

                  {/* Document preview */}
                  <div style={{ padding:"16px", minHeight:360, display:"flex", flexDirection:"column" }}>
                    <DocViewer doc={selDocObj} driverName={selDriverObj.name} driverVehicle={selDriverObj.vehicle} />
                  </div>
                </div>

                {/* Actions + expiry panel */}
                <div style={{ background:"#080c14", border:"1px solid rgba(99,179,237,0.1)", borderRadius:12, padding:"16px 18px", display:"flex", flexDirection:"column", gap:14 }}>

                  {/* Approve / Reject */}
                  <div>
                    <div style={{ color:"rgba(148,163,184,0.35)", fontSize:9, fontFamily:"'JetBrains Mono',monospace", letterSpacing:2, marginBottom:8 }}>VERIFICATION DECISION</div>
                    {!viewOnly && <div style={{ display:"flex", gap:8 }}>
                      <button
                        onClick={() => approveDoc(selDriverObj.id, selectedDoc.docIndex)}
                        disabled={selDocObj.status === "approved"}
                        style={{ flex:1, padding:"10px", borderRadius:8, background:selDocObj.status==="approved"?"rgba(34,197,94,0.15)":"rgba(34,197,94,0.08)", border:`1px solid rgba(34,197,94,${selDocObj.status==="approved"?"0.4":"0.2"})`, color:"#22c55e", fontSize:11, fontWeight:700, cursor:selDocObj.status==="approved"?"default":"pointer", fontFamily:"'JetBrains Mono',monospace", opacity:selDocObj.status==="approved"?0.6:1 }}
                      >
                        {selDocObj.status === "approved" ? "✓ APPROVED" : "✓ APPROVE"}
                      </button>
                      <button
                        onClick={() => setRejectTarget(v => v === null ? selectedDoc.docIndex : null)}
                        disabled={selDocObj.status === "missing"}
                        style={{ flex:1, padding:"10px", borderRadius:8, background:selDocObj.status==="rejected"?"rgba(239,68,68,0.15)":"rgba(239,68,68,0.07)", border:`1px solid rgba(239,68,68,${selDocObj.status==="rejected"?"0.35":"0.2"})`, color:"#ef4444", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace" }}
                      >
                        {selDocObj.status === "rejected" ? "✗ REJECTED" : "✗ REJECT"}
                      </button>
                      {(selDocObj.status === "approved" || selDocObj.status === "rejected") && (
                        <button onClick={() => patchDoc(selDriverObj.id, selectedDoc.docIndex, { status:"pending", note:"" })} style={{ padding:"10px 14px", borderRadius:8, background:"transparent", border:"1px solid rgba(99,179,237,0.12)", color:"#475569", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace" }}>
                          ↺ RESET
                        </button>
                      )}
                    </div>}

                    {/* Reject reason */}
                    {isRejectOpen && (
                      <div style={{ marginTop:10, display:"flex", flexDirection:"column", gap:7 }}>
                        <textarea
                          placeholder="Rejection reason — will be shown to the driver…"
                          value={rejectNote} onChange={e => setRejectNote(e.target.value)}
                          rows={2} autoFocus
                          style={{ width:"100%", padding:"9px 11px", background:"rgba(239,68,68,0.05)", border:"1px solid rgba(239,68,68,0.25)", borderRadius:8, color:"#f87171", fontSize:11, fontFamily:"inherit", outline:"none", resize:"vertical", boxSizing:"border-box" }}
                        />
                        <div style={{ display:"flex", gap:7 }}>
                          <button onClick={() => { patchDoc(selDriverObj.id, selectedDoc.docIndex, { status:"rejected", note: rejectNote || "Document rejected." }); setRejectTarget(null); setRejectNote(""); }} style={{ flex:1, padding:"8px", borderRadius:7, background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", color:"#ef4444", fontSize:10, fontWeight:700, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace" }}>
                            CONFIRM REJECTION
                          </button>
                          <button onClick={() => { setRejectTarget(null); setRejectNote(""); }} style={{ padding:"8px 14px", borderRadius:7, background:"transparent", border:"1px solid rgba(99,179,237,0.1)", color:"#475569", fontSize:10, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace" }}>
                            CANCEL
                          </button>
                        </div>
                      </div>
                    )}

                    {selDocObj.note && (
                      <div style={{ marginTop:8, padding:"8px 11px", background:"rgba(239,68,68,0.05)", border:"1px solid rgba(239,68,68,0.15)", borderRadius:7 }}>
                        <span style={{ color:"#475569", fontSize:9, fontFamily:"'JetBrains Mono',monospace" }}>NOTE TO DRIVER: </span>
                        <span style={{ color:"#f87171", fontSize:10 }}>{selDocObj.note}</span>
                      </div>
                    )}
                  </div>

                  {/* Expiry date */}
                  <div style={{ borderTop:"1px solid rgba(99,179,237,0.08)", paddingTop:14 }}>
                    <div style={{ color:"rgba(148,163,246,0.35)", fontSize:9, fontFamily:"'JetBrains Mono',monospace", letterSpacing:2, marginBottom:8 }}>DOCUMENT EXPIRY &amp; RENEWAL</div>
                    <div style={{ display:"flex", gap:10, alignItems:"flex-end" }}>
                      <div style={{ flex:1 }}>
                        <div style={{ color:"#475569", fontSize:10, marginBottom:5 }}>Expiration date — driver will be notified before this date</div>
                        <input
                          type="date"
                          value={selDocObj.expiresOn || ""}
                          onChange={e => patchDoc(selDriverObj.id, selectedDoc.docIndex, { expiresOn: e.target.value })}
                          style={{ width:"100%", padding:"9px 12px", background:"#0d1220", border:`1px solid ${expired?"rgba(239,68,68,0.4)":expiring?"rgba(245,158,11,0.35)":"rgba(99,179,237,0.18)"}`, borderRadius:8, color:expired?"#ef4444":expiring?"#f59e0b":"#94a3b8", fontSize:13, fontFamily:"'JetBrains Mono',monospace", outline:"none", boxSizing:"border-box", cursor:"pointer" }}
                        />
                      </div>
                      {selDocObj.expiresOn && (
                        <button onClick={() => patchDoc(selDriverObj.id, selectedDoc.docIndex, { expiresOn:"" })} style={{ padding:"9px 12px", borderRadius:8, background:"transparent", border:"1px solid rgba(99,179,237,0.1)", color:"#334155", fontSize:10, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace", flexShrink:0 }}>
                          CLEAR
                        </button>
                      )}
                    </div>

                    {/* Expiry status */}
                    {selDocObj.expiresOn && (
                      <div style={{ marginTop:8, padding:"8px 11px", background:expired?"rgba(239,68,68,0.07)":expiring?"rgba(245,158,11,0.07)":"rgba(34,197,94,0.06)", border:`1px solid ${expired?"rgba(239,68,68,0.2)":expiring?"rgba(245,158,11,0.2)":"rgba(34,197,94,0.15)"}`, borderRadius:7, display:"flex", alignItems:"center", gap:7 }}>
                        <span style={{ fontSize:13 }}>{expired?"🔴":expiring?"🟡":"🟢"}</span>
                        <div>
                          <div style={{ color:expired?"#ef4444":expiring?"#f59e0b":"#22c55e", fontSize:11, fontWeight:600 }}>
                            {expired ? "Document expired" : expiring ? "Expiring within 30 days" : "Valid"}
                          </div>
                          <div style={{ color:"#475569", fontSize:9, marginTop:1 }}>
                            {expired ? "Driver must resubmit before going online" : expiring ? "Send renewal reminder to driver" : `Renews ${selDocObj.expiresOn}`}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Quick expiry presets */}
                    <div style={{ marginTop:8 }}>
                      <div style={{ color:"#1e293b", fontSize:8, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1, marginBottom:5 }}>QUICK SET</div>
                      <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                        {[
                          ["1 yr",  365],
                          ["2 yr",  730],
                          ["5 yr",  1825],
                          ["6 mo",  180],
                          ["3 mo",  90],
                        ].map(([label, days]) => {
                          const d = new Date();
                          d.setDate(d.getDate() + days);
                          const val = d.toISOString().split("T")[0];
                          return (
                            <button key={label} onClick={() => patchDoc(selDriverObj.id, selectedDoc.docIndex, { expiresOn: val })} style={{ padding:"4px 10px", borderRadius:5, border:"1px solid rgba(99,179,237,0.12)", background:"rgba(99,179,237,0.04)", color:"#475569", fontSize:9, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace", transition:"all 0.12s" }}
                              onMouseEnter={e => { e.target.style.borderColor="rgba(99,179,237,0.3)"; e.target.style.color="#94a3b8"; }}
                              onMouseLeave={e => { e.target.style.borderColor="rgba(99,179,237,0.12)"; e.target.style.color="#475569"; }}
                            >
                              +{label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                </div>
              </>
            );
          })() : (
            <div style={{ flex:1, background:"#080c14", border:"1px solid rgba(99,179,237,0.08)", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12, padding:40, minHeight:400 }}>
              <div style={{ fontSize:36, opacity:0.3 }}>⊟</div>
              <div style={{ color:"#334155", fontSize:13 }}>Select a driver and document to begin review</div>
              <div style={{ color:"#1e293b", fontSize:10 }}>Expand a driver row on the left to see their uploaded files</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PageZones({ viewOnly, drivers, patchDriver }) {
  const [zones,          setZones]          = useState(INIT_ZONES);
  const [driverZones,    setDriverZones]    = useState(DRIVER_ZONE_DEFAULTS);
  const [selectedZone,   setSelectedZone]   = useState(null);
  const [hoveredZone,    setHoveredZone]    = useState(null);
  const [filterStatus,   setFilterStatus]   = useState("all");
  const [showDriverPane, setShowDriverPane] = useState(false);
  const canvasRef = useRef();
  const W = 560, H = 420;

  const sel = zones.find(z => z.id === selectedZone);
  const assignedDriverIds = selectedZone
    ? Object.entries(driverZones).filter(([,zs]) => zs.includes(selectedZone)).map(([d]) => d)
    : [];

  function patchZone(id, patch) {
    setZones(zs => zs.map(z => z.id === id ? { ...z, ...patch } : z));
  }
  function assignDriver(driverId, zoneId) {
    setDriverZones(dz => {
      const cur = dz[driverId] || [];
      if (cur.includes(zoneId)) return dz;
      return { ...dz, [driverId]: [...cur, zoneId] };
    });
  }
  function unassignDriver(driverId, zoneId) {
    setDriverZones(dz => ({ ...dz, [driverId]: (dz[driverId]||[]).filter(z=>z!==zoneId) }));
  }
  function getZoneDriverCount(zoneId) {
    return Object.values(driverZones).filter(zs => zs.includes(zoneId)).length;
  }

  function pointInPolygon(px, py, polygon) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const [xi, yi] = polygon[i], [xj, yj] = polygon[j];
      if (((yi > py) !== (yj > py)) && (px < (xj - xi) * (py - yi) / (yj - yi) + xi))
        inside = !inside;
    }
    return inside;
  }
  function centroid(polygon) {
    return [
      polygon.reduce((s,[x]) => s+x, 0) / polygon.length,
      polygon.reduce((s,[,y]) => s+y, 0) / polygon.length,
    ];
  }

  function handleCanvasClick(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (W / rect.width);
    const my = (e.clientY - rect.top)  * (H / rect.height);
    let hit = null;
    for (const z of [...zones].reverse()) {
      if (pointInPolygon(mx, my, z.polygon)) { hit = z.id; break; }
    }
    setSelectedZone(prev => prev === hit ? null : hit);
    if (hit) setShowDriverPane(false);
  }

  function handleCanvasMove(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (W / rect.width);
    const my = (e.clientY - rect.top)  * (H / rect.height);
    let hit = null;
    for (const z of [...zones].reverse()) {
      if (pointInPolygon(mx, my, z.polygon)) { hit = z.id; break; }
    }
    setHoveredZone(hit);
  }

  // ── Draw map ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = "#080c14";
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = "rgba(99,179,237,0.04)";
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

    // Lake Ontario (top band)
    const lakeGrad = ctx.createLinearGradient(0, 0, 0, 90);
    lakeGrad.addColorStop(0, "rgba(15,40,100,0.6)");
    lakeGrad.addColorStop(1, "rgba(15,40,100,0.0)");
    ctx.fillStyle = lakeGrad;
    ctx.fillRect(0, 0, W, 95);
    ctx.fillStyle = "rgba(59,130,246,0.18)";
    ctx.font = "10px 'JetBrains Mono',monospace";
    ctx.fillText("LAKE ONTARIO", 195, 30);

    // Lake Erie (bottom band)
    const erie = ctx.createLinearGradient(0, 370, 0, H);
    erie.addColorStop(0, "rgba(15,40,100,0.0)");
    erie.addColorStop(1, "rgba(15,40,100,0.55)");
    ctx.fillStyle = erie;
    ctx.fillRect(0, 360, W, H);
    ctx.fillStyle = "rgba(59,130,246,0.15)";
    ctx.fillText("LAKE ERIE", 395, H-10);

    // Niagara River (right edge, vertical)
    ctx.strokeStyle = "rgba(59,130,246,0.2)";
    ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(W-10, 65); ctx.lineTo(W-10, H-20); ctx.stroke();
    ctx.fillStyle = "rgba(59,130,246,0.15)";
    ctx.font = "8px 'JetBrains Mono',monospace";
    ctx.save(); ctx.translate(W-4, 220); ctx.rotate(-Math.PI/2);
    ctx.fillText("NIAGARA RIVER  ← USA →", 0, 0);
    ctx.restore();

    // Niagara Escarpment line (horizontal, through Hamilton)
    ctx.strokeStyle = "rgba(148,163,184,0.12)";
    ctx.setLineDash([6,4]);
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(10,210); ctx.lineTo(300,210); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(148,163,184,0.18)";
    ctx.font = "8px 'JetBrains Mono',monospace";
    ctx.fillText("— NIAGARA ESCARPMENT —", 30, 207);

    // QEW highway hint
    ctx.strokeStyle = "rgba(251,191,36,0.15)";
    ctx.setLineDash([3,5]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(100, 155); ctx.bezierCurveTo(200,148, 330,135, 450,130);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(251,191,36,0.2)";
    ctx.font = "8px 'JetBrains Mono',monospace";
    ctx.fillText("QEW", 230, 128);

    // ── Draw zones ──────────────────────────────────────────────────────────
    const filtered = filterStatus === "all" ? zones : zones.filter(z => z.status === filterStatus);

    for (const z of filtered) {
      const isSel = z.id === selectedZone;
      const isHov = z.id === hoveredZone;
      const sm    = ZONE_STATUS_META[z.status];

      ctx.beginPath();
      ctx.moveTo(...z.polygon[0]);
      for (const pt of z.polygon.slice(1)) ctx.lineTo(...pt);
      ctx.closePath();

      const alpha = isSel ? 0.38 : isHov ? 0.24 : 0.13;
      ctx.fillStyle = z.color + Math.round(alpha * 255).toString(16).padStart(2,"0");
      ctx.fill();

      ctx.strokeStyle = isSel ? z.color : isHov ? z.color+"cc" : z.color+"55";
      ctx.lineWidth   = isSel ? 2.5 : isHov ? 1.8 : 1;
      if (z.status === "blocked")     ctx.setLineDash([5,4]);
      else if (z.status === "restricted") ctx.setLineDash([8,3]);
      else ctx.setLineDash([]);
      ctx.stroke();
      ctx.setLineDash([]);

      const [cx, cy] = centroid(z.polygon);
      const dCount   = getZoneDriverCount(z.id);

      // Status dot
      ctx.beginPath();
      ctx.arc(cx, cy - 13, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = sm.color;
      if (!isSel) ctx.globalAlpha = 0.7;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Zone label
      ctx.font = `${isSel ? "bold " : ""}9px 'JetBrains Mono',monospace`;
      ctx.fillStyle = isSel ? "#f0f9ff" : "#94a3b8";
      ctx.textAlign = "center";
      const words = z.name.split(" ");
      if (words.length > 2) {
        // Two lines for long names
        const mid = Math.ceil(words.length/2);
        ctx.fillText(words.slice(0,mid).join(" "), cx, cy+1);
        ctx.font = `8px 'JetBrains Mono',monospace`;
        ctx.fillStyle = isSel ? "#cbd5e1" : "#64748b";
        ctx.fillText(words.slice(mid).join(" "), cx, cy+11);
        ctx.font = `8px 'JetBrains Mono',monospace`;
        ctx.fillStyle = isSel ? z.color : "rgba(148,163,184,0.35)";
        ctx.fillText(`${dCount}/${z.maxDrivers}`, cx, cy+22);
      } else {
        ctx.fillText(z.name, cx, cy+2);
        ctx.font = `8px 'JetBrains Mono',monospace`;
        ctx.fillStyle = isSel ? z.color : "rgba(148,163,184,0.35)";
        ctx.fillText(`${dCount}/${z.maxDrivers}`, cx, cy+13);
      }

      // Surge badge
      if (z.surgeOverride) {
        ctx.fillStyle = "rgba(245,158,11,0.9)";
        ctx.font = "bold 8px 'JetBrains Mono',monospace";
        ctx.fillText(`⚡${z.surgeOverride}x`, cx, cy - 17);
      }

      ctx.textAlign = "left";
    }

    // Compass
    ctx.fillStyle = "rgba(99,179,237,0.3)";
    ctx.font = "bold 11px 'JetBrains Mono',monospace";
    ctx.fillText("N", W-24, 22);
    ctx.strokeStyle = "rgba(99,179,237,0.25)"; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(W-20,24); ctx.lineTo(W-20,38); ctx.stroke();

    // Scale hint
    ctx.fillStyle = "rgba(99,179,237,0.15)";
    ctx.font = "8px 'JetBrains Mono',monospace";
    ctx.fillText("← Hamilton  ·  ~90km axis  ·  Niagara Falls →", 8, H-8);

  }, [zones, selectedZone, hoveredZone, filterStatus, driverZones]);

  const statusCounts = { active:0, restricted:0, blocked:0 };
  zones.forEach(z => statusCounts[z.status]++);

  const P = {
    page:   { display:"flex", gap:20, alignItems:"flex-start" },
    left:   { flex:"0 0 auto" },
    right:  { flex:1, display:"flex", flexDirection:"column", gap:14, minWidth:0 },
    panel:  { background:"#080c14", border:"1px solid rgba(99,179,237,0.1)", borderRadius:12, overflow:"hidden" },
    ph:     { padding:"11px 16px", borderBottom:"1px solid rgba(99,179,237,0.08)", background:"rgba(59,130,246,0.04)" },
    pTitle: { color:"rgba(148,163,184,0.5)", fontSize:9, fontFamily:"'JetBrains Mono',monospace", letterSpacing:2, fontWeight:700 },
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom:20 }}>
        <div style={{ color:"#f0f9ff", fontSize:20, fontWeight:700, letterSpacing:-0.5 }}>Zone Control</div>
        <div style={{ color:"#475569", fontSize:12, marginTop:3 }}>Hamilton–Niagara operational axis · 12 zones · ~90km corridor</div>
      </div>

      {/* Summary stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:20 }}>
        {[
          ["TOTAL ZONES",  zones.length,            "#3b82f6","⬡"],
          ["ACTIVE",       statusCounts.active,      "#22c55e","●"],
          ["RESTRICTED",   statusCounts.restricted,  "#f59e0b","◐"],
          ["BLOCKED",      statusCounts.blocked,     "#ef4444","○"],
        ].map(([label,val,color,icon]) => (
          <div key={label} style={{ background:"#080c14", border:"1px solid rgba(99,179,237,0.1)", borderRadius:10, padding:"13px 16px", display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ color, fontSize:18 }}>{icon}</span>
            <div>
              <div style={{ color, fontSize:22, fontWeight:700, fontFamily:"'JetBrains Mono',monospace", lineHeight:1 }}>{val}</div>
              <div style={{ color:"rgba(148,163,184,0.35)", fontSize:9, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1.5, marginTop:2 }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={P.page}>
        {/* ── MAP ── */}
        <div style={P.left}>
          <div style={P.panel}>
            <div style={{ ...P.ph, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
              <span style={P.pTitle}>HAMILTON–NIAGARA OPERATIONAL MAP</span>
              <div style={{ display:"flex", gap:5 }}>
                {["all","active","restricted","blocked"].map(s => (
                  <button key={s} onClick={() => setFilterStatus(s)} style={{ padding:"3px 8px", borderRadius:4, border:`1px solid ${filterStatus===s?"rgba(59,130,246,0.4)":"rgba(99,179,237,0.1)"}`, background:filterStatus===s?"rgba(59,130,246,0.1)":"transparent", color:filterStatus===s?"#60a5fa":"#334155", fontSize:8, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace", textTransform:"uppercase" }}>{s}</button>
                ))}
              </div>
            </div>
            <div style={{ position:"relative" }}>
              <canvas
                ref={canvasRef} width={W} height={H}
                onClick={handleCanvasClick}
                onMouseMove={handleCanvasMove}
                onMouseLeave={() => setHoveredZone(null)}
                style={{ display:"block", width:"100%", maxWidth:W, cursor:"pointer" }}
              />
              {/* Hover tooltip */}
              {hoveredZone && !selectedZone && (() => {
                const hz = zones.find(z => z.id === hoveredZone);
                return hz ? (
                  <div style={{ position:"absolute", top:8, left:8, background:"rgba(8,12,20,0.95)", border:"1px solid rgba(99,179,237,0.2)", borderRadius:7, padding:"7px 11px", pointerEvents:"none", maxWidth:220 }}>
                    <div style={{ color:"#e2e8f0", fontSize:11, fontWeight:600 }}>{hz.name}</div>
                    <div style={{ color:ZONE_STATUS_META[hz.status].color, fontSize:9, fontFamily:"'JetBrains Mono',monospace", marginTop:2 }}>{hz.status.toUpperCase()} · {getZoneDriverCount(hz.id)}/{hz.maxDrivers} drivers</div>
                    {hz.surgeOverride && <div style={{ color:"#f59e0b", fontSize:9, marginTop:2 }}>⚡ Surge override: {hz.surgeOverride}x</div>}
                  </div>
                ) : null;
              })()}
            </div>
            {/* Legend */}
            <div style={{ padding:"8px 14px", borderTop:"1px solid rgba(99,179,237,0.07)", display:"flex", gap:16, flexWrap:"wrap" }}>
              {Object.entries(ZONE_STATUS_META).map(([k,m]) => (
                <div key={k} style={{ display:"flex", alignItems:"center", gap:5 }}>
                  <div style={{ width:7, height:7, borderRadius:"50%", background:m.color }} />
                  <span style={{ color:"rgba(148,163,184,0.4)", fontSize:8, fontFamily:"'JetBrains Mono',monospace" }}>{m.label}</span>
                </div>
              ))}
              <span style={{ color:"rgba(148,163,184,0.2)", fontSize:8 }}>⚡ = surge override active</span>
              <span style={{ color:"rgba(148,163,184,0.2)", fontSize:8 }}>Click zone to manage</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={P.right}>

          {/* Zone list */}
          <div style={P.panel}>
            <div style={P.ph}><span style={P.pTitle}>ALL ZONES ({zones.length})</span></div>
            <div style={{ maxHeight:220, overflowY:"auto" }}>
              {zones.map(z => {
                const m = ZONE_STATUS_META[z.status];
                const dCount = getZoneDriverCount(z.id);
                const isSel = z.id === selectedZone;
                return (
                  <div key={z.id} onClick={() => { setSelectedZone(p=>p===z.id?null:z.id); setShowDriverPane(false); }} style={{ padding:"8px 16px", borderBottom:"1px solid rgba(99,179,237,0.05)", display:"flex", alignItems:"center", gap:10, cursor:"pointer", background:isSel?"rgba(59,130,246,0.06)":"transparent", transition:"background 0.15s" }}>
                    <div style={{ width:9, height:9, borderRadius:2, background:z.color, flexShrink:0 }} />
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ color:isSel?"#e2e8f0":"#94a3b8", fontSize:11, fontWeight:isSel?600:400, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{z.name}</div>
                    </div>
                    {z.surgeOverride && <span style={{ color:"#f59e0b", fontSize:9 }}>⚡{z.surgeOverride}x</span>}
                    <span style={{ color:m.color, background:m.bg, border:`1px solid ${m.border}`, borderRadius:4, padding:"2px 6px", fontSize:7, fontWeight:700, fontFamily:"'JetBrains Mono',monospace", flexShrink:0 }}>{m.label.toUpperCase()}</span>
                    <span style={{ color:"#475569", fontSize:9, fontFamily:"'JetBrains Mono',monospace", flexShrink:0 }}>{dCount}/{z.maxDrivers}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Zone detail */}
          {sel ? (
            <div style={P.panel}>
              <div style={{ ...P.ph, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:10, height:10, borderRadius:2, background:sel.color }} />
                  <span style={{ color:"#e2e8f0", fontSize:12, fontWeight:600 }}>{sel.name}</span>
                  <span style={{ color:"#334155", fontSize:9, fontFamily:"'JetBrains Mono',monospace" }}>{sel.id}</span>
                </div>
                <button onClick={() => setSelectedZone(null)} style={{ background:"none", border:"none", color:"#334155", fontSize:13, cursor:"pointer" }}>✕</button>
              </div>
              <div style={{ padding:"14px 16px", display:"flex", flexDirection:"column", gap:12 }}>

                {/* Status */}
                <div>
                  <div style={{ color:"#475569", fontSize:9, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1, marginBottom:7 }}>ZONE STATUS</div>
                  <div style={{ display:"flex", gap:6 }}>
                    {!viewOnly && Object.entries(ZONE_STATUS_META).map(([k,m]) => (
                      <button key={k} onClick={() => patchZone(sel.id,{status:k})} style={{ flex:1, padding:"8px 4px", borderRadius:7, border: sel.status===k ? `1px solid ${m.border}` : "1px solid rgba(99,179,237,0.1)", background:sel.status===k?m.bg:"transparent", color:sel.status===k?m.color:"#334155", fontSize:9, fontWeight:700, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace", transition:"all 0.15s" }}>
                        {k==="active"?"●":k==="restricted"?"◐":"○"}<br/>{m.label.toUpperCase()}
                      </button>
                    ))}
                  </div>
                  <div style={{ marginTop:5, color:ZONE_STATUS_META[sel.status].color, fontSize:10 }}>{ZONE_STATUS_META[sel.status].desc}</div>
                </div>

                {/* Max drivers + surge */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                  <div>
                    <div style={{ color:"#475569", fontSize:9, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1, marginBottom:5 }}>MAX DRIVERS</div>
                    <input type="number" value={sel.maxDrivers} onChange={e=>patchZone(sel.id,{maxDrivers:parseInt(e.target.value)||0})} style={{ width:"100%", padding:"7px 10px", background:"#0d1220", border:"1px solid rgba(99,179,237,0.15)", borderRadius:7, color:"#e2e8f0", fontSize:14, fontWeight:700, fontFamily:"'JetBrains Mono',monospace", outline:"none", boxSizing:"border-box" }} />
                  </div>
                  <div>
                    <div style={{ color:"#475569", fontSize:9, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1, marginBottom:5 }}>SURGE OVERRIDE (x)</div>
                    <input type="text" placeholder="e.g. 1.3 or blank" value={sel.surgeOverride||""} onChange={e=>patchZone(sel.id,{surgeOverride:e.target.value||null})} style={{ width:"100%", padding:"7px 10px", background:"#0d1220", border:`1px solid ${sel.surgeOverride?"rgba(245,158,11,0.3)":"rgba(99,179,237,0.15)"}`, borderRadius:7, color:sel.surgeOverride?"#f59e0b":"#94a3b8", fontSize:14, fontWeight:700, fontFamily:"'JetBrains Mono',monospace", outline:"none", boxSizing:"border-box" }} />
                    {sel.surgeOverride && <div style={{ color:"#f59e0b", fontSize:9, marginTop:3 }}>Overrides global surge for this zone</div>}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <div style={{ color:"#475569", fontSize:9, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1, marginBottom:5 }}>NOTES</div>
                  <textarea value={sel.notes} onChange={e=>patchZone(sel.id,{notes:e.target.value})} rows={2} style={{ width:"100%", padding:"8px 10px", background:"#0d1220", border:"1px solid rgba(99,179,237,0.15)", borderRadius:7, color:"#94a3b8", fontSize:11, fontFamily:"inherit", outline:"none", resize:"vertical", boxSizing:"border-box" }} />
                </div>

                {/* Driver assignment */}
                <div>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:7 }}>
                    <div style={{ color:"#475569", fontSize:9, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1 }}>ASSIGNED DRIVERS ({assignedDriverIds.length}/{sel.maxDrivers})</div>
                    <button onClick={()=>setShowDriverPane(v=>!v)} style={{ background:"none", border:"1px solid rgba(59,130,246,0.2)", borderRadius:5, padding:"3px 9px", color:"#60a5fa", fontSize:9, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace" }}>
                      {showDriverPane?"DONE":"+ ASSIGN"}
                    </button>
                  </div>

                  {assignedDriverIds.length === 0
                    ? <div style={{ color:"#334155", fontSize:11, fontStyle:"italic" }}>No drivers assigned to this zone</div>
                    : assignedDriverIds.map(did => {
                        const d = drivers.find(dr=>dr.id===did);
                        if (!d) return null;
                        return (
                          <div key={did} style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 10px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(99,179,237,0.07)", borderRadius:7, marginBottom:4 }}>
                            <div style={{ width:24, height:24, borderRadius:"50%", background:"linear-gradient(135deg,#3b82f6,#7c3aed)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, fontWeight:700, color:"#fff", flexShrink:0 }}>{d.name.split(" ").map(n=>n[0]).join("")}</div>
                            <div style={{ flex:1, minWidth:0 }}>
                              <div style={{ color:"#cbd5e1", fontSize:11 }}>{d.name}</div>
                              <div style={{ color:"#334155", fontSize:9, fontFamily:"'JetBrains Mono',monospace" }}>{d.id}</div>
                            </div>
                            {d.online && <div style={{ width:6, height:6, borderRadius:"50%", background:"#22c55e", boxShadow:"0 0 5px #22c55e" }} />}
                            <span style={{ color:d.status==="active"?"#22c55e":d.status==="suspended"?"#ef4444":"#475569", fontSize:9, fontFamily:"'JetBrains Mono',monospace" }}>{d.status}</span>
                            <button onClick={()=>unassignDriver(did,sel.id)} style={{ background:"none", border:"none", color:"#ef4444", fontSize:12, cursor:"pointer", opacity:0.6 }}>✕</button>
                          </div>
                        );
                      })
                  }

                  {showDriverPane && (
                    <div style={{ marginTop:8, background:"rgba(0,0,0,0.3)", border:"1px solid rgba(99,179,237,0.1)", borderRadius:8, padding:"10px 12px" }}>
                      <div style={{ color:"#60a5fa", fontSize:9, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1.5, marginBottom:8 }}>ADD DRIVER TO {sel.name.toUpperCase()}</div>
                      {drivers.filter(d=>!assignedDriverIds.includes(d.id)).map(d => (
                        <div key={d.id} style={{ display:"flex", alignItems:"center", gap:8, padding:"5px 0", borderBottom:"1px solid rgba(99,179,237,0.05)" }}>
                          <div style={{ width:22, height:22, borderRadius:"50%", background:"linear-gradient(135deg,#475569,#334155)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, fontWeight:700, color:"#fff", flexShrink:0 }}>{d.name.split(" ").map(n=>n[0]).join("")}</div>
                          <div style={{ flex:1 }}>
                            <div style={{ color:"#94a3b8", fontSize:11 }}>{d.name}</div>
                            <div style={{ color:"#334155", fontSize:9 }}>★{d.rating}</div>
                          </div>
                          <button onClick={()=>assignDriver(d.id,sel.id)} disabled={assignedDriverIds.length>=sel.maxDrivers} style={{ background:"rgba(59,130,246,0.1)", border:"1px solid rgba(59,130,246,0.2)", borderRadius:5, padding:"4px 9px", color:"#60a5fa", fontSize:9, fontWeight:700, cursor:assignedDriverIds.length>=sel.maxDrivers?"not-allowed":"pointer", fontFamily:"'JetBrains Mono',monospace", opacity:assignedDriverIds.length>=sel.maxDrivers?0.4:1 }}>+ ADD</button>
                        </div>
                      ))}
                      {drivers.filter(d=>!assignedDriverIds.includes(d.id)).length===0 && <div style={{ color:"#334155", fontSize:11, padding:"4px 0" }}>All drivers already assigned to this zone.</div>}
                    </div>
                  )}
                </div>

                {/* Quick actions */}
                {!viewOnly && <div style={{ display:"flex", gap:7, paddingTop:4, borderTop:"1px solid rgba(99,179,237,0.07)" }}>
                  <button onClick={()=>{patchZone(sel.id,{status:"blocked"});setSelectedZone(null);}} disabled={sel.status==="blocked"} style={{ flex:1, background:"rgba(239,68,68,0.07)", border:"1px solid rgba(239,68,68,0.2)", color:"#ef4444", borderRadius:7, padding:"8px", fontSize:10, fontWeight:700, cursor:sel.status==="blocked"?"not-allowed":"pointer", fontFamily:"'JetBrains Mono',monospace", opacity:sel.status==="blocked"?0.4:1 }}>🚫 BLOCK ZONE</button>
                  <button onClick={()=>patchZone(sel.id,{status:"active"})} disabled={sel.status==="active"} style={{ flex:1, background:"rgba(34,197,94,0.07)", border:"1px solid rgba(34,197,94,0.2)", color:"#22c55e", borderRadius:7, padding:"8px", fontSize:10, fontWeight:700, cursor:sel.status==="active"?"not-allowed":"pointer", fontFamily:"'JetBrains Mono',monospace", opacity:sel.status==="active"?0.4:1 }}>✓ ACTIVATE</button>
                </div>}
              </div>
            </div>
          ) : (
            <div style={{ ...P.panel, padding:"24px 20px", textAlign:"center" }}>
              <div style={{ fontSize:26, marginBottom:8 }}>⬡</div>
              <div style={{ color:"#475569", fontSize:12 }}>Select a zone on the map or list to manage it</div>
              <div style={{ color:"#334155", fontSize:10, marginTop:3 }}>Assign drivers, set status, surge overrides</div>
            </div>
          )}

          {/* Driver zone overview */}
          <div style={P.panel}>
            <div style={P.ph}><span style={P.pTitle}>DRIVER ZONE ASSIGNMENTS</span></div>
            <div style={{ padding:"10px 14px", display:"flex", flexDirection:"column", gap:5 }}>
              {drivers.map(d => {
                const dZones = (driverZones[d.id]||[]).map(zid=>zones.find(z=>z.id===zid)).filter(Boolean);
                return (
                  <div key={d.id} style={{ display:"flex", alignItems:"center", gap:9, padding:"7px 10px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(99,179,237,0.06)", borderRadius:7 }}>
                    <div style={{ width:24, height:24, borderRadius:"50%", background:"linear-gradient(135deg,#3b82f6,#7c3aed)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, fontWeight:700, color:"#fff", flexShrink:0 }}>{d.name.split(" ").map(n=>n[0]).join("")}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ color:"#94a3b8", fontSize:11, fontWeight:500 }}>{d.name}</div>
                      <div style={{ display:"flex", flexWrap:"wrap", gap:3, marginTop:2 }}>
                        {dZones.length===0
                          ? <span style={{ color:"#ef4444", fontSize:9, fontStyle:"italic" }}>No zones — cannot take pickups</span>
                          : dZones.map(z=>(
                              <span key={z.id} style={{ background:`${z.color}18`, border:`1px solid ${z.color}40`, borderRadius:4, padding:"1px 5px", fontSize:8, color:z.color, fontFamily:"'JetBrains Mono',monospace" }}>{z.name.split(" ").slice(0,2).join(" ")}</span>
                            ))
                        }
                      </div>
                    </div>
                    {d.online && <div style={{ width:6, height:6, borderRadius:"50%", background:"#22c55e", boxShadow:"0 0 5px #22c55e", flexShrink:0 }} />}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AI PRICING ADVISOR
// ─────────────────────────────────────────────────────────────────────────────
function AIPricingAdvisor({ trips, drivers, subs, currentSettings, pricingState, dispatchState, onApply }) {

  // ── Chat state ──────────────────────────────────────────────────────────────
  const [messages,  setMessages]  = useState([
    { role:"assistant", content:"Hey — I'm your ZeezRyde pricing advisor. I can analyse your platform data and recommend pricing adjustments, surge tiers, or flag anything that looks off. Ask me anything or hit **Analyse Now** for a full review." }
  ]);
  const [input,     setInput]     = useState("");
  const [loading,   setLoading]   = useState(false);
  const [history,   setHistory]   = useState([]);
  const bottomRef = useRef();

  // ── Scheduler state ──────────────────────────────────────────────────────────
  const [schedulerOn,   setSchedulerOn]   = useState(false);
  const [intervalHrs,   setIntervalHrs]   = useState("1");
  const [nextRunAt,     setNextRunAt]     = useState(null);
  const [countdown,     setCountdown]     = useState(null);
  const [inbox,         setInbox]         = useState([]);   // notification cards
  const [activeTab,     setActiveTab]     = useState("chat"); // "chat" | "inbox"
  const [schedulerLog,  setSchedulerLog]  = useState([]);
  const [analysing,     setAnalysing]     = useState(false);
  const intervalRef   = useRef(null);
  const countdownRef  = useRef(null);

  // Unread badge count
  const unread = inbox.filter(i => !i.decision && !i.seen).length;

  // Auto-scroll chat
  useEffect(() => {
    if (activeTab === "chat") bottomRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [messages, loading, activeTab]);

  // Mark inbox items seen when tab opened
  useEffect(() => {
    if (activeTab === "inbox") {
      setInbox(q => q.map(i => ({ ...i, seen: true })));
    }
  }, [activeTab]);

  // Countdown ticker
  useEffect(() => {
    if (!schedulerOn || !nextRunAt) { setCountdown(null); return; }
    countdownRef.current = setInterval(() => {
      const secs = Math.max(0, Math.round((nextRunAt - Date.now()) / 1000));
      setCountdown(secs);
    }, 1000);
    return () => clearInterval(countdownRef.current);
  }, [schedulerOn, nextRunAt]);

  // Scheduler runner
  useEffect(() => {
    if (!schedulerOn) {
      clearInterval(intervalRef.current);
      setNextRunAt(null);
      return;
    }
    const hrs = Math.max(0.017, parseFloat(intervalHrs) || 1); // floor at ~1min for demo
    const ms  = hrs * 60 * 60 * 1000;
    setNextRunAt(Date.now() + ms);
    runScheduledAnalysis();
    intervalRef.current = setInterval(() => {
      setNextRunAt(Date.now() + ms);
      runScheduledAnalysis();
    }, ms);
    return () => clearInterval(intervalRef.current);
  }, [schedulerOn, intervalHrs]);

  function fmtCountdown(secs) {
    if (secs === null) return "—";
    const h = Math.floor(secs / 3600), m = Math.floor((secs % 3600) / 60), s = secs % 60;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  }

  function buildSnapshot() {
    const completed  = trips.filter(t => t.status === "completed");
    const cancelled  = trips.filter(t => t.status === "cancelled");
    const grossFare  = completed.reduce((s,t) => s + parseFloat(t.fare.replace("CA$","") || 0), 0);
    const onlineN    = drivers.filter(d => d.online).length;
    const activeN    = drivers.filter(d => d.status === "active").length;
    const cancelRate = trips.length ? ((cancelled.length / trips.length) * 100).toFixed(1) : "0.0";
    return { completed, cancelled, grossFare, onlineN, activeN, cancelRate };
  }

  function buildContext() {
    const { completed, cancelled, grossFare, onlineN, activeN, cancelRate } = buildSnapshot();
    const grossPlatform = completed.reduce((s,t) => s + parseFloat(t.platform?.replace("CA$","") || 0), 0);
    const paidSubs      = subs.filter(s => s.status === "paid").length;
    const failedSubs    = subs.filter(s => s.status !== "paid").length;
    const avgRating     = (drivers.reduce((s,d) => s + d.rating, 0) / drivers.length).toFixed(2);
    return `
ZEEZRYDE PLATFORM SNAPSHOT
===========================
Drivers: ${drivers.length} total | ${activeN} active | ${onlineN} currently online | avg rating ${avgRating}
Trips:   ${completed.length} completed | ${cancelled.length} cancelled | ${cancelRate}% cancel rate
Revenue: CA$${grossFare.toFixed(2)} gross fare | CA$${grossPlatform.toFixed(2)} platform commission
Subs:    ${paidSubs} paid | ${failedSubs} failed/unpaid this cycle

CURRENT PRICING
===============
Base fare: CA$${pricingState.baseFare} | Rate/km: CA$${pricingState.ratePerKm} | Rate/min: CA$${pricingState.ratePerMin}
Min fare: CA$${pricingState.minimumFare} | Family x${pricingState.familyMult} | Friends x${pricingState.friendsMult}
Commission: ${currentSettings.commPct}% | Weekly pass: CA$${currentSettings.subFee} | Demand: ${pricingState.demandTier}

DISPATCH POLICY
===============
Max pickup radius: ${dispatchState.maxPickupKm} km | Over-radius fee: ${dispatchState.pickupFeeOn ? "ON — CA$" + dispatchState.pickupFeeKm + "/km beyond radius" : "OFF"}

TRIP LOG
========
${trips.map(t => `${t.id} | ${t.date} | ${t.type} | ${t.fare} | ${t.status}`).join("\n")}
    `.trim();
  }

  const SYSTEM_CHAT = `You are an expert pricing advisor for ZeezRyde, a rideshare platform in the GTA, Ontario, Canada.
Analyse platform data and give clear, specific, actionable pricing recommendations.
When recommending specific value changes, output a JSON block at the END of your response:

<recommendation>
{
  "summary": "One-line summary",
  "urgent": false,
  "changes": {
    "baseFare": 2.50,
    "ratePerKm": 1.20,
    "pickupFeeKm": 0.75,
    "maxPickupKm": 12
  }
}
</recommendation>

Changeable fields: baseFare, ratePerKm, ratePerMin, minimumFare, familyMult, friendsMult, demandTier, commPct, subFee, pickupFeeKm (CA$/km over-radius), maxPickupKm (km), pickupFeeOn (true/false).
Only include fields you want to change. Omit unchanged fields. Be concise and data-driven.`;

  const SYSTEM_SCHEDULED = `You are an automated hourly pricing advisor for ZeezRyde (GTA rideshare).
Run a pricing health check. Decide if any changes are needed RIGHT NOW based on the data.
Be decisive. Always output a <recommendation> block — even if no change is needed (use empty "changes": {}).

<recommendation>
{
  "summary": "One sentence summary of your finding",
  "urgent": true or false,
  "reasoning": "2-3 sentence explanation of why",
  "changes": {}
}
</recommendation>

Changeable fields include: baseFare, ratePerKm, ratePerMin, minimumFare, familyMult, friendsMult, demandTier, commPct, subFee, pickupFeeKm (CA$/km beyond max radius), maxPickupKm (km), pickupFeeOn (true/false).
Only include fields to change in "changes". If nothing needs changing, leave it empty.`;

  async function runScheduledAnalysis() {
    if (analysing) return;
    setAnalysing(true);
    const ts = new Date().toLocaleTimeString("en-CA", { hour:"2-digit", minute:"2-digit" });
    setSchedulerLog(l => [{ ts, status:"running", msg:"Scheduled analysis running…" }, ...l.slice(0,9)]);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 500,
          system: SYSTEM_SCHEDULED + "\n\nPLATFORM DATA:\n" + buildContext(),
          messages: [{ role:"user", content:"Run the hourly pricing health check now." }],
        }),
      });
      const data = await res.json();
      const raw  = data.content?.[0]?.text || "";
      const recMatch = raw.match(/<recommendation>([\s\S]*?)<\/recommendation>/);
      let rec = null;
      if (recMatch) { try { rec = JSON.parse(recMatch[1].trim()); } catch(e) {} }
      const analysis = raw.replace(/<recommendation>[\s\S]*?<\/recommendation>/, "").trim();

      if (rec) {
        const hasChanges = Object.keys(rec.changes || {}).length > 0;
        const card = {
          id:         Date.now(),
          ts,
          summary:    rec.summary,
          reasoning:  rec.reasoning || analysis,
          urgent:     rec.urgent,
          changes:    rec.changes || {},
          hasChanges,
          decision:   null,
          seen:       false,
        };
        setInbox(q => [card, ...q]);
        // Auto-switch to inbox tab if urgent
        if (rec.urgent) setActiveTab("inbox");
        setSchedulerLog(l => [
          { ts, status: hasChanges ? "alert" : "ok", msg: hasChanges ? `⚡ Changes recommended — awaiting approval` : "✓ No changes needed" },
          ...l.slice(0,9)
        ]);
      }
    } catch(e) {
      setSchedulerLog(l => [{ ts, status:"error", msg:"Analysis failed — API error" }, ...l.slice(0,9)]);
    }
    setAnalysing(false);
  }

  function approveCard(card) {
    if (card.hasChanges) onApply(card.changes);
    setInbox(q => q.map(i => i.id === card.id ? { ...i, decision:"approved", seen:true } : i));
    if (card.hasChanges) {
      setHistory(h => [{ ts: card.ts, summary: card.summary, changes: card.changes }, ...h]);
    }
  }

  function declineCard(card) {
    setInbox(q => q.map(i => i.id === card.id ? { ...i, decision:"declined", seen:true } : i));
  }

  // ── Chat send ────────────────────────────────────────────────────────────────
  async function sendMessage(userMsg) {
    if (loading) return;
    const text = userMsg || input.trim();
    if (!text) return;
    setInput("");
    setLoading(true);
    const newMessages = [...messages, { role:"user", content:text }];
    setMessages(newMessages);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 800,
          system: SYSTEM_CHAT + "\n\nPLATFORM CONTEXT:\n" + buildContext(),
          messages: newMessages.map(m => ({ role:m.role, content:m.content })),
        }),
      });
      const data = await res.json();
      const raw  = data.content?.[0]?.text || "Sorry, I couldn't generate a response.";
      const recMatch = raw.match(/<recommendation>([\s\S]*?)<\/recommendation>/);
      let rec = null;
      if (recMatch) { try { rec = JSON.parse(recMatch[1].trim()); } catch(e) {} }
      const cleanText = raw.replace(/<recommendation>[\s\S]*?<\/recommendation>/, "").trim();
      setMessages(prev => [...prev, { role:"assistant", content:cleanText, recommendation:rec }]);
    } catch(e) {
      setMessages(prev => [...prev, { role:"assistant", content:"⚠ Could not reach AI service. Check your connection." }]);
    }
    setLoading(false);
  }

  function applyFromChat(rec) {
    onApply(rec.changes);
    setHistory(h => [{ ts: new Date().toLocaleTimeString("en-CA",{hour:"2-digit",minute:"2-digit"}), summary: rec.summary, changes: rec.changes }, ...h]);
    setMessages(prev => [...prev, { role:"assistant", content:`✅ Applied: **${rec.summary}**. Values updated in the pricing panels — hit Save when ready.` }]);
  }

  function renderText(txt) {
    return txt.split(/(\*\*[^*]+\*\*)/).map((p, i) =>
      p.startsWith("**") ? <strong key={i} style={{ color:"#e2e8f0" }}>{p.slice(2,-2)}</strong> : p
    );
  }

  const LABEL = { baseFare:"Base Fare", ratePerKm:"Rate/km", ratePerMin:"Rate/min", minimumFare:"Min Fare", familyMult:"Family x", friendsMult:"Friends x", demandTier:"Demand Tier", commPct:"Commission", subFee:"Weekly Pass", pickupFeeKm:"Pickup Fee/km", maxPickupKm:"Max Pickup Radius", pickupFeeOn:"Pickup Fee Active" };
  const CURR  = { baseFare:pricingState.baseFare, ratePerKm:pricingState.ratePerKm, ratePerMin:pricingState.ratePerMin, minimumFare:pricingState.minimumFare, familyMult:pricingState.familyMult, friendsMult:pricingState.friendsMult, demandTier:pricingState.demandTier, commPct:currentSettings.commPct, subFee:currentSettings.subFee, pickupFeeKm:dispatchState.pickupFeeKm, maxPickupKm:dispatchState.maxPickupKm, pickupFeeOn:dispatchState.pickupFeeOn };

  const S = {
    wrap:       { background:"#080c14", border:"1px solid rgba(99,179,237,0.12)", borderRadius:12, overflow:"hidden", display:"flex", flexDirection:"column" },
    header:     { padding:"13px 18px", background:"rgba(59,130,246,0.06)", borderBottom:"1px solid rgba(99,179,237,0.1)", display:"flex", alignItems:"center", justifyContent:"space-between", gap:8 },
    tab:        (active) => ({ padding:"5px 14px", borderRadius:6, border:`1px solid ${active?"rgba(59,130,246,0.4)":"rgba(99,179,237,0.1)"}`, background:active?"rgba(59,130,246,0.12)":"transparent", color:active?"#60a5fa":"#475569", fontSize:10, fontWeight:700, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace", letterSpacing:0.5, position:"relative" }),
    msgs:       { flex:1, height:300, overflowY:"auto", padding:"14px 16px", display:"flex", flexDirection:"column", gap:10 },
    userBubble: { alignSelf:"flex-end", background:"rgba(59,130,246,0.15)", border:"1px solid rgba(59,130,246,0.25)", borderRadius:"12px 12px 3px 12px", padding:"8px 12px", maxWidth:"85%", color:"#93c5fd", fontSize:12, lineHeight:1.5 },
    aiBubble:   { alignSelf:"flex-start", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(99,179,237,0.1)", borderRadius:"12px 12px 12px 3px", padding:"10px 13px", maxWidth:"95%", color:"#cbd5e1", fontSize:12, lineHeight:1.6 },
  };

  const QUICK = ["Analyse my pricing now","Should I activate surge?","Am I cheaper than Uber?","Why is my cancel rate high?"];

  return (
    <div style={S.wrap}>

      {/* ── HEADER ── */}
      <div style={S.header}>
        <div style={{ display:"flex", alignItems:"center", gap:9 }}>
          <div style={{ width:28, height:28, borderRadius:7, background:"linear-gradient(135deg,#3b82f6,#7c3aed)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, boxShadow:"0 0 12px rgba(59,130,246,0.4)" }}>✦</div>
          <div>
            <div style={{ color:"#e2e8f0", fontSize:13, fontWeight:600 }}>AI Pricing Advisor</div>
            <div style={{ color:"#3b82f6", fontSize:9, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1.5 }}>POWERED BY CLAUDE</div>
          </div>
        </div>
        {/* Tabs */}
        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
          <button style={S.tab(activeTab==="chat")} onClick={() => setActiveTab("chat")}>CHAT</button>
          <button style={S.tab(activeTab==="inbox")} onClick={() => setActiveTab("inbox")}>
            INBOX
            {unread > 0 && (
              <span style={{ position:"absolute", top:-5, right:-5, background:"#ef4444", color:"#fff", fontSize:8, fontWeight:700, width:14, height:14, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 6px rgba(239,68,68,0.6)" }}>{unread}</span>
            )}
          </button>
        </div>
      </div>

      {/* ── SCHEDULER BAR ── */}
      <div style={{ padding:"10px 16px", borderBottom:"1px solid rgba(99,179,237,0.08)", background:"rgba(0,0,0,0.15)", display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, flex:1 }}>
          {schedulerOn
            ? <div style={{ width:7, height:7, borderRadius:"50%", background:"#22c55e", boxShadow:"0 0 8px #22c55e", animation:"pulse 1.5s infinite", flexShrink:0 }} />
            : <div style={{ width:7, height:7, borderRadius:"50%", background:"#334155", flexShrink:0 }} />
          }
          <div>
            <div style={{ color: schedulerOn ? "#22c55e" : "#475569", fontSize:11, fontWeight:600 }}>
              {schedulerOn ? `Auto-analysis ON — next in ${fmtCountdown(countdown)}` : "Auto-analysis OFF"}
            </div>
            {schedulerOn && analysing && <div style={{ color:"#f59e0b", fontSize:9 }}>Running analysis…</div>}
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <span style={{ color:"#334155", fontSize:10 }}>every</span>
          <input
            value={intervalHrs} onChange={e => setIntervalHrs(e.target.value)}
            disabled={schedulerOn}
            style={{ width:36, padding:"3px 6px", background:"#0d1220", border:"1px solid rgba(99,179,237,0.15)", borderRadius:5, fontSize:11, fontWeight:700, color:"#60a5fa", fontFamily:"'JetBrains Mono',monospace", outline:"none", textAlign:"center", opacity:schedulerOn?0.5:1 }}
          />
          <span style={{ color:"#334155", fontSize:10 }}>hr</span>
          <Toggle val={schedulerOn} set={setSchedulerOn} />
        </div>
        {/* Quick presets */}
        {!schedulerOn && (
          <div style={{ display:"flex", gap:4 }}>
            {[["1h","1"],["2h","2"],["4h","4"],["8h","8"]].map(([l,v]) => (
              <button key={v} onClick={() => setIntervalHrs(v)} style={{ padding:"2px 7px", borderRadius:4, border:`1px solid ${intervalHrs===v?"#3b82f6":"rgba(99,179,237,0.1)"}`, background:intervalHrs===v?"rgba(59,130,246,0.1)":"transparent", color:intervalHrs===v?"#60a5fa":"#334155", fontSize:9, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace" }}>{l}</button>
            ))}
          </div>
        )}
      </div>

      {/* ── CHAT TAB ── */}
      {activeTab === "chat" && (
        <>
          <div style={S.msgs}>
            {messages.map((m, i) => (
              <div key={i} style={m.role==="user" ? S.userBubble : S.aiBubble}>
                <div style={{ whiteSpace:"pre-wrap" }}>{renderText(m.content)}</div>
                {m.recommendation && Object.keys(m.recommendation.changes||{}).length > 0 && (
                  <div style={{ marginTop:10, background:"rgba(59,130,246,0.08)", border:"1px solid rgba(59,130,246,0.2)", borderRadius:8, padding:"10px 12px" }}>
                    <div style={{ color:"#60a5fa", fontSize:9, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1.5, marginBottom:7 }}>RECOMMENDED CHANGES</div>
                    {Object.entries(m.recommendation.changes).map(([k,v]) => (
                      <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"3px 0", borderBottom:"1px solid rgba(99,179,237,0.06)" }}>
                        <span style={{ color:"#64748b", fontSize:10 }}>{LABEL[k]||k}</span>
                        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                          <span style={{ color:"#475569", fontSize:10, fontFamily:"'JetBrains Mono',monospace", textDecoration:"line-through" }}>{CURR[k]}</span>
                          <span style={{ color:"#22c55e", fontSize:11, fontWeight:700, fontFamily:"'JetBrains Mono',monospace" }}>→ {v}</span>
                        </div>
                      </div>
                    ))}
                    <button onClick={() => applyFromChat(m.recommendation)} style={{ marginTop:9, width:"100%", background:"linear-gradient(135deg,#22c55e,#16a34a)", color:"#fff", border:"none", borderRadius:6, padding:"7px", fontSize:10, fontWeight:700, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace" }}>
                      ✓ APPLY CHANGES
                    </button>
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div style={S.aiBubble}>
                <div style={{ display:"flex", gap:4, alignItems:"center" }}>
                  {[0,1,2].map(i => <div key={i} style={{ width:5, height:5, borderRadius:"50%", background:"#3b82f6", animation:`pulse ${1.2}s ${i*0.2}s ease-in-out infinite` }} />)}
                  <span style={{ color:"#475569", fontSize:10, marginLeft:4 }}>Analysing…</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          {/* Quick prompts */}
          <div style={{ padding:"0 14px 8px", display:"flex", gap:5, flexWrap:"wrap" }}>
            {QUICK.map(q => (
              <button key={q} onClick={() => sendMessage(q)} disabled={loading} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(99,179,237,0.1)", borderRadius:20, padding:"4px 10px", fontSize:9, color:"#475569", cursor:loading?"not-allowed":"pointer", fontFamily:"inherit" }}>{q}</button>
            ))}
          </div>
          {/* Input */}
          <div style={{ padding:"8px 14px 14px", borderTop:"1px solid rgba(99,179,237,0.08)", display:"flex", gap:8 }}>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&sendMessage()} placeholder="Ask about pricing, surge, market rates…" disabled={loading} style={{ flex:1, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(99,179,237,0.12)", borderRadius:8, padding:"8px 12px", color:"#94a3b8", fontSize:12, outline:"none", fontFamily:"inherit" }} />
            <button onClick={()=>sendMessage()} disabled={loading||!input.trim()} style={{ background:"linear-gradient(135deg,#3b82f6,#1d4ed8)", color:"#fff", border:"none", borderRadius:8, padding:"8px 14px", fontSize:12, fontWeight:700, cursor:(loading||!input.trim())?"not-allowed":"pointer", opacity:(loading||!input.trim())?0.5:1 }}>→</button>
          </div>
        </>
      )}

      {/* ── INBOX TAB ── */}
      {activeTab === "inbox" && (
        <div style={{ flex:1, overflowY:"auto", maxHeight:480 }}>

          {/* Inbox toolbar */}
          <div style={{ padding:"8px 16px", borderBottom:"1px solid rgba(99,179,237,0.07)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", gap:10 }}>
              <span style={{ color:"#60a5fa", fontSize:10, fontFamily:"'JetBrains Mono',monospace" }}>{inbox.length} analyses</span>
              {inbox.filter(i=>!i.decision).length > 0 && <span style={{ color:"#f59e0b", fontSize:10 }}>{inbox.filter(i=>!i.decision).length} pending</span>}
            </div>
            {inbox.length > 0 && <button onClick={()=>setInbox([])} style={{ background:"none", border:"none", color:"#334155", fontSize:9, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace" }}>CLEAR ALL</button>}
          </div>

          {inbox.length === 0 ? (
            <div style={{ padding:"40px 20px", textAlign:"center" }}>
              <div style={{ fontSize:28, marginBottom:10 }}>⏱</div>
              <div style={{ color:"#475569", fontSize:12 }}>No analyses yet.</div>
              <div style={{ color:"#334155", fontSize:10, marginTop:4 }}>Enable auto-analysis above or run one manually.</div>
              <button onClick={() => { runScheduledAnalysis(); }} disabled={analysing} style={{ marginTop:14, background:"linear-gradient(135deg,#3b82f6,#1d4ed8)", color:"#fff", border:"none", borderRadius:7, padding:"8px 18px", fontSize:10, fontWeight:700, cursor:analysing?"not-allowed":"pointer", fontFamily:"'JetBrains Mono',monospace", opacity:analysing?0.6:1 }}>
                {analysing ? "RUNNING…" : "RUN ANALYSIS NOW"}
              </button>
            </div>
          ) : (
            <div style={{ padding:"8px 12px", display:"flex", flexDirection:"column", gap:8 }}>
              {inbox.map(card => {
                const decided = !!card.decision;
                const urgentColor = card.urgent ? "#f59e0b" : "#3b82f6";
                return (
                  <div key={card.id} style={{ background: decided?"rgba(255,255,255,0.01)":card.urgent?"rgba(245,158,11,0.04)":"rgba(59,130,246,0.03)", border:`1px solid ${decided?"rgba(99,179,237,0.06)":card.urgent?"rgba(245,158,11,0.25)":"rgba(59,130,246,0.18)"}`, borderRadius:10, overflow:"hidden", opacity:decided?0.55:1, transition:"opacity 0.3s" }}>

                    {/* Card header */}
                    <div style={{ padding:"9px 12px 7px", display:"flex", alignItems:"center", gap:8, borderBottom:"1px solid rgba(99,179,237,0.05)" }}>
                      <div style={{ width:8, height:8, borderRadius:"50%", background: decided?(card.decision==="approved"?"#22c55e":"#ef4444"):card.urgent?"#f59e0b":"#3b82f6", boxShadow:decided?"none":`0 0 6px ${urgentColor}`, flexShrink:0 }} />
                      <span style={{ color:"#334155", fontSize:9, fontFamily:"'JetBrains Mono',monospace" }}>{card.ts}</span>
                      {card.urgent && !decided && <span style={{ background:"rgba(245,158,11,0.15)", color:"#f59e0b", fontSize:8, fontWeight:700, padding:"1px 7px", borderRadius:4, fontFamily:"'JetBrains Mono',monospace" }}>URGENT</span>}
                      {card.hasChanges && !decided && <span style={{ background:"rgba(59,130,246,0.12)", color:"#60a5fa", fontSize:8, fontWeight:700, padding:"1px 7px", borderRadius:4, fontFamily:"'JetBrains Mono',monospace" }}>CHANGES RECOMMENDED</span>}
                      {!card.hasChanges && !decided && <span style={{ background:"rgba(34,197,94,0.1)", color:"#22c55e", fontSize:8, fontWeight:700, padding:"1px 7px", borderRadius:4, fontFamily:"'JetBrains Mono',monospace" }}>NO ACTION NEEDED</span>}
                      {decided && <span style={{ marginLeft:"auto", color:card.decision==="approved"?"#22c55e":"#ef4444", fontSize:9, fontWeight:700, fontFamily:"'JetBrains Mono',monospace" }}>{card.decision==="approved"?"✓ APPROVED":"✗ DECLINED"}</span>}
                    </div>

                    {/* Summary + reasoning */}
                    <div style={{ padding:"9px 12px" }}>
                      <div style={{ color:"#cbd5e1", fontSize:12, fontWeight:500, marginBottom:5, lineHeight:1.4 }}>{card.summary}</div>
                      {card.reasoning && <div style={{ color:"#475569", fontSize:10, lineHeight:1.5, marginBottom:8 }}>{card.reasoning}</div>}

                      {/* Change tags */}
                      {card.hasChanges && (
                        <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:10 }}>
                          {Object.entries(card.changes).map(([k,v]) => (
                            <span key={k} style={{ background:"rgba(59,130,246,0.1)", border:"1px solid rgba(59,130,246,0.2)", borderRadius:5, padding:"3px 8px", fontSize:9, color:"#60a5fa", fontFamily:"'JetBrains Mono',monospace", display:"flex", alignItems:"center", gap:5 }}>
                              <span style={{ color:"#475569", textDecoration:"line-through" }}>{CURR[k]}</span>
                              <span>→</span>
                              <span style={{ color:"#22c55e", fontWeight:700 }}>{v}</span>
                              <span style={{ color:"#334155" }}>{LABEL[k]||k}</span>
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Action buttons */}
                      {!decided && (
                        <div style={{ display:"flex", gap:7 }}>
                          <button onClick={() => approveCard(card)} style={{ flex:1, background:card.hasChanges?"linear-gradient(135deg,#22c55e,#16a34a)":"rgba(34,197,94,0.1)", color:"#fff", border:card.hasChanges?"none":"1px solid rgba(34,197,94,0.3)", borderRadius:7, padding:"8px", fontSize:10, fontWeight:700, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace" }}>
                            {card.hasChanges ? "✓ APPROVE & APPLY" : "✓ ACKNOWLEDGE"}
                          </button>
                          {card.hasChanges && (
                            <button onClick={() => declineCard(card)} style={{ flex:1, background:"transparent", border:"1px solid rgba(239,68,68,0.3)", color:"#ef4444", borderRadius:7, padding:"8px", fontSize:10, fontWeight:700, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace" }}>
                              ✗ DECLINE
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Scheduler log */}
          {schedulerLog.length > 0 && (
            <div style={{ borderTop:"1px solid rgba(99,179,237,0.07)", padding:"8px 16px 12px" }}>
              <div style={{ color:"rgba(148,163,184,0.25)", fontSize:8, fontFamily:"'JetBrains Mono',monospace", letterSpacing:2, marginBottom:5 }}>RUN LOG</div>
              {schedulerLog.slice(0,5).map((l,i) => (
                <div key={i} style={{ display:"flex", gap:8, padding:"2px 0" }}>
                  <span style={{ color:"#1e293b", fontSize:9, fontFamily:"'JetBrains Mono',monospace", flexShrink:0 }}>{l.ts}</span>
                  <span style={{ color:l.status==="error"?"#ef4444":l.status==="alert"?"#f59e0b":l.status==="ok"?"#22c55e":"#334155", fontSize:9 }}>{l.msg}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── APPLIED HISTORY ── */}
      {history.length > 0 && (
        <div style={{ borderTop:"1px solid rgba(99,179,237,0.07)", padding:"8px 16px 12px" }}>
          <div style={{ color:"rgba(148,163,184,0.25)", fontSize:8, fontFamily:"'JetBrains Mono',monospace", letterSpacing:2, marginBottom:5 }}>APPLIED CHANGES</div>
          {history.slice(0,3).map((h,i) => (
            <div key={i} style={{ display:"flex", gap:8, padding:"3px 0", borderBottom:"1px solid rgba(99,179,237,0.04)" }}>
              <span style={{ color:"#22c55e", fontSize:9, fontFamily:"'JetBrains Mono',monospace", flexShrink:0 }}>{h.ts}</span>
              <span style={{ color:"#334155", fontSize:10 }}>{h.summary}</span>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DETAIL MODAL
// ─────────────────────────────────────────────────────────────────────────────
function Modal({ viewOnly, modal, setModal, patchDriver, patchRider }) {
  const d = modal.data;
  const isDriver = modal.type === "driver";
  const [tab, setTab] = useState(modal.tab || "profile");
  const [rejectNote, setRejectNote] = useState("");
  const [rejectTarget, setRejectTarget] = useState(null);

  function handleAction(status) {
    if (isDriver) patchDriver(d.id, { status });
    else patchRider(d.id, { status });
    setModal(null);
  }

  function patchDoc(docIndex, patch) {
    const newFiles = d.docFiles.map((f, i) => i === docIndex ? { ...f, ...patch } : f);
    const statuses = newFiles.map(f => f.status);
    let topDocs = statuses.every(s => s === "approved") ? "approved" : "pending";
    patchDriver(d.id, { docFiles: newFiles, docs: topDocs });
  }

  const driverVehWarning = isDriver ? vehicleYearWarning(d.vehicleYear) : null;
  const fields = isDriver ? [
    ["EMAIL", d.email], ["PHONE", d.phone], ["CITY", d.city],
    ["VEHICLE", d.vehicle + (d.vehicleYear ? "" : "")], ["PLATE", d.plate], ["JOINED", d.joined],
    ["DOCUMENTS", d.docs.toUpperCase()], ["SUB STATUS", d.subPaid ? "PAID ✓" : "UNPAID ✗"],
    ["SUB RENEWS", d.subDue], ["THIS WEEK", d.weekEarned],
  ] : [
    ["EMAIL", d.email], ["PHONE", d.phone], ["JOINED", d.joined],
    ["PAYMENT", d.payment], ["TOTAL TRIPS", d.trips], ["TOTAL SPENT", d.spent],
  ];

  const pendingDocCount = isDriver ? (d.docFiles||[]).filter(f => f.status === "pending").length : 0;

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", backdropFilter:"blur(6px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:500, padding:20 }} onClick={() => setModal(null)}>
      <div style={{ background:"#0d1220", border:"1px solid rgba(99,179,237,0.15)", borderRadius:16, width:560, maxWidth:"100%", maxHeight:"90vh", overflowY:"auto", boxShadow:"0 30px 80px rgba(0,0,0,0.6)" }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding:"20px 22px 16px", borderBottom:"1px solid rgba(99,179,237,0.08)", display:"flex", alignItems:"center", gap:13 }}>
          <Avi name={d.name} seed={d.id} size={44} hue={isDriver ? 220 : 270} />
          <div style={{ flex:1 }}>
            <div style={{ color:"#f0f9ff", fontSize:16, fontWeight:600 }}>{d.name}</div>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:4 }}>
              <Mono small>{d.id}</Mono>
              <span style={{ color:"#1e293b" }}>·</span>
              <span style={{ color:"#334155", fontSize:10, fontFamily:"'JetBrains Mono',monospace" }}>{isDriver?"DRIVER":"RIDER"}</span>
              <StatusBadge s={d.status} />
            </div>
          </div>
          <button onClick={() => setModal(null)} style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(99,179,237,0.1)", borderRadius:7, width:30, height:30, cursor:"pointer", fontSize:14, color:"#475569", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
        </div>

        {/* Stats bar for drivers */}
        {isDriver && (
          <div style={{ padding:"14px 22px", borderBottom:"1px solid rgba(99,179,237,0.08)", display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
            {[["RATING",`★ ${d.rating.toFixed(2)}`,"#f59e0b"],["TOTAL TRIPS",d.trips.toLocaleString(),"#3b82f6"],["THIS WEEK",d.weekEarned,"#22c55e"]].map(([l,v,c])=>(
              <div key={l} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(99,179,237,0.07)", borderRadius:8, padding:"10px 12px", textAlign:"center" }}>
                <div style={{ color:c, fontSize:18, fontWeight:700, fontFamily:"'JetBrains Mono',monospace" }}>{v}</div>
                <div style={{ color:"#1e293b", fontSize:9, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1, marginTop:3 }}>{l}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs — only for drivers */}
        {isDriver && (
          <div style={{ padding:"0 22px", borderBottom:"1px solid rgba(99,179,237,0.08)", display:"flex", gap:4 }}>
            {[
              { id:"profile", label:"Profile" },
              { id:"docs",    label:"Documents", badge: pendingDocCount },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ padding:"11px 14px", background:"none", border:"none", borderBottom:`2px solid ${tab===t.id?"#3b82f6":"transparent"}`, color:tab===t.id?"#60a5fa":"#475569", fontSize:11, fontWeight:tab===t.id?700:400, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:6, transition:"all 0.15s" }}>
                {t.label}
                {t.badge > 0 && <span style={{ background:"#f59e0b", color:"#000", fontSize:8, fontWeight:700, padding:"1px 5px", borderRadius:10 }}>{t.badge}</span>}
              </button>
            ))}
          </div>
        )}

        {/* ── PROFILE TAB ── */}
        {(tab === "profile" || !isDriver) && (
          <div style={{ padding:"16px 22px", borderBottom:"1px solid rgba(99,179,237,0.08)" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {fields.map(([l, v]) => (
                <div key={l} style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(99,179,237,0.06)", borderRadius:8, padding:"9px 12px" }}>
                  <div style={{ color:"rgba(148,163,184,0.4)", fontSize:8, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", fontFamily:"'JetBrains Mono',monospace", marginBottom:3 }}>{l}</div>
                  <div style={{ color:"#94a3b8", fontSize:12, fontWeight:500 }}>{v}</div>
                </div>
              ))}
            </div>
          {/* Vehicle age warning in profile tab */}
          {driverVehWarning && (
            <div style={{ marginTop:12, background: d.vehicleYear < MIN_VEHICLE_YEAR ? "rgba(239,68,68,0.07)" : "rgba(245,158,11,0.07)", border: d.vehicleYear < MIN_VEHICLE_YEAR ? "1px solid rgba(239,68,68,0.25)" : "1px solid rgba(245,158,11,0.25)", borderRadius:9, padding:"10px 13px", display:"flex", alignItems:"flex-start", gap:9 }}>
              <span style={{ fontSize:15 }}>{d.vehicleYear < MIN_VEHICLE_YEAR ? "🚫" : "⚠️"}</span>
              <div>
                <div style={{ color: d.vehicleYear < MIN_VEHICLE_YEAR ? "#ef4444" : "#f59e0b", fontSize:11, fontWeight:700, marginBottom:2 }}>
                  {d.vehicleYear < MIN_VEHICLE_YEAR ? `Vehicle Over ${MAX_VEHICLE_AGE} Years Old` : "Vehicle Approaching Age Limit"}
                </div>
                <div style={{ color:"#64748b", fontSize:10 }}>{driverVehWarning}</div>
              </div>
            </div>
          )}
          </div>
        )}

        {/* ── DOCUMENTS TAB ── */}
        {tab === "docs" && isDriver && (
          <div style={{ padding:"16px 22px", borderBottom:"1px solid rgba(99,179,237,0.08)" }}>
            <div style={{ color:"#475569", fontSize:10, marginBottom:12, lineHeight:1.6 }}>
              Required documents for {d.name} · {d.vehicle} ({d.plate})
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {(d.docFiles||[]).map((f, i) => {
                const m = DOC_META[f.status] || DOC_META.missing;
                const isRejectOpen = rejectTarget === i;
                return (
                  <div key={i} style={{ background:"rgba(255,255,255,0.02)", border:`1px solid ${m.border}`, borderRadius:10, overflow:"hidden" }}>
                    <div style={{ padding:"11px 14px", display:"flex", alignItems:"center", gap:11 }}>
                      <span style={{ fontSize:20 }}>{DOC_ICONS[f.type]||"📄"}</span>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:2 }}>
                          <span style={{ color:"#cbd5e1", fontSize:12, fontWeight:500 }}>{f.type}</span>
                          <DocStatusPill status={f.status} />
                        </div>
                        {f.file
                          ? <span style={{ color:"#334155", fontSize:9, fontFamily:"'JetBrains Mono',monospace" }}>📎 {f.file}{f.uploaded ? ` · uploaded ${f.uploaded}` : ""}</span>
                          : <span style={{ color:"#475569", fontSize:9, fontStyle:"italic" }}>No file uploaded yet</span>
                        }
                        {f.note && (
                          <div style={{ marginTop:5, padding:"4px 8px", background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.15)", borderRadius:5 }}>
                            <span style={{ color:"#f87171", fontSize:9 }}>Note to driver: {f.note}</span>
                          </div>
                        )}
                      </div>
                      <div style={{ display:"flex", gap:5, flexShrink:0 }}>
                        {f.status === "pending" && !viewOnly && (
                          <>
                            <button onClick={() => patchDoc(i, { status:"approved", note:"" })} style={{ padding:"5px 10px", borderRadius:6, background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.25)", color:"#22c55e", fontSize:9, fontWeight:700, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace" }}>✓</button>
                            <button onClick={() => setRejectTarget(t => t === i ? null : i)} style={{ padding:"5px 10px", borderRadius:6, background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.25)", color:"#ef4444", fontSize:9, fontWeight:700, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace" }}>✗</button>
                          </>
                        )}
                        {f.status === "approved" && !viewOnly && (
                          <button onClick={() => patchDoc(i, { status:"pending" })} style={{ padding:"4px 8px", borderRadius:5, background:"transparent", border:"1px solid rgba(99,179,237,0.1)", color:"#334155", fontSize:8, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace" }}>REVOKE</button>
                        )}
                        {f.status === "rejected" && !viewOnly && (
                          <button onClick={() => patchDoc(i, { status:"pending", note:"" })} style={{ padding:"4px 8px", borderRadius:5, background:"transparent", border:"1px solid rgba(245,158,11,0.15)", color:"#f59e0b", fontSize:8, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace" }}>RE-OPEN</button>
                        )}
                      </div>
                    </div>
                    {isRejectOpen && (
                      <div style={{ padding:"0 14px 12px 45px", display:"flex", gap:8 }}>
                        <textarea
                          placeholder="Rejection reason (shown to driver)…"
                          value={rejectNote} onChange={e => setRejectNote(e.target.value)}
                          rows={2} autoFocus
                          style={{ flex:1, padding:"7px 9px", background:"#080c14", border:"1px solid rgba(239,68,68,0.25)", borderRadius:6, color:"#f87171", fontSize:11, fontFamily:"inherit", outline:"none", resize:"vertical" }}
                        />
                        <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                          <button onClick={() => { patchDoc(i, { status:"rejected", note: rejectNote || "Document rejected." }); setRejectTarget(null); setRejectNote(""); }} style={{ padding:"7px 10px", borderRadius:5, background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", color:"#ef4444", fontSize:9, fontWeight:700, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace" }}>CONFIRM</button>
                          <button onClick={() => { setRejectTarget(null); setRejectNote(""); }} style={{ padding:"5px 10px", borderRadius:5, background:"transparent", border:"1px solid rgba(99,179,237,0.1)", color:"#475569", fontSize:9, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace" }}>CANCEL</button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {/* Approve all */}
            {(d.docFiles||[]).some(f => f.status === "pending") && (
              <button onClick={() => {
                const newFiles = d.docFiles.map(f => f.status === "pending" ? { ...f, status:"approved", note:"" } : f);
                patchDriver(d.id, { docFiles: newFiles, docs: newFiles.every(f => f.status==="approved") ? "approved" : "pending" });
              }} style={{ width:"100%", marginTop:12, padding:"10px", borderRadius:8, background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.2)", color:"#22c55e", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace", letterSpacing:0.5 }}>
                ✓ APPROVE ALL PENDING DOCUMENTS
              </button>
            )}
          </div>
        )}

        {/* Actions */}
        <div style={{ padding:"16px 22px", display:"flex", gap:9 }}>
          {d.status === "active"
            ? <button onClick={() => handleAction("suspended")} style={{ flex:1, background:"rgba(239,68,68,0.08)", color:"#ef4444", border:"1px solid rgba(239,68,68,0.2)", borderRadius:8, padding:"10px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit", letterSpacing:0.5 }}>SUSPEND ACCOUNT</button>
            : <button onClick={() => handleAction("active")} style={{ flex:1, background:"rgba(34,197,94,0.08)", color:"#22c55e", border:"1px solid rgba(34,197,94,0.2)", borderRadius:8, padding:"10px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit", letterSpacing:0.5 }}>REINSTATE ACCOUNT</button>
          }
          <button onClick={() => setModal(null)} style={{ flex:1, background:"rgba(255,255,255,0.04)", color:"#475569", border:"1px solid rgba(99,179,237,0.08)", borderRadius:8, padding:"10px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function Styles() {
  useEffect(() => {
    const id = "zeez-styles";
    if (document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id;
    el.textContent = [
      "@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');",
      "*, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }",
      "body { background:#080c14; }",
      "::-webkit-scrollbar { width:4px; height:4px; }",
      "::-webkit-scrollbar-track { background:#080c14; }",
      "::-webkit-scrollbar-thumb { background:#1e293b; border-radius:99px; }",
      ".trow:hover td { background:rgba(59,130,246,0.04); }",
      ".kpi-card { animation:rise 0.4s ease both; }",
      "@keyframes rise { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }",
      "@keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }",
      "@keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }",
    ].join(" ");
    document.head.appendChild(el);
    return () => { try { document.head.removeChild(el); } catch(e) {} };
  }, []);
  return null;
}


// ─── PROMOS PAGE ──────────────────────────────────────────────────────────────
function PagePromos({ viewOnly, promos, setPromos }) {
  const BLANK = { code:"", name:"", description:"", discount_type:"pct", discount:"", max_uses:"", target:"new_drivers", expiry:"", status:"active" };
  const [form, setForm]           = useState(BLANK);
  const [editing, setEditing]     = useState(null);  // promo id being edited
  const [showForm, setShowForm]   = useState(false);
  const [flash, setFlash]         = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);

  const toast = (msg, ok=true) => { setFlash({msg,ok}); setTimeout(()=>setFlash(null),3000); };

  const openCreate = () => { setForm(BLANK); setEditing(null); setShowForm(true); };
  const openEdit   = (p)  => {
    setForm({ code:p.code, name:p.name, description:p.description||"",
      discount_type:p.discount_type||p.discountType||"pct",
      discount:String(p.discount), max_uses:p.max_uses!=null?String(p.max_uses):"",
      target:p.target||"new_drivers", expiry:p.expiry||"", status:p.status||"active" });
    setEditing(p.id); setShowForm(true);
  };
  const cancelForm = () => { setShowForm(false); setEditing(null); setForm(BLANK); };

  const savePromo = async () => {
    if (!form.code.trim() || !form.name.trim() || !form.discount) { toast("Code, name and discount are required", false); return; }
    const row = {
      code:        form.code.trim().toUpperCase(),
      name:        form.name.trim(),
      description: form.description||"",
      discount_type: form.discount_type||"pct",
      discount:    parseFloat(form.discount)||0,
      max_uses:    form.max_uses ? parseInt(form.max_uses) : null,
      target:      form.target||"new_drivers",
      expiry:      form.expiry||"",
      status:      form.status||"active",
    };
    const sb = await getSupabase();
    if (editing) {
      // UPDATE
      const { error } = await sb.from("promos").update(row).eq("id", editing);
      if (error) { toast("Save failed: "+error.message, false); return; }
      setPromos(p => p.map(pr => pr.id===editing ? {...pr,...row} : pr));
      toast("Promo updated ✓");
    } else {
      // INSERT
      const id = "PROMO-"+String(Date.now()).slice(-6);
      const newRow = { id, ...row, used:0, created_at:new Date().toISOString() };
      const { error } = await sb.from("promos").insert(newRow);
      if (error) { toast("Create failed: "+error.message, false); return; }
      setPromos(p => [...p, {...newRow, discountType:newRow.discount_type, maxUses:newRow.max_uses}]);
      toast("Promo created ✓");
    }
    cancelForm();
  };

  const toggleStatus = async (p) => {
    const newStatus = p.status==="active" ? "paused" : "active";
    const sb = await getSupabase();
    await sb.from("promos").update({status:newStatus}).eq("id",p.id).catch(()=>{});
    setPromos(prev => prev.map(pr => pr.id===p.id ? {...pr,status:newStatus} : pr));
  };

  const deletePromo = async (id) => {
    const sb = await getSupabase();
    await sb.from("promos").delete().eq("id",id).catch(()=>{});
    setPromos(prev => prev.filter(pr => pr.id!==id));
    setConfirmDel(null);
    toast("Promo deleted");
  };

  const inp = { width:"100%", background:"#0d1220", border:"1px solid rgba(99,179,237,0.15)", borderRadius:8, padding:"8px 12px", color:"#f0f9ff", fontSize:12, outline:"none", boxSizing:"border-box" };
  const lbl = { display:"block", color:"rgba(148,163,184,0.5)", fontSize:8, fontWeight:700, letterSpacing:2, marginBottom:4 };

  return (
    <div>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div>
          <h1 style={{ color:"#f0f9ff", fontSize:20, fontWeight:600, fontFamily:"'Space Grotesk',sans-serif" }}>Promo Codes</h1>
          <p style={{ color:"#334155", fontSize:12, marginTop:4 }}>{promos.length} total · {promos.filter(p=>p.status==="active").length} active</p>
        </div>
        {!viewOnly && !showForm && (
          <button onClick={openCreate} style={{ background:"#2563eb", border:"none", color:"#fff", borderRadius:8, padding:"9px 18px", fontSize:11, fontWeight:700, cursor:"pointer", letterSpacing:1 }}>
            + NEW PROMO
          </button>
        )}
      </div>

      {/* Flash */}
      {flash && (
        <div style={{ background:flash.ok?"rgba(34,197,94,0.08)":"rgba(239,68,68,0.08)", border:`1px solid ${flash.ok?"rgba(34,197,94,0.2)":"rgba(239,68,68,0.2)"}`, borderRadius:8, padding:"10px 14px", marginBottom:16, color:flash.ok?"#86efac":"#fca5a5", fontSize:12 }}>
          {flash.msg}
        </div>
      )}

      {/* Create / Edit Form */}
      {showForm && (
        <div style={{ background:"#0d1220", border:"1px solid rgba(59,130,246,0.2)", borderRadius:12, padding:22, marginBottom:20 }}>
          <div style={{ color:"rgba(148,163,184,0.5)", fontSize:9, fontWeight:700, letterSpacing:2, marginBottom:16 }}>
            {editing ? "EDIT PROMO" : "CREATE NEW PROMO"}
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
            <div><label style={lbl}>Promo Code *</label><input style={inp} value={form.code} onChange={e=>setForm(f=>({...f,code:e.target.value.toUpperCase()}))} placeholder="e.g. WELCOME25" /></div>
            <div><label style={lbl}>Name *</label><input style={inp} value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Welcome Discount" /></div>
          </div>

          <div style={{ marginBottom:14 }}>
            <label style={lbl}>Description</label>
            <input style={inp} value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="Brief description" />
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:14, marginBottom:14 }}>
            <div>
              <label style={lbl}>Discount Type</label>
              <select style={{...inp}} value={form.discount_type} onChange={e=>setForm(f=>({...f,discount_type:e.target.value}))}>
                <option value="pct">Percentage (%)</option>
                <option value="flat">Flat Amount (CA$)</option>
              </select>
            </div>
            <div>
              <label style={lbl}>Discount Value *</label>
              <input style={inp} type="number" min="0" value={form.discount} onChange={e=>setForm(f=>({...f,discount:e.target.value}))} placeholder={form.discount_type==="pct"?"e.g. 25":"e.g. 5"} />
            </div>
            <div>
              <label style={lbl}>Max Uses (blank = unlimited)</label>
              <input style={inp} type="number" min="1" value={form.max_uses} onChange={e=>setForm(f=>({...f,max_uses:e.target.value}))} placeholder="e.g. 100" />
            </div>
            <div>
              <label style={lbl}>Expiry Date</label>
              <input style={{...inp}} type="date" value={form.expiry} onChange={e=>setForm(f=>({...f,expiry:e.target.value}))} />
            </div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:20 }}>
            <div>
              <label style={lbl}>Target</label>
              <select style={{...inp}} value={form.target} onChange={e=>setForm(f=>({...f,target:e.target.value}))}>
                <option value="new_drivers">New Drivers Only</option>
                <option value="all_drivers">All Drivers</option>
              </select>
            </div>
            <div>
              <label style={lbl}>Status</label>
              <select style={{...inp}} value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
              </select>
            </div>
          </div>

          <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
            <button onClick={cancelForm} style={{ padding:"9px 20px", borderRadius:8, border:"1px solid rgba(99,179,237,0.15)", background:"transparent", color:"#64748b", fontSize:11, fontWeight:700, cursor:"pointer" }}>
              Cancel
            </button>
            <button onClick={savePromo} style={{ padding:"9px 22px", borderRadius:8, border:"none", background:"#2563eb", color:"#fff", fontSize:11, fontWeight:700, cursor:"pointer", letterSpacing:1 }}>
              {editing ? "SAVE CHANGES" : "CREATE PROMO"}
            </button>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {confirmDel && (
        <div style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:10, padding:"14px 18px", marginBottom:16 }}>
          <div style={{ color:"#fca5a5", fontSize:13, fontWeight:600, marginBottom:10 }}>
            Delete promo <strong>{confirmDel.code}</strong>? This cannot be undone.
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={()=>deletePromo(confirmDel.id)} style={{ padding:"7px 18px", borderRadius:7, border:"none", background:"#ef4444", color:"#fff", fontSize:11, fontWeight:700, cursor:"pointer" }}>Delete</button>
            <button onClick={()=>setConfirmDel(null)} style={{ padding:"7px 18px", borderRadius:7, border:"1px solid rgba(99,179,237,0.15)", background:"transparent", color:"#64748b", fontSize:11, cursor:"pointer" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Promos Table */}
      <Panel title="ALL PROMOS" sub={`${promos.length} total`}>
        {promos.length === 0 ? (
          <div style={{ padding:"30px", textAlign:"center", color:"#334155", fontSize:13 }}>No promos yet. Create one above.</div>
        ) : (
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr>{["CODE","NAME","DISCOUNT","MAX USES","USED","TARGET","EXPIRY","STATUS",""].map(h=><Th key={h}>{h}</Th>)}</tr>
            </thead>
            <tbody>
              {promos.map(p => {
                const discLabel = (p.discount_type||p.discountType)==="pct" ? `${p.discount}% off` : `CA$${p.discount} off`;
                const isActive  = p.status==="active";
                return (
                  <tr key={p.id} className="trow">
                    <Td><Mono small>{p.code}</Mono></Td>
                    <Td><div style={{ color:"#e2e8f0", fontSize:12, fontWeight:600 }}>{p.name}</div>{p.description&&<div style={{ color:"#475569", fontSize:10, marginTop:2 }}>{p.description}</div>}</Td>
                    <Td><span style={{ color:"#22c55e", fontWeight:700, fontFamily:"'JetBrains Mono',monospace", fontSize:12 }}>{discLabel}</span></Td>
                    <Td><span style={{ color:"#64748b", fontSize:11 }}>{p.max_uses!=null ? p.max_uses : "∞"}</span></Td>
                    <Td><span style={{ color:"#64748b", fontSize:11 }}>{p.used||0}</span></Td>
                    <Td><span style={{ background:"rgba(99,179,237,0.07)", color:"#93c5fd", fontSize:9, padding:"2px 7px", borderRadius:10 }}>{p.target==="new_drivers"?"New Drivers":"All Drivers"}</span></Td>
                    <Td><span style={{ color:"#475569", fontSize:10 }}>{p.expiry||"—"}</span></Td>
                    <Td><span style={{ background:isActive?"rgba(34,197,94,0.08)":"rgba(245,158,11,0.08)", border:`1px solid ${isActive?"rgba(34,197,94,0.2)":"rgba(245,158,11,0.2)"}`, color:isActive?"#86efac":"#fcd34d", fontSize:9, padding:"2px 8px", borderRadius:10, fontWeight:600 }}>{p.status}</span></Td>
                    <Td>
                      {!viewOnly && (
                        <div style={{ display:"flex", gap:6 }}>
                          <button onClick={()=>openEdit(p)} style={{ background:"rgba(59,130,246,0.08)", border:"1px solid rgba(59,130,246,0.2)", borderRadius:6, color:"#60a5fa", fontSize:10, fontWeight:700, padding:"4px 10px", cursor:"pointer" }}>EDIT</button>
                          <button onClick={()=>toggleStatus(p)} style={{ background:"rgba(99,179,237,0.07)", border:"1px solid rgba(99,179,237,0.12)", borderRadius:6, color:"#94a3b8", fontSize:10, fontWeight:700, padding:"4px 10px", cursor:"pointer" }}>{isActive?"PAUSE":"RESUME"}</button>
                          <button onClick={()=>setConfirmDel(p)} style={{ background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.15)", borderRadius:6, color:"#f87171", fontSize:10, fontWeight:700, padding:"4px 10px", cursor:"pointer" }}>DEL</button>
                        </div>
                      )}
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Panel>
    </div>
  );
}

function SectionHdr({ title, sub }) {
  return (
    <div style={{ marginBottom:22 }}>
      <h1 style={{ color:"#f0f9ff", fontSize:20, fontWeight:600, fontFamily:"'Space Grotesk',sans-serif", letterSpacing:-0.3 }}>{title}</h1>
      {sub && <p style={{ color:"#334155", fontSize:12, marginTop:4, fontFamily:"'JetBrains Mono',monospace" }}>{sub}</p>}
    </div>
  );
}

function Panel({ title, sub, children }) {
  return (
    <div style={{ background:"#0d1220", border:"1px solid rgba(99,179,237,0.08)", borderRadius:12, overflow:"hidden" }}>
      {(title || sub) && (
        <div style={{ padding:"14px 18px", borderBottom:"1px solid rgba(99,179,237,0.07)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ color:"rgba(148,163,184,0.5)", fontSize:9, fontWeight:700, letterSpacing:2, fontFamily:"'JetBrains Mono',monospace" }}>{title}</span>
          {sub && <span style={{ color:"#1e293b", fontSize:10, fontFamily:"'JetBrains Mono',monospace" }}>{sub}</span>}
        </div>
      )}
      {children}
    </div>
  );
}

function SettingsPanel({ title, children }) {
  return (
    <div style={{ background:"#0d1220", border:"1px solid rgba(99,179,237,0.08)", borderRadius:12, padding:"18px 22px", marginBottom:14 }}>
      <div style={{ color:"rgba(148,163,184,0.4)", fontSize:8, fontWeight:700, letterSpacing:2, fontFamily:"'JetBrains Mono',monospace", marginBottom:4 }}>{title}</div>
      {children}
    </div>
  );
}

function Th({ children }) {
  return <th style={{ padding:"11px 14px", textAlign:"left", fontSize:8, fontWeight:700, color:"rgba(148,163,184,0.35)", letterSpacing:2, textTransform:"uppercase", fontFamily:"'JetBrains Mono',monospace", borderBottom:"1px solid rgba(99,179,237,0.07)", background:"rgba(0,0,0,0.25)", whiteSpace:"nowrap" }}>{children}</th>;
}

function Td({ children, muted }) {
  return <td style={{ padding:"11px 14px", verticalAlign:"middle", borderBottom:"1px solid rgba(99,179,237,0.04)" }}>{muted ? <span style={{ color:"#64748b", fontSize:12 }}>{children}</span> : children}</td>;
}

function Mono({ children, small }) {
  return (
    <span style={{ background:"rgba(59,130,246,0.07)", border:"1px solid rgba(59,130,246,0.12)", color:"#60a5fa", fontSize:small?9:10, fontWeight:500, padding:small?"1px 5px":"2px 7px", borderRadius:4, fontFamily:"'JetBrains Mono',monospace", display:"inline-block" }}>
      {children}
    </span>
  );
}

function Avi({ name, seed = "", size = 32, hue = 220 }) {
  const initials = name.split(" ").slice(0,2).map(w => w[0]).join("").toUpperCase();
  const palette = [
    ["#1d4ed8","#3b82f6"], ["#6d28d9","#8b5cf6"], ["#065f46","#059669"],
    ["#92400e","#d97706"], ["#9f1239","#e11d48"], ["#164e63","#0891b2"],
  ];
  const [dark, light] = palette[(seed.charCodeAt(4) || 0) % palette.length];
  return (
    <div style={{ width:size, height:size, borderRadius:"50%", background:`linear-gradient(135deg,${dark},${light})`, display:"flex", alignItems:"center", justifyContent:"center", color:"rgba(255,255,255,0.9)", fontSize:size*0.36, fontWeight:600, flexShrink:0, fontFamily:"'JetBrains Mono',monospace" }}>
      {initials}
    </div>
  );
}

function StatusBadge({ s }) {
  const MAP = {
    active:    ["#22c55e","rgba(34,197,94,0.08)","rgba(34,197,94,0.2)"],
    suspended: ["#ef4444","rgba(239,68,68,0.08)","rgba(239,68,68,0.2)"],
    inactive:  ["#475569","rgba(71,85,105,0.08)","rgba(71,85,105,0.2)"],
    completed: ["#22c55e","rgba(34,197,94,0.08)","rgba(34,197,94,0.2)"],
    cancelled: ["#ef4444","rgba(239,68,68,0.08)","rgba(239,68,68,0.2)"],
  };
  const [c, bg, border] = MAP[s] || MAP.inactive;
  return (
    <span style={{ background:bg, border:`1px solid ${border}`, color:c, fontSize:8, fontWeight:700, padding:"2px 8px", borderRadius:4, textTransform:"uppercase", letterSpacing:1, fontFamily:"'JetBrains Mono',monospace", whiteSpace:"nowrap" }}>
      {s}
    </span>
  );
}

function FilterPill({ label, count, active, onClick, accent }) {
  return (
    <button onClick={onClick} style={{ padding:"5px 13px", borderRadius:20, border:`1px solid ${active ? accent : "rgba(99,179,237,0.1)"}`, background:active?`${accent}18`:"transparent", color:active?accent:"#334155", fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s" }}>
      {label.charAt(0).toUpperCase()+label.slice(1)} <span style={{ opacity:0.6 }}>({count})</span>
    </button>
  );
}

function ActBtn({ children, onClick, danger, success }) {
  const c = danger ? "#ef4444" : success ? "#22c55e" : "#60a5fa";
  const bg = danger ? "rgba(239,68,68,0.08)" : success ? "rgba(34,197,94,0.08)" : "rgba(59,130,246,0.08)";
  const br = danger ? "rgba(239,68,68,0.2)" : success ? "rgba(34,197,94,0.2)" : "rgba(59,130,246,0.2)";
  return (
    <button onClick={onClick} style={{ background:bg, color:c, border:`1px solid ${br}`, borderRadius:5, padding:"4px 10px", fontSize:9, fontWeight:700, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace", letterSpacing:0.5, whiteSpace:"nowrap" }}>
      {children}
    </button>
  );
}

function Toggle({ val, set }) {
  return (
    <div onClick={() => set(v => !v)} style={{ width:42, height:22, borderRadius:100, background:val?"linear-gradient(135deg,#3b82f6,#1d4ed8)":"rgba(99,179,237,0.08)", border:"1px solid rgba(99,179,237,0.15)", position:"relative", cursor:"pointer", transition:"background 0.2s", flexShrink:0 }}>
      <div style={{ position:"absolute", top:2, left:val?21:2, width:17, height:17, borderRadius:"50%", background:val?"#fff":"#1e293b", border:"1px solid rgba(99,179,237,0.2)", transition:"left 0.2s", boxShadow:val?"0 0 8px rgba(59,130,246,0.5)":"none" }} />
    </div>
  );
}

function EmptyRow({ text }) {
  return (
    <div style={{ padding:"36px 20px", textAlign:"center", color:"#1e293b", fontSize:12, fontFamily:"'JetBrains Mono',monospace" }}>{text}</div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE: SHUTTLE SERVICE
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// SHUTTLE FIELD — label wrapper (defined OUTSIDE PageShuttle to prevent focus loss)
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// PAGE: USERS (Admin user management)
// ─────────────────────────────────────────────────────────────────────────────
// ── Module-level constants for PageUsers + UserForm ─────────────
const ALL_PAGES = [
  { id:"overview",  label:"Overview"         },
  { id:"drivers",   label:"Drivers"          },
  { id:"riders",    label:"Riders"           },
  { id:"trips",     label:"Trips"            },
  { id:"subs",      label:"Subscriptions"    },
  { id:"docs",      label:"Documents"        },
  { id:"promos",    label:"Promos"           },
  { id:"zones",     label:"Zone Control"     },
  { id:"shuttle",   label:"Shuttle/Airport"  },
  { id:"payment",   label:"Payment"          },
  { id:"settings",  label:"Settings"         },
  { id:"data",      label:"Data Management"  },
];
const EMPTY_PERMS = () => Object.fromEntries(ALL_PAGES.map(p => [p.id, "none"]));
const PERM_COLORS = {
  none: { bg:"rgba(99,179,237,0.04)", border:"rgba(99,179,237,0.1)", color:"#334155", label:"—" },
  view: { bg:"rgba(59,130,246,0.1)",  border:"rgba(59,130,246,0.3)",  color:"#60a5fa", label:"View" },
  edit: { bg:"rgba(34,197,94,0.1)",   border:"rgba(34,197,94,0.3)",   color:"#22c55e", label:"Edit" },
};

function PageUsers({ viewOnly }) {


  const [users,       setUsers]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [modal,       setModal]       = useState(null); // "create" | "edit" | "approve" | "delete"
  const [selected,    setSelected]    = useState(null); // selected user object
  const [form,        setForm]        = useState({ name:"", email:"", password:"", role:"view", perms: EMPTY_PERMS() });
  const [toast,       setToast]       = useState(null);
  const [pendingEdit, setPendingEdit] = useState(null); // pending edit awaiting approval
  const [approvals,   setApprovals]   = useState([]); // list of pending approval requests

  function flash(msg, ok=true) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  }

  // Load users from localStorage (persisted locally since Supabase auth management
  // requires service role key which we don't expose client-side)
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("zeez_admin_users") || "[]");
      const savedApprovals = JSON.parse(localStorage.getItem("zeez_admin_approvals") || "[]");
      setUsers(saved);
      setApprovals(savedApprovals);
    } catch(e) { setUsers([]); setApprovals([]); }
    setLoading(false);
  }, []);

  function saveUsers(list) {
    setUsers(list);
    try { localStorage.setItem("zeez_admin_users", JSON.stringify(list)); } catch(e) {}
  }

  function saveApprovals(list) {
    setApprovals(list);
    try { localStorage.setItem("zeez_admin_approvals", JSON.stringify(list)); } catch(e) {}
  }

  // Perm toggle: cycles none → view → edit → none
  function cyclePerm(pageId) {
    setForm(f => {
      const cur = f.perms[pageId] || "none";
      const next = cur === "none" ? "view" : cur === "view" ? "edit" : "none";
      return { ...f, perms: { ...f.perms, [pageId]: next } };
    });
  }

  function setAllPerms(level) {
    setForm(f => ({ ...f, perms: Object.fromEntries(ALL_PAGES.map(p => [p.id, level])) }));
  }

  // Create new user
  function handleCreate() {
    if (!form.name.trim()) { flash("Name is required", false); return; }
    if (!form.email.trim() || !form.email.includes("@")) { flash("Valid email required", false); return; }
    if (!form.password || form.password.length < 8) { flash("Password must be 8+ characters", false); return; }
    if (users.some(u => u.email.toLowerCase() === form.email.toLowerCase())) {
      flash("Email already exists", false); return;
    }
    const newUser = {
      id: "USR-" + Date.now(),
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password, // stored locally; in production use Supabase Auth
      role: form.role,
      perms: { ...form.perms },
      status: "active",
      created_at: new Date().toISOString(),
    };
    saveUsers([...users, newUser]);
    setModal(null);
    setForm({ name:"", email:"", password:"", role:"view", perms: EMPTY_PERMS() });
    flash(`User ${newUser.name} created`);
  }

  // Request edit — goes to approval queue
  function handleRequestEdit() {
    if (!form.name.trim() || !form.email.trim()) { flash("Name and email required", false); return; }
    const req = {
      id: "APR-" + Date.now(),
      userId: selected.id,
      originalUser: { ...selected },
      proposed: {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        role: form.role,
        perms: { ...form.perms },
      },
      requestedAt: new Date().toISOString(),
      status: "pending",
    };
    saveApprovals([...approvals, req]);
    setModal(null);
    flash("Edit request submitted — awaiting Super Admin approval");
  }

  // Approve or reject a pending edit
  function handleApprove(aprId, approve) {
    const apr = approvals.find(a => a.id === aprId);
    if (!apr) return;
    if (approve) {
      const updated = users.map(u =>
        u.id === apr.userId ? { ...u, ...apr.proposed } : u
      );
      saveUsers(updated);
      flash(`Changes to ${apr.proposed.name} approved and applied`);
    } else {
      flash(`Edit request rejected`);
    }
    saveApprovals(approvals.map(a => a.id === aprId ? { ...a, status: approve ? "approved" : "rejected" } : a));
  }

  // Toggle user active/suspended
  function toggleStatus(userId) {
    const updated = users.map(u =>
      u.id === userId ? { ...u, status: u.status === "active" ? "suspended" : "active" } : u
    );
    saveUsers(updated);
    flash("User status updated");
  }

  // Delete user
  function handleDelete(userId) {
    saveUsers(users.filter(u => u.id !== userId));
    setModal(null);
    setSelected(null);
    flash("User deleted");
  }

  const pendingApprovals = approvals.filter(a => a.status === "pending");

  // ── Styles ────────────────────────────────────────────────────
  const IS = { width:"100%", background:"rgba(99,179,237,0.05)", border:"1px solid rgba(99,179,237,0.15)",
    borderRadius:7, padding:"8px 11px", color:"#f0f9ff", fontSize:12, outline:"none", boxSizing:"border-box" };



  function PermBadge({ level }) {
    const c = PERM_COLORS[level] || PERM_COLORS.none;
    return (
      <span style={{ fontSize:9, fontWeight:700, padding:"2px 7px", borderRadius:4,
        background:c.bg, border:`1px solid ${c.border}`, color:c.color,
        fontFamily:"'JetBrains Mono',monospace", letterSpacing:0.5 }}>
        {c.label}
      </span>
    );
  }

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div style={{ position:"fixed", top:20, right:20, zIndex:9999,
          background:toast.ok?"rgba(34,197,94,0.15)":"rgba(239,68,68,0.15)",
          border:`1px solid ${toast.ok?"rgba(34,197,94,0.3)":"rgba(239,68,68,0.3)"}`,
          borderRadius:10, padding:"10px 18px", color:toast.ok?"#86efac":"#fca5a5",
          fontSize:12, fontWeight:600, backdropFilter:"blur(8px)" }}>
          {toast.msg}
        </div>
      )}

      <SectionHdr title="Users" sub="Manage admin portal accounts and page-level permissions" />

      {/* Pending approvals banner */}
      {pendingApprovals.length > 0 && !viewOnly && (
        <div style={{ marginBottom:16, padding:"12px 16px",
          background:"rgba(245,158,11,0.1)", border:"1px solid rgba(245,158,11,0.3)",
          borderRadius:10, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <span style={{ color:"#f59e0b", fontWeight:700, fontSize:12 }}>
              ⏳ {pendingApprovals.length} edit request{pendingApprovals.length>1?"s":""} awaiting approval
            </span>
          </div>
          <button onClick={() => setModal("approvals")}
            style={{ padding:"6px 14px", borderRadius:7, border:"1px solid rgba(245,158,11,0.4)",
              background:"rgba(245,158,11,0.1)", color:"#f59e0b", fontSize:11, fontWeight:700, cursor:"pointer" }}>
            Review
          </button>
        </div>
      )}

      {/* Header row */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <div style={{ color:"#64748b", fontSize:12 }}>
          {users.length} user{users.length!==1?"s":""} · {users.filter(u=>u.status==="active").length} active
        </div>
        {!viewOnly && (
          <button onClick={() => {
            setForm({ name:"", email:"", password:"", role:"view", perms: EMPTY_PERMS() });
            setModal("create");
          }} style={{ padding:"8px 18px", borderRadius:8, border:"1px solid rgba(59,130,246,0.3)",
            background:"rgba(59,130,246,0.08)", color:"#60a5fa", fontSize:12, fontWeight:700, cursor:"pointer" }}>
            + Create User
          </button>
        )}
      </div>

      {/* Users table */}
      <Panel title="ALL USERS">
        {loading ? (
          <div style={{ padding:40, textAlign:"center", color:"#334155" }}>Loading…</div>
        ) : users.length === 0 ? (
          <div style={{ padding:"40px", textAlign:"center", color:"#334155", fontSize:13 }}>
            No users created yet.<br/>
            {!viewOnly && <span style={{ color:"#60a5fa" }}>Click + Create User to add one.</span>}
          </div>
        ) : (
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr>{["NAME","EMAIL","ROLE","PAGES","STATUS","CREATED",""].map(h => <Th key={h}>{h}</Th>)}</tr>
            </thead>
            <tbody>
              {users.map(u => {
                const editCount   = Object.values(u.perms||{}).filter(v=>v==="edit").length;
                const viewCount   = Object.values(u.perms||{}).filter(v=>v==="view").length;
                const hasPending  = approvals.some(a => a.userId===u.id && a.status==="pending");
                return (
                  <tr key={u.id} className="trow">
                    <Td>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <Avi name={u.name} seed={u.id} hue={200} />
                        <div>
                          <div style={{ color:"#e2e8f0", fontSize:13, fontWeight:500 }}>{u.name}</div>
                          <Mono small>{u.id}</Mono>
                        </div>
                      </div>
                    </Td>
                    <Td><span style={{ color:"#64748b", fontSize:11 }}>{u.email}</span></Td>
                    <Td>
                      <span style={{ padding:"3px 8px", borderRadius:5, fontSize:10, fontWeight:700,
                        fontFamily:"'JetBrains Mono',monospace",
                        background:u.role==="super"?"rgba(167,139,250,0.1)":"rgba(99,179,237,0.07)",
                        border:`1px solid ${u.role==="super"?"rgba(167,139,250,0.3)":"rgba(99,179,237,0.15)"}`,
                        color:u.role==="super"?"#a78bfa":"#93c5fd" }}>
                        {u.role==="super"?"Super Admin":u.role==="edit"?"Editor":"Viewer"}
                      </span>
                    </Td>
                    <Td>
                      <div style={{ fontSize:10, color:"#64748b" }}>
                        {editCount > 0 && <span style={{ color:"#22c55e", marginRight:6 }}>{editCount} edit</span>}
                        {viewCount > 0 && <span style={{ color:"#60a5fa" }}>{viewCount} view</span>}
                        {editCount===0 && viewCount===0 && <span style={{ color:"#334155" }}>—</span>}
                      </div>
                      {hasPending && <div style={{ color:"#f59e0b", fontSize:9, fontWeight:700 }}>⏳ edit pending</div>}
                    </Td>
                    <Td><StatusBadge s={u.status||"active"} /></Td>
                    <Td>
                      <span style={{ color:"#475569", fontSize:11, fontFamily:"'JetBrains Mono',monospace" }}>
                        {new Date(u.created_at).toLocaleDateString("en-CA",{month:"short",day:"numeric",year:"numeric"})}
                      </span>
                    </Td>
                    <Td>
                      {!viewOnly && (
                        <div style={{ display:"flex", gap:5 }}>
                          <ActBtn onClick={() => {
                            setSelected(u);
                            setForm({ name:u.name, email:u.email, password:"", role:u.role||"view", perms:{ ...EMPTY_PERMS(), ...(u.perms||{}) } });
                            setModal("edit");
                          }}>Edit</ActBtn>
                          <ActBtn onClick={() => toggleStatus(u.id)}>
                            {u.status==="active"?"Suspend":"Reinstate"}
                          </ActBtn>
                          <ActBtn danger onClick={() => { setSelected(u); setModal("delete"); }}>Delete</ActBtn>
                        </div>
                      )}
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Panel>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* MODAL: CREATE USER                                        */}
      {/* ══════════════════════════════════════════════════════════ */}
      {modal === "create" && (
        <ShuttleModal title="Create New User" onClose={() => setModal(null)}>
          <UserForm
            form={form} setForm={setForm} IS={IS} ALL_PAGES={ALL_PAGES}
            PERM_COLORS={PERM_COLORS} cyclePerm={cyclePerm} setAllPerms={setAllPerms}
            showPassword={true}
          />
          <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:20 }}>
            <button onClick={() => setModal(null)}
              style={{ padding:"8px 16px", borderRadius:7, border:"1px solid rgba(99,179,237,0.15)",
                background:"transparent", color:"#64748b", fontSize:12, cursor:"pointer" }}>
              Cancel
            </button>
            <button onClick={handleCreate}
              style={{ padding:"8px 24px", borderRadius:7, border:"1px solid rgba(34,197,94,0.3)",
                background:"rgba(34,197,94,0.08)", color:"#22c55e", fontSize:12, fontWeight:700, cursor:"pointer" }}>
              Create User
            </button>
          </div>
        </ShuttleModal>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* MODAL: EDIT USER (requires approval)                      */}
      {/* ══════════════════════════════════════════════════════════ */}
      {modal === "edit" && selected && (
        <ShuttleModal title={`Edit User — ${selected.name}`} onClose={() => setModal(null)}>
          <div style={{ marginBottom:14, padding:"10px 14px",
            background:"rgba(245,158,11,0.08)", border:"1px solid rgba(245,158,11,0.2)",
            borderRadius:8, color:"#f59e0b", fontSize:11 }}>
            ⚠️ Edits require Super Admin approval before taking effect
          </div>
          <UserForm
            form={form} setForm={setForm} IS={IS} ALL_PAGES={ALL_PAGES}
            PERM_COLORS={PERM_COLORS} cyclePerm={cyclePerm} setAllPerms={setAllPerms}
            showPassword={false}
          />
          <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:20 }}>
            <button onClick={() => setModal(null)}
              style={{ padding:"8px 16px", borderRadius:7, border:"1px solid rgba(99,179,237,0.15)",
                background:"transparent", color:"#64748b", fontSize:12, cursor:"pointer" }}>
              Cancel
            </button>
            <button onClick={handleRequestEdit}
              style={{ padding:"8px 24px", borderRadius:7, border:"1px solid rgba(245,158,11,0.3)",
                background:"rgba(245,158,11,0.08)", color:"#f59e0b", fontSize:12, fontWeight:700, cursor:"pointer" }}>
              Submit for Approval →
            </button>
          </div>
        </ShuttleModal>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* MODAL: PENDING APPROVALS                                  */}
      {/* ══════════════════════════════════════════════════════════ */}
      {modal === "approvals" && (
        <ShuttleModal title="Pending Edit Approvals" onClose={() => setModal(null)}>
          {pendingApprovals.length === 0 ? (
            <div style={{ padding:"30px 0", textAlign:"center", color:"#334155" }}>No pending approvals</div>
          ) : (
            pendingApprovals.map(apr => {
              const orig = apr.originalUser;
              const prop = apr.proposed;
              return (
                <div key={apr.id} style={{ marginBottom:16, padding:16,
                  background:"rgba(99,179,237,0.04)", border:"1px solid rgba(99,179,237,0.1)",
                  borderRadius:10 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                    <div>
                      <div style={{ color:"#f0f9ff", fontWeight:600, fontSize:13 }}>{orig.name}</div>
                      <div style={{ color:"#475569", fontSize:10, marginTop:2 }}>
                        Requested: {new Date(apr.requestedAt).toLocaleString()}
                      </div>
                    </div>
                    <Mono small>{apr.id}</Mono>
                  </div>

                  {/* Show diff */}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
                    <div style={{ padding:"8px 10px", background:"rgba(239,68,68,0.05)",
                      border:"1px solid rgba(239,68,68,0.15)", borderRadius:7 }}>
                      <div style={{ color:"#ef4444", fontSize:9, fontWeight:700, marginBottom:6 }}>CURRENT</div>
                      <div style={{ color:"#94a3b8", fontSize:11 }}>{orig.name}</div>
                      <div style={{ color:"#64748b", fontSize:10 }}>{orig.email}</div>
                      <div style={{ color:"#64748b", fontSize:10 }}>Role: {orig.role||"view"}</div>
                    </div>
                    <div style={{ padding:"8px 10px", background:"rgba(34,197,94,0.05)",
                      border:"1px solid rgba(34,197,94,0.15)", borderRadius:7 }}>
                      <div style={{ color:"#22c55e", fontSize:9, fontWeight:700, marginBottom:6 }}>PROPOSED</div>
                      <div style={{ color:"#94a3b8", fontSize:11 }}>{prop.name}</div>
                      <div style={{ color:"#64748b", fontSize:10 }}>{prop.email}</div>
                      <div style={{ color:"#64748b", fontSize:10 }}>Role: {prop.role||"view"}</div>
                    </div>
                  </div>

                  {/* Permission changes */}
                  <div style={{ marginBottom:12 }}>
                    <div style={{ color:"#475569", fontSize:9, fontWeight:700, letterSpacing:1, marginBottom:6 }}>PERMISSION CHANGES</div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                      {ALL_PAGES.map(p => {
                        const was = orig.perms?.[p.id]||"none";
                        const now = prop.perms?.[p.id]||"none";
                        const changed = was !== now;
                        if (!changed) return null;
                        const cc = PERM_COLORS[now]||PERM_COLORS.none;
                        return (
                          <div key={p.id} style={{ fontSize:9, padding:"2px 8px", borderRadius:5,
                            background:cc.bg, border:`1px solid ${cc.border}`, color:cc.color,
                            fontFamily:"'JetBrains Mono',monospace" }}>
                            {p.label}: {was}→{now}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={() => handleApprove(apr.id, false)}
                      style={{ flex:1, padding:"8px", borderRadius:7, border:"1px solid rgba(239,68,68,0.3)",
                        background:"rgba(239,68,68,0.07)", color:"#ef4444", fontSize:11, fontWeight:700, cursor:"pointer" }}>
                      ✕ Reject
                    </button>
                    <button onClick={() => handleApprove(apr.id, true)}
                      style={{ flex:2, padding:"8px", borderRadius:7, border:"1px solid rgba(34,197,94,0.3)",
                        background:"rgba(34,197,94,0.08)", color:"#22c55e", fontSize:11, fontWeight:700, cursor:"pointer" }}>
                      ✓ Approve &amp; Apply
                    </button>
                  </div>
                </div>
              );
            })
          )}
          <div style={{ textAlign:"right", marginTop:8 }}>
            <button onClick={() => setModal(null)}
              style={{ padding:"8px 16px", borderRadius:7, border:"1px solid rgba(99,179,237,0.15)",
                background:"transparent", color:"#64748b", fontSize:12, cursor:"pointer" }}>
              Close
            </button>
          </div>
        </ShuttleModal>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* MODAL: DELETE CONFIRM                                     */}
      {/* ══════════════════════════════════════════════════════════ */}
      {modal === "delete" && selected && (
        <ShuttleModal title="Delete User" onClose={() => setModal(null)}>
          <div style={{ color:"#94a3b8", fontSize:13, marginBottom:20 }}>
            Are you sure you want to permanently delete{" "}
            <strong style={{ color:"#f0f9ff" }}>{selected.name}</strong>?
            This cannot be undone.
          </div>
          <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
            <button onClick={() => setModal(null)}
              style={{ padding:"8px 16px", borderRadius:7, border:"1px solid rgba(99,179,237,0.15)",
                background:"transparent", color:"#64748b", fontSize:12, cursor:"pointer" }}>
              Cancel
            </button>
            <button onClick={() => handleDelete(selected.id)}
              style={{ padding:"8px 24px", borderRadius:7, border:"1px solid rgba(239,68,68,0.3)",
                background:"rgba(239,68,68,0.08)", color:"#ef4444", fontSize:12, fontWeight:700, cursor:"pointer" }}>
              Delete
            </button>
          </div>
        </ShuttleModal>
      )}

    </div>
  );
}

// ── UserForm — shared between Create and Edit modals ──────────────────────────
function UserForm({ form, setForm, IS, ALL_PAGES, PERM_COLORS, cyclePerm, setAllPerms, showPassword }) {
  return (
    <>
      {/* Basic info */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
        <ShuttleField label="Full Name" full>
          <input value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))}
            placeholder="e.g. Jane Smith" style={IS} />
        </ShuttleField>
        <ShuttleField label="Email Address" full>
          <input type="email" value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))}
            placeholder="jane@zeezryde.com" style={IS} />
        </ShuttleField>
        {showPassword && (
          <ShuttleField label="Password" full>
            <input type="password" value={form.password} onChange={e => setForm(f=>({...f,password:e.target.value}))}
              placeholder="Min 8 characters" style={IS} />
          </ShuttleField>
        )}
        <ShuttleField label="Role">
          <select value={form.role} onChange={e => setForm(f=>({...f,role:e.target.value}))}
            style={{ ...IS, background:"#0d1220" }}>
            <option value="view">Viewer</option>
            <option value="edit">Editor</option>
            <option value="super">Super Admin</option>
          </select>
        </ShuttleField>
      </div>

      {/* Permission matrix */}
      <div style={{ marginBottom:12 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <div style={{ color:"rgba(148,163,184,0.6)", fontSize:9, fontWeight:700,
            letterSpacing:1.5, textTransform:"uppercase", fontFamily:"'JetBrains Mono',monospace" }}>
            Page Permissions
          </div>
          <div style={{ display:"flex", gap:6 }}>
            {["none","view","edit"].map(level => (
              <button key={level} onClick={() => setAllPerms(level)}
                style={{ padding:"3px 10px", borderRadius:5, fontSize:9, fontWeight:700,
                  cursor:"pointer", fontFamily:"'JetBrains Mono',monospace",
                  background:PERM_COLORS[level].bg, border:`1px solid ${PERM_COLORS[level].border}`,
                  color:PERM_COLORS[level].color }}>
                All {level==="none"?"—":level==="view"?"View":"Edit"}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
          {ALL_PAGES.map(p => {
            const level = form.perms[p.id] || "none";
            const c = PERM_COLORS[level];
            return (
              <button key={p.id} type="button" onClick={() => cyclePerm(p.id)}
                style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                  padding:"8px 12px", borderRadius:8, cursor:"pointer", textAlign:"left",
                  background:c.bg, border:`1px solid ${c.border}`, transition:"all 0.12s" }}>
                <span style={{ color:"#94a3b8", fontSize:11 }}>{p.label}</span>
                <span style={{ fontSize:9, fontWeight:700, color:c.color,
                  fontFamily:"'JetBrains Mono',monospace" }}>
                  {level==="none"?"—":level==="view"?"👁 View":"✏️ Edit"}
                </span>
              </button>
            );
          })}
        </div>
        <div style={{ color:"#334155", fontSize:10, marginTop:8 }}>
          Click a page to cycle: — (no access) → 👁 View → ✏️ Edit → —
        </div>
      </div>
    </>
  );
}


function ShuttleField({ label, children, full }) {
  return (
    <div style={{ gridColumn: full ? "1/-1" : undefined }}>
      <div style={{ color:"rgba(148,163,184,0.5)", fontSize:9, fontWeight:700,
        letterSpacing:1.5, textTransform:"uppercase",
        fontFamily:"'JetBrains Mono',monospace", marginBottom:5 }}>{label}</div>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SHUTTLE MODAL — overlay wrapper (defined OUTSIDE PageShuttle)
// ─────────────────────────────────────────────────────────────────────────────
function ShuttleModal({ title, children, onClose }) {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:900,
      background:"rgba(5,8,18,0.85)", backdropFilter:"blur(6px)",
      display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:"#0d1220", border:"1px solid rgba(99,179,237,0.12)",
        borderRadius:14, padding:"24px 26px", width:"100%", maxWidth:580,
        maxHeight:"90vh", overflowY:"auto", boxShadow:"0 24px 60px rgba(0,0,0,0.6)" }}>
        <div style={{ display:"flex", justifyContent:"space-between",
          alignItems:"center", marginBottom:20 }}>
          <h3 style={{ color:"#f0f9ff", fontSize:16, fontWeight:600, margin:0,
            fontFamily:"'Space Grotesk',sans-serif" }}>{title}</h3>
          <button onClick={onClose} style={{ background:"none", border:"none",
            color:"#475569", fontSize:20, cursor:"pointer", lineHeight:1,
            padding:"0 4px" }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE: SHUTTLE / AIRPORT
// ─────────────────────────────────────────────────────────────────────────────
function PageShuttle({
  viewOnly, flash, vehicles, setVehicles, trips, setTrips, drivers,
  shuttleDrivers, setShuttleDrivers,
  shuttleBaseFare, setShuttleBaseFare,
  shuttleBookingFee, setShuttleBookingFee,
  shuttlePeakOn, setShuttlePeakOn,
  shuttlePeakMult, setShuttlePeakMult,
  airportFareYYZ, setAirportFareYYZ,
  airportFareYHM, setAirportFareYHM,
  airportFareYTZ, setAirportFareYTZ,
  airportBookingFee, setAirportBookingFee,
  airportMinNotice, setAirportMinNotice,
  dispatchEmail, setDispatchEmail,
}) {
  const [tab,           setTab]           = useState("drivers");
  const [modal,         setModal]         = useState(null);
  const [form,          setForm]          = useState({});

  function saveShuttleSettings() {
    try {
      // Read existing, merge ONLY our keys (avoid bloating with old data)
      let saved = {};
      try { saved = JSON.parse(localStorage.getItem("zeez_settings") || "{}"); } catch(e) {}
      const updated = {
        ...saved,
        shuttleBaseFare, shuttleBookingFee, shuttlePeakOn, shuttlePeakMult,
        airportFareYYZ, airportFareYHM, airportFareYTZ,
        airportBookingFee, airportMinNotice,
      };
      // Also write airport fares to dedicated airport_trips table
      getSupabase().then(sb => {
        const rows = [
          { code:"yyz", name:"Pearson International (YYZ)",       fare:parseFloat(airportFareYYZ)||55, booking_fee:parseFloat(airportBookingFee)||3, min_notice_hrs:parseInt(airportMinNotice)||2, updated_at:new Date().toISOString() },
          { code:"yhm", name:"John C. Munro Hamilton (YHM)",       fare:parseFloat(airportFareYHM)||35, booking_fee:parseFloat(airportBookingFee)||3, min_notice_hrs:parseInt(airportMinNotice)||2, updated_at:new Date().toISOString() },
          { code:"ytz", name:"Billy Bishop Toronto City (YTZ)",    fare:parseFloat(airportFareYTZ)||28, booking_fee:parseFloat(airportBookingFee)||3, min_notice_hrs:parseInt(airportMinNotice)||2, updated_at:new Date().toISOString() },
        ];
        sb.from("airport_trips").upsert(rows, { onConflict:"code" })
          .then(()=>{}).catch(e=>console.error("airport_trips upsert:", e));
      });
      // Remove any bloat (non-primitive values, long strings)
      const clean = Object.fromEntries(
        Object.entries(updated).filter(([,v]) => typeof v !== "object" || v === null)
      );
      try { localStorage.setItem("zeez_settings", JSON.stringify(clean)); } catch(e) {
        // If still too large, save ONLY the critical fare keys
        localStorage.setItem("zeez_settings", JSON.stringify({
          airportFareYYZ, airportFareYHM, airportFareYTZ,
          shuttleBaseFare, shuttleBookingFee, shuttlePeakOn, shuttlePeakMult,
          airportBookingFee, airportMinNotice,
        }));
      }
      // Also save to Supabase so settings persist on refresh and across devices
      getSupabase().then(sb => {
        sb.from("settings").upsert(
          { key: "admin_settings", value: updated, updated_at: new Date().toISOString() },
          { onConflict: "key" }
        ).then(() => {}).catch(e => console.error("Shuttle settings Supabase save:", e));
      });
      if (flash) flash("Airport & Shuttle settings saved ✓");
    } catch(e) {
      if (flash) flash("Save failed: " + e.message, false);
    }
  }
  const [toast,         setToast]         = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const safeVehicles      = vehicles       || [];
  const safeTrips         = trips          || [];
  const safeDrivers       = drivers         || [];
  const safeShuttleDrivers = shuttleDrivers || [];

  const TIMES = [
    "12:00 AM","1:00 AM","2:00 AM","3:00 AM","4:00 AM","5:00 AM",
    "6:00 AM","7:00 AM","8:00 AM","9:00 AM","10:00 AM","11:00 AM",
    "12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM",
    "6:00 PM","7:00 PM","8:00 PM","9:00 PM","10:00 PM","11:00 PM",
  ];

  function showToast(msg, ok=true) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  }

  // Input style
  const IS = { width:"100%", background:"rgba(99,179,237,0.05)",
    border:"1px solid rgba(99,179,237,0.15)", borderRadius:7,
    padding:"8px 11px", color:"#f0f9ff", fontSize:12, outline:"none",
    boxSizing:"border-box" };
  const SS = { ...IS, background:"#0d1220" };

  // ── Computed stats ─────────────────────────────────────────────────────────
  const activeVehicles = safeVehicles.filter(v => v.status === "active");
  const scheduledTrips = safeTrips.filter(t => t.status === "scheduled");
  const completedTrips = safeTrips.filter(t => t.status === "completed");
  const totalRevenue   = completedTrips.reduce((s,t) =>
    s + parseFloat((t.fare||"0").replace("CA$","")) * (t.booked||0), 0);

  // ── Save vehicle ───────────────────────────────────────────────────────────
  async function saveVehicle() {
    if (!form.make) { showToast("Please select a make", false); return; }
    if (!form.model) { showToast("Please select a model", false); return; }
    if (!form.plate) { showToast("Please enter a licence plate", false); return; }
        const payload = {
          make:         form.make,
          model:        form.model,
          year:         parseInt(form.year) || 2023,
          plate:        form.plate.toUpperCase(),
          capacity:     parseInt(form.capacity) || (form.vehicleType === "3-seater" ? 3 : form.vehicleType === "5-seater" ? 5 : 7),
          vehicle_type: form.vehicleType || "7-seater",
          color:        form.color || "White",
          driver:       form.driver || "Unassigned",
          status:       form.status || "active",
          default_route:form.defaultRoute || "",
        };
    if (modal === "add_vehicle") {
      const newId = "SHV-" + String(safeVehicles.length + 1).padStart(3,"0");
      const newVeh = { id:newId, ...payload, booked:0, created_at:new Date().toISOString() };
      setVehicles(prev => [...(prev||[]), newVeh]);
      try { const sb = await getSupabase(); await sb.from("shuttle_vehicles").insert(newVeh); } catch(e) { console.error("SB veh insert:",e); }
      showToast(`${payload.make} ${payload.model} added as ${newId}`);
    } else {
      setVehicles(prev => (prev||[]).map(v => v.id === modal.id ? { ...v, ...payload } : v));
      try { const sb = await getSupabase(); await sb.from("shuttle_vehicles").update(payload).eq("id", modal.id); } catch(e) { console.error("SB veh update:",e); }
      showToast(`Vehicle ${modal.id} updated`);
    }
  }

  // ── Save trip ──────────────────────────────────────────────────────────────
  async function saveTrip() {
    if (!form.pickup) { showToast("Please enter a pickup location", false); return; }
    if (!form.dropoff) { showToast("Please enter a drop-off location", false); return; }
    if (!form.date) { showToast("Please enter a date", false); return; }
    const payload = {
      route:        `${form.pickup} → ${form.dropoff}`,
      pickup:       form.pickup,
      dropoff:      form.dropoff,
      date:         form.date,
      time:         form.time || TIMES[7],
      fare_per_seat:parseFloat(form.fare) || parseFloat(shuttleBaseFare) || 12,
      fare:         `CA$${parseFloat(form.fare) || parseFloat(shuttleBaseFare) || 12}`,
      seats:        parseInt(form.seats) || 7,
      vehicle:       form.vehicle || "",
          vehicle_plate: form.vehicle_plate || "",
          vehicle_make:  form.vehicle_make  || "",
          vehicle_model: form.vehicle_model || "",
      driver:       form.driver || "Unassigned",
      notes:        form.notes || "",
      status:       "scheduled",
      booked:       0,
      booked_seats: [],
      days:         form.days||[],
    };
    if (modal === "create_trip") {
      const newId = "ST-" + String(Date.now()).slice(-6);
      const newTrip = { id:newId, ...payload };
      setTrips(prev => [...(prev||[]), newTrip]);
      try { const sb = await getSupabase(); await sb.from("shuttle_trips").insert({ ...newTrip, created_at:new Date().toISOString() }); } catch(e) { console.error("SB trip insert:",e); }
      showToast(`Trip created: ${payload.route}`);
    } else {
      setTrips(prev => (prev||[]).map(t => t.id === modal.id ? { ...t, ...payload } : t));
      try { const sb = await getSupabase(); await sb.from("shuttle_trips").update(payload).eq("id", modal.id); } catch(e) { console.error("SB trip update:",e); }
      showToast(`Trip ${modal.id} updated`);
    }
  }

  // ── Delete confirm ─────────────────────────────────────────────────────────
  async function doDelete() {
    if (!confirmDelete) return;
    if (confirmDelete.type === "vehicle") {
      setVehicles(prev => (prev||[]).filter(v => v.id !== confirmDelete.item.id));
      try { const sb = await getSupabase(); await sb.from("shuttle_vehicles").delete().eq("id", confirmDelete.item.id); } catch(e) { console.error("SB veh delete:",e); }
      showToast(`Vehicle ${confirmDelete.item.id} removed`);
    } else {
      setTrips(prev => (prev||[]).filter(t => t.id !== confirmDelete.item.id));
      try { const sb = await getSupabase(); await sb.from("shuttle_trips").delete().eq("id", confirmDelete.item.id); } catch(e) { console.error("SB trip delete:",e); }
      showToast(`Trip removed`);
    }
    setConfirmDelete(null);
  }

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div style={{ position:"fixed", top:20, right:20, zIndex:9999,
          background:toast.ok ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
          border:`1px solid ${toast.ok ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
          borderRadius:10, padding:"10px 18px",
          color:toast.ok ? "#86efac" : "#fca5a5",
          fontSize:12, fontWeight:600, backdropFilter:"blur(8px)", zIndex:9999 }}>
          {toast.msg}
        </div>
      )}

      <SectionHdr title="Shuttle / Airport" sub="Manage fleet vehicles, routes, trips and airport fares" />

      {/* ── KPI strip ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:18 }}>
        {[
          ["FLEET VEHICLES",  safeVehicles.length,          "#3b82f6"],
          ["ACTIVE VEHICLES", activeVehicles.length,        "#22c55e"],
          ["SCHEDULED TRIPS", scheduledTrips.length,        "#f59e0b"],
          ["TOTAL REVENUE",   `CA$${totalRevenue.toFixed(0)}`, "#a78bfa"],
        ].map(([label, value, color]) => (
          <div key={label} style={{ background:"rgba(255,255,255,0.02)",
            border:"1px solid rgba(99,179,237,0.1)", borderRadius:10, padding:"16px 20px" }}>
            <div style={{ color:"rgba(148,163,184,0.4)", fontSize:8, fontWeight:700,
              letterSpacing:2, fontFamily:"'JetBrains Mono',monospace", marginBottom:6 }}>{label}</div>
            <div style={{ color, fontSize:26, fontWeight:700,
              fontFamily:"'JetBrains Mono',monospace" }}>{value}</div>
          </div>
        ))}
      </div>

      {/* ── Tab bar ── */}
      <div style={{ display:"flex", gap:6, marginBottom:16, alignItems:"center" }}>
        {[["drivers","👤 Drivers"],["vehicles","🚐 Fleet Vehicles"],["trips","🗓 Shuttle Trips"],["airport","✈️ Airport Settings"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            style={{ padding:"7px 20px", borderRadius:8,
              border:`1px solid ${tab===id ? "#3b82f6" : "rgba(99,179,237,0.12)"}`,
              background:tab===id ? "rgba(59,130,246,0.1)" : "transparent",
              color:tab===id ? "#60a5fa" : "#64748b",
              fontSize:12, fontWeight:600, cursor:"pointer" }}>
            {label}
          </button>
        ))}
        <div style={{ flex:1 }} />
        {tab === "vehicles" && !viewOnly && (
          <button onClick={() => {
            setForm({ make:"", model:"", year:"2023", plate:"", capacity:"7",
              color:"White", driver:"Unassigned", status:"active",
              vehicleType:"7-seater" });
            setModal("add_vehicle");
          }} style={{ padding:"7px 16px", borderRadius:8,
            border:"1px solid rgba(59,130,246,0.3)",
            background:"rgba(59,130,246,0.08)", color:"#60a5fa",
            fontSize:12, fontWeight:700, cursor:"pointer" }}>
            + Add Vehicle
          </button>
        )}
        {tab === "trips" && !viewOnly && (
          <button onClick={() => {
            setForm({ pickup:"", dropoff:"", vehicle:"", date:"",
              time:TIMES[7], fare:shuttleBaseFare||"12", seats:"7",
              driver:"Unassigned", notes:"", days:[] });
            setModal("create_trip");
          }} style={{ padding:"7px 16px", borderRadius:8,
            border:"1px solid rgba(34,197,94,0.3)",
            background:"rgba(34,197,94,0.08)", color:"#22c55e",
            fontSize:12, fontWeight:700, cursor:"pointer" }}>
            + Create Trip
          </button>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* TAB: FLEET VEHICLES                                       */}
      {/* ══════════════════════════════════════════════════════════ */}
      {tab === "vehicles" && (
        <>
        <Panel title={`FLEET VEHICLES — ${safeVehicles.length} TOTAL`}>
          {safeVehicles.length === 0 ? (
            <div style={{ padding:"40px", textAlign:"center", color:"#334155", fontSize:13 }}>
              No vehicles in fleet yet.<br/>
              <span style={{ color:"#60a5fa" }}>Click + Add Vehicle above to get started.</span>
            </div>
          ) : (
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr>{["ID","MAKE / MODEL","YEAR","PLATE","TYPE","CAPACITY","DRIVER","STATUS",""].map(h =>
                  <Th key={h}>{h}</Th>)}</tr>
              </thead>
              <tbody>
                {safeVehicles.map(v => (
                  <tr key={v.id} className="trow">
                    <Td><Mono small>{v.id}</Mono></Td>
                    <Td><span style={{ color:"#f0f9ff", fontWeight:600 }}>{v.make} {v.model}</span></Td>
                    <Td muted>{v.year}</Td>
                    <Td><Mono small>{v.plate}</Mono></Td>
                    <Td muted>{v.vehicleType||v.vehicle_type||"7-seater"}</Td>
                    <Td muted>{v.capacity} seats</Td>
                    <Td muted>{v.driver||"Unassigned"}</Td>
                    <Td><StatusBadge s={v.status||"active"} /></Td>
                    <Td>
                      <div style={{ display:"flex", gap:6 }}>
                        {!viewOnly && <ActBtn onClick={() => {
                          setForm({ ...v });
                          setModal({ id:v.id, type:"edit_vehicle" });
                        }}>Edit</ActBtn>}
                        {!viewOnly && <ActBtn danger onClick={() => setConfirmDelete({ type:"vehicle", item:v })}>Delete</ActBtn>}
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Panel>
        {/* Save Shuttle/Airport Settings */}
        {!viewOnly && (
          <div style={{ marginTop:16, display:"flex", justifyContent:"flex-end" }}>
            <button
              onClick={saveShuttleSettings}
              style={{ padding:"11px 32px", borderRadius:10, border:"none",
                cursor:"pointer", background:"linear-gradient(135deg,#2563eb,#1d4ed8)",
                color:"#fff", fontSize:13, fontWeight:700, letterSpacing:0.3,
                boxShadow:"0 4px 14px rgba(37,99,235,0.4)" }}>
              Save Airport and Shuttle Settings
            </button>
          </div>
        )}
        </>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* TAB: SHUTTLE TRIPS                                        */}
      {/* ══════════════════════════════════════════════════════════ */}
      {tab === "trips" && (
        <>
        <Panel title={`SHUTTLE TRIPS — ${safeTrips.length} TOTAL`}>
          {safeTrips.length === 0 ? (
            <div style={{ padding:"40px", textAlign:"center", color:"#334155", fontSize:13 }}>
              No trips scheduled yet.<br/>
              <span style={{ color:"#22c55e" }}>Click + Create Trip above to add one.</span>
            </div>
          ) : (
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr>{["ID","ROUTE","DATE","TIME","FARE/SEAT","BOOKED","VEHICLE","STATUS",""].map(h =>
                  <Th key={h}>{h}</Th>)}</tr>
              </thead>
              <tbody>
                {safeTrips.map(t => (
                  <tr key={t.id} className="trow">
                    <Td><Mono small>{t.id}</Mono></Td>
                    <Td><span style={{ color:"#f0f9ff", fontSize:11 }}>{t.route||`${t.pickup} → ${t.dropoff}`}</span></Td>
                    <Td muted>{t.date}</Td>
                    <Td muted>{t.time}</Td>
                    <Td><span style={{ color:"#f0f9ff", fontWeight:600, fontFamily:"'JetBrains Mono',monospace" }}>CA${parseFloat(t.fare_per_seat||0).toFixed(2)}</span></Td>
                    <Td muted>{t.booked||0} / {t.seats||7}</Td>
                    <Td muted>{t.vehicle||"—"}</Td>
                    <Td><StatusBadge s={t.status||"scheduled"} /></Td>
                    <Td>
                      <div style={{ display:"flex", gap:6 }}>
                        {!viewOnly && <ActBtn onClick={() => {
                          setForm({
                            pickup: t.pickup || (t.route||"").split("→")[0]?.trim() || "",
                            dropoff:t.dropoff|| (t.route||"").split("→")[1]?.trim() || "",
                            date:   t.date||"", time:t.time||TIMES[7],
                            fare:   String(t.fare_per_seat||""), seats:String(t.seats||7),
                            vehicle:t.vehicle||"", driver:t.driver||"Unassigned",
                            notes:  t.notes||"", days: t.days||[],
                          });
                          setModal({ id:t.id, type:"edit_trip" });
                        }}>Edit</ActBtn>}
                        {!viewOnly && <ActBtn danger onClick={() => setConfirmDelete({ type:"trip", item:t })}>Delete</ActBtn>}
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Panel>
        {/* Save Shuttle/Airport Settings */}
        {!viewOnly && (
          <div style={{ marginTop:16, display:"flex", justifyContent:"flex-end" }}>
            <button
              onClick={saveShuttleSettings}
              style={{ padding:"11px 32px", borderRadius:10, border:"none",
                cursor:"pointer", background:"linear-gradient(135deg,#2563eb,#1d4ed8)",
                color:"#fff", fontSize:13, fontWeight:700, letterSpacing:0.3,
                boxShadow:"0 4px 14px rgba(37,99,235,0.4)" }}>
              Save Airport and Shuttle Settings
            </button>
          </div>
        )}
        </>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* TAB: SHUTTLE DRIVERS                                       */}
      {/* ══════════════════════════════════════════════════════════ */}
      {tab === "drivers" && (
        <>
        <Panel title="SHUTTLE DRIVERS">
          {/* Add Driver Form */}
          {!viewOnly && (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr auto", gap:10, marginBottom:16, alignItems:"end" }}>
              <div>
                <div style={{ fontSize:9, fontWeight:700, color:"#94a3b8", letterSpacing:1.2, textTransform:"uppercase", marginBottom:4 }}>Full Name</div>
                <input value={form.driverName||""} onChange={e=>setForm(f=>({...f,driverName:e.target.value}))}
                  placeholder="e.g. John Smith"
                  style={{ width:"100%", background:"#0d1220", border:"1px solid rgba(99,179,237,0.15)", borderRadius:6,
                    padding:"7px 10px", color:"#f0f9ff", fontSize:12, outline:"none", boxSizing:"border-box" }} />
              </div>
              <div>
                <div style={{ fontSize:9, fontWeight:700, color:"#94a3b8", letterSpacing:1.2, textTransform:"uppercase", marginBottom:4 }}>Phone</div>
                <input value={form.driverPhone||""} onChange={e=>setForm(f=>({...f,driverPhone:e.target.value}))}
                  placeholder="e.g. 905-555-0100"
                  style={{ width:"100%", background:"#0d1220", border:"1px solid rgba(99,179,237,0.15)", borderRadius:6,
                    padding:"7px 10px", color:"#f0f9ff", fontSize:12, outline:"none", boxSizing:"border-box" }} />
              </div>
              <div>
                <div style={{ fontSize:9, fontWeight:700, color:"#94a3b8", letterSpacing:1.2, textTransform:"uppercase", marginBottom:4 }}>Licence #</div>
                <input value={form.driverLicence||""} onChange={e=>setForm(f=>({...f,driverLicence:e.target.value}))}
                  placeholder="e.g. A12345-67890-AB000"
                  style={{ width:"100%", background:"#0d1220", border:"1px solid rgba(99,179,237,0.15)", borderRadius:6,
                    padding:"7px 10px", color:"#f0f9ff", fontSize:12, outline:"none", boxSizing:"border-box" }} />
              </div>
              <div>
                <div style={{ fontSize:9, fontWeight:700, color:"#94a3b8", letterSpacing:1.2, textTransform:"uppercase", marginBottom:4 }}>Email</div>
                <input value={form.driverEmail||""} onChange={e=>setForm(f=>({...f,driverEmail:e.target.value}))}
                  placeholder="e.g. driver@email.com"
                  style={{ width:"100%", background:"#0d1220", border:"1px solid rgba(99,179,237,0.15)", borderRadius:6,
                    padding:"7px 10px", color:"#f0f9ff", fontSize:12, outline:"none", boxSizing:"border-box" }} />
              </div>
              <button onClick={()=>{
                if (!form.driverName?.trim()) { showToast("Name is required", false); return; }
            const nd = { id:"SD-"+String(Date.now()).slice(-5), name:form.driverName.trim(), phone:form.driverPhone||"", email:form.driverEmail||"", licence:form.driverLicence||"", status:"active" };
                setShuttleDrivers(prev=>[...prev, nd]);
                getSupabase().then(sb=>sb.from("shuttle_drivers").insert(nd).then(()=>{}).catch(e=>console.error(e)));
                showToast(`${nd.name} added`);
                setForm(f=>({...f, driverName:"", driverPhone:"", driverEmail:"", driverLicence:""}));
              }} style={{ padding:"7px 18px", borderRadius:8, border:"none", cursor:"pointer",
                background:"linear-gradient(135deg,#2563eb,#1d4ed8)", color:"#fff", fontSize:12, fontWeight:700, whiteSpace:"nowrap" }}>
                + Add Driver
              </button>
            </div>
          )}
          {/* Drivers Table */}
          {(shuttleDrivers||[]).length === 0 ? (
            <div style={{ padding:"30px", textAlign:"center", color:"#334155", fontSize:13 }}>
              No shuttle drivers yet. Add one above.
            </div>
          ) : (
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
              <tr>{["ID","NAME","PHONE","EMAIL","LICENCE","STATUS",""].map(h=>(
                  <Th key={h}>{h}</Th>
                ))}</tr>
              </thead>
              <tbody>
                {(shuttleDrivers||[]).map(d=>(
                  <tr key={d.id} className="trow">
                    <Td><Mono small>{d.id}</Mono></Td>
                    <Td><span style={{ color:"#f0f9ff", fontWeight:600 }}>{d.name}</span></Td>
                    <Td muted>{d.phone||"—"}</Td>
              <Td muted>{d.email||"—"}</Td>
                    <Td muted>{d.licence||"—"}</Td>
                    <Td><StatusBadge s={d.status||"active"} /></Td>
                    <Td>
                      {!viewOnly && (
                        <ActBtn danger onClick={()=>{
                          setShuttleDrivers(prev=>prev.filter(x=>x.id!==d.id));
                          getSupabase().then(sb=>sb.from("shuttle_drivers").delete().eq("id",d.id).then(()=>{}).catch(e=>console.error(e)));
                          showToast(`${d.name} removed`);
                        }}>Remove</ActBtn>
                      )}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Panel>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* TAB: AIRPORT SETTINGS                                     */}
      {/* ══════════════════════════════════════════════════════════ */}
      {tab === "airport" && (
        <>
        <Panel title="AIRPORT FARES">
            {[
              ["Pearson International (YYZ)", airportFareYYZ, setAirportFareYYZ],
              ["Hamilton Airport (YHM)",       airportFareYHM, setAirportFareYHM],
              ["Billy Bishop (YTZ)",            airportFareYTZ, setAirportFareYTZ],
            ].map(([name, val, setter]) => (
              <div key={name} style={{ display:"flex", justifyContent:"space-between",
                alignItems:"center", padding:"10px 0",
                borderBottom:"1px solid rgba(99,179,237,0.07)" }}>
                <span style={{ color:"#94a3b8", fontSize:12 }}>{name}</span>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{ color:"#64748b", fontSize:12 }}>CA$</span>
                  <input value={val} onChange={e => setter(e.target.value)}
                    style={{ width:70, background:"#0d1220",
                      border:"1px solid rgba(99,179,237,0.15)", borderRadius:6,
                      padding:"5px 8px", color:"#60a5fa", fontSize:13,
                      fontWeight:700, fontFamily:"'JetBrains Mono',monospace",
                      outline:"none", textAlign:"center" }} />
                </div>
              </div>
            ))}
            {[
              ["Platform Booking Fee (CA$)", airportBookingFee, setAirportBookingFee],
              ["Min Booking Notice (hrs)",   airportMinNotice,  setAirportMinNotice],
            ].map(([label, val, setter]) => (
            <div key={label} style={{ display:"flex", justifyContent:"space-between",
              alignItems:"center", padding:"10px 0",
              borderBottom:"1px solid rgba(99,179,237,0.07)" }}>
              <span style={{ color:"#94a3b8", fontSize:12 }}>{label}</span>
              <input value={val} onChange={e => setter(e.target.value)}
                style={{ width:70, background:"#0d1220",
                border:"1px solid rgba(99,179,237,0.15)", borderRadius:6,
                padding:"5px 8px", color:"#60a5fa", fontSize:13,
                fontWeight:700, fontFamily:"'JetBrains Mono',monospace",
                outline:"none", textAlign:"center" }} />
            </div>
            ))}
          </Panel>

        {/* Dispatch Email */}
        <Panel title="DISPATCH NOTIFICATIONS">
          <div style={{ padding:"10px 0" }}>
            <div style={{ color:"#94a3b8", fontSize:12, marginBottom:8 }}>Dispatch Email — receives notification for every airport booking</div>
            <input
              value={dispatchEmail}
              onChange={e=>setDispatchEmail(e.target.value)}
              placeholder="e.g. dispatch@zeezryde.com"
              style={{ width:"100%", background:"#0d1220", border:"1px solid rgba(99,179,237,0.15)",
                borderRadius:6, padding:"8px 12px", color:"#60a5fa", fontSize:13,
                outline:"none", boxSizing:"border-box" }}
            />
          </div>
        </Panel>
        {!viewOnly && (
          <div style={{ marginTop:16, display:"flex", justifyContent:"flex-end" }}>
            <button
              onClick={saveShuttleSettings}
              style={{ padding:"11px 32px", borderRadius:10, border:"none",
                cursor:"pointer", background:"linear-gradient(135deg,#2563eb,#1d4ed8)",
                color:"#fff", fontSize:13, fontWeight:700, letterSpacing:0.3,
                boxShadow:"0 4px 14px rgba(37,99,235,0.4)" }}>
              Save Airport and Shuttle Settings
            </button>
          </div>
        )}
        </>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* MODAL: ADD / EDIT VEHICLE                                 */}
      {/* ══════════════════════════════════════════════════════════ */}
      {(modal === "add_vehicle" || modal?.type === "edit_vehicle") && (
        <ShuttleModal
          title={modal === "add_vehicle" ? "Add Fleet Vehicle" : `Edit Vehicle — ${modal.id}`}
          onClose={() => { setModal(null); setForm({}); }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>

            <ShuttleField label="Make">
              <select value={form.make||""} onChange={e => setForm(f => ({...f, make:e.target.value, model:""}))} style={SS}>
                <option value="">— Select Make —</option>
                {CAR_MAKES.map(m => <option key={m.make} value={m.make}>{m.make}</option>)}
              </select>
            </ShuttleField>

            <ShuttleField label="Model">
              <select value={form.model||""} onChange={e => setForm(f => ({...f, model:e.target.value}))}
                style={{ ...SS, opacity: form.make ? 1 : 0.5 }} disabled={!form.make}>
                <option value="">{form.make ? "— Select Model —" : "— Select Make first —"}</option>
                {(CAR_MAKES.find(m => m.make === form.make)?.models || []).map(m =>
                  <option key={m} value={m}>{m}</option>)}
              </select>
            </ShuttleField>

            <ShuttleField label="Year">
              <input type="number" value={form.year||""} onChange={e => setForm(f => ({...f, year:e.target.value}))}
                placeholder="e.g. 2023" style={IS} />
            </ShuttleField>

            <ShuttleField label="Licence Plate">
              <input value={form.plate||""} onChange={e => setForm(f => ({...f, plate:e.target.value}))}
                placeholder="e.g. ABCD 123" style={IS} />
            </ShuttleField>

            <ShuttleField label="Vehicle Type">
              <select value={form.vehicleType||"7-seater"}
                onChange={e => setForm(f => ({...f, vehicleType:e.target.value, capacity:e.target.value==="7-seater"?"7":e.target.value==="5-seater"?"5":"3"}))}
                style={SS}>
                <option value="7-seater">7-Seater (1+3+3)</option>
                <option value="5-seater">5-Seater (1+2+2)</option>
                <option value="3-seater">3-Seater (1+1+1)</option>
              </select>
            </ShuttleField>

            <ShuttleField label="Capacity (seats)">
              <input type="number" value={form.capacity||""} onChange={e => setForm(f => ({...f, capacity:e.target.value}))}
                placeholder="e.g. 7" style={IS} />
            </ShuttleField>

            <ShuttleField label="Color">
              <input value={form.color||""} onChange={e => setForm(f => ({...f, color:e.target.value}))}
                placeholder="e.g. White" style={IS} />
            </ShuttleField>

            <ShuttleField label="Status">
              <select value={form.status||"active"} onChange={e => setForm(f => ({...f, status:e.target.value}))} style={SS}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </ShuttleField>

            <ShuttleField label="Assigned Driver" full>
              <select value={form.driver||"Unassigned"} onChange={e => setForm(f => ({...f, driver:e.target.value}))} style={SS}>
                <option value="Unassigned">Unassigned</option>
                {safeShuttleDrivers.filter(d => d.status === "active").map(d =>
                  <option key={d.id} value={d.name}>{d.name}</option>)}
              </select>
            </ShuttleField>

            <ShuttleField label="Default Route (optional)" full>
              <input value={form.defaultRoute||""} onChange={e => setForm(f => ({...f, defaultRoute:e.target.value}))}
                placeholder="e.g. Hamilton GO → Pearson Airport" style={IS} />
            </ShuttleField>

          </div>
          <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
            <button onClick={() => { setModal(null); setForm({}); }}
              style={{ padding:"8px 16px", borderRadius:7, border:"1px solid rgba(99,179,237,0.15)",
                background:"transparent", color:"#64748b", fontSize:12, cursor:"pointer" }}>
              Cancel
            </button>
            <button onClick={saveVehicle}
              style={{ padding:"8px 20px", borderRadius:7, border:"1px solid rgba(34,197,94,0.3)",
                background:"rgba(34,197,94,0.08)", color:"#22c55e",
                fontSize:12, fontWeight:700, cursor:"pointer" }}>
              {modal === "add_vehicle" ? "Add Vehicle" : "Save Changes"}
            </button>
          </div>
        </ShuttleModal>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* MODAL: CREATE / EDIT TRIP                                 */}
      {/* ══════════════════════════════════════════════════════════ */}
      {(modal === "create_trip" || modal?.type === "edit_trip") && (
        <ShuttleModal
          title={modal === "create_trip" ? "Create Shuttle Trip" : `Edit Trip — ${modal.id}`}
          onClose={() => { setModal(null); setForm({}); }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>

            <ShuttleField label="Pickup Location" full>
              <input value={form.pickup||""} onChange={e => setForm(f => ({...f, pickup:e.target.value}))}
                placeholder="e.g. Hamilton GO Station" style={IS} />
            </ShuttleField>

            <ShuttleField label="Drop-off Location" full>
              <input value={form.dropoff||""} onChange={e => setForm(f => ({...f, dropoff:e.target.value}))}
                placeholder="e.g. Toronto Pearson Airport" style={IS} />
            </ShuttleField>

            <ShuttleField label="Date">
              <input type="date" value={form.date||""} onChange={e => setForm(f => ({...f, date:e.target.value}))} style={IS} />
            </ShuttleField>

            <ShuttleField label="Departure Time">
              <select value={form.time||TIMES[7]} onChange={e => setForm(f => ({...f, time:e.target.value}))} style={SS}>
                {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </ShuttleField>

            <ShuttleField label="Fare per Seat (CA$)">
              <input type="number" value={form.fare||""} onChange={e => setForm(f => ({...f, fare:e.target.value}))}
                placeholder={shuttleBaseFare||"12"} style={IS} />
            </ShuttleField>

            <ShuttleField label="Total Seats">
              <input type="number" value={form.seats||""} onChange={e => setForm(f => ({...f, seats:e.target.value}))}
                placeholder="7" style={IS} />
            </ShuttleField>

            <ShuttleField label="Assign Vehicle" full>
              <select value={form.vehicle||""} onChange={e => {
                const v = safeVehicles.find(x => x.id === e.target.value);
                setForm(f => ({...f, vehicle:e.target.value, seats:String(v?.capacity||7), driver:v?.driver||"Unassigned"}));
              }} style={SS}>
                <option value="">— Unassigned —</option>
                {safeVehicles.filter(v => v.status === "active").map(v =>
                  <option key={v.id} value={v.id}>{v.id} — {v.make} {v.model} ({v.capacity} seats)</option>)}
              </select>
              {form.vehicle && (() => {
                const v = safeVehicles.find(x => x.id === form.vehicle);
                return v ? (
                  <div style={{ marginTop:5, color:"#334155", fontSize:10 }}>
                    Driver: <strong style={{ color:"#94a3b8" }}>{v.driver}</strong>
                    {" · "} Capacity: <strong style={{ color:"#60a5fa" }}>{v.capacity} seats</strong>
                  </div>
                ) : null;
              })()}
            </ShuttleField>

            <ShuttleField label="Days of Week (recurring)" full>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(day => {
                  const sel = (form.days||[]).includes(day);
                  return (
                    <button key={day} type="button"
                      onClick={() => setForm(f => {
                        const days = f.days||[];
                        return {...f, days: sel ? days.filter(d=>d!==day) : [...days, day]};
                      })}
                      style={{ padding:"6px 12px", borderRadius:7, fontSize:11, fontWeight:700,
                        cursor:"pointer", border:`1.5px solid ${sel?"#3b82f6":"rgba(99,179,237,0.2)"}`,
                        background:sel?"rgba(59,130,246,0.15)":"rgba(99,179,237,0.04)",
                        color:sel?"#60a5fa":"#475569", transition:"all 0.12s" }}>
                      {day}
                    </button>
                  );
                })}
              </div>
              {(form.days||[]).length > 0 && (
                <div style={{ marginTop:5, color:"#475569", fontSize:10 }}>
                  Runs every: <strong style={{ color:"#60a5fa" }}>{(form.days||[]).join(", ")}</strong>
                </div>
              )}
            </ShuttleField>

            <ShuttleField label="Assign Driver" full>
              <select value={form.driver||"Unassigned"} onChange={e => setForm(f => ({...f, driver:e.target.value}))} style={SS}>
                <option value="Unassigned">Unassigned</option>
                {safeShuttleDrivers.filter(d => d.status === "active").map(d =>
                  <option key={d.id} value={d.name}>{d.name}</option>)}
              </select>
            </ShuttleField>

            <ShuttleField label="Notes (optional)" full>
              <textarea value={form.notes||""} onChange={e => setForm(f => ({...f, notes:e.target.value}))}
                placeholder="Any notes about this trip..." rows={2}
                style={{ ...IS, resize:"vertical", fontFamily:"inherit" }} />
            </ShuttleField>

          </div>
          <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
            <button onClick={() => { setModal(null); setForm({}); }}
              style={{ padding:"8px 16px", borderRadius:7, border:"1px solid rgba(99,179,237,0.15)",
                background:"transparent", color:"#64748b", fontSize:12, cursor:"pointer" }}>
              Cancel
            </button>
            <button onClick={saveTrip}
              style={{ padding:"8px 20px", borderRadius:7, border:"1px solid rgba(34,197,94,0.3)",
                background:"rgba(34,197,94,0.08)", color:"#22c55e",
                fontSize:12, fontWeight:700, cursor:"pointer" }}>
              {modal === "create_trip" ? "Create Trip" : "Save Changes"}
            </button>
          </div>
        </ShuttleModal>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* MODAL: CONFIRM DELETE                                     */}
      {/* ══════════════════════════════════════════════════════════ */}
      {confirmDelete && (
        <ShuttleModal title="Confirm Delete" onClose={() => setConfirmDelete(null)}>
          <div style={{ color:"#94a3b8", fontSize:13, marginBottom:20 }}>
            Are you sure you want to delete{" "}
            <strong style={{ color:"#f0f9ff" }}>
              {confirmDelete.type === "vehicle"
                ? `${confirmDelete.item.make} ${confirmDelete.item.model} (${confirmDelete.item.id})`
                : `trip ${confirmDelete.item.id}`}
            </strong>?
            {confirmDelete.type === "vehicle" && confirmDelete.item.booked > 0 && (
              <div style={{ color:"#f59e0b", marginTop:8, fontSize:12 }}>
                ⚠ This vehicle has active bookings.
              </div>
            )}
          </div>
          <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
            <button onClick={() => setConfirmDelete(null)}
              style={{ padding:"8px 16px", borderRadius:7, border:"1px solid rgba(99,179,237,0.15)",
                background:"transparent", color:"#64748b", fontSize:12, cursor:"pointer" }}>
              Cancel
            </button>
            <button onClick={doDelete}
              style={{ padding:"8px 20px", borderRadius:7, border:"1px solid rgba(239,68,68,0.3)",
                background:"rgba(239,68,68,0.08)", color:"#ef4444",
                fontSize:12, fontWeight:700, cursor:"pointer" }}>
              Delete
            </button>
          </div>
        </ShuttleModal>
      )}

    </div>
  );
}



// ─────────────────────────────────────────────────────────────────────────────
// PAGE: PAYMENT
// ─────────────────────────────────────────────────────────────────────────────
function PagePayment({ methods, setMethods, payouts, setPayouts, trips, subs, autoPayoutEnabled, setAutoPayoutEnabled, lastAutoPayoutDate, nextAutoPayoutDate, cashoutRequests, setCashoutRequests,
  stripePublishableKey, setStripePublishableKey,
  stripeSecretKey, setStripeSecretKey,
  stripeWebhookSecret, setStripeWebhookSecret,
  stripeAccountId, setStripeAccountId,
  stripeMode, setStripeMode,
  stripeConnected, setStripeConnected,
  payoutSchedule, setPayoutSchedule,
  payoutDay, setPayoutDay,
  stripeAutoCapture, setStripeAutoCapture,
  businessName, setBusinessName,
  businessEmail, setBusinessEmail,
  businessPhone, setBusinessPhone,
  businessAddress, setBusinessAddress,
  businessBankName, setBusinessBankName,
  businessBankLast4, setBusinessBankLast4,
  businessTransitNo, setBusinessTransitNo,
  businessInstNo, setBusinessInstNo,
}) {
  const [tab, setTab] = useState("overview");
  const [toast, setToast] = useState(null);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [showWebhookSecret, setShowWebhookSecret] = useState(false);
  const [savingStripe, setSavingStripe] = useState(false);
  const [testingConn, setTestingConn] = useState(false);
  const [connTestResult, setConnTestResult] = useState(null); // null | {ok, msg}
  const API_BASE = (typeof window !== "undefined" && window.__ZEEZ_API_URL) || "http://localhost:4000";

  function showToast(msg, ok = true) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  }

  const totalFares = trips.filter(t => t.status === "completed" && t.fare !== "—")
    .reduce((s, t) => s + parseFloat(t.fare.replace("CA$","")||0), 0);
  const totalPlatform = trips.filter(t => t.status === "completed" && t.platform !== "—")
    .reduce((s, t) => s + parseFloat(t.platform.replace("CA$","")||0), 0);
  const totalSubRev  = subs.filter(s => s.status === "paid").length * 25;
  const pendingPayouts = payouts.filter(p => p.status === "pending");
  const onHoldPayouts  = payouts.filter(p => p.status === "on_hold");

  function maskKey(key) {
    if (!key) return "";
    if (key.length <= 12) return key;
    return key.slice(0, 12) + "·".repeat(Math.min(key.length - 16, 20)) + key.slice(-4);
  }

  return (
    <div>
      {toast && (
        <div style={{ position:"fixed", top:20, right:20, zIndex:999, background:toast.ok?"rgba(34,197,94,0.15)":"rgba(239,68,68,0.15)", border:`1px solid ${toast.ok?"rgba(34,197,94,0.3)":"rgba(239,68,68,0.3)"}`, color:toast.ok?"#22c55e":"#ef4444", padding:"10px 16px", borderRadius:10, fontSize:12, fontWeight:600, fontFamily:"'Space Grotesk',sans-serif" }}>
          {toast.msg}
        </div>
      )}

      <SectionHdr title="Payment" sub="Stripe Connect integration, business account routing, driver payouts, and revenue overview" />

      {/* KPI strip */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:20 }}>
        {[
          ["GROSS FARE REV",  `CA$${totalFares.toFixed(0)}`,     "rgba(59,130,246,0.07)",  "rgba(59,130,246,0.15)",  "#3b82f6"],
          ["PLATFORM CUT",   `CA$${totalPlatform.toFixed(0)}`,   "rgba(167,139,250,0.07)", "rgba(167,139,250,0.15)", "#a78bfa"],
          ["SUB REVENUE",    `CA$${totalSubRev}`,                 "rgba(34,197,94,0.07)",   "rgba(34,197,94,0.15)",   "#22c55e"],
          ["PENDING PAYOUTS",pendingPayouts.length + onHoldPayouts.length, "rgba(245,158,11,0.07)","rgba(245,158,11,0.15)","#f59e0b"],
        ].map(([l,v,bg,bdr,c]) => (
          <div key={l} style={{ background:bg, border:`1px solid ${bdr}`, borderRadius:10, padding:"16px 20px" }}>
            <div style={{ color:"rgba(148,163,184,0.4)", fontSize:8, fontWeight:700, letterSpacing:2, fontFamily:"'JetBrains Mono',monospace", marginBottom:8 }}>{l}</div>
            <div style={{ color:c, fontSize:26, fontWeight:700, fontFamily:"'JetBrains Mono',monospace" }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:6, marginBottom:16 }}>
        {[["stripe","Stripe Settings"],["overview","Revenue Overview"],["payouts","Driver Payouts"],["methods","Payment Methods"]].map(([id,label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ padding:"7px 18px", borderRadius:8, border:`1px solid ${tab===id?"#3b82f6":"rgba(99,179,237,0.1)"}`, background:tab===id?"rgba(59,130,246,0.12)":"transparent", color:tab===id?"#60a5fa":"#475569", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"'Space Grotesk',sans-serif", transition:"all 0.15s" }}>
            {id === "stripe" && (
              <span style={{ display:"inline-flex", alignItems:"center", gap:5 }}>
                <span style={{ width:6, height:6, borderRadius:"50%", background:stripeConnected?"#22c55e":"#475569", display:"inline-block" }} />
                {label}
              </span>
            )}
            {id !== "stripe" && label}
            {id === "payouts" && (pendingPayouts.length + onHoldPayouts.length) > 0 && (
              <span style={{ marginLeft:6, background:"#f59e0b", color:"#000", fontSize:9, fontWeight:700, borderRadius:8, padding:"1px 5px" }}>{pendingPayouts.length + onHoldPayouts.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── STRIPE SETTINGS TAB ── */}
      {tab === "stripe" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>

          {/* Connection status */}
          <div style={{ gridColumn:"1/-1", background:stripeConnected?"rgba(34,197,94,0.06)":"rgba(59,130,246,0.06)", border:`1px solid ${stripeConnected?"rgba(34,197,94,0.2)":"rgba(59,130,246,0.2)"}`, borderRadius:12, padding:"16px 20px", display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:44, height:44, borderRadius:10, background:stripeConnected?"rgba(34,197,94,0.12)":"rgba(59,130,246,0.12)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>
              {stripeConnected ? "✓" : "⬡"}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ color:stripeConnected?"#22c55e":"#60a5fa", fontSize:14, fontWeight:700, fontFamily:"'Space Grotesk',sans-serif", marginBottom:2 }}>
                {stripeConnected ? "Stripe Connected — Payments Live" : "Stripe Not Connected"}
              </div>
              <div style={{ color:"#475569", fontSize:11 }}>
                {stripeConnected
                  ? `Business account linked · ${stripeMode === "live" ? "LIVE MODE — real money" : "TEST MODE — no real charges"} · All rider payments route to your Stripe account automatically`
                  : "Add your Stripe API keys below to start accepting real payments and routing funds to your business account"
                }
              </div>
            </div>
            {stripeConnected && (
              <div style={{ textAlign:"right", flexShrink:0 }}>
                <div style={{ color:"rgba(148,163,184,0.4)", fontSize:8, letterSpacing:2, textTransform:"uppercase", fontFamily:"'JetBrains Mono',monospace", marginBottom:3 }}>MODE</div>
                <div style={{ background:stripeMode==="live"?"rgba(239,68,68,0.12)":"rgba(245,158,11,0.12)", border:`1px solid ${stripeMode==="live"?"rgba(239,68,68,0.3)":"rgba(245,158,11,0.3)"}`, color:stripeMode==="live"?"#ef4444":"#f59e0b", fontSize:10, fontWeight:700, borderRadius:6, padding:"3px 10px" }}>
                  {stripeMode === "live" ? "🔴 LIVE" : "🟡 TEST"}
                </div>
              </div>
            )}
          </div>

          {/* API Keys panel */}
          <Panel title="API KEYS">
            <div style={{ padding:"18px", display:"flex", flexDirection:"column", gap:16 }}>

              {/* Mode toggle */}
              <div>
                <div style={{ color:"rgba(148,163,184,0.4)", fontSize:9, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", fontFamily:"'JetBrains Mono',monospace", marginBottom:8 }}>Environment</div>
                <div style={{ display:"flex", gap:6 }}>
                  {[["test","Test Mode"],["live","Live Mode"]].map(([val, label]) => (
                    <button key={val} onClick={() => setStripeMode(val)} style={{ flex:1, padding:"8px", borderRadius:8, border:`1px solid ${stripeMode===val?(val==="live"?"rgba(239,68,68,0.4)":"rgba(59,130,246,0.4)"):"rgba(99,179,237,0.1)"}`, background:stripeMode===val?(val==="live"?"rgba(239,68,68,0.08)":"rgba(59,130,246,0.08)"):"transparent", color:stripeMode===val?(val==="live"?"#ef4444":"#60a5fa"):"#475569", fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"'Space Grotesk',sans-serif" }}>
                      {val === "live" ? "🔴 " : "🟡 "}{label}
                    </button>
                  ))}
                </div>
                {stripeMode === "live" && (
                  <div style={{ marginTop:8, background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:7, padding:"8px 10px", color:"#ef4444", fontSize:10 }}>
                    ⚠ Live mode charges real money. Make sure your account is fully verified with Stripe before switching.
                  </div>
                )}
              </div>

              {/* Publishable key */}
              <div>
                <div style={{ color:"rgba(148,163,184,0.4)", fontSize:9, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", fontFamily:"'JetBrains Mono',monospace", marginBottom:6 }}>Publishable Key</div>
                <div style={{ color:"#334155", fontSize:9, marginBottom:6 }}>Used on the frontend to create PaymentMethods. Safe to expose.</div>
                <input
                  value={stripePublishableKey}
                  onChange={e => setStripePublishableKey(e.target.value)}
                  placeholder={`pk_${stripeMode}_...`}
                  style={{ width:"100%", background:"rgba(99,179,237,0.05)", border:"1px solid rgba(99,179,237,0.12)", borderRadius:7, padding:"8px 10px", color:"#f0f9ff", fontSize:12, outline:"none", fontFamily:"'JetBrains Mono',monospace", boxSizing:"border-box" }}
                />
              </div>

              {/* Secret key */}
              <div>
                <div style={{ color:"rgba(148,163,184,0.4)", fontSize:9, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", fontFamily:"'JetBrains Mono',monospace", marginBottom:6 }}>Secret Key</div>
                <div style={{ color:"#334155", fontSize:9, marginBottom:6 }}>Server-side only. Never expose this publicly. Stored encrypted in your .env file.</div>
                <div style={{ position:"relative" }}>
                  <input
                    type={showSecretKey ? "text" : "password"}
                    value={stripeSecretKey}
                    onChange={e => setStripeSecretKey(e.target.value)}
                    placeholder={`sk_${stripeMode}_...`}
                    style={{ width:"100%", background:"rgba(99,179,237,0.05)", border:"1px solid rgba(99,179,237,0.12)", borderRadius:7, padding:"8px 36px 8px 10px", color:"#f0f9ff", fontSize:12, outline:"none", fontFamily:"'JetBrains Mono',monospace", boxSizing:"border-box" }}
                  />
                  <button onClick={() => setShowSecretKey(v => !v)} style={{ position:"absolute", right:8, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"#475569", cursor:"pointer", fontSize:13, lineHeight:1 }}>{showSecretKey ? "🙈" : "👁"}</button>
                </div>
              </div>

              {/* Account ID */}
              <div>
                <div style={{ color:"rgba(148,163,184,0.4)", fontSize:9, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", fontFamily:"'JetBrains Mono',monospace", marginBottom:6 }}>Business Account ID</div>
                <div style={{ color:"#334155", fontSize:9, marginBottom:6 }}>Your Stripe platform account ID (acct_...). Found in Dashboard → Settings → Account.</div>
                <input
                  value={stripeAccountId}
                  onChange={e => setStripeAccountId(e.target.value)}
                  placeholder="acct_..."
                  style={{ width:"100%", background:"rgba(99,179,237,0.05)", border:"1px solid rgba(99,179,237,0.12)", borderRadius:7, padding:"8px 10px", color:"#f0f9ff", fontSize:12, outline:"none", fontFamily:"'JetBrains Mono',monospace", boxSizing:"border-box" }}
                />
              </div>
            </div>
          </Panel>

          {/* Webhook + Payout config */}
          <Panel title="WEBHOOKS &amp; PAYOUTS">
            <div style={{ padding:"18px", display:"flex", flexDirection:"column", gap:16 }}>

              {/* Webhook secret */}
              <div>
                <div style={{ color:"rgba(148,163,184,0.4)", fontSize:9, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", fontFamily:"'JetBrains Mono',monospace", marginBottom:6 }}>Webhook Signing Secret</div>
                <div style={{ color:"#334155", fontSize:9, marginBottom:6 }}>From Stripe Dashboard → Webhooks. Point your endpoint to:</div>
                <div style={{ background:"rgba(99,179,237,0.04)", border:"1px solid rgba(99,179,237,0.1)", borderRadius:6, padding:"6px 10px", color:"#60a5fa", fontSize:10, fontFamily:"'JetBrains Mono',monospace", marginBottom:8 }}>
                  POST /api/payments/webhooks/stripe
                </div>
                <div style={{ color:"#334155", fontSize:9, marginBottom:6 }}>Required events: payment_intent.succeeded · payment_intent.payment_failed · charge.refunded · account.updated</div>
                <div style={{ position:"relative" }}>
                  <input
                    type={showWebhookSecret ? "text" : "password"}
                    value={stripeWebhookSecret}
                    onChange={e => setStripeWebhookSecret(e.target.value)}
                    placeholder="whsec_..."
                    style={{ width:"100%", background:"rgba(99,179,237,0.05)", border:"1px solid rgba(99,179,237,0.12)", borderRadius:7, padding:"8px 36px 8px 10px", color:"#f0f9ff", fontSize:12, outline:"none", fontFamily:"'JetBrains Mono',monospace", boxSizing:"border-box" }}
                  />
                  <button onClick={() => setShowWebhookSecret(v => !v)} style={{ position:"absolute", right:8, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"#475569", cursor:"pointer", fontSize:13, lineHeight:1 }}>{showWebhookSecret ? "🙈" : "👁"}</button>
                </div>
              </div>

              {/* Payout schedule */}
              <div>
                <div style={{ color:"rgba(148,163,184,0.4)", fontSize:9, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", fontFamily:"'JetBrains Mono',monospace", marginBottom:8 }}>Driver Payout Schedule</div>
                <div style={{ display:"flex", gap:6, marginBottom:10 }}>
                  {[["daily","Daily"],["weekly","Weekly"],["manual","Manual"]].map(([val, label]) => (
                    <button key={val} onClick={() => setPayoutSchedule(val)} style={{ flex:1, padding:"7px", borderRadius:8, border:`1px solid ${payoutSchedule===val?"rgba(59,130,246,0.4)":"rgba(99,179,237,0.1)"}`, background:payoutSchedule===val?"rgba(59,130,246,0.08)":"transparent", color:payoutSchedule===val?"#60a5fa":"#475569", fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"'Space Grotesk',sans-serif" }}>
                      {label}
                    </button>
                  ))}
                </div>
                {payoutSchedule === "weekly" && (
                  <div>
                    <div style={{ color:"rgba(148,163,184,0.4)", fontSize:9, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", fontFamily:"'JetBrains Mono',monospace", marginBottom:6 }}>Payout Day</div>
                    <select value={payoutDay} onChange={e => setPayoutDay(e.target.value)} style={{ width:"100%", background:"#0d1220", border:"1px solid rgba(99,179,237,0.12)", borderRadius:7, padding:"8px 10px", color:"#f0f9ff", fontSize:12, outline:"none", fontFamily:"'Space Grotesk',sans-serif", boxSizing:"border-box" }}>
                      {["monday","tuesday","wednesday","thursday","friday"].map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase()+d.slice(1)}</option>)}
                    </select>
                  </div>
                )}
                {payoutSchedule === "manual" && (
                  <div style={{ background:"rgba(245,158,11,0.06)", border:"1px solid rgba(245,158,11,0.2)", borderRadius:7, padding:"8px 10px", color:"#f59e0b", fontSize:10 }}>
                    Manual mode: admin must approve each payout request from the Driver Payouts tab.
                  </div>
                )}
              </div>

              {/* Auto-capture toggle */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div>
                  <div style={{ color:"#94a3b8", fontSize:12, fontWeight:500 }}>Auto-capture payments</div>
                  <div style={{ color:"#334155", fontSize:10, marginTop:2 }}>Capture funds immediately on authorization. Disable to manually capture within 7 days.</div>
                </div>
                <Toggle val={stripeAutoCapture} set={setStripeAutoCapture} />
              </div>
            </div>
          </Panel>

          {/* How money flows */}
          <div style={{ gridColumn:"1/-1" }}>
            <Panel title="HOW PAYMENTS ROUTE TO YOUR BUSINESS ACCOUNT">
              <div style={{ padding:"18px" }}>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:0, alignItems:"center", marginBottom:20 }}>
                  {[
                    { icon:"💳", label:"Rider pays", sub:"Stripe charges\nrider's saved card", color:"#60a5fa" },
                    { arrow: true },
                    { icon:"⚡", label:"Zeez Ryde\nStripe account", sub:`Platform keeps ${10}%\napplication fee`, color:"#a78bfa" },
                    { arrow: true },
                    { icon:"🏦", label:"Your bank account", sub:"Stripe deposits net\nbalance on schedule", color:"#22c55e" },
                  ].map((step, i) => step.arrow ? (
                    <div key={i} style={{ textAlign:"center", color:"#1e3a5f", fontSize:18 }}>→</div>
                  ) : (
                    <div key={i} style={{ background:"rgba(99,179,237,0.04)", border:"1px solid rgba(99,179,237,0.08)", borderRadius:10, padding:"14px 10px", textAlign:"center" }}>
                      <div style={{ fontSize:24, marginBottom:6 }}>{step.icon}</div>
                      <div style={{ color:step.color, fontSize:11, fontWeight:700, fontFamily:"'Space Grotesk',sans-serif", whiteSpace:"pre-line", marginBottom:4 }}>{step.label}</div>
                      <div style={{ color:"#334155", fontSize:9, lineHeight:1.5, whiteSpace:"pre-line" }}>{step.sub}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                  {[
                    ["Rider pays fare",        "Stripe PaymentIntent created → rider card charged"],
                    ["Platform commission",    "Application fee deducted automatically before transfer"],
                    ["Driver Connect account", "Remaining fare transferred to driver's linked bank via Stripe Connect Express"],
                    ["Weekly subscriptions",   "Stripe Billing recurring charge → deposited to your account directly"],
                    ["Shuttle bookings",       "Pre-authorization at booking → captured at departure"],
                    ["Your bank payout",       `Stripe deposits accumulated balance on your ${payoutSchedule} schedule`],
                  ].map(([title, desc]) => (
                    <div key={title} style={{ display:"flex", gap:10, padding:"10px 12px", background:"rgba(99,179,237,0.03)", borderRadius:8, border:"1px solid rgba(99,179,237,0.06)" }}>
                      <div style={{ width:6, height:6, borderRadius:"50%", background:"#3b82f6", marginTop:4, flexShrink:0 }} />
                      <div>
                        <div style={{ color:"#94a3b8", fontSize:11, fontWeight:600, marginBottom:2 }}>{title}</div>
                        <div style={{ color:"#334155", fontSize:10, lineHeight:1.5 }}>{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Panel>
          </div>

          {/* Business Account Details */}
          <div style={{ gridColumn:"1/-1" }}>
            <Panel title="BUSINESS ACCOUNT — WHERE MONEY LANDS">
              <div style={{ padding:"18px" }}>
                <div style={{ color:"#334155", fontSize:11, marginBottom:16, lineHeight:1.6 }}>
                  This is your <strong style={{ color:"#94a3b8" }}>Zeez Ryde business bank account</strong>. Stripe will deposit your net platform income here on your chosen payout schedule. Add your details so the setup guide and API config match your actual account.
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  {[
                    ["Business / Legal Name",    businessName,        setBusinessName,        "e.g. Zeez Ryde Inc.",           "text"],
                    ["Business Email",           businessEmail,       setBusinessEmail,       "e.g. finance@zeezryde.com",     "email"],
                    ["Business Phone",           businessPhone,       setBusinessPhone,       "e.g. +1 905 555 0100",          "text"],
                    ["Business Address",         businessAddress,     setBusinessAddress,     "e.g. 100 Main St, Hamilton ON", "text"],
                    ["Bank Name",                businessBankName,    setBusinessBankName,    "e.g. RBC Royal Bank",           "text"],
                    ["Account Last 4 Digits",    businessBankLast4,   setBusinessBankLast4,   "e.g. 4821",                     "text"],
                    ["Transit Number (5-digit)", businessTransitNo,   setBusinessTransitNo,   "e.g. 00152",                    "text"],
                    ["Institution Number (3-digit)", businessInstNo,  setBusinessInstNo,      "e.g. 003",                      "text"],
                  ].map(([label, val, setter, ph, type]) => (
                    <div key={label}>
                      <div style={{ color:"rgba(148,163,184,0.4)", fontSize:9, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", fontFamily:"'JetBrains Mono',monospace", marginBottom:5 }}>{label}</div>
                      <input
                        type={type}
                        value={val}
                        onChange={e => setter(e.target.value)}
                        placeholder={ph}
                        style={{ width:"100%", background:"rgba(99,179,237,0.05)", border:"1px solid rgba(99,179,237,0.12)", borderRadius:7, padding:"8px 10px", color:"#f0f9ff", fontSize:12, outline:"none", fontFamily:"'JetBrains Mono',monospace", boxSizing:"border-box" }}
                      />
                    </div>
                  ))}
                </div>

                {/* Status / preview */}
                {(businessName || businessBankName) && (
                  <div style={{ marginTop:16, background:"rgba(34,197,94,0.05)", border:"1px solid rgba(34,197,94,0.15)", borderRadius:9, padding:"12px 14px", display:"flex", alignItems:"center", gap:12 }}>
                    <span style={{ fontSize:22 }}>🏦</span>
                    <div>
                      <div style={{ color:"#22c55e", fontSize:12, fontWeight:700, marginBottom:2 }}>
                        {businessName || "Your Business"} — {businessBankName || "Bank"}
                      </div>
                      <div style={{ color:"#334155", fontSize:10 }}>
                        {businessBankLast4 ? `Account ···${businessBankLast4}` : "Account not set"}
                        {businessTransitNo && ` · Transit ${businessTransitNo}`}
                        {businessInstNo && ` · Institution ${businessInstNo}`}
                      </div>
                    </div>
                  </div>
                )}

                {/* Canadian banking note */}
                <div style={{ marginTop:14, background:"rgba(59,130,246,0.04)", border:"1px solid rgba(59,130,246,0.1)", borderRadius:8, padding:"10px 12px" }}>
                  <div style={{ color:"#60a5fa", fontSize:10, fontWeight:600, marginBottom:4 }}>🇨🇦 Canadian Banking Note</div>
                  <div style={{ color:"#334155", fontSize:10, lineHeight:1.6 }}>
                    To link your Canadian bank account to Stripe, go to <strong style={{ color:"#60a5fa" }}>Stripe Dashboard → Settings → Bank accounts</strong> and add your account using your institution number, transit number, and account number. Stripe supports CAD deposits to all major Canadian banks (RBC, TD, Scotiabank, BMO, CIBC, etc.). Payouts typically arrive in <strong style={{ color:"#94a3b8" }}>2–3 business days</strong> after each payout cycle.
                  </div>
                </div>
              </div>
            </Panel>
          </div>

          {/* ── SETUP CHECKLIST ── */}
          <div style={{ gridColumn:"1/-1" }}>
            <Panel title="SETUP CHECKLIST — ROUTE PAYMENTS TO YOUR BUSINESS ACCOUNT">
              <div style={{ padding:"18px" }}>
                {[
                  ["Stripe account created at stripe.com", !!(stripePublishableKey || stripeSecretKey)],
                  ["Publishable Key entered (pk_test_ or pk_live_)", !!(stripePublishableKey && (stripePublishableKey.startsWith("pk_test_") || stripePublishableKey.startsWith("pk_live_")))],
                  ["Secret Key entered (sk_test_ or sk_live_)", !!(stripeSecretKey && (stripeSecretKey.startsWith("sk_test_") || stripeSecretKey.startsWith("sk_live_")))],
                  ["Platform Account ID entered (acct_...)", !!(stripeAccountId && stripeAccountId.startsWith("acct_"))],
                  ["Webhook Secret entered (whsec_...)", !!(stripeWebhookSecret && stripeWebhookSecret.startsWith("whsec_"))],
                  ["Business bank account details filled in", !!(businessBankName && businessBankLast4 && businessTransitNo && businessInstNo)],
                  ["Payout schedule configured", !!payoutSchedule],
                  ["Save & Connect completed successfully", stripeConnected],
                ].map(([label, done]) => (
                  <div key={label} style={{ display:"flex", alignItems:"center", gap:10, padding:"7px 0", borderBottom:"1px solid rgba(99,179,237,0.06)" }}>
                    <span style={{ width:18, height:18, borderRadius:4, background:done?"rgba(34,197,94,0.15)":"rgba(99,179,237,0.06)", border:`1px solid ${done?"rgba(34,197,94,0.4)":"rgba(99,179,237,0.15)"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, flexShrink:0 }}>
                      {done ? <span style={{ color:"#22c55e" }}>✓</span> : <span style={{ color:"#334155" }}>○</span>}
                    </span>
                    <span style={{ color:done?"#94a3b8":"#334155", fontSize:11, fontFamily:"'Space Grotesk',sans-serif" }}>{label}</span>
                    {done && <span style={{ marginLeft:"auto", color:"#22c55e", fontSize:9, fontFamily:"'JetBrains Mono',monospace", fontWeight:700 }}>DONE</span>}
                  </div>
                ))}
                {/* Progress bar */}
                {(() => {
                  const checks = [
                    !!(stripePublishableKey || stripeSecretKey),
                    !!(stripePublishableKey && (stripePublishableKey.startsWith("pk_test_") || stripePublishableKey.startsWith("pk_live_"))),
                    !!(stripeSecretKey && (stripeSecretKey.startsWith("sk_test_") || stripeSecretKey.startsWith("sk_live_"))),
                    !!(stripeAccountId && stripeAccountId.startsWith("acct_")),
                    !!(stripeWebhookSecret && stripeWebhookSecret.startsWith("whsec_")),
                    !!(businessBankName && businessBankLast4 && businessTransitNo && businessInstNo),
                    !!payoutSchedule,
                    stripeConnected,
                  ];
                  const done = checks.filter(Boolean).length;
                  const pct = Math.round((done / checks.length) * 100);
                  return (
                    <div style={{ marginTop:14 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                        <span style={{ color:"#475569", fontSize:10, fontFamily:"'Space Grotesk',sans-serif" }}>Setup progress</span>
                        <span style={{ color: pct===100?"#22c55e":"#60a5fa", fontSize:10, fontWeight:700, fontFamily:"'JetBrains Mono',monospace" }}>{done}/{checks.length} — {pct}%</span>
                      </div>
                      <div style={{ height:6, borderRadius:3, background:"rgba(99,179,237,0.1)", overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${pct}%`, background:pct===100?"#22c55e":"#3b82f6", borderRadius:3, transition:"width 0.4s" }} />
                      </div>
                      {pct === 100 && (
                        <div style={{ marginTop:10, color:"#22c55e", fontSize:11, fontWeight:600, fontFamily:"'Space Grotesk',sans-serif" }}>
                          ✓ All payments are routing to your business bank account via Stripe Connect
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </Panel>
          </div>

          {/* Test Connection Result */}
          {connTestResult && (
            <div style={{ gridColumn:"1/-1", background:connTestResult.ok?"rgba(34,197,94,0.06)":"rgba(239,68,68,0.06)", border:`1px solid ${connTestResult.ok?"rgba(34,197,94,0.2)":"rgba(239,68,68,0.2)"}`, borderRadius:9, padding:"12px 16px" }}>
              <div style={{ color:connTestResult.ok?"#22c55e":"#ef4444", fontSize:12, fontWeight:600, fontFamily:"'Space Grotesk',sans-serif", marginBottom:4 }}>
                {connTestResult.ok ? "✓ Connection Test Passed" : "✗ Connection Test Failed"}
              </div>
              <div style={{ color:"#475569", fontSize:11 }}>{connTestResult.msg}</div>
            </div>
          )}

          {/* Save button row */}
          <div style={{ gridColumn:"1/-1", display:"flex", justifyContent:"flex-end", gap:10, flexWrap:"wrap" }}>

            {/* Test Connection button */}
            <button
              disabled={testingConn || !stripePublishableKey || !stripeSecretKey}
              onClick={async () => {
                setTestingConn(true);
                setConnTestResult(null);
                try {
                  const token = localStorage.getItem("zeez_admin_token") || "";
                  const res = await fetch(`${API_BASE}/api/payments/config`, {
                    headers: { Authorization: `Bearer ${token}` }
                  });
                  if (res.ok) {
                    const data = await res.json();
                    const mode = data.mode || "not_configured";
                    setConnTestResult({
                      ok: true,
                      msg: `Backend reachable · Stripe mode: ${mode.toUpperCase()} · Keys configured: ${data.configured ? "YES" : "NO"}`
                    });
                    if (data.configured) setStripeConnected(true);
                  } else {
                    setConnTestResult({ ok: false, msg: `Backend returned HTTP ${res.status}. Check that your API server is running on ${API_BASE}.` });
                  }
                } catch (err) {
                  setConnTestResult({ ok: false, msg: `Cannot reach backend at ${API_BASE}. Start the ZeezRyde API server with: npm run dev` });
                }
                setTestingConn(false);
              }}
              style={{ padding:"10px 22px", borderRadius:8, border:"1px solid rgba(167,139,250,0.3)", background:"rgba(167,139,250,0.08)", color: (!stripePublishableKey||!stripeSecretKey)?"#334155":"#a78bfa", fontSize:12, fontWeight:600, cursor:(!stripePublishableKey||!stripeSecretKey)?"not-allowed":"pointer", fontFamily:"'Space Grotesk',sans-serif", opacity:testingConn?0.6:1, transition:"all 0.2s" }}
            >
              {testingConn ? "Testing…" : "🔌 Test Connection"}
            </button>

            {/* Save & Connect button */}
            <button
              disabled={savingStripe}
              onClick={async () => {
                if (!stripePublishableKey || !stripeSecretKey) {
                  showToast("Enter at least the Publishable Key and Secret Key", false);
                  return;
                }
                setSavingStripe(true);
                const payload = {
                  stripe_publishable_key: stripePublishableKey || undefined,
                  stripe_secret_key:      stripeSecretKey || undefined,
                  stripe_webhook_secret:  stripeWebhookSecret || undefined,
                  stripe_account_id:      stripeAccountId || undefined,
                  payout_schedule:        payoutSchedule || undefined,
                  payout_day:             payoutDay ? parseInt(payoutDay) : undefined,
                  payout_currency:        "cad",
                  business_name:          businessName || undefined,
                  business_email:         businessEmail || undefined,
                  business_bank_last4:    businessBankLast4 || undefined,
                };
                // Remove undefined keys
                Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k]);
                try {
                  const token = localStorage.getItem("zeez_admin_token") || "";
                  const res = await fetch(`${API_BASE}/api/payments/config`, {
                    method: "PUT",
                    headers: { "Content-Type":"application/json", Authorization:`Bearer ${token}` },
                    body: JSON.stringify(payload),
                  });
                  if (res.ok) {
                    setStripeConnected(true);
                    const hasBusiness = businessName && businessBankName;
                    showToast(hasBusiness
                      ? `Stripe connected ✓ · Payouts routing to ${businessBankName} ···${businessBankLast4||"?????"}`
                      : "Stripe settings saved — add your business bank account to enable payouts"
                    );
                  } else {
                    const err = await res.json().catch(() => ({}));
                    showToast(`Save failed: ${err.error || `HTTP ${res.status}`}`, false);
                  }
                } catch {
                  // Backend not reachable — save locally
                  setStripeConnected(true);
                  showToast("Saved locally (backend offline) — settings will persist when API server is running", true);
                }
                setSavingStripe(false);
              }}
              style={{ padding:"10px 28px", borderRadius:8, border:"1px solid rgba(34,197,94,0.3)", background:"rgba(34,197,94,0.08)", color:"#22c55e", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"'Space Grotesk',sans-serif", opacity:savingStripe?0.6:1, transition:"opacity 0.2s" }}
            >
              {savingStripe ? "Saving…" : "Save & Connect Stripe"}
            </button>

            {stripeConnected && (
              <button
                onClick={() => { setStripeConnected(false); setStripePublishableKey(""); setStripeSecretKey(""); setStripeWebhookSecret(""); setStripeAccountId(""); setConnTestResult(null); showToast("Stripe disconnected", false); }}
                style={{ padding:"10px 20px", borderRadius:8, border:"1px solid rgba(239,68,68,0.3)", background:"rgba(239,68,68,0.06)", color:"#ef4444", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"'Space Grotesk',sans-serif" }}
              >
                Disconnect
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── REVENUE OVERVIEW ── */}
      {tab === "overview" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          <Panel title="REVENUE BREAKDOWN">
            <div style={{ padding:"18px" }}>
              {[
                ["Gross Fare Revenue",   `CA$${totalFares.toFixed(2)}`,    "#f0f9ff"],
                ["Platform Commission",  `CA$${totalPlatform.toFixed(2)}`, "#a78bfa"],
                ["Driver Payouts",       `CA$${(totalFares-totalPlatform).toFixed(2)}`, "#60a5fa"],
                ["Subscription Revenue", `CA$${totalSubRev}.00`,           "#22c55e"],
                ["Total Platform Income",`CA$${(totalPlatform+totalSubRev).toFixed(2)}`, "#f59e0b"],
              ].map(([label,val,c],i,arr) => (
                <div key={label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"11px 0", borderBottom:i<arr.length-1?"1px solid rgba(99,179,237,0.06)":"none" }}>
                  <span style={{ color:"#475569", fontSize:12 }}>{label}</span>
                  <span style={{ color:c, fontWeight:700, fontSize:14, fontFamily:"'JetBrains Mono',monospace" }}>{val}</span>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="SUBSCRIPTION REVENUE">
            <div style={{ padding:"18px" }}>
              {[
                ["Paid",    subs.filter(s => s.status==="paid").length,    "#22c55e"],
                ["Failed",  subs.filter(s => s.status==="failed").length,  "#ef4444"],
                ["Unpaid",  subs.filter(s => s.status==="unpaid").length,  "#f59e0b"],
              ].map(([label,count,c]) => (
                <div key={label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:c }} />
                    <span style={{ color:"#64748b", fontSize:12 }}>{label} subscriptions</span>
                  </div>
                  <span style={{ color:c, fontWeight:700, fontSize:14, fontFamily:"'JetBrains Mono',monospace" }}>{count}</span>
                </div>
              ))}
              <div style={{ marginTop:14, paddingTop:14, borderTop:"1px solid rgba(99,179,237,0.06)" }}>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <span style={{ color:"#475569", fontSize:12 }}>Weekly sub total</span>
                  <span style={{ color:"#22c55e", fontWeight:700, fontSize:14, fontFamily:"'JetBrains Mono',monospace" }}>CA${totalSubRev}</span>
                </div>
              </div>
            </div>
          </Panel>
          <div style={{ gridColumn:"1/-1" }}>
            <Panel title="RECENT TRANSACTIONS">
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead><tr>{["TRIP ID","RIDER","DRIVER","FARE","PLATFORM CUT","DRIVER CUT","DATE","STATUS"].map(h=><Th key={h}>{h}</Th>)}</tr></thead>
                <tbody>
                  {trips.slice(0,8).map(t => (
                    <tr key={t.id} className="trow">
                      <Td><Mono small>{t.id}</Mono></Td>
                      <Td><span style={{ color:"#cbd5e1", fontSize:12 }}>{t.rider}</span></Td>
                      <Td><span style={{ color:"#94a3b8", fontSize:12 }}>{t.driver}</span></Td>
                      <Td><span style={{ color:"#f0f9ff", fontWeight:600, fontFamily:"'JetBrains Mono',monospace" }}>{t.fare}</span></Td>
                      <Td><span style={{ color:"#a78bfa", fontFamily:"'JetBrains Mono',monospace", fontSize:12 }}>{t.platform}</span></Td>
                      <Td><span style={{ color:"#60a5fa", fontFamily:"'JetBrains Mono',monospace", fontSize:12 }}>{t.driverCut}</span></Td>
                      <Td muted>{t.date}</Td>
                      <Td><StatusBadge s={t.status} /></Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Panel>
          </div>
        </div>
      )}

      {/* ── DRIVER PAYOUTS ── */}
      {tab === "payouts" && (
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

          {/* ── Weekly Auto-Payout Config ── */}
          <div style={{ background:"rgba(34,197,94,0.05)", border:"1px solid rgba(34,197,94,0.18)", borderRadius:12, padding:"18px 20px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:36, height:36, borderRadius:9, background:"rgba(34,197,94,0.1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>⚡</div>
                <div>
                  <div style={{ color:"#22c55e", fontSize:14, fontWeight:700, fontFamily:"'Space Grotesk',sans-serif" }}>Automated Weekly Payouts</div>
                  <div style={{ color:"#334155", fontSize:11, marginTop:2 }}>Every {payoutSchedule === "weekly" ? "Monday" : payoutDay || "Monday"} at 12:00 PM — all pending driver balances transferred automatically via Stripe</div>
                </div>
              </div>
              <Toggle val={autoPayoutEnabled} set={setAutoPayoutEnabled} />
            </div>

            {autoPayoutEnabled ? (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
                {[
                  ["LAST RUN",    lastAutoPayoutDate, "Completed successfully", "#22c55e"],
                  ["NEXT RUN",    nextAutoPayoutDate, "Automatic · all active drivers", "#60a5fa"],
                  ["SCHEDULE",    payoutSchedule === "weekly" ? "Weekly · Monday" : payoutSchedule === "daily" ? "Daily" : "Manual only", "Configurable in Stripe Settings", "#a78bfa"],
                ].map(([label, val, sub, c]) => (
                  <div key={label} style={{ background:"rgba(0,0,0,0.2)", border:"1px solid rgba(99,179,237,0.08)", borderRadius:9, padding:"11px 13px" }}>
                    <div style={{ color:"rgba(148,163,184,0.4)", fontSize:8, fontWeight:700, letterSpacing:2, fontFamily:"'JetBrains Mono',monospace", marginBottom:5 }}>{label}</div>
                    <div style={{ color:c, fontSize:13, fontWeight:700, fontFamily:"'JetBrains Mono',monospace", marginBottom:3 }}>{val}</div>
                    <div style={{ color:"#334155", fontSize:9 }}>{sub}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ background:"rgba(245,158,11,0.06)", border:"1px solid rgba(245,158,11,0.2)", borderRadius:8, padding:"10px 12px", color:"#f59e0b", fontSize:11 }}>
                ⚠ Automated payouts are <strong>off</strong> — drivers must cash out manually or admin must approve individual requests. Turn on to automatically pay all drivers on schedule.
              </div>
            )}
          </div>

          {/* ── Instant Cashout Requests ── */}
          <Panel title={`INSTANT CASHOUT REQUESTS · ${cashoutRequests.filter(c => c.status === "pending").length} PENDING`}>
            <div style={{ padding:"10px 0 0" }}>
              {cashoutRequests.length === 0 && (
                <div style={{ padding:"20px", textAlign:"center", color:"#334155", fontSize:12 }}>No cashout requests</div>
              )}
              {cashoutRequests.map(co => {
                const isPending    = co.status === "pending";
                const isProcessing = co.status === "processing";
                const isPaid       = co.status === "paid";
                const isAuto       = co.type === "weekly_auto";
                return (
                  <div key={co.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 20px", borderBottom:"1px solid rgba(99,179,237,0.06)" }}>
                    <div style={{ width:36, height:36, borderRadius:9, background:isAuto?"rgba(59,130,246,0.1)":isPaid?"rgba(34,197,94,0.1)":isProcessing?"rgba(245,158,11,0.1)":"rgba(167,139,250,0.1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>
                      {isAuto ? "⚡" : isPaid ? "✓" : isProcessing ? "⏳" : "💸"}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:2 }}>
                        <span style={{ color:"#cbd5e1", fontSize:13, fontWeight:600 }}>{co.driver}</span>
                        <span style={{ background:isAuto?"rgba(59,130,246,0.1)":"rgba(167,139,250,0.1)", color:isAuto?"#60a5fa":"#a78bfa", fontSize:8, fontWeight:700, borderRadius:4, padding:"1px 6px" }}>
                          {isAuto ? "AUTO" : "INSTANT"}
                        </span>
                      </div>
                      <div style={{ color:"#334155", fontSize:10 }}>{co.requestedAt} · {co.method}</div>
                    </div>
                    <div style={{ textAlign:"right", flexShrink:0, marginRight:12 }}>
                      <div style={{ color:"#f0f9ff", fontWeight:700, fontSize:15, fontFamily:"'JetBrains Mono',monospace" }}>{co.amount}</div>
                      <div style={{ marginTop:3 }}>
                        {isPaid       && <span style={{ color:"#22c55e", fontSize:9, fontWeight:700 }}>✓ PAID</span>}
                        {isProcessing && <span style={{ color:"#f59e0b", fontSize:9, fontWeight:700 }}>PROCESSING…</span>}
                        {isPending    && <span style={{ color:"#a78bfa", fontSize:9, fontWeight:700 }}>AWAITING APPROVAL</span>}
                      </div>
                    </div>
                    {(isPending || isProcessing) && (
                      <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                        {isPending && (
                          <ActBtn success onClick={() => {
                            setCashoutRequests(prev => prev.map(x => x.id === co.id ? {...x, status:"processing"} : x));
                            setTimeout(() => {
                              setCashoutRequests(prev => prev.map(x => x.id === co.id ? {...x, status:"paid"} : x));
                              showToast(`CA$${co.amount} transferred to ${co.driver} via Stripe ✓`);
                            }, 1800);
                            showToast(`Processing ${co.id}…`);
                          }}>Approve</ActBtn>
                        )}
                        <ActBtn danger onClick={() => {
                          setCashoutRequests(prev => prev.map(x => x.id === co.id ? {...x, status:"on_hold"} : x));
                          showToast(`${co.id} placed on hold`, false);
                        }}>Hold</ActBtn>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Panel>

          {/* ── Legacy payout requests ── */}
          <Panel title="ALL PAYOUT HISTORY">
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr>{["PAYOUT ID","DRIVER","AMOUNT","DATE","METHOD","TYPE","STATUS","ACTIONS"].map(h=><Th key={h}>{h}</Th>)}</tr></thead>
              <tbody>
                {payouts.map(p => (
                  <tr key={p.id} className="trow">
                    <Td><Mono small>{p.id}</Mono></Td>
                    <Td><span style={{ color:"#cbd5e1", fontSize:13 }}>{p.driver}</span></Td>
                    <Td><span style={{ color:"#f0f9ff", fontWeight:700, fontFamily:"'JetBrains Mono',monospace" }}>{p.amount}</span></Td>
                    <Td muted>{p.date}</Td>
                    <Td><span style={{ color:"#64748b", fontSize:11 }}>{p.method}</span></Td>
                    <Td><span style={{ background:"rgba(59,130,246,0.08)", color:"#60a5fa", fontSize:9, fontWeight:700, borderRadius:4, padding:"2px 6px" }}>weekly</span></Td>
                    <Td>
                      <StatusBadge s={p.status === "on_hold" ? "suspended" : p.status} />
                      {p.status === "on_hold" && <span style={{ color:"#f59e0b", fontSize:9, fontWeight:700, marginLeft:5 }}>ON HOLD</span>}
                    </Td>
                    <Td>
                      <div style={{ display:"flex", gap:5 }}>
                        {p.status === "pending" && (
                          <ActBtn success onClick={() => {
                            setPayouts(prev => prev.map(x => x.id===p.id ? {...x, status:"paid", date:new Date().toLocaleDateString("en-CA",{month:"short",day:"numeric",year:"numeric"})} : x));
                            showToast(`Payout ${p.id} approved — transfer initiated via Stripe`);
                          }}>Approve</ActBtn>
                        )}
                        {(p.status === "pending" || p.status === "on_hold") && (
                          <ActBtn danger onClick={() => {
                            setPayouts(prev => prev.map(x => x.id===p.id ? {...x, status:"on_hold"} : x));
                            showToast(`Payout ${p.id} placed on hold`, false);
                          }}>Hold</ActBtn>
                        )}
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
        </div>
      )}

      {/* ── PAYMENT METHODS ── */}
      {tab === "methods" && (
        <Panel title="RIDER PAYMENT METHODS">
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr>{["METHOD ID","TYPE","CARD","HOLDER","EXPIRY","STATUS","ACTIONS"].map(h=><Th key={h}>{h}</Th>)}</tr></thead>
            <tbody>
              {methods.map(m => (
                <tr key={m.id} className="trow">
                  <Td><Mono small>{m.id}</Mono></Td>
                  <Td>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <span style={{ fontSize:14 }}>💳</span>
                      <span style={{ color:"#cbd5e1", fontSize:12, fontWeight:500 }}>{m.type}</span>
                      {m.default && <span style={{ background:"rgba(59,130,246,0.15)", color:"#60a5fa", fontSize:8, fontWeight:700, borderRadius:4, padding:"1px 5px" }}>DEFAULT</span>}
                    </div>
                  </Td>
                  <Td><Mono small>···{m.last4}</Mono></Td>
                  <Td><span style={{ color:"#94a3b8", fontSize:12 }}>{m.holder}</span></Td>
                  <Td>
                    <span style={{ color: m.status==="expired" ? "#ef4444" : "#64748b", fontSize:11, fontFamily:"'JetBrains Mono',monospace" }}>{m.expiry}</span>
                  </Td>
                  <Td><StatusBadge s={m.status === "expired" ? "suspended" : "active"} /></Td>
                  <Td>
                    <div style={{ display:"flex", gap:5 }}>
                      {m.status === "active" && (
                        <ActBtn danger onClick={() => {
                          setMethods(prev => prev.map(x => x.id===m.id ? {...x, status:"blocked"} : x));
                          showToast(`Card ···${m.last4} blocked`, false);
                        }}>Block</ActBtn>
                      )}
                      {m.status !== "active" && (
                        <ActBtn success onClick={() => {
                          setMethods(prev => prev.map(x => x.id===m.id ? {...x, status:"active"} : x));
                          showToast(`Card ···${m.last4} reactivated`);
                        }}>Restore</ActBtn>
                      )}
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}
    </div>
  );
}
