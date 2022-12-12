import React, { useRef } from "react";
import Image from './Images';
import { useStateValue } from "./StateProvider";
import AWN from "awesome-notifications";
import { firedb, storage } from "./firebaseconfig";
import Edit from "./Images/icon_edit.png"
function Account() {

    const [{ user }, dispatch] = useStateValue();

    let first_name = useRef();
    let last_name = useRef();
    let phone = useRef();


    function Update_User_details() {
        firedb
            .collection("admin")
            .doc(user.email)
            .update({
                first_name: first_name.current.value,
                last_name: last_name.current.value,
                phone: phone.current.value,
            })
            .then((u) => {
                firedb
                    .collection("admin")
                    .doc(user.email)
                    .get()
                    .then((u) => {
                        dispatch({
                            type: "SET_USER",
                            user: u.data(),
                        });
                        new AWN().success("success");
                    })
                    .catch((e) => {
                        new AWN().alert("something went wrong relogin to solve this.");
                    });
            })
            .catch((e) => {
                new AWN().alert(e.message);
            });

    }
    const Profile_image_upload = (e) => {
        var image = e.target.files[0];
        const type = image.type.split("/")[1];

        if (!image) {
            new AWN().alert("no image file selected", { position: "bottom-right" });
            return;
        }
        var storageRef = storage.ref();
        storageRef
            .child(`profile/${user?.email + type}`)
            .put(image)
            .then((snapshot) => {
                snapshot.ref
                    .getDownloadURL()
                    .then(function (downloadURL) {
                        firedb
                            .collection("admin")
                            .doc(user.email)
                            .update({
                                profile_image: downloadURL,
                            })
                        const u = { ...user, profile_image: downloadURL }
                        dispatch({
                            type: "SET_USER",
                            user: u,
                        });

                    })
                    .catch((e) => {
                        new AWN().alert(e.message, { position: "bottom-right" });
                    });
            });
    };

    return (
        <div className="bg-dashboard_bg min-h-screen text-white">
            <div className="h-20 border-b border-border border-opacity-10 items-center flex px-10">
                <h1 className="text-4xl font-medium">Account</h1>
            </div>

            <div className=" bg-card_bg lg:m-16 m-5">
                <div className="">
                    <div className="border-b flex justify-between ml-8 mr-8 py-5 items-center">
                        <h1 className="text-lg tracking-wide">You</h1>
                    </div>
                    <div className="p-8 ">
                        <div className="flex lg:flex-row flex-col gap-16">
                            <div className="">
                                <div className="lg:w-64 lg:h-64 w-52 h-52 ">
                                    {user?.profile_image ?
                                        <div className="lg:w-64 lg:h-64 w-52 h-52  flex  relative ">
                                            <img draggable="false" src={user?.profile_image} alt="" className="h-64" />
                                            <div className=" absolute right-0 flex items-center justify-center cursor-pointer ">
                                                <img src={Edit} alt="" className="h-8 w-8 cursor-pointer shadow-md" />
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    id="file-for"
                                                    className="absolute h-full w-full opacity-0"
                                                    onChange={(e) => Profile_image_upload(e)}
                                                />
                                            </div>

                                        </div>
                                        :
                                        <div className="w-full h-full bg-input flex flex-col items-center justify-between relative hover:shadow-inner">
                                            <p className="text-5xl font-extralight text-theme mt-24">+</p>
                                            <p className="text-sm text-lightblack tracking-wide mb-4 ">Add a photo</p>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                id="file-for"
                                                className="absolute h-full w-full opacity-0 cursor-pointer"
                                                onChange={(e) => Profile_image_upload(e)}
                                            />
                                        </div>
                                    }

                                </div>
                            </div>
                            <div className="grid grid-flow-row grid-row-2 w-full">
                                <div className="grid lg:grid-flow-col lg:grid-cols-2 lg:grid-rows-1 gap-10 w-full">
                                    <div className="w-full">
                                        <p className="font-medium pb-2">First Name</p>
                                        <input
                                            className="h-12 w-full px-5 text-black bg-input text-sm tracking-wide appearance-none focus:outline-none outline-none border border-input focus:border-theme"
                                            placeholder="Enter first name"
                                            defaultValue={user?.first_name}
                                            ref={first_name}
                                            disabled={false}
                                        />
                                    </div>
                                    <div className="w-full">
                                        <p className="font-medium pb-2">Last Name</p>
                                        <input
                                            className="h-12 w-full px-5 text-black bg-input text-sm tracking-wide appearance-none outline-none focus:outline-none border border-input focus:border-theme"
                                            placeholder="Enter last name"
                                            ref={last_name}
                                            defaultValue={user?.last_name}
                                            disabled={false}
                                        />
                                    </div>
                                </div>
                                <div className="grid lg:grid-flow-col lg:grid-cols-2 lg:grid-rows-1 gap-10 w-full lg:mt-0 mt-8">
                                    <div className="w-full">
                                        <p className="font-medium pb-2">Email </p>
                                        <input
                                            className="h-12 w-full px-5 text-black bg-input text-sm tracking-wide appearance-none outline-none focus:outline-none border border-input focus:border-theme"
                                            placeholder="Enter email"
                                            disabled={true}
                                            defaultValue={user?.email}
                                        />
                                    </div>
                                    <div className="w-full">
                                        <p className="font-medium pb-2">Phone No. </p>
                                        <input
                                            className="h-12 w-full px-5 text-black bg-input text-sm tracking-wide appearance-none outline-none focus:outline-none border border-input focus:border-theme"
                                            placeholder="Enter phone no"
                                            ref={phone}
                                            disabled={false}
                                            defaultValue={user?.phone}
                                        />
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="mt-5 h-10">
                            <div className="flex float-right gap-10">
                                <button className="focus:outline-none text-sm tracking-wide">Cancel</button>
                                <button className="h-12 w-36 bg-theme hover:bg-hover text-white focus:outline-none text-sm tracking-wide"
                                    onClick={() => Update_User_details()}
                                >Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Account
