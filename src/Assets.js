import React from "react";
import {
    Link,
    Route,
    Switch,
    useLocation,
    useRouteMatch,
} from "react-router-dom";
import Video from "./Video";
import Audio from "./Audio";
function Assets() {


    let { path, url } = useRouteMatch();
    const location = useLocation();


    const active = "text-lg tracking-wide font-medium  border-hover border-b-[3px] cursor-pointer appearance-none outline-none focus:outline-none";
    const passive = "text-lg text-opacity-50 tracking-wide font-medium border-hover hover:border-b-[3px] cursor-pointer appearance-none outline-none focus:outline-none";


    return (
        <div className="bg-dashboard_bg min-h-screen text-white">
            <div className="h-20 border-b border-border border-opacity-10 items-center flex px-10">
                <h1 className="text-4xl font-medium">Assets</h1>
            </div>
            <div className="m-10">
                <div className="flex gap-x-5">
                    <Link
                        to={`${url}/video`}

                    >
                        <p className={
                            location.pathname.includes("video") ||
                                location.pathname === url
                                ? active
                                : passive
                        }>Video</p>
                    </Link>
                    <Link
                        to={`${url}/audio`}

                    >
                        <p className={
                            location.pathname.includes("audio") ? active : passive
                        }>Audio</p>
                    </Link>
                </div>
                <div>

                </div>
            </div>
            <div className="mx-10">
                <Switch>
                    <Route exact path={path}>
                        <Video />
                    </Route>
                    <Route path={`${path}/video`}>
                        <Video />
                    </Route>
                    <Route path={`${path}/audio`}>
                        <Audio />
                    </Route>
                </Switch>
            </div>
        </div>
    )
}

export default Assets
