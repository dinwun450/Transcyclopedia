import { transit } from "./envUnloader.jsx";

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

export function getAlertsFromAgency(agency) {
    var agencyAlertHandler = new XMLHttpRequest();
    agencyAlertHandler.open("GET", `https://transit.land/api/v2/rest/agencies?onestop_id=${agency}&api_key=${transit}&include_alerts=true`);
    agencyAlertHandler.send();
    agencyAlertHandler.onreadystatechange = function() {
        if (agencyAlertHandler.readyState === 4 && agencyAlertHandler.status === 200) {
            var agencyAlertOutput = JSON.parse(agencyAlertHandler.responseText).agencies[0].alerts;
            if (agencyAlertOutput.length === 0) {
                document.getElementById("alert_agency_entity").innerHTML = "No active alerts for this agency.";
            }
            else {
                for (var i = 0; i < agencyAlertOutput.length; i++) {
                    var header_text = agencyAlertOutput[i].header_text[0].text;
                    var description_text = agencyAlertOutput[i].description_text[0].text;

                    document.getElementById("alert_agency_entity").innerHTML = `
                        <span style="font-weight:bold; font-size:1.2em;">${header_text}</span><br />${description_text}
                    `;

                    var alertNode = document.getElementById("alert_agency_entity").cloneNode(true);
                    document.getElementById("all_agency_alerts").appendChild(alertNode);
                }

                var allAlerts = document.getElementById("all_agency_alerts").children;
                document.getElementById("all_agency_alerts").removeChild(allAlerts[0]);
            }
        }
    };
}

export function getRouteAlertsFromAgency(agency) {
    var routeAlertHandler = new XMLHttpRequest();
    routeAlertHandler.open("GET", `https://transit.land/api/v2/rest/routes?operator_onestop_id=${agency}&api_key=${transit}&include_alerts=true&limit=1200`);
    routeAlertHandler.send();
    routeAlertHandler.onreadystatechange = function() {
        if (routeAlertHandler.readyState === 4 && routeAlertHandler.status === 200) {
            var routeAlertOutput = JSON.parse(routeAlertHandler.responseText).routes;
            // dedupe by route + header + description
            const seenRouteAlerts = new Set();
            for (var i = 0; i < routeAlertOutput.length; i++) {
                var route_alerts = routeAlertOutput[i].alerts;
                if (!route_alerts || route_alerts.length === 0) continue;

                for (var j = 0; j < route_alerts.length; j++) {
                    var route_header_text = route_alerts[j].header_text && route_alerts[j].header_text[0] ? route_alerts[j].header_text[0].text : "";
                    var route_description_text_base = route_alerts[j].description_text || [];
                    var route_description_text = route_description_text_base.length > 0 && route_description_text_base[0] ? route_description_text_base[0].text : "";
                    var route_color = routeAlertOutput[i].route_color;
                    var route_text_color = routeAlertOutput[i].route_text_color;
                    var route_short_name = routeAlertOutput[i].route_short_name || "&nbsp;&nbsp;&nbsp;";

                    var key = `${route_short_name}||${route_header_text}||${route_description_text}`;
                    if (seenRouteAlerts.has(key)) continue;
                    seenRouteAlerts.add(key);

                    document.getElementById("alert_routes_entity").innerHTML = `
                        <span class="styling_for_routes" id="route_affected"></span><br /><span style="font-weight:bold; font-size:1.2em;">${route_header_text}</span><br />${route_description_text}
                    `;
                    document.getElementById("route_affected").innerHTML = route_short_name;
                    fillInRoutes(route_short_name, route_color, route_text_color, "route_affected");

                    var routeAlertNode = document.getElementById("alert_routes_entity").cloneNode(true);
                    document.getElementById("all_route_alerts").appendChild(routeAlertNode);
                }
            }

            if (document.getElementById("all_route_alerts").children.length === 1) {
                document.getElementById("alert_routes_entity").innerHTML = "No active route alerts for all routes.";
            }
        }
    };
}

