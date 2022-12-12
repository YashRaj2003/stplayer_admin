import { Link } from 'react-router-dom';
import Image from './Images';
import AWN from "awesome-notifications";
import React, { useRef, useState } from "react";
import { auth, firedb } from "./firebaseconfig";
import validateRefs from "./utils/utils";
import { useStateValue } from "./StateProvider";
import { useHistory } from "react-router";

function Login() {

    const [loading, setLoading] = useState(false);

    const [{ }, dispatch] = useStateValue();
    const history = useHistory();

    let email = useRef();
    let password = useRef();

    let refs = [email, password];

    const loginUser = (e) => {
        setLoading(true);
        e.preventDefault();

        let res = validateRefs(refs);
        if (res.success) {
            auth
                .signInWithEmailAndPassword(email.current.value, password.current.value)
                .then((data) => {
                    if (data.user) {
                        firedb
                            .collection("admin")
                            .doc(data.user.email)
                            .get()
                            .then((user) => {
                                localStorage.setItem("user", JSON.stringify(user.data()));
                                dispatch({
                                    type: "SET_USER",
                                    user: user.data(),
                                });
                                new AWN().success("logged In", { position: "bottom-right" });
                                history.replace("/panel/start");
                            });
                    }
                })
                .catch((e) => {
                    new AWN().alert(e.message, { position: "bottom-right" });
                    setLoading(false);
                    return;
                });
        } else {
            new AWN().alert(res.message, { position: "bottom-right" });
            setLoading(false);
            return;
        }
    };

    return (
        <div className="bg-background min-h-screen flex items-center justify-center">
            <div className="">
                <div className="flex items-center justify-center my-10">
                    <img src={Image.Logo} alt="" className="w-52" />
                </div>
                <div className="bg-white shadow-md">
                    <div className="w-[480px] px-3 py-8">
                        <form action="get"
                            onSubmit={(e) => loginUser(e)}
                        >
                            <div className="px-5">
                                <p className="text-center font-medium text-xl mb-6 pb-5 mx-16 border-b">Log in</p>
                                <input
                                    type="text"
                                    className="h-14 w-full my-3 border-[1.5px] border-border focus:border-theme rounded appearance-none outline-none focus:outline-none p-5"
                                    placeholder="Email"
                                    ref={email}
                                />
                                <input
                                    type="password"
                                    className="h-14 w-full my-3 border-[1.5px] border-border focus:border-theme rounded appearance-none outline-none focus:outline-none p-5"
                                    placeholder="Password"
                                    ref={password}

                                />
                                <button
                                    type="submit"
                                    className="h-14 w-full bg-theme my-3 text-white font-medium tracking-wide text-lg  rounded appearance-none outline-none focus:outline-none"
                                    onClick={(e) => loginUser(e)}
                                >
                                    Log In
                                </button>
                            </div>
                            {/*<div className="flex items-center justify-center pt-10 gap-x-3 mx-3 border-t">
                                <button type="button" className="bg-white shadow py-2 text-sm tracking-wide w-full px-3 rounded flex items-center gap-x-2" >
                                    <img src={Image.Google} alt="" className="" /><span className=""> Sign in with Google</span>
                                </button>
                                <button type="button" className="bg-blue text-white text-sm tracking-wide shadow py-2 px-3 w-full rounded flex items-center gap-x-1" >
                                    <img src={Image.Facebook} alt="" className="" /><span className=""> Sign in with Facebook</span>
                                </button>
                             </div>
                             */}
                        </form>
                    </div>
                </div>
                <div className="text-white my-3 text-center">
                    <p className="">Don't have an account?. &nbsp;&nbsp; <Link to="/signup"><span className="underline-offset-2	underline cursor-pointer">Create an account</span></Link></p>
                </div>
            </div>
        </div>
    )
}

export default Login
