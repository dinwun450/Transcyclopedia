import { transit } from "./envUnloader.jsx";

const transitIcons = {
    0: '<i class="fa-solid fa-train-tram"></i>',
    1: '<i class="fa-solid fa-train-subway"></i>',
    2: '<i class="fa-solid fa-train"></i>',
    3: '<i class="fa-solid fa-bus"></i>',
    4: '<i class="fa-solid fa-ferry"></i>',
    5: '<i class="fa-solid fa-cable-car"></i>',
    6: '<i class="fa-solid fa-cable-car"></i>',
    7: '<i class="fa-solid fa-cable-car"></i>',
    11: '<i class="fa-solid fa-bus"></i>',
    12: '<i class="fa-solid fa-train"></i>'
}

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

function getDeparturesForStop(onestop_id, container) {
    // container: DOM element representing the specific stop node (fallbacks to document)
    if (!container) container = document;

    var departures_call = new XMLHttpRequest();
    departures_call.open("GET", `https://transit.land/api/v2/rest/stops/${onestop_id}/departures?api_key=${transit}`);
    departures_call.send();
    departures_call.onreadystatechange = function() {
        if (departures_call.readyState === 4 && departures_call.status === 200) {
            var departures_output = JSON.parse(departures_call.responseText);

            var descEl = container.querySelector('#desc_departures');
            var timeEl = container.querySelector('#departuretime');
            var listEl = container.querySelector('.alldepartures');
            var departureTemplate = container.querySelector('.departure');

            if (!descEl || !timeEl || !listEl || !departureTemplate) {
                return;
            }

            if (departures_output.stops[0].departures.length === 0) {
                descEl.innerHTML = "No upcoming departures.";
                timeEl.innerHTML = "";
            }
            else {
                for (var i = 0; i < departures_output.stops[0].departures.length; i++) {
                    var headsign = departures_output.stops[0].departures[i].trip.trip_headsign;
                    var route_short_name = departures_output.stops[0].departures[i].trip.route.route_short_name;
                    var route_color = departures_output.stops[0].departures[i].trip.route.route_color;
                    var route_text_color = departures_output.stops[0].departures[i].trip.route.route_text_color;

                    // clone per-stop departure node and fill scoped fields
                    var departureNode = departureTemplate.cloneNode(true);

                    var routeEl = departureNode.querySelector('.styling_for_routes');
                    if (routeEl) {
                        routeEl.innerHTML = route_short_name || '&nbsp;&nbsp;&nbsp;';
                        if (route_color) routeEl.style.backgroundColor = `#${route_color}40`;
                        if (route_color) routeEl.style.borderColor = `#${route_color}`;
                        if (route_text_color) routeEl.style.color = `#${route_text_color}`;
                    }

                    var descInNode = departureNode.querySelector('#desc_departures');
                    if (descInNode) descInNode.innerHTML = headsign || '';

                    var timeInNode = departureNode.querySelector('#departuretime');
                    if (timeInNode) {
                        var dep = departures_output.stops[0].departures[i];
                        try {
                            var timeStr = '';
                            // check common locations for scheduled/estimated times
                            if (dep.departure) {
                                if (dep.departure.estimated) timeStr = dep.departure.estimated;
                                else if (dep.departure.scheduled) timeStr = dep.departure.scheduled;
                                else if (dep.departure.departure_time) timeStr = dep.departure.departure_time;
                            }
                            if (!timeStr) {
                                if (dep.estimated) timeStr = dep.estimated;
                                else if (dep.scheduled) timeStr = dep.scheduled;
                                else if (dep.departure_time) timeStr = dep.departure_time;
                            }
                            if (!timeStr) timeStr = 'TBD';
                            // format ISO timestamps to local HH:MM where possible
                            var formatted = timeStr;
                            var parsed = Date.parse(timeStr);
                            if (!isNaN(parsed)) {
                                var dt = new Date(parsed);
                                formatted = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            }
                            timeInNode.innerHTML = formatted;
                            var isEstimated = Boolean((dep.departure && dep.departure.estimated) || dep.estimated);
                            timeInNode.style.color = isEstimated ? '#007700' : '#000000';
                        } catch (e) {
                            timeInNode.innerHTML = '';
                        }
                    }

                    listEl.appendChild(departureNode);
                }

                // remove the placeholder first child if present
                var departuresAll = listEl.children;
                if (departuresAll.length > 0) listEl.removeChild(departuresAll[0]);
            }
        }
    }
}

