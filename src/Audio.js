import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useStateValue } from "./StateProvider";
import { useHistory, Redirect } from "react-router";
import { firedb } from "./firebaseconfig";
import moment from "moment";
function Audio() {

    const history = useHistory();
    const [audio, setaudio] = useState([]);
    const [search, setsearch] = useState("");

    useEffect(() => {
        firedb.collection("audio").onSnapshot((snapshot) => {
            var a = [];
            snapshot.forEach((snap) => {
                a.push({ ...snap.data(), id: snap.id });
            });

            setaudio(a);
        });
    });


    function handleClick(id) {
        history.push("/panel/ViewAudio/" + id);
    }
    return (
        <div className="">
            <div className="flex justify-between gap-x-16">
                <div className="bg-input flex border focus:border-theme gap-x-5 px-3 py-2 rounded items-center w-full ">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-lightblack" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                    <input
                        type="text"
                        className="bg-input appearance-none focus:outline-none outline-none text-black w-full"
                        onChange={(event) => { setsearch(event.target.value); }}
                    />
                </div>
                <Link to="/panel/NewAudio">
                    <button className="bg-button py-2 px-2 rounded font-medium ml-8 w-52">
                        Create New
                    </button>
                </Link>
            </div>
            <div className="mt-10 pb-24">
                <table className="table-fixed w-full">
                    <tbody className="grid lg:grid-cols-4 grid-flow-row float-left gap-14">
                        {audio.filter((val) => {
                            if (search === "") {
                                return val
                            }
                            else if (val.title.toLowerCase().includes(search.toLowerCase())) {
                                return val
                            }
                        }).map((a, index) => (
                            <div className="cursor-pointer"
                                key={index}
                                onClick={() => handleClick(a.id)}
                            >
                                <img src={a.artwork} alt="" className="w-64" />
                                <div className="w-64 flex justify-between mt-2 opacity-50 tracking-wide">
                                    <p className="truncate w-32">{a.title}</p>
                                    <p className="ml-8 ">{moment(a?.createdAt).format("DD-MM-YYYY")}</p>
                                </div>
                            </div>
                        ))}
                    </tbody>
                </table>

            </div>
        </div>
    )
}

export default Audio
