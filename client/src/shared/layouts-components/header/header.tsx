import { useEffect, useRef, useState } from 'react';
import { Dropdown, Form, Image, ListGroup, Modal } from 'react-bootstrap';
import { MENUITEMS } from '../sidebar/nav';
import { getState, setState } from '../services/switcherServices';
import { Link, useNavigate } from 'react-router-dom';
import logo1 from "../../../assets/images/brand-logos/desktop-logo.png";
import logo2 from "../../../assets/images/brand-logos/toggle-dark.png";
import logo3 from "../../../assets/images/brand-logos/desktop-dark.png";
import logo4 from "../../../assets/images/brand-logos/toggle-logo.png";
import SpkButton from '../../@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons';
import Switcher from '../switcher/switcher';
import { useAuth } from '../../../context/AuthContext';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    let [variable, _setVariable] = useState(getState());

    // Logout handler
    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    // MenuClose Function
    function menuClose() {
        const theme = getState();
        if (window.innerWidth <= 992) {
            setState({ toggled: "close" });
        }
        if (window.innerWidth >= 992) {
            const newToggledValue = theme.toggled ? theme.toggled : '';
            setState({ toggled: newToggledValue });
        }
    }

    // Sidebar Toggle Function
    const overlayRef = useRef<HTMLDivElement | null>(null);

    const toggleSidebar = () => {
        const theme = getState();
        const sidemenuType = theme.dataNavLayout;
        if (window.innerWidth >= 992) {
            if (sidemenuType === "vertical") {
                const verticalStyle = theme.dataVerticalStyle;
                const navStyle = theme.dataNavStyle;
                switch (verticalStyle) {
                    case "closed":
                        setState({ dataNavStyle: "", toggled: theme.toggled === "close-menu-close" ? "" : "close-menu-close" });
                        break;
                    case "overlay":
                        setState({ dataNavStyle: "", toggled: theme.toggled === "icon-overlay-close" ? "" : "icon-overlay-close", iconOverlay: "" });
                        break;
                    case "icontext":
                        setState({ dataNavStyle: "", toggled: theme.toggled === "icon-text-close" ? "" : "icon-text-close" });
                        break;
                    case "doublemenu":
                        setState({ dataNavStyle: "" });
                        if (theme.toggled === "double-menu-open") {
                            setState({ toggled: "double-menu-close" });
                        }
                        break;
                    case "detached":
                        setState({ toggled: theme.toggled === "detached-close" ? "" : "detached-close", iconOverlay: "" });
                        break;
                    default:
                        setState({ toggled: "" });
                        break;
                }
                switch (navStyle) {
                    case "menu-click":
                        setState({ toggled: theme.toggled === "menu-click-closed" ? "" : "menu-click-closed" });
                        break;
                    case "menu-hover":
                        setState({ toggled: theme.toggled === "menu-hover-closed" ? "" : "menu-hover-closed" });
                        break;
                    case "icon-click":
                        setState({ toggled: theme.toggled === "icon-click-closed" ? "" : "icon-click-closed" });
                        break;
                    case "icon-hover":
                        setState({ toggled: theme.toggled === "icon-hover-closed" ? "" : "icon-hover-closed" });
                        break;
                }
            }
        } else {
            if (theme.toggled === "close") {
                setState({ toggled: "open" });
                setTimeout(() => {
                    const overlay = overlayRef.current;
                    if (overlay) {
                        overlay.classList.add("active");
                        overlay.addEventListener("click", () => {
                            overlay.classList.remove("active");
                            menuClose();
                        });
                    }
                }, 100);
            } else {
                setState({ toggled: "close" });
            }
        }
    };

    // Switcher Offcanvas
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // Fullscreen Function
    const [isFullscreen, setIsFullscreen] = useState(false);
    const toggleFullscreen = () => {
        if (!isFullscreen) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    useEffect(() => {
        const fullscreenChangeHandler = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener("fullscreenchange", fullscreenChangeHandler);
        return () => document.removeEventListener("fullscreenchange", fullscreenChangeHandler);
    }, []);

    // Theme Toggle Function
    const toggleTheme = () => {
        const currentTheme = getState();
        const newState = {
            dataThemeMode: currentTheme.dataThemeMode === 'dark' ? 'light' : 'dark',
            dataHeaderStyles: currentTheme.dataThemeMode === 'transparent' ? 'light' : 'transparent',
            dataMenuStyles: currentTheme.dataThemeMode === 'transparent' ? 'light' : 'transparent',
        };
        setState(newState);
        if (newState.dataThemeMode != 'dark') {
            setState({ bodyBg: '', lightRgb: '', bodyBg2: '', inputBorder: '', formControlBg: '', gray: '' });
            localStorage.setItem("vyzorlightTheme", "light");
            localStorage.removeItem("vyzordarkTheme");
        } else {
            localStorage.setItem("vyzordarkTheme", "dark");
            localStorage.removeItem("vyzorlightTheme");
        }
    };

    // Search Functionality
    const searchRef = useRef<HTMLInputElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const searchResultRef = useRef<HTMLDivElement | null>(null);
    const [showa, setShowa] = useState(false);
    const [InputValue, setInputValue] = useState("");
    const [show2, setShow2] = useState(false);
    const [searchcolor, setsearchcolor] = useState("text-dark");
    const [searchval, setsearchval] = useState("Type something");
    const [NavData, setNavData] = useState([]);

    const handleClick = (event: MouseEvent) => {
        const searchInput = searchRef.current;
        const container = containerRef.current;
        if (searchInput && container && !searchInput.contains(event.target as Node) && !container.contains(event.target as Node)) {
            container.classList.remove("searchdrop");
        } else if (searchInput && container && (searchInput === event.target || searchInput.contains(event.target as Node))) {
            container.classList.add("searchdrop");
        }
    };

    useEffect(() => {
        document.body.addEventListener("click", handleClick);
        return () => document.body.removeEventListener("click", handleClick);
    }, []);

    useEffect(() => {
        const clickHandler = (event: any) => {
            if (searchResultRef.current && !searchResultRef.current.contains(event.target)) {
                searchResultRef.current.classList.add("d-none");
            }
        };
        document.addEventListener("click", clickHandler);
        return () => document.removeEventListener("click", clickHandler);
    }, []);

    const myfunction = (inputvalue: string) => {
        if (searchResultRef.current) searchResultRef.current.classList.remove("d-none");
        const i: any = [];
        const allElement2: any = [];
        MENUITEMS.forEach((mainLevel: any) => {
            if (mainLevel.children) {
                setShowa(true);
                mainLevel.children.forEach((subLevel: any) => {
                    i.push(subLevel);
                    if (subLevel.children) {
                        subLevel.children.forEach((subLevel1: any) => {
                            i.push(subLevel1);
                        });
                    }
                });
            }
        });
        for (const allElement of i) {
            if (allElement.title.toLowerCase().includes(inputvalue.toLowerCase())) {
                if (allElement.title.toLowerCase().startsWith(inputvalue.toLowerCase())) {
                    setShow2(true);
                    if (allElement.path && !allElement2.some((el: any) => el.title === allElement.title)) {
                        allElement2.push(allElement);
                    }
                }
            }
        }
        if (!allElement2.length || inputvalue === "") {
            if (inputvalue === "") {
                setShow2(false);
                setsearchval("Type something");
                setsearchcolor("text-dark");
            }
            if (!allElement2.length) {
                setShow2(false);
                setsearchcolor("text-danger");
                setsearchval("There is no component with this name");
            }
        }
        setNavData(allElement2);
    };

    // Responsive Search Modal
    const [show1, setShow1] = useState(false);
    const handleClose1 = () => setShow1(false);
    const handleShow1 = () => setShow1(true);

    // Sticky header
    useEffect(() => {
        const navbar = document?.querySelector(".app-header");
        const navbar1 = document?.querySelector(".app-sidebar");
        const sticky: any = navbar?.clientHeight;
        function stickyFn() {
            if (window.pageYOffset >= sticky) {
                navbar?.classList.add("sticky-pin");
                navbar1?.classList.add("sticky-pin");
            } else {
                navbar?.classList.remove("sticky-pin");
                navbar1?.classList.remove("sticky-pin");
            }
        }
        window.addEventListener("scroll", stickyFn);
        window.addEventListener("DOMContentLoaded", stickyFn);
        return () => {
            window.removeEventListener("scroll", stickyFn);
            window.removeEventListener("DOMContentLoaded", stickyFn);
        };
    }, []);

    // Get role name
    const getRoleName = (maquyen: string | undefined) => {
        const roles: Record<string, string> = {
            'VT01': 'Quản trị viên',
            'VT02': 'Cán bộ',
            'VT03': 'Học viên',
            'VT04': 'Người xem',
        };
        return roles[maquyen || ''] || maquyen || '';
    };

    return (
        <div>
            <header className="app-header sticky" id="header">
                <div className="main-header-container container-fluid">
                    {variable.toggled === "open" && <div ref={overlayRef} id="responsive-overlay"></div>}

                    {/* Header Left */}
                    <div className="header-content-left">
                        {/* Logo */}
                        <div className="header-element">
                            <div className="horizontal-logo">
                                <Link to={`${import.meta.env.BASE_URL}guard-management/dashboard`} className="header-logo">
                                    <Image src={logo1} alt="logo" className="desktop-logo" />
                                    <Image src={logo2} alt="logo" className="toggle-dark" />
                                    <Image src={logo3} alt="logo" className="desktop-dark" />
                                    <Image src={logo4} alt="logo" className="toggle-logo" />
                                </Link>
                            </div>
                        </div>

                        {/* Sidebar Toggle */}
                        <div className="header-element mx-lg-0 mx-2">
                            <Link aria-label="Hide Sidebar" onClick={toggleSidebar} className="sidemenu-toggle header-link animated-arrow hor-toggle horizontal-navtoggle" data-bs-toggle="sidebar" to="#!"><span></span></Link>
                        </div>

                        {/* Search Bar */}
                        <div ref={containerRef} className="header-element header-search d-md-block d-none my-auto auto-complete-search">
                            <div className='autoComplete_wrapper'>
                                <input type="text" className="header-search-bar form-control" ref={searchRef} defaultValue={InputValue} onChange={(e) => { myfunction(e.target.value); setInputValue(e.target.value); }} id="header-search" placeholder="Tìm kiếm..." spellCheck={false} autoComplete="off" autoCapitalize="off" />
                            </div>
                            <Link to="#!;" className="header-search-icon border-0">
                                <i className="bi bi-search fs-12"></i>
                            </Link>
                            {showa && (
                                <div className="card custom-card search-result position-absolute z-index-9 search-fix border" ref={searchResultRef}>
                                    <div className="card-header p-2">
                                        <div className="card-title mb-0 text-break">Kết quả tìm kiếm: {InputValue}</div>
                                    </div>
                                    <div className='card-body overflow-auto p-2'>
                                        <ListGroup className='m-2 header-searchdropdown'>
                                            {show2 ? NavData.map((e: any) => (
                                                <ListGroup.Item key={Math.random()}>
                                                    <Link to={`${e.path}/`} className='search-result-item' onClick={() => { setShowa(false); setInputValue(""); }}>{e.title}</Link>
                                                </ListGroup.Item>
                                            )) : <b className={`${searchcolor} `}>{searchval}</b>}
                                        </ListGroup>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Header Right */}
                    <ul className="header-content-right">
                        {/* Mobile Search */}
                        <li className="header-element d-md-none d-block">
                            <Link to="#!" className="header-link" onClick={handleShow1}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="header-link-icon" viewBox="0 0 256 256"><rect width="256" height="256" fill="none" /><circle cx="112" cy="112" r="80" opacity="0.2" /><circle cx="112" cy="112" r="80" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><line x1="168.57" y1="168.57" x2="224" y2="224" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /></svg>
                            </Link>
                        </li>

                        {/* Theme Toggle */}
                        <li className="header-element header-theme-mode">
                            <Link to="#!" className="header-link layout-setting" onClick={toggleTheme}>
                                <span className="light-layout">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="header-link-icon" viewBox="0 0 256 256"><rect width="256" height="256" fill="none" /><path d="M108.11,28.11A96.09,96.09,0,0,0,227.89,147.89,96,96,0,1,1,108.11,28.11Z" opacity="0.2" /><path d="M108.11,28.11A96.09,96.09,0,0,0,227.89,147.89,96,96,0,1,1,108.11,28.11Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /></svg>
                                </span>
                                <span className="dark-layout">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="header-link-icon" viewBox="0 0 256 256"><rect width="256" height="256" fill="none" /><circle cx="128" cy="128" r="56" opacity="0.2" /><line x1="128" y1="40" x2="128" y2="32" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><circle cx="128" cy="128" r="56" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /></svg>
                                </span>
                            </Link>
                        </li>

                        {/* Fullscreen */}
                        <li className="header-element header-fullscreen">
                            <Link to="#!" className="header-link" onClick={toggleFullscreen}>
                                {isFullscreen ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="full-screen-close header-link-icon d-block" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><polyline points="160 48 208 48 208 96" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></polyline><line x1="144" y1="112" x2="208" y2="48" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line><polyline points="96 208 48 208 48 160" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></polyline><line x1="112" y1="144" x2="48" y2="208" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="full-screen-open header-link-icon" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><polyline points="168 48 208 48 208 88" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></polyline><polyline points="88 208 48 208 48 168" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></polyline><polyline points="208 168 208 208 168 208" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></polyline><polyline points="48 88 48 48 88 48" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></polyline></svg>
                                )}
                            </Link>
                        </li>

                        {/* User Profile Dropdown */}
                        <Dropdown className="header-element dropdown">
                            <Dropdown.Toggle as="a" variant='' className="header-link dropdown-toggle" id="mainHeaderProfile">
                                <div className="d-flex align-items-center gap-2">
                                    <span className="avatar avatar-sm bg-primary avatar-rounded">
                                        <i className="bi bi-person-fill text-white"></i>
                                    </span>
                                    <span className="d-none d-lg-block">
                                        <span className="d-block fw-semibold lh-1">{user?.tendn || 'Người dùng'}</span>
                                        <span className="text-muted fs-11">{getRoleName(user?.maquyen)}</span>
                                    </span>
                                </div>
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="main-header-dropdown dropdown-menu pt-0 overflow-hidden header-profile-dropdown dropdown-menu-end">
                                <div className="p-3 bg-primary text-fixed-white">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <p className="mb-0 fs-16">Tài khoản</p>
                                    </div>
                                </div>
                                <div className="dropdown-divider"></div>
                                <div className="p-3">
                                    <div className="d-flex align-items-start gap-2">
                                        <div className="lh-1">
                                            <span className="avatar avatar-sm bg-primary-transparent avatar-rounded">
                                                <i className="bi bi-person-fill"></i>
                                            </span>
                                        </div>
                                        <div>
                                            <span className="d-block fw-semibold lh-1">{user?.tendn || 'Người dùng'}</span>
                                            <span className="text-muted fs-12">{getRoleName(user?.maquyen)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="dropdown-divider"></div>
                                <ul className="list-unstyled mb-0">
                                    <li>
                                        <Link className="dropdown-item d-flex align-items-center text-danger" to="#!" onClick={handleLogout}>
                                            <i className="bi bi-box-arrow-right me-2 fs-18"></i>Đăng xuất
                                        </Link>
                                    </li>
                                </ul>
                            </Dropdown.Menu>
                        </Dropdown>

                        {/* Switcher */}
                        <li className="header-element">
                            <Link to="#!" className="header-link switcher-icon" onClick={handleShow}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="header-link-icon" viewBox="0 0 256 256"><rect width="256" height="256" fill="none" /><circle cx="128" cy="128" r="40" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><path d="M41.43,178.09A99.14,99.14,0,0,1,31.36,153.8l16.78-21a81.59,81.59,0,0,1,0-9.64l-16.77-21a99.43,99.43,0,0,1,10.05-24.3l26.71-3a81,81,0,0,1,6.81-6.81l3-26.7A99.14,99.14,0,0,1,102.2,31.36l21,16.78a81.59,81.59,0,0,1,9.64,0l21-16.77a99.43,99.43,0,0,1,24.3,10.05l3,26.71a81,81,0,0,1,6.81,6.81l26.7,3a99.14,99.14,0,0,1,10.07,24.29l-16.78,21a81.59,81.59,0,0,1,0,9.64l16.77,21a99.43,99.43,0,0,1-10,24.3l-26.71,3a81,81,0,0,1-6.81,6.81l-3,26.7a99.14,99.14,0,0,1-24.29,10.07l-21-16.78a81.59,81.59,0,0,1-9.64,0l-21,16.77a99.43,99.43,0,0,1-24.3-10l-3-26.71a81,81,0,0,1-6.81-6.81Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /></svg>
                            </Link>
                            <Switcher show={show} handleClose={handleClose} />
                        </li>
                    </ul>
                </div>
            </header>

            {/* Mobile Search Modal */}
            <Modal show={show1} onHide={handleClose1} className="fade" id="header-responsive-search" tabIndex={-1}>
                <Modal.Body>
                    <div className="input-group">
                        <Form.Control type="text" className="border-end-0" placeholder="Tìm kiếm..." aria-label="Tìm kiếm..." />
                        <SpkButton Buttonvariant='primary' Buttontype="button" Id="button-addon2"><i className="bi bi-search"></i></SpkButton>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Header;
