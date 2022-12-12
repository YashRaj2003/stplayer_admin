import React, { useRef, useState, useEffect } from "react";
import { firedb, storage } from "../firebaseconfig";
import { useStateValue } from "../StateProvider";
import AWN from "awesome-notifications";
import { useHistory } from "react-router";
import Edit from "../Images/icon_edit.png";
import Image from "../Images";
import { nanoid } from "nanoid";
import VideoThumbnail from 'react-video-thumbnail';
function Video() {

    const [id, setid] = useState(`${nanoid(20)}`);
    const [progress_thumbnail, setprogress_thumbnail] = useState(0);
    const [progress_video, setprogress_video] = useState(0);
    const [videourl, setvideourl] = useState(null);
    const [thumbnailurl, setthumbnailurl] = useState(null);

    const [tags, settags] = useState([]);

    let tagref = useRef();
    let title = useRef();
    let cline = useRef();
    let pline = useRef();
    let label = useRef();
    let description = useRef();
    let facebook = useRef();
    let instagram = useRef();
    let twitter = useRef();

    const removeTag = (e) => {
        console.log(e);
        settags(tags.filter((word) => e !== word));
    };

    const addtags = (e) => {
        e.preventDefault();

        if (tags?.includes(tagref.current.value)) {
            return;
        }
        settags([...tags, tagref.current.value.trim()]);
        tagref.current.value = "";
    };


    const [{ user }, dispatch] = useStateValue();
    const history = useHistory();

    const [video, setvideo] = useState({
        createdAt: Date.now(),
        user: user.email,
    });


    const imageupload = (e) => {
        var image = e.target.files[0];
        const type = image.type.split("/")[1];

        if (!image) {
            new AWN().alert("no  file selected", { position: "bottom-right" });
            return;
        }

        var storageRef = storage.ref();
        var uploadtask = storageRef
            .child(`files/${id + ".jpeg"}`)
            .put(image);

        uploadtask.on(
            "state_changed",
            function (snapshot) {
                var progress_thumbnail = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setprogress_thumbnail(progress_thumbnail);
            },
            (error) => {
                new AWN().alert(error.message);
            },
            () => {
                uploadtask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    setthumbnailurl(downloadURL);

                });
            }
        );
    };

    const video_upload = (e) => {
        var image = e.target.files[0];
        const type = image.type.split("/")[1];

        if (!image) {
            new AWN().alert("no  file selected", { position: "bottom-right" });
            return;
        }

        var storageRef = storage.ref();
        var uploadtask = storageRef
            .child(`files/${id + ".mp4"}`)
            .put(image);

        uploadtask.on(
            "state_changed",
            function (snapshot) {
                var progress_video = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setprogress_video(progress_video);
            },
            (error) => {
                new AWN().alert(error.message);
            },
            () => {
                uploadtask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    videourl = downloadURL;
                });
            }
        );
    };

    useEffect(() => {
        firedb
            .collection("files")
            .doc(id)
            .get()
            .then((res) => {
                if (res.data()) {
                    setvideo(res.data());
                }
            });
    }, []);

    function createVideo() {
        const data = { ...video, tags: tags }
        firedb
            .collection("files")
            .doc(id)
            .set(data)
            .then(() => {
                new AWN().success("success");
                history.replace("/panel/assets/video");
            })
            .catch((e) => {
                new AWN().alert(e.message);
            });

    }

    function testsubmit() {

        var details = {
            createdAt: Date.now(),
            user: user.email,
            title: title.current.value,
            cline: cline.current.value,
            pline: pline.current.value,
            label: label.current.value,
            description: description.current.value,
            facebook: facebook.current.value,
            instagram: instagram.current.value,
            twitter: twitter.current.value,
        }

        if (!details.title) {
            alert("please add title for the video")
        }
        if (!details.label) {
            alert("please add label for the video")
        }
        console.log(details)

    }
    return (
        <div className="bg-dashboard_bg min-h-screen text-white">
            <div className="h-24 border-b border-border border-opacity-10 items-center flex px-10">
                <h1 className="text-4xl font-medium">Create New Video</h1>
            </div>
            <div className="lg:px-16 px-5 mt-10 pb-32">
                <div className="bg-card_bg">
                    <div className="border-b flex justify-between ml-8 mr-8 py-5 items-center">
                        <h1 className="text-lg tracking-wide">Thumbnail</h1>
                    </div>
                    <div className="p-8">
                        <div className="flex lg:flex-row flex-col gap-16">
                            {!thumbnailurl ? <div className="relative">
                                <div className="lg:w-96 lg:h-[216px] w-64 h-36 ">
                                    <div className="absolute lg:w-96 lg:h-[216px] w-64 h-36 hover:shadow-inner cursor-pointer">
                                        <div className="flex justify-end ">
                                            <input type="file" accept=".jpg,.png,.jpeg" className="lg:w-96 lg:h-[216px] w-64 h-36 opacity-0" onChange={(e) => imageupload(e)} />
                                        </div>
                                    </div>
                                    <div className="w-full h-full bg-input flex flex-col items-center justify-between">
                                        <p className="text-5xl font-extralight text-hover mt-24">+</p>
                                        <p className="text-xs md:text-xs lg:text-sm  text-black tracking-wide mb-4 ">Drag your file here or click to upload</p>
                                    </div>
                                </div>

                            </div>
                                : <div className="">

                                    <div className="lg:w-96 lg:h-[216px] w-64 h-36 relative hover:shadow-inner">
                                        <div className="absolute right-0 cursor-pointer">
                                            <input type="file" accept=".jpg,.png,.jpeg" className="h-8 w-8 opacity-0 absolute" onChange={(e) => imageupload(e)} />
                                            <img src={Edit} alt="" className="w-8 h-8" onChange={(e) => imageupload(e)} />
                                        </div>
                                        <img src={thumbnailurl} alt="" className="h-full w-full" />
                                    </div>
                                </div>
                            }

                            <div className="">
                                <div>
                                    <p className="font-medium pb-2">Please follow these rules so your release isn't rejected by the stores & services:</p>
                                    <ul className="list-disc tracking-wide text-sm px-8">

                                        <li>{thumbnailurl}File format: PNG, JPG or JPEG</li>
                                        <li>Color space: RGB</li>
                                        <li>Minimum dimensions: 1920x1080 pixels, but recommend 1280x720 pixels.</li>
                                        <li>16:9 image: width and height must be in 16:9 ratio.</li>
                                        <li>Your image cannot be stretched, upscaled, or appear to be low-resolution.</li>
                                        <li>The information on your cover art must match your album title and artist name.</li>
                                        <li>Website addresses, social media links and contact information are not permitted on album artwork.</li>
                                        <li>Your cover art may not include sexually explicit imagery.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </div>
                    {video?.thumbnail || progress_thumbnail > 0 ? (
                        <div className="mx-8 pb-8">
                            <div className="py-2 bg-input text-black  px-4">
                                {progress_thumbnail <= 99
                                    ? <div> Uploading &nbsp;{Math.floor(progress_thumbnail) + "%"}</div>
                                    : <div className="truncate ">{thumbnailurl}</div>}
                            </div>
                        </div>
                    ) : (<div className="">{thumbnailurl}</div>)}
                </div>
                <div className="bg-card_bg mt-10">
                    <div className="border-b flex justify-between ml-8 mr-8 py-5 items-center">
                        <h1 className="text-lg tracking-wide">Video</h1>
                    </div>
                    <div className="p-8">
                        <div className="flex lg:flex-row flex-col gap-16">
                            {!video?.videoURL ? <div className="relative">
                                <div className="lg:w-96 lg:h-[216px] w-64 h-36 ">
                                    <div className="absolute lg:w-96 lg:h-[216px] w-64 h-36 hover:shadow-inner cursor-pointer">
                                        <div className="flex justify-end ">
                                            <input type="file" accept=".mp4" className="lg:w-96 lg:h-[216px] w-64 h-36 opacity-0"
                                                onChange={(e) => video_upload(e)} />
                                        </div>
                                    </div>
                                    <div className="w-full h-full bg-input flex flex-col items-center justify-between">
                                        <p className="text-5xl font-extralight text-hover mt-24">+</p>
                                        <p className="text-xs md:text-xs lg:text-sm  text-black tracking-wide mb-4 ">Drag your file here or click to upload</p>
                                    </div>
                                </div>
                            </div>
                                : <div className="">
                                    <div className="lg:w-96 lg:h-[216px] w-64 h-36 relative hover:shadow-inner">
                                        <video src={video?.videoURL} className="w-full h-56 appearance-none outline-none focus:outline-none " controls></video>
                                    </div>
                                    <div className="lg:w-96 w-64 flex items-center justify-center mt-3">
                                        <div className="w-20 relative">
                                            <input type="file" accept=".mp4" className="w-20 opacity-0 absolute  cursor-pointer" onChange={(e) => video_upload(e)} />
                                            <p className="w-max underline underline-offset-2 cursor-pointer">replace</p>
                                        </div>
                                    </div>
                                </div>
                            }

                            <div className="">
                                <div>
                                    <p className="font-medium pb-2">Please follow these rules so your release isn't rejected by the stores & services:</p>
                                    <ul className="list-disc tracking-wide text-sm px-8">
                                        <li>File format: MP4</li>
                                        <li>Minimum dimensions: 1280x720 pixels, but recommend 1920x1080 pixels.</li>
                                        <li>16:9 Video: width and height must be in 16:9 ratio.</li>
                                        <li>Your Video cannot be stretched, upscaled, or appear to be low-resolution.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>


                    {video?.videoURL || progress_video > 0 ? (

                        <div className="mx-8 pb-8">
                            <div className="py-2 bg-input text-black  px-4">
                                {progress_video <= 99
                                    ? <div> Uploading &nbsp;{Math.floor(progress_video) + "%"}</div>
                                    : <div className="truncate ">{video?.videoURL}</div>}
                            </div>
                        </div>
                    ) : (<div className="">{video?.videoURL}</div>)}
                </div>
                <div className="bg-card_bg mt-10">
                    <div className="border-b flex justify-between ml-8 mr-8 py-5 items-center">
                        <h1 className="text-lg tracking-wide">Details</h1>
                    </div>
                    <div className="py-6">

                        <div className="px-8 py-3">
                            <p className="text-lg font-medium tracking-wide pb-2">Title</p>
                            <input
                                type="text"
                                ref={title}
                                className="h-12 w-full p-5 appearance-none outline-none focus:outline-none border-2 focus:border-hover text-black" placeholder="Enter title of video" />
                        </div>
                        <div className="grid lg:grid-col-2 lg:grid-flow-col px-8">
                            <div className="pr-3 py-3">
                                <p className="text-lg font-medium tracking-wide pb-2">C line</p>
                                <input
                                    type="text"
                                    ref={cline}
                                    className="h-12 w-full p-5 appearance-none outline-none focus:outline-none border-2 focus:border-hover text-black"
                                    placeholder="C line" />
                            </div>
                            <div className="pl-3 py-3">
                                <p className="text-lg font-medium tracking-wide pb-2">P line</p>
                                <input
                                    type="text"
                                    ref={pline}
                                    className="h-12 w-full p-5 appearance-none outline-none focus:outline-none border-2 focus:border-hover text-black"
                                    placeholder="P line" />
                            </div>
                        </div>
                        <div className="grid grid-col-2 grid-flow-col px-8">
                            <div className="py-3">
                                <p className="text-lg font-medium tracking-wide pb-2">Label Name</p>
                                <input
                                    type="text"
                                    ref={label}
                                    className="h-12 w-full p-5 appearance-none outline-none focus:outline-none border-2 focus:border-hover text-black"
                                    placeholder="Label Name" />
                            </div>

                        </div>

                        <div className="px-8 py-3">
                            <p className="text-lg font-medium tracking-wide pb-2">Description</p>
                            <textarea
                                type="text"
                                ref={description}
                                className="h-32 w-full p-5 appearance-none outline-none focus:outline-none border border-opacity-0 focus:border-hover text-black" placeholder="Enter description of video" />
                        </div>
                        <div className="px-8 py-3">
                            <p className="text-lg font-medium tracking-wide pb-2">Social Credits</p>
                            <input
                                type="text"
                                ref={facebook}
                                defaultValue="https://facebook.com/"
                                className="h-12 w-full p-5 mb-2 appearance-none outline-none focus:outline-none border-2 focus:border-hover text-black"
                                placeholder="Facebook"
                            />
                            <input
                                type="text"
                                ref={instagram}
                                defaultValue="https://instagram.com/"
                                className="h-12 w-full p-5 my-2 appearance-none outline-none focus:outline-none border-2 focus:border-hover text-black"
                                placeholder="Instagram"
                            />
                            <input
                                type="text"
                                ref={twitter}
                                defaultValue="https://twitter.com/"
                                className="h-12 w-full p-5 my-2 appearance-none outline-none focus:outline-none border-2 focus:border-hover text-black"
                                placeholder="Twitter"
                            />
                        </div>
                        <div className="px-8 py-3">
                            <p className="tracking-wide">Tags </p>
                            <div className="">
                                <div className="flex flex-wrap mt-2 bg-input items-center">
                                    {tags?.map((e) => (
                                        <span
                                            className="bg-black text-white m-2   cursor-pointer"
                                        >
                                            <span className="flex items-center py-[5px]">
                                                <p className="px-2">{e}</p>
                                                <img src={Image.Closewhite} alt="" className="h-3 px-2" onClick={() => removeTag(e)} />
                                            </span>
                                        </span>
                                    ))}
                                    <form onSubmit={(e) => addtags(e)}>
                                        <input
                                            type="text"
                                            ref={tagref}
                                            className="px-5 w-full bg-input text-black appearance-none outline-none border border-input focus:border-input h-12 text-sm tracking-wide"
                                            placeholder="Enter Tag(s)"
                                        />
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-10">
                    <button
                        onClick={() => testsubmit()}
                        className="bg-theme hover:bg-hover text-black px-7  py-3 rounded font-medium">
                        Submit
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Video