export function getTransitRoutes(position) {
    var transit_call = new XMLHttpRequest();
    transit_call.open("GET", `https://transit.land/api/v2/rest/routes?api_key=${transit}&lat=${position.coords.latitude}&lon=${position.coords.longitude}&radius=500`);
    transit_call.send();
    transit_call.onreadystatechange = function() {
        if (transit_call.readyState === 4 && transit_call.status === 200) {
            var transit_output = JSON.parse(transit_call.responseText);
            if (transit_output.routes.length === 0) {
                document.getElementById("route_entity").innerHTML = "No routes nearby."
            }
            else {
                for (var i = 0; i < transit_output.routes.length; i++) {
                    var route_short_name = transit_output.routes[i].route_short_name;
                    var route_long_name = transit_output.routes[i].route_long_name;
                    var route_color = transit_output.routes[i].route_color;
                    var route_text_color = transit_output.routes[i].route_text_color;
                    var route_type = transit_output.routes[i].route_type;
                    var agency_name = transit_output.routes[i].agency.agency_name;

                    fillInRoutes(route_short_name, route_color, route_text_color);
                    document.getElementById("routeType").innerHTML = transitIcons[route_type] + "";
                    document.getElementById("description").innerHTML = route_long_name;
                    document.getElementById("agencyfortransitroute").innerHTML = agency_name;

                    var routeNode = document.getElementById("route_entity").cloneNode(true);
                    document.querySelector(".routes_near_you").appendChild(routeNode);
                }

                var linesAll = document.querySelector(".routes_near_you").children;
                document.querySelector(".routes_near_you").removeChild(linesAll[0]);
            }
        }
    }
}

export function getTransitAgencies(position) {
    var agency_call = new XMLHttpRequest();
    agency_call.open("GET", `https://transit.land/api/v2/rest/agencies?api_key=${transit}&lat=${position.coords.latitude}&lon=${position.coords.longitude}&radius=500`);
    agency_call.send();
    agency_call.onreadystatechange = function() {
        if (agency_call.readyState === 4 && agency_call.status === 200) {
            var agency_output = JSON.parse(agency_call.responseText);
            if (agency_output.agencies.length === 0) {
                document.getElementById("agency_entity").innerHTML = "No agencies nearby."
            }
            else {
                for (var i = 0; i < agency_output.agencies.length; i++) {
                    var agency_name = agency_output.agencies[i].agency_name;
                    var agency_url = agency_output.agencies[i].agency_url;
                    var agency_email = agency_output.agencies[i].agency_email;
                    var agency_phone = agency_output.agencies[i].agency_phone;

                    if (agency_phone === null) {
                        agency_phone = "-";
                    }

                    if (agency_email === null) {
                        agency_email = "-";
                    }

                    if (agency_url === null) {
                        agency_url = "-";
                    }
                    
                    document.getElementById("agencyname").innerHTML = agency_name;
                    document.getElementById("website").innerHTML = `Website: ${agency_url}`;
                    document.getElementById("email").innerHTML = `Email: ${agency_email}`;
                    document.getElementById("phone").innerHTML = `Phone: ${agency_phone}`;

                    var agencyNode = document.getElementById("agency_entity").cloneNode(true);
                    document.querySelector(".agencies_near_you").appendChild(agencyNode);
                }

                var agenciesAll = document.querySelector(".agencies_near_you").children;
                document.querySelector(".agencies_near_you").removeChild(agenciesAll[0]);
            }
        }
    }
}

export function getTransitStops(position) {
    var stop_call = new XMLHttpRequest();
    stop_call.open("GET", `https://transit.land/api/v2/rest/stops?api_key=${transit}&lat=${position.coords.latitude}&lon=${position.coords.longitude}&radius=500`);
    stop_call.send();
    stop_call.onreadystatechange = function() {
        if (stop_call.readyState === 4 && stop_call.status === 200) {
            var stop_output = JSON.parse(stop_call.responseText);
            if (stop_output.stops.length === 0) {
                document.getElementById("stop_entity").innerHTML = "No stops nearby."
            }
            else {
                for (var i = 0; i < stop_output.stops.length; i++) {
                    var stop_name = stop_output.stops[i].stop_name;
                    var stop_code = stop_output.stops[i].stop_code;
                    var onestop_id = stop_output.stops[i].onestop_id;

                    // clone the stop node first, then populate it and request departures scoped to it
                    var stopNode = document.querySelector(".a_departure").cloneNode(true);
                    // populate cloned node
                    var stopNameEl = stopNode.querySelector('#stopname');
                    if (stopNameEl) stopNameEl.innerHTML = stop_name;
                    var stopIdEl = stopNode.querySelector('#stopid');
                    if (stopIdEl) stopIdEl.innerHTML = `Stop ID: ${stop_code}`;

                    document.querySelector(".stops_near_you").appendChild(stopNode);
                    // request departures for this stop and scope DOM updates to the cloned node
                    getDeparturesForStop(onestop_id, stopNode);
                }

                var stopsAll = document.querySelector(".stops_near_you").children;
                document.querySelector(".stops_near_you").removeChild(stopsAll[0]);
            }
        }
    }
}