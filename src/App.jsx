import React, { useState, useEffect, useRef } from "react";
import AdminApp from "./Admin";

// ─── SUPABASE ─────────────────────────────────────────────────────────────────
import { createClient } from "@supabase/supabase-js";
const SUPABASE_URL  = "https://bkbpsobvhxxvlzlmzsmy.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrYnBzb2J2aHh4dmx6bG16c215Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0NzQ4MTUsImV4cCI6MjA4OTA1MDgxNX0.PLJyaouYk4FLfcZwVy_YsKMmny2a6DqrYOn_3jmpgMI";
const db = createClient(SUPABASE_URL, SUPABASE_ANON);

// ─── LIVE SETTINGS READER ─────────────────────────────────────────────────────
// Reads from admin bridge (live), then localStorage (persisted), then default
function getLive(key, defaultVal) {
  try {
    const bridge = window.__zeezAdmin;
    if (bridge) {
      if (key === "baseFare"        && bridge.getBaseFare)        return parseFloat(bridge.getBaseFare())        || defaultVal;
      if (key === "ratePerKm"       && bridge.getRatePerKm)       return parseFloat(bridge.getRatePerKm())       || defaultVal;
      if (key === "ratePerMin"      && bridge.getRatePerMin)      return parseFloat(bridge.getRatePerMin())      || defaultVal;
      if (key === "minimumFare"     && bridge.getMinimumFare)     return parseFloat(bridge.getMinimumFare())     || defaultVal;
      if (key === "commPct"         && bridge.getCommPct)         return parseFloat(bridge.getCommPct())         || defaultVal;
      if (key === "subFee"          && bridge.getSubFee)          return parseFloat(bridge.getSubFee())          || defaultVal;
      if (key === "airportFareYYZ"  && bridge.getAirportFare)     return parseFloat(bridge.getAirportFare("yyz"))|| defaultVal;
      if (key === "airportFareYHM"  && bridge.getAirportFare)     return parseFloat(bridge.getAirportFare("yhm"))|| defaultVal;
      if (key === "airportFareYTZ"  && bridge.getAirportFare)     return parseFloat(bridge.getAirportFare("ytz"))|| defaultVal;
      if (key === "shuttleBaseFare" && bridge.getShuttleBaseFare) return parseFloat(bridge.getShuttleBaseFare()) || defaultVal;
      if (key === "surgeEnabled"    && bridge.getSurgeEnabled)    return bridge.getSurgeEnabled();
    }
  } catch(e) {}
  try {
    const saved = JSON.parse(localStorage.getItem("zeez_settings") || "{}");
    if (saved[key] !== undefined) return typeof defaultVal === "number" ? parseFloat(saved[key]) || defaultVal : saved[key];
  } catch(e) {}
  return defaultVal;
}

function getLiveAirportFare(code) {
