import React, { useRef, useState } from "react";
import validateRefs from "./utils/utils";
import { Link } from 'react-router-dom';
import { auth, firedb } from "./firebaseconfig";
import { useHistory } from "react-router";
import { useStateValue } from "./StateProvider";
import AWN from "awesome-notifications";
import Image from './Images';
import "./notification.css";

function Signup() {

    const [Loading, setLoading] = useState(false);
    const [{ }, dispatch] = useStateValue();

    const history = useHistory();

    let first_name = useRef();
    let last_name = useRef();
    let email = useRef();
    let password = useRef();

    var refs = [first_name, last_name, email, password];

    const createUser = (e) => {
        setLoading(true);
        e.preventDefault();
        if (password.current.value >= 6) {
            new AWN().alert("password must be atleast 6 digits", {
                position: "bottom-right",
            });
            return;
        }
        let result = validateRefs(refs);
        if (result.success) {
            auth
                .createUserWithEmailAndPassword(
                    email.current.value,
                    password.current.value
                )
                .then((data) => {
                    if (data.user) {
                        var userdata = {
                            first_name: first_name.current.value,
                            last_name: last_name.current.value,
                            email: email.current.value,
                            role: "admin"
                        };
                        firedb
                            .collection("admin")
                            .doc(email.current.value)
                            .set(userdata)
                            .then(() => {
                                localStorage.setItem("user", JSON.stringify(userdata));
                                dispatch({
                                    type: "SET_USER",
                                    user: userdata,
                                });
                                new AWN().success("account created successfully", {
                                    position: "bottom-right",
                                });
                                history.replace("/panel/start");
                            })
                            .catch((e) => {
                                console.log(e.message);
                                new AWN().alert(e.message, {
                                    position: "bottom-right",
                                });
                                setLoading(false);
                            });
                    }
                })
                .catch((e) => {
                    console.log(e.message);
                    new AWN().alert(e.message, {
                        position: "bottom-right",
                    });
                    setLoading(false);
                });
        } else {
            new AWN().warning(result.message, { position: "bottom-right" });
            setLoading(false);
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
                        <form action="">
                            <div className="px-5">
                                <p className="text-center font-medium text-xl mb-6 pb-5 mx-16 border-b">Sign Up</p>
                                <div className="flex  gap-x-5">
                                    <input
                                        type="text"
                                        className="h-14 w-full my-3 border-[1.5px] border-border focus:border-theme rounded appearance-none outline-none focus:outline-none p-5"
                                        placeholder="First Name"
                                        ref={first_name}
                                        name="name"

                                    />
                                    <input
                                        type="text"
                                        className="h-14 w-full my-3 border-[1.5px] border-border focus:border-theme rounded appearance-none outline-none focus:outline-none p-5"
                                        placeholder="Last Name"
                                        ref={last_name}
                                        name="name"

                                    />
                                </div>
                                <input
                                    type="text"
                                    className="h-14 w-full my-3 border-[1.5px] border-border focus:border-theme rounded appearance-none outline-none focus:outline-none p-5"
                                    placeholder="Email"
                                    ref={email}
                                    name="email"
                                />
                                <input
                                    type="password"
                                    className="h-14 w-full my-3 border-[1.5px] border-border focus:border-theme rounded appearance-none outline-none focus:outline-none p-5"
                                    placeholder="Password"
                                    ref={password}
                                    name="password"

                                />
                                <button
                                    type="submit"
                                    className="h-14 w-full bg-theme my-3 text-white font-medium tracking-wide text-lg  rounded appearance-none outline-none focus:outline-none"
                                    onClick={(e) => createUser(e)}
                                >
                                    Sign Up
                                </button>
                            </div>

                        </form>
                        <div className="flex items-center justify-center pt-10 gap-x-3 mx-3 border-t">
                            <button type="button" className="bg-white shadow py-2 text-sm tracking-wide w-full px-3 rounded flex items-center gap-x-2" >
                                <img src={Image.Google} alt="" className="" /><span className=""> Sign up with Google</span>
                            </button>
                            <button type="button" className="bg-blue text-white text-sm tracking-wide shadow py-2 px-3 w-full rounded flex items-center gap-x-1" >
                                <img src={Image.Facebook} alt="" className="" /><span className=""> Sign up with Facebook</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="text-white my-3 text-center">
                    <p className="">Already have an account?. &nbsp;&nbsp; <Link to="/"><span className="underline-offset-2	underline cursor-pointer">Login to your account</span></Link></p>
                </div>
            </div>
        </div>
    )
}

export default Signup
