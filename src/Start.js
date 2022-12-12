import React from 'react'
import { useStateValue } from "./StateProvider";

function Start() {
    const [{ user }, dispatch] = useStateValue();

    return (
        <div className="bg-dashboard_bg min-h-screen text-white">
            <div className="h-20 border-b border-border border-opacity-10 items-center flex px-10">
                <h1 className="text-4xl font-medium">Hi {user?.first_name}!</h1>
            </div>
        </div>
    )
}

export default Start
