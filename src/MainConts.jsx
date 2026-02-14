import { useState, useEffect } from 'react'
import { useRef } from 'react'

import './styles/MainConts.css'
import './styles/Navbar.css'
import './styles/InterfaceMaterials.css'
import './styles/Scrollbars.css'
import './styles/Responsive.css'
import './styles/lightDarkMode.css'

import Navbar from './Navbar.jsx'
import * as TimeAndWeather from './scripts/timeandweather.jsx'
import { getTransitAgencies, getTransitRoutes, getTransitStops } from './scripts/Overview.jsx'
import { keyDownAgency } from './scripts/Agency.jsx'
import { makeAgencyKeyDownHandler, fetchAgenciesApi, getDeparturesByAgencyAndStop } from './scripts/Departures.jsx';
import { getAlertsFromAgency, getRouteAlertsFromAgency, getLocationForAlerts } from './scripts/AllAlerts.jsx';
import { getLocation } from './scripts/InteractiveMap.jsx'
import { updateSize } from './scripts/Responsiveness.jsx'

/* Open the sidenav */
export function openNav() {
    const el = document.querySelector(".left_navbar");
    const hb = document.querySelector('.hamburger');
    if (el) {
        el.style.display = "block";
        el.setAttribute('aria-hidden', 'false');
        // focus first tabbable item for accessibility
        const first = el.querySelector('.tablinks');
        if (first && typeof first.focus === 'function') first.focus();
    }
    if (hb) {
        hb.style.display = 'none';
        hb.setAttribute('aria-hidden', 'true');
    }
}

/* Close/hide the sidenav */
export function closeNav() {
    const el = document.querySelector(".left_navbar");
    const hb = document.querySelector('.hamburger');
    if (el) {
        el.style.display = "none";
        el.setAttribute('aria-hidden', 'true');
    }
    if (hb) {
        hb.style.display = '';
        hb.setAttribute('aria-hidden', 'false');
        if (typeof hb.focus === 'function') hb.focus();
    }
}