export function getLocationForAlerts() {
    document.getElementById("all_agency_alerts").innerHTML = `<li id="alert_agency_entity" class="glassmorphic-without-boxshadow tenpx-radius"><p>Loading...</p></li>`;
    document.getElementById("all_route_alerts").innerHTML = `<li id="alert_routes_entity" class="glassmorphic-without-boxshadow tenpx-radius"><p>Loading...</p></li>`;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPositionForAlertsAgencies);
        navigator.geolocation.getCurrentPosition(showPositionForAlertsRoutes);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPositionForAlertsAgencies(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    var positionAlertFetcher = new XMLHttpRequest();
    
    positionAlertFetcher.open("GET", `https://transit.land/api/v2/rest/agencies?lat=${lat}&lon=${lon}&radius=500&api_key=${transit}&include_alerts=true`);
    positionAlertFetcher.send();
    positionAlertFetcher.onreadystatechange = function() {
        if (positionAlertFetcher.readyState === 4 && positionAlertFetcher.status === 200) {
            var positionAlertOutput = JSON.parse(positionAlertFetcher.responseText).agencies;
            for (var i = 0; i < positionAlertOutput.length; i++) {
                if (positionAlertOutput[i].alerts.length === 0) {
                    continue;
                }
                else {
                    for (var j = 0; j < positionAlertOutput[i].alerts.length; j++) {
                        var header_text = positionAlertOutput[i].alerts[j].header_text[0].text;
                        var description_text = positionAlertOutput[i].alerts[j].description_text[0].text;

                        document.getElementById("alert_agency_entity").innerHTML = `
                            <span style="font-weight:bold; font-size:1.2em;">${header_text}</span><br />${description_text}
                        `;
                    }

                    var alertNode = document.getElementById("alert_agency_entity").cloneNode(true);
                    document.getElementById("all_agency_alerts").appendChild(alertNode);
                }
            }

            var allAlerts = document.getElementById("all_agency_alerts").children;
            document.getElementById("all_agency_alerts").removeChild(allAlerts[0]);
        }
    };
}

function showPositionForAlertsRoutes(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    var positionRouteAlertFetcher = new XMLHttpRequest();

    positionRouteAlertFetcher.open("GET", `https://transit.land/api/v2/rest/routes?lat=${lat}&lon=${lon}&radius=500&api_key=${transit}&include_alerts=true&limit=700`);
    positionRouteAlertFetcher.send();
    positionRouteAlertFetcher.onreadystatechange = function() {
        if (positionRouteAlertFetcher.readyState === 4 && positionRouteAlertFetcher.status === 200) {
             var routeAlertOutput = JSON.parse(positionRouteAlertFetcher.responseText).routes;
            for (var i = 0; i < routeAlertOutput.length; i++) {
                var route_alerts = routeAlertOutput[i].alerts;
                if (route_alerts && route_alerts.length > 0) {
                    for (var j = 0; j < route_alerts.length; j++) {
                        var route_header_text = route_alerts[j].header_text[0].text;
                        var route_description_text = route_alerts[j].description_text[0].text;
                        var route_color = routeAlertOutput[i].route_color;
                        var route_text_color = routeAlertOutput[i].route_text_color;
                        var route_short_name = routeAlertOutput[i].route_short_name;

                        document.getElementById("alert_routes_entity").innerHTML = `
                            <span class="styling_for_routes" id="route_affected"></span><br /><span style="font-weight:bold; font-size:1.2em;">${route_header_text}</span><br />${route_description_text}
                        `;
                        document.getElementById("route_affected").innerHTML = route_short_name;
                        fillInRoutes(route_short_name, route_color, route_text_color, "route_affected");

                        var routeAlertNode = document.getElementById("alert_routes_entity").cloneNode(true);
                        document.getElementById("all_route_alerts").appendChild(routeAlertNode);
                    }

                    var allRouteAlerts = document.getElementById("all_route_alerts").children;
                    document.getElementById("all_route_alerts").removeChild(allRouteAlerts[0]);
                }
            }

            if (document.getElementById("all_route_alerts").children.length === 1) {
                document.getElementById("alert_routes_entity").innerHTML = "No active route alerts for all routes.";
            }
        }
    };
}