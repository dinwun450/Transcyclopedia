import { openTab, closeNav } from './MainConts.jsx';
export default function Navbar({ setActiveTab }) {
    return (
        <ul className="left_navbar">
            <h1 className="logo">Transcycl<span className="globe"><i className="fa-solid fa-earth-americas"></i></span>pedia</h1>
            <li className="tablinks" id="defaulttab" onClick={(e) => openTab(e, 'overview', setActiveTab)}><a href="#"><i className="fa-solid fa-table-cells-large"></i>&nbsp;&nbsp;Overview</a></li>
            <li className="tablinks" onClick={(e) => openTab(e, 'agency', setActiveTab)}><a href="#"><i className="fa-regular fa-user"></i>&nbsp;&nbsp;Agency</a></li>
            <li className="tablinks" onClick={(e) => openTab(e, 'departures', setActiveTab)}><a href="#"><i className="fa-solid fa-clock"></i>&nbsp;&nbsp;Departures</a></li>
            <li className="tablinks" onClick={(e) => openTab(e, 'alerts', setActiveTab)}><a href="#"><i className="fa-solid fa-triangle-exclamation"></i>&nbsp;&nbsp;Alerts</a></li>
            
            <li className="tablinks" onClick={(e) => openTab(e, 'intermap', setActiveTab)}><a href="#"><i className="fa-regular fa-map"></i>&nbsp;&nbsp;Map</a></li>
            <li className="tablinks" onClick={(e) => openTab(e, 'about', setActiveTab)}><a href="#"><i className="fa-solid fa-circle-info"></i>&nbsp;&nbsp;About</a></li>
            <li className="x"><a href="#" className="closebtn" onClick={(e) => { e.preventDefault(); closeNav(); }}>&times;&nbsp;&nbsp;Close</a></li>
            <p className="copyright">Your encyclopedia for public transit, created by Dino Wun.</p>
        </ul>
    );

}