function OverView() {
    return (
        <div className="window full-width-height" id="overview">
            <div className="gridoverview full-width-height">
                <div className="routes glassmorphic tenpx-radius">
                    <div className="allcover light_mode">
                        <h2>Routes Nearby</h2>
                    </div>
                    <hr />
                    <ul className="routes_near_you full-width-height">
                        <li id="route_entity" className="glassmorphic tenpx-radius">
                            <div className="route_and_info">
                                <p id="route_info">
                                    <span id="routeType"></span>
                                    <span id="route" className="styling_for_routes">-</span>
                                    <span id="description">Loading...</span>
                                </p>
                            </div>
                            <div id="agencyfortransitroute"></div>
                        </li>
                    </ul>
                </div>
                <div className="stops glassmorphic tenpx-radius">
                    <div className="allcover light_mode">
                        <h2>Stops Nearby</h2>
                    </div>
                    <hr />
                    <ul className="stops_near_you full-width-height">
                        <li className="a_departure glassmorphic tenpx-radius">
                            <div className="stop_header">
                                <span id="stopname">Loading Stops...</span>
                                <button className="accordion-toggle" aria-expanded="false" aria-label="Toggle departures">▾</button>
                            </div>
                            <hr />
                            <div className="alldepartures">
                                <p className="departure">
                                    <span id="routeDeparture" className="styling_for_routes">-</span>
                                    <span id="desc_departures">Loading Departures...</span>
                                    <span id="departuretime">Please wait...</span>
                                </p>
                            </div>
                            <hr />
                            <span id="stopid">Stop ID: -</span>
                        </li>
                    </ul>
                </div>
                <div className="agencies glassmorphic tenpx-radius">
                    <div className="allcover light_mode">
                        <h2>Agencies Nearby</h2>
                    </div>
                    <hr />
                    <ul className="agencies_near_you full-width-height">
                        <li id="agency_entity" className="glassmorphic tenpx-radius">
                            <span id="agencyname">Loading Agencies...</span>
                            <hr />
                            <p className="agency_info">
                                <span id="website">Website: -</span><br />
                                <span id="email">Email: -</span><br />
                                <span id="phone">Phone: -</span>
                            </p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

function Agency() {
    return (
        <div className="window full-width-height" id="agency">
            <input type="text" placeholder="Search for a transit agency..." id="agencygetter" className="searchbars" autoComplete="off" onKeyDown={keyDownAgency} />
            <ul id="descofagencies">
                <li id="each_agency_desc" className="glassmorphic tenpx-radius">
                    <h2 id="name_of_agency">Once you search for some agencies, it'll appear here.</h2>
                    <hr style={{marginTop: '5px', marginBottom: '10px'}}/>
                    <p id="desc_of_agency">
                        <span style={{display: 'inline-block', width: '48%', verticalAlign: 'top'}}>
                            <strong>Phone:</strong> <span id="agency_phone">-</span><br />
                            <strong>Email:</strong> <span id="agency_email">-</span>
                        </span>
                        <span style={{display: 'inline-block', width: '48%', textAlign: 'left', verticalAlign: 'top'}}>
                            <strong>Site:</strong> <a id="agency_website" href="#" target="_blank">-</a><br />
                            <strong>Timezone:</strong> <span id="agency_timezone">-</span>
                        </span>
                    </p>
                    <hr style={{marginTop: '10px'}} />
                </li>
            </ul>
        </div>
    );
}

function Departures() {
    return (
        <div className="window full-width-height" id="departures">
            <div className="alltogether">
                <div className="agencyspecifier">
                    <label htmlFor="departuredate">Agency:</label>
                    <input
                        type="text"
                        placeholder="Search for a transit agency..."
                        id="agencygetter_departures"
                        className="searchbars"
                        autoComplete="off"
                        onKeyDown={makeAgencyKeyDownHandler(fetchAgenciesApi, (agencies, err) => {
                            const container = document.getElementById('descofagencies_departures');
                            console.log(agencies, err);
                            if (!container) return;
                            // hide while populating
                            container.style.display = 'none';
                            container.innerHTML = '';
                            if (err) {
                                const li = document.createElement('li');
                                li.textContent = 'Error: ' + (err.message || err);
                                container.appendChild(li);
                                container.style.display = 'block';
                                return;
                            }
                            if (!agencies || agencies.length === 0) {
                                // keep hidden when there are no results
                                return;
                            }
                            // we have results — show the list
                            container.style.display = 'block';
                            agencies.forEach(a => {
                                const li = document.createElement('li');
                                li.textContent = a.agency_name || 'Unknown';
                                li.tabIndex = 0; // make focusable for keyboard
                                li.style.cursor = 'pointer';
                                // click shows a simple alert with agency details
                                li.addEventListener('click', () => {
                                    document.getElementById('stopname').innerHTML = '---';
                                    document.getElementById('list_of_departures').innerHTML = `
                                        <li id="line_for_departure" class="lod_styling"><div id="lod" class="styling_for_routes symbol_tagged">-</div> <span id="aor"></span> <span id="hod" class="route_headsigns">Loading...</span><span id="depart_time" class="departure_times">Please wait...</span></li>
                                    `;
                                    // alert('Onestop ID: ' + (a.onestop_id || '-') + '\nValue of Stop ID: ' + document.getElementById('stopgetter').value.trim());
                                    getDeparturesByAgencyAndStop(a.onestop_id, document.getElementById('stopgetter').value.trim());
                                });
                                // keyboard support: Enter or Space triggers click
                                li.addEventListener('keydown', (ke) => {
                                    if (ke.key === 'Enter' || ke.key === ' ') {
                                        ke.preventDefault();
                                        li.click();
                                    }
                                });
                                container.appendChild(li);
                            });
                        })}
                    />
                        <ul id="descofagencies_departures" className="descofagenciesdepartures" />
                </div>
                <div class="stopspecifier">
                    <label for="locationtofind">Stop ID:</label>
                    <input type="text" placeholder="Search for a stop..." onkeydown="" id="stopgetter" class="searchbars" autocomplete="off" />
                </div>
            </div>
            <p class="headerforstop glassmorphic">Departures for: &nbsp; <span id="stopname">---</span></p>
            <ul id="list_of_departures" class="scroller_departures individual_departure glassmorphic">
                <li id="line_for_departure" class="lod_styling"><div id="lod" class="styling_for_routes symbol_tagged">-</div> <span id="aor"></span> <span id="hod" class="route_headsigns">(None)</span><span id="depart_time" class="departure_times">Enter an agency and then a stop by their stop ID</span></li>
            </ul>
        </div>
    );
}

function Alerts() {
    return (
         <div class="window full-width-height" id="alerts">
            <div class="alltogether">
                <input 
                    type="text" 
                    placeholder="Search for a transit agency..."
                    id="agencygetter_alerts" 
                    class="searchbars"
                    onKeyDown={makeAgencyKeyDownHandler(fetchAgenciesApi, (agencies, err) => {
                            const container = document.getElementById('descofagencies_alerts');
                            console.log(agencies, err);
                            if (!container) return;
                            container.style.display = 'none';
                            container.innerHTML = '';
                            if (err) {
                                const li = document.createElement('li');
                                li.textContent = 'Error: ' + (err.message || err);
                                container.appendChild(li);
                                container.style.display = 'block';
                                return;
                            }
                            if (!agencies || agencies.length === 0) {
                                // keep hidden when nothing matches
                                return;
                            }
                            container.style.display = 'block';
                            agencies.forEach(a => {
                                const li = document.createElement('li');
                                li.textContent = a.agency_name || 'Unknown';
                                li.tabIndex = 0; // make focusable for keyboard
                                li.style.cursor = 'pointer';
                                // click shows a simple alert with agency details
                                li.addEventListener('click', () => {
                                    document.getElementById("all_agency_alerts").innerHTML = `<li id="alert_agency_entity" class="glassmorphic-without-boxshadow tenpx-radius"><p>Loading...</p></li>`;
                                    document.getElementById("all_route_alerts").innerHTML = `<li id="alert_routes_entity" class="glassmorphic-without-boxshadow tenpx-radius"><p>Loading...</p></li>`;

                                    getAlertsFromAgency(a.onestop_id);
                                    getRouteAlertsFromAgency(a.onestop_id);
                                });
                                // keyboard support: Enter or Space triggers click
                                li.addEventListener('keydown', (ke) => {
                                    if (ke.key === 'Enter' || ke.key === ' ') {
                                        ke.preventDefault();
                                        li.click();
                                    }
                                });
                                container.appendChild(li);
                            });
                        })} 
                    autocomplete="off" />
                <button id="getCurrentLocation" className="glassmorphic-without-boxshadow" onClick={getLocationForAlerts}>Get Location</button>
            </div>
            <ul id="descofagencies_alerts" className="descofagenciesalerts" />
            <div class="alert_entity_agency alert_section_agency glassmorphic-without-boxshadow tenpx-radius">
                <h3>Agency</h3>
                <ul id="all_agency_alerts">
                    <li id="alert_agency_entity" className="glassmorphic-without-boxshadow tenpx-radius"><p>Type and search an agency name or get location to see alerts.</p></li>
                </ul>
            </div>
            <div class="alert_entity_routes alert_section_lines glassmorphic-without-boxshadow tenpx-radius">
                <div className="allcoveralerts light_mode">
                    <h3>Routes</h3>
                </div>
                <ul id="all_route_alerts">
                    <li id="alert_routes_entity" className="glassmorphic-without-boxshadow tenpx-radius"><p>Type and search an agency name or get location to see route alerts.</p></li>
                </ul>
            </div>
        </div>
    );
}


function Map() {
    useEffect(() => {
        // initialize map and locate user when this component mounts
        getLocation();
    }, []);

    return (
        <div className="window full-width-height" id="intermap">
            <div id="map"></div>
            <ul id="range_of_routes" className="glassmorphic-without-boxshadow tenpx-radius">
                <li id="rir" className="route_radius flexer"><span id="route_name_rad" className="styling_for_routes symbol_tagged">-</span> <span id="route_detail_rad">Drag the map to filter nearby routes.</span></li>
            </ul>
            <p>*The map might come out of size, resizing the window or rotating your mobile device can help.</p>
        </div>
    );
}

function About() {
    return (
        <div className="window full-width-height" id="about">
            <p className="about_text glassmorphic tenpx-radius">
                Transcyclopedia is a comprehensive web application that provides detailed transit information for major cities across the United States and possibly elsewhere. 
                Created by Dino Wun, Transcyclopedia reflects the passion of implementing transit into websites for everyone to use, no matter where they'll head to.
                Within ferries, buses, trains, and subways, Transcyclopedia aims to provide users lines, departures, service alerts, and interactive map to track where they're heading to.
                Transcyclopedia is free to use and is open-source on GitHub, although you need a Mapbox, OpenWeatherMap, and Transitland API key.
            </p>
            <div className="socials glassmorphic tenpx-radius">
                <h2>My Socials:</h2>
                <a href="https://github.com/dinwun450"><i className="fab fa-github"></i></a>
                <a href="https://www.linkedin.com/in/dinowun"><i className="fab fa-linkedin"></i></a>
                <a href="https://www.facebook.com/dino.wun.5/"><i className="fab fa-facebook"></i></a>
                <a href="https://www.instagram.com/dinwun450/"><i className="fab fa-instagram"></i></a>
            </div>
        </div>
    );
}

function switchWindows(tabName) {
    if (tabName === "overview") return <OverView />;
    if (tabName === "agency") return <Agency />;
    if (tabName === "departures") return <Departures />;
    if (tabName === "alerts") return <Alerts />;
    if (tabName === "intermap") return <Map />;
    if (tabName === "about") return <About />;
}

export function openTab(evt, tabName, setActiveTab) {
    if (typeof setActiveTab === 'function') setActiveTab(tabName);
    switchWindows(tabName);

    // keep tab button active class behavior if you still use DOM tab buttons
    const tablinks = document.getElementsByClassName("tablinks");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }
    if (evt && evt.currentTarget) evt.currentTarget.classList.add("active");
}

export default function MainConts() {
    const [activeTab, setActiveTab] = useState('overview')

    // Theme (light/dark) state: persisted and respects OS preference
    const [isDark, setIsDark] = useState(() => {
        if (typeof window === 'undefined') return false;
        try {
            const saved = localStorage.getItem('theme');
            if (saved) return saved === 'dark';
        } catch (e) {}
        return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });

    // ensure .light_mode class is applied when not in dark mode
    useEffect(() => {
        try {
            const el = document.documentElement;
            if (isDark) el.classList.remove('light_mode');
            else el.classList.add('light_mode');
        } catch (e) {}
    }, [isDark]);

    useEffect(() => {
        try {
            const el = document.documentElement;
            if (isDark) el.classList.add('dark'); else el.classList.remove('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        } catch (e) {
            // ignore
        }
    }, [isDark]);

    function toggleTheme() {
        setIsDark(v => !v);
    }

    useEffect(() => {
        const defaultBtn = document.getElementById("defaulttab");
        if (defaultBtn && typeof defaultBtn.click === "function") defaultBtn.click();
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        // set initial size and keep update on resize
        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    // Call location/weather once on mount instead of during every render
    const locationRequested = useRef(false)
    const positionRef = useRef(null)
    useEffect(() => {
        if (locationRequested.current) return
            locationRequested.current = true

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                positionRef.current = position
                TimeAndWeather.weatherForecaster(position)
                getTransitRoutes(position)
                getTransitAgencies(position)
                getTransitStops(position)
            })
        }
    }, [])

    // Re-fetch routes whenever the Overview tab becomes active so content is repopulated
    useEffect(() => {
        if (activeTab === 'overview' && positionRef.current) {
            getTransitRoutes(positionRef.current)
            getTransitAgencies(positionRef.current)
            getTransitStops(positionRef.current)
        }
    }, [activeTab])

    const [dt, setDt] = useState(() => {
        const base = TimeAndWeather.getDateAndTime ? TimeAndWeather.getDateAndTime() : { dayName: '', month: '', dayNumber: '', yearNumber: '', time: '' };
        if (typeof window !== 'undefined' && window.innerWidth < 1000) {
            const d = new Date();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            const yyyy = d.getFullYear();
            return { dayName: '', month: `${mm}/${dd}/${yyyy}`, dayNumber: '', yearNumber: '', time: base.time || '' };
        }
        return base;
    });

    useEffect(() => {
        const tick = () => {
            const base = TimeAndWeather.getDateAndTime ? TimeAndWeather.getDateAndTime() : { dayName: '', month: '', dayNumber: '', yearNumber: '', time: '' };
            if (typeof window !== 'undefined' && window.innerWidth < 1000) {
                const d = new Date();
                const mm = String(d.getMonth() + 1).padStart(2, '0');
                const dd = String(d.getDate()).padStart(2, '0');
                const yyyy = d.getFullYear();
                setDt({ dayName: '', month: `${mm}/${dd}/${yyyy}`, dayNumber: '', yearNumber: '', time: base.time || '' });
            } else {
                setDt(base);
            }
        };

        const timer = setInterval(tick, 1000);
        // run immediately so UI updates without waiting 1s
        tick();
        return () => clearInterval(timer);
    }, []);

    // Accordion behavior for each stop entity: event delegation on the document
    useEffect(() => {
        const onClick = (e) => {
            const toggle = e.target.closest && e.target.closest('.accordion-toggle');
            if (!toggle) return;
            const item = toggle.closest('.a_departure');
            if (!item) return;
            const panel = item.querySelector('.alldepartures');
            const expanded = item.classList.toggle('expanded');
            toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
            if (panel) {
                if (expanded) panel.style.maxHeight = panel.scrollHeight + 'px';
                else panel.style.maxHeight = null;
            }
        };

        const onKey = (e) => {
            if ((e.key === 'Enter' || e.key === ' ') && e.target && e.target.classList && e.target.classList.contains('accordion-toggle')) {
                e.preventDefault();
                e.target.click();
            }
        };

        document.addEventListener('click', onClick);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('click', onClick);
            document.removeEventListener('keydown', onKey);
        };
    }, []);

    return (
        <>
        <Navbar setActiveTab={setActiveTab} />
        <div className="main">
            <div className="topinfo">
                <div className="time_date_weather">
                    <p id="date">
                        {typeof window !== 'undefined' && window.innerWidth < 1000 ? (
                            <>
                                {dt.month}
                                <br />
                                {dt.time}
                            </>
                        ) : (
                            <>
                                {dt.dayName}, {dt.month} {dt.dayNumber}, <br />
                                {dt.yearNumber}, {dt.time}
                            </>
                        )}
                    </p>
                    <p id="weather"></p>
                </div>
                <button
                    type="button"
                    className="light_dark_responsive"
                    onClick={toggleTheme}
                    aria-pressed={isDark}
                    aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                    {isDark ? 'Dark Mode' : 'Light Mode'}
                </button>
                <button className="hamburger" aria-label="Open navigation" onClick={() => openNav()}>
                    <i className="fa-solid fa-bars"></i>
                </button>
                <button
                    id="light_or_dark"
                    className="glassmorphic tenpx-radius"
                    onClick={toggleTheme}
                    aria-pressed={isDark}
                    aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                    <i className={isDark ? "fa-regular fa-moon" : "fa-regular fa-sun"} id="icon"></i>
                </button>
            </div>
            <div className="content">
                {switchWindows(activeTab)}
            </div>
        </div>
        </>
    )
}