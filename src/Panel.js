import React, { useEffect, useState } from "react";
import { useRouteMatch, Route, Switch } from "react-router-dom";
import Sidebar from './Sidebar';
import Assets from './Assets';
import Start from './Start';
import './App.css';
import Account from "./Account";
import NewVideo from "./Create New/Video"
import NewAudio from "./Create New/Audio"
import ViewVideo from "./ViewVideo";
import ViewAudio from "./ViewAudio";

function Panel() {
    let { path } = useRouteMatch();
    const [show, setshow] = useState(false);

    return (
        <div className="font-graphik">

            <div className="flex flex-row h-screen  ">
                <div className="flex"><Sidebar /></div>
                <div className=" w-full overflow-y-auto">
                    <Switch>
                        <Route path={`${path}/start`}>
                            <Start />
                        </Route>
                        <Route path={`${path}/assets`}>
                            <Assets />
                        </Route>
                        <Route path={`${path}/account`}>
                            <Account />
                        </Route>
                        <Route path={`${path}/NewVideo`}>
                            <NewVideo />
                        </Route>
                        <Route path={`${path}/NewAudio`}>
                            <NewAudio />
                        </Route>
                        <Route path={`${path}/ViewVideo/:id`}>
                            <ViewVideo />
                        </Route>
                        <Route path={`${path}/ViewAudio/:id`}>
                            <ViewAudio />
                        </Route>
                    </Switch>
                </div>
            </div>
        </div>
    );
}

export default Panel;
