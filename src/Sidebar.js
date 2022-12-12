import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { auth } from "./firebaseconfig";
import { useHistory, useLocation } from "react-router";
import { useStateValue } from "./StateProvider";
import Image from './Images';

function Sidebar() {

    const [{ user }] = useStateValue();
    const matchurl = useLocation();
    const history = useHistory();

    const logoutnow = (e) => {
        e.preventDefault();
        localStorage.removeItem("user");
        auth.signOut();
        history.replace("/");
    };



    const active = "h-10 px-5 my-3 text-sm tracking-wide text-black bg-hover flex items-center font-medium cursor-pointer rounded";
    const passive = "h-10 px-5 my-3 text-sm tracking-wide text-black bg-theme flex items-center font-medium cursor-pointer rounded hover:bg-hover";
    const text = "pt-[1.5px] pl-3";
    const outline_none = "appearance-none outline-none focus:outline-none";


    return (
        <div className="flex min-h-screen bg-dashboard_bg">
            <div className="w-[256px] border-r border-border border-opacity-10 px-5 py-8">
                <div>
                    <img src={Image.Logo} draggable="false" alt="" className="w-full" />
                </div>
                <div className="my-10 px-2">
                    <p className="font-medium text-white tracking-wide">{user?.first_name} {user?.last_name}</p>
                </div>
                <div>
                    <div className="my-10">
                        <Link to="/panel/start" className={outline_none}>
                            <div className={
                                matchurl.pathname.includes("start")
                                    ? active
                                    : passive
                            }>
                                {matchurl.pathname.includes("start") ?
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                    </svg>
                                    :
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>}
                                <p className={text}>Start</p>
                            </div>
                        </Link>
                        <Link to="/panel/assets" className={outline_none}>
                            <div className={
                                matchurl.pathname.includes("assets")
                                    ? active
                                    : passive
                            }>
                                {matchurl.pathname.includes("assets") ?
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                                    </svg>
                                    :
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                }
                                <p className={text}>Assets</p>
                            </div>
                        </Link>
                    </div>
                    <div className="my-10 border-t">
                        <Link to="/panel/account" className={outline_none}>
                            <div className={
                                matchurl.pathname.includes("account")
                                    ? active
                                    : passive
                            }>
                                {matchurl.pathname.includes("account") ?
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                                    </svg>
                                    :
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                }
                                <p className={text}>Account</p>
                            </div>
                        </Link>
                        <div className="absolute bottom-5">
                            <div
                                className={passive}
                                onClick={(e) => logoutnow(e)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <p className={text}>Log Out</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Sidebar
