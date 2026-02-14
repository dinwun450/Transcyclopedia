import React, { useState } from "react";
import { transit } from './envUnloader.jsx';

function fillInRoutes(rsn, rc, rtc, insId="route") {
    if (rsn === null) {
        rsn = "&nbsp;&nbsp;&nbsp;";
    }

    if (rc === null) {
        rc = "333333";
    }

    if (rtc === null) {
        rtc = "FFFFFF";
    }

    document.getElementById(insId).innerHTML = rsn;
    document.getElementById(insId).style.backgroundColor = `#${rc}40`;
    document.getElementById(insId).style.borderColor = `#${rc}`;
    document.getElementById(insId).style.color = `#${rtc}`;
}

export default function AgencyDepartures() {
    const [query, setQuery] = useState("");
    const [agencies, setAgencies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function fetchAgencies(q) {
        if (!q || !q.trim()) {
            setAgencies([]);
            return;
        }
        setLoading(true);
        setError(null);
        setAgencies([]);
        try {
            const res = await fetch(
                `https://transit.land/api/v2/rest/agencies?search=${encodeURIComponent(
                    q
                )}&include_alerts=true&api_key=${transit}`
            );
            if (!res.ok) throw new Error(res.statusText || "Network error");
            const json = await res.json();
            setAgencies(json.agencies || []);
        } catch (err) {
            setError(err.message || "Failed to fetch");
        } finally {
            setLoading(false);
        }
    }

    function onKeyDown(e) {
        if (e.key === "Enter") fetchAgencies(query);
    }

    return (
        <div>
            <label htmlFor="agency-search">Search agencies</label>
            <input
                id="agency-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Type name or operator and press Enter"
            />
            <button onClick={() => fetchAgencies(query)}>Search</button>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <ul id="descofagencies" style={{ listStyle: "none", padding: 0 }}>
                {agencies.map((a, idx) => {
                    const name = a.agency_name || "Unknown";
                    return (
                        <li key={a.onestop_id || idx}>
                            {name}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

// --- Reusable API + handler for Option A ---
export async function fetchAgenciesApi(q) {
    if (!q || !q.trim()) return [];
    const res = await fetch(
        `https://transit.land/api/v2/rest/agencies?search=${encodeURIComponent(
            q
        )}&include_alerts=true&api_key=${transit}`
    );
    if (!res.ok) throw new Error(res.statusText || "Network error");
    const json = await res.json();
    return json.agencies || [];
}

// Returns an `onKeyDown` handler that calls `fetchFn` and forwards results to `onResult`
export function makeAgencyKeyDownHandler(fetchFn, onResult) {
    return async function (e) {
        if (e.key !== 'Enter') return;
        const q = e.target.value;
        try {
            const agencies = await fetchFn(q);
            if (typeof onResult === 'function') onResult(agencies, null);
        } catch (err) {
            if (typeof onResult === 'function') onResult(null, err);
        }
    };
}

function getDeparturesByAgencyAndStopFinal(onestopIdForDepartures) {
    var departuresFinalHandler = new XMLHttpRequest();
    departuresFinalHandler.open("GET", `https://transit.land/api/v2/rest/stops/${onestopIdForDepartures}/departures?api_key=${transit}&include_alerts=true`);
    departuresFinalHandler.send();
    departuresFinalHandler.onreadystatechange = function() {
        if (departuresFinalHandler.readyState === 4 && departuresFinalHandler.status === 200) {
            var departuresFinalOutput = JSON.parse(departuresFinalHandler.responseText);
            var stops = departuresFinalOutput.stops || [];

            // collect departures from all stops
            var combined = [];
            for (var s = 0; s < stops.length; s++) {
                var stop = stops[s];
                if (!stop || !Array.isArray(stop.departures)) continue;
                for (var d = 0; d < stop.departures.length; d++) {
                    var dep = stop.departures[d];
                    var departureObj = dep.departure || null;
                    var timeStr = null;
                    var timeUTC = null;
                    if (departureObj) {
                        timeStr = departureObj.estimated || departureObj.scheduled || null;
                        timeUTC = departureObj.estimated_utc || departureObj.scheduled_utc || null;
                    }
                    var timeMs = timeStr ? Date.parse(timeStr) : NaN;
                    combined.push({ stop: stop, dep: dep, timeStr: timeStr, timeMs: timeMs, timeUTC: timeUTC } );
                }
            }

            // if nothing collected, show message
            if (combined.length === 0) {
                document.getElementById("depart_time").innerHTML = "No upcoming departures found.";
                return;
            }
            combined.sort((a, b) => new Date(a.timeUTC) - new Date(b.timeUTC));

            // render combined departures
            for (var i = 0; i < combined.length; i++) {
                var item = combined[i];
                var dep = item.dep;
                var route_headsign = (dep.trip && dep.trip.trip_headsign) || "";
                var route_text_color = (dep.trip && dep.trip.route && dep.trip.route.route_text_color) || null;
                var route_color = (dep.trip && dep.trip.route && dep.trip.route.route_color) || null;
                var route_short_name = (dep.trip && dep.trip.route && dep.trip.route.route_short_name) || null;
                var displayTime = item.timeStr || "";

                if (item.timeStr && (dep.departure && dep.departure.estimated !== null)) {
                    document.getElementById("depart_time").style.color = "#007700";
                } else {
                    document.getElementById("depart_time").style.color = "#000000";
                }

                fillInRoutes(route_short_name, route_color, route_text_color, "lod");
                document.getElementById("depart_time").innerHTML = displayTime;
                document.getElementById("hod").innerHTML = route_headsign;

                var alertsLength = (dep.trip && dep.trip.route && Array.isArray(dep.trip.route.alerts)) ? dep.trip.route.alerts.length : 0;
                if (alertsLength > 0) {
                    document.getElementById("aor").innerHTML = `(<i class="fa-solid fa-triangle-exclamation alert_triangle"></i> ${alertsLength})`;
                    var tri = document.querySelector(".alert_triangle");
                    if (tri) tri.style.color = "#FFD580";
                } else {
                    document.getElementById("aor").innerHTML = "";
                }

                var departureCloner = document.getElementById("line_for_departure").cloneNode(true);
                document.getElementById("list_of_departures").appendChild(departureCloner);
            }

            var allDepartures = document.getElementById("list_of_departures").children;
            if (allDepartures && allDepartures.length > 0) {
                document.getElementById("list_of_departures").removeChild(allDepartures[0]);
            }
        }
    };
}

export function getDeparturesByAgencyAndStop(agencyOnestopId, stopId) {
    var departuresBaseHandler = new XMLHttpRequest();
    departuresBaseHandler.open("GET", `https://transit.land/api/v2/rest/stops?served_by_onestop_ids=${agencyOnestopId}&stop_id=${stopId}&api_key=${transit}`);
    departuresBaseHandler.send();
    departuresBaseHandler.onreadystatechange = function() {
        if (departuresBaseHandler.readyState === 4 && departuresBaseHandler.status === 200) {
            var departuresBaseOutput = JSON.parse(departuresBaseHandler.responseText);
            var stopName = departuresBaseOutput.stops[0].stop_name;
            var onestopIdForDepartures = departuresBaseOutput.stops[0].onestop_id;

            document.getElementById("stopname").innerHTML = stopName;
            getDeparturesByAgencyAndStopFinal(onestopIdForDepartures);
        }
    };
}