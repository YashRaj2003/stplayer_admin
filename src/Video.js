import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useHistory } from "react-router";
import { firedb } from "./firebaseconfig";
import moment from "moment";

function Video() {

    const history = useHistory();
    const [video, setvideo] = useState([]);
    const [search, setsearch] = useState("");

    useEffect(() => {
        firedb.collection("video").onSnapshot((snapshot) => {
            var v = [];
            snapshot.forEach((snap) => {
                v.push({ ...snap.data(), id: snap.id });
            });

            setvideo(v);
        });
    });


    function handleClick(id) {
        history.push("/panel/ViewVideo/" + id);
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
                <Link to="/panel/NewVideo">
                    <button className="bg-button py-2 px-2 rounded font-medium ml-8 w-52">
                        Create New
                    </button>
                </Link>
            </div>
            <div className="mt-10 pb-24">
                <table className="table-fixed w-full">
                    <tbody className="flex flex-wrap float-left gap-8">
                        {video.filter((val) => {
                            if (search === "") {
                                return val
                            }
                            else if (val.title.toLowerCase().includes(search.toLowerCase())) {
                                return val
                            }
                        }).map((v, index) => (
                            <div className="cursor-pointer"
                                key={index}
                                onClick={() => handleClick(v.id)}
                            >
                                <img src={v.thumbnail} alt="" className="w-80 aspect-video object-cover" />
                                <div className=" mt-2 opacity-50 tracking-wide w-80">
                                    <div className="flex items-center justify-between">
                                        <p className="truncate mr-8 w-64">{v.title}</p>

                                        <p className="mr-1">{moment(v?.createdAt).format("DD-MM-YYYY")}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Video
