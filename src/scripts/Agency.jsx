import { transit } from './envUnloader.jsx';

export function keyDownAgency(event) {
    event = event || window.event;
    if (event.keyCode === 13) {
        var searchQuery = document.getElementById("agencygetter").value;
        document.getElementById("descofagencies").innerHTML = `
            <li id="each_agency_desc" class="glassmorphic tenpx-radius">
                <h2 id="name_of_agency">Loading...</h2>
                <hr style="margin-top:5px; margin-bottom:10px;"/>
                <p id="desc_of_agency">
                    <span style="display:inline-block; width:48%; vertical-align:top;">
                        <strong>Phone:</strong> <span id="agency_phone">-</span><br />
                        <strong>Email:</strong> <span id="agency_email">-</span>
                    </span>
                    <span style="display:inline-block; width:48%; text-align:left; vertical-align:top;">
                        <strong>Site:</strong> <a id="agency_website" href="#" target="_blank">-</a><br />
                        <strong>Timezone:</strong> <span id="agency_timezone">-</span>
                    </span>
                </p>
                <hr style="margin-top:10px;" />
            </li>
        `;
        agencySearch(searchQuery);
    }
}

function agencySearch(searchQuery) {
    var agencyCall = new XMLHttpRequest();
    agencyCall.open("GET", `https://transit.land/api/v2/rest/agencies?search=${searchQuery}&include_alerts=true&api_key=${transit}`);
    agencyCall.send();
    agencyCall.onreadystatechange = function() {
        if (agencyCall.readyState === 4 && agencyCall.status === 200) {
            var agencyData = JSON.parse(agencyCall.responseText).agencies;
            for (var i = 0; i < agencyData.length; i++) {
                var agency_name = agencyData[i].agency_name;
                var agency_email = agencyData[i].agency_email;
                var agency_phone = agencyData[i].agency_phone;
                var agency_timezone = agencyData[i].agency_timezone;
                var agency_website = agencyData[i].agency_url;

                if (!agency_email) {
                    agency_email = "N/A";
                }
                if (!agency_phone) {
                    agency_phone = "N/A";
                }
                if (!agency_timezone) {
                    agency_timezone = "N/A";
                }
                if (!agency_website) {
                    agency_website = "#";
                }

                document.getElementById("name_of_agency").innerHTML = agency_name;
                document.getElementById("agency_phone").innerHTML = agency_phone;
                document.getElementById("agency_email").innerHTML = agency_email;
                document.getElementById("agency_timezone").innerHTML = agency_timezone;

                var agency_website_link = document.getElementById("agency_website");
                agency_website_link.href = agency_website;
                agency_website_link.innerHTML = agency_website;

                var agencyNode = document.getElementById("each_agency_desc").cloneNode(true);
                document.getElementById("descofagencies").appendChild(agencyNode);
            }

            var allAgencies = document.getElementById("descofagencies").children;
            document.getElementById("descofagencies").removeChild(allAgencies[0]);
        }
    };
}