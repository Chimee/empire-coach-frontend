import React, { useState, useEffect } from "react";
import { Accordion } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import './sidebar.css';
import { MenuItems } from "./Sidemenus";
import { DropdownSvg } from "../../../svgFiles/DropdownSvg";
import { useDispatch } from "react-redux";
import { dmApi } from "../../../app/dmApi";
import { WhiteLogoSvg } from "../../../svgFiles/WhiteLogoSvg";
import { jwtDecode } from "../../../helpers/AccessControlUtils";



const Sidebar = () => {
    const getToken = localStorage.getItem("authToken")
    const authToken = jwtDecode(getToken)
    const userRole = authToken?.role;
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [activeKey, setActiveKey] = useState(null);

    useEffect(() => {
        // Close all accordions when navigating to Dashboard
        if (location.pathname === "/dashboard") {
            setActiveKey(null);
        }
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.clear();
        dispatch(dmApi.util.resetApiState());
        navigate("/login");
    };

    const renderMenuItem = (item, index) => {
        const isParentActive = item.subMenu.some((subItem) =>
            location.pathname.startsWith(subItem.path)
        );

        const isActive =
            location.pathname.startsWith(item.path) || isParentActive;

        return (
            <li key={index} className={`outerlist ${isActive ? "activeLink" : ""}`}>
                {item.subMenu.length > 0 ? (
                    <Accordion.Item eventKey={String(index)} className="border-0">
                        <Accordion.Header>
                            {item.icon} {item.title} <span className="arrow_down">{DropdownSvg}</span>
                        </Accordion.Header>
                        <Accordion.Body>
                            <ul className="list-unstyled">
                                {item.subMenu
                                    .filter((subItem) => subItem.roles.includes(userRole))
                                    .map((subItem, subIndex) => (
                                        <li key={subIndex} className={location.pathname === subItem.path ? "active_accordian" : ""}>
                                            <Link to={subItem.path} className="text-decoration-none">
                                                {subItem.title}
                                            </Link>
                                        </li>
                                    ))}
                            </ul>
                        </Accordion.Body>
                    </Accordion.Item>
                ) : (
                    <Link to={item.path} className="text-decoration-none d-flex align-items-center gap-2"> {/* Added align-items-center */}
                        {item.icon} {item.title}
                    </Link>
                )}
            </li>
        );
    };

    return (
        <div className="side_bar">
            <div className="sidebar_inner">
                <div className="side_logo">
                    <WhiteLogoSvg />
                </div>
                <ul className="list-unstyled">
                    <Accordion activeKey={activeKey} onSelect={(key) => setActiveKey(key)}>
                        {MenuItems
                            .filter((item) => item.roles.includes(userRole))
                            .map(renderMenuItem)} {/* Use the renderMenuItem function */}
                    </Accordion>
                    <li className="logout" onClick={handleLogout}>
                        <span>
                            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18.332 19.9062V21.9375C18.332 24.1776 16.5097 26 14.2695 26H4.0625C1.82237 26 0 24.1776 0 21.9375V4.0625C0 1.82237 1.82237 0 4.0625 0H14.2695C16.5097 0 18.332 1.82237 18.332 4.0625V6.09375C18.332 6.65472 17.8774 7.10938 17.3164 7.10938C16.7554 7.10938 16.3008 6.65472 16.3008 6.09375V4.0625C16.3008 2.94254 15.3895 2.03125 14.2695 2.03125H4.0625C2.94254 2.03125 2.03125 2.94254 2.03125 4.0625V21.9375C2.03125 23.0575 2.94254 23.9688 4.0625 23.9688H14.2695C15.3895 23.9688 16.3008 23.0575 16.3008 21.9375V19.9062C16.3008 19.3453 16.7554 18.8906 17.3164 18.8906C17.8774 18.8906 18.332 19.3453 18.332 19.9062ZM25.2563 11.2554L22.9821 8.98114C22.5854 8.58441 21.9423 8.58441 21.5457 8.98114C21.149 9.37767 21.149 10.0208 21.5457 10.4173L23.1634 12.0352H10.9688C10.4078 12.0352 9.95313 12.4898 9.95313 13.0508C9.95313 13.6118 10.4078 14.0664 10.9688 14.0664H23.1634L21.5457 15.6843C21.149 16.0808 21.149 16.7239 21.5457 17.1204C21.7441 17.3188 22.004 17.418 22.2638 17.418C22.5239 17.418 22.7837 17.3188 22.9821 17.1204L25.2563 14.8462C26.2464 13.8561 26.2464 12.2454 25.2563 11.2554Z" fill="white" />
                            </svg>
                            Log out
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;