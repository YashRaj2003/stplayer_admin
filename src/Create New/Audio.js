import React, { useRef, useState, useEffect } from "react";
import { firedb, storage } from "../firebaseconfig";
import { useStateValue } from "../StateProvider";
import AWN from "awesome-notifications";
import { useHistory } from "react-router";
import Edit from "../Images/icon_edit.png";
import Image from "../Images";
import { nanoid } from "nanoid";

function Audio() {

    const [id, setid] = useState(`${nanoid(20)}`);
    const [progress_artwork, setprogress_artwork] = useState(0);
    const [progress_audio, setprogress_audio] = useState(0);





    const [tags, settags] = useState([]);

    let tagref = useRef();

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

    const [audio, setaudio] = useState({
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
            .child(`artwork/${id + ".jpeg"}`)
            .put(image);

        uploadtask.on(
            "state_changed",
            function (snapshot) {
                var progress_artwork = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setprogress_artwork(progress_artwork);
            },
            (error) => {
                new AWN().alert(error.message);
            },
            () => {
                uploadtask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    setaudio({ ...audio, artwork: downloadURL });
                });
            }
        );
    };

    const audio_upload = (e) => {
        var image = e.target.files[0];
        const type = image.type.split("/")[1];

        if (!image) {
            new AWN().alert("no  file selected", { position: "bottom-right" });
            return;
        }

        var storageRef = storage.ref();
        var uploadtask = storageRef
            .child(`audio/${id + ".mp3"}`)
            .put(image);

        uploadtask.on(
            "state_changed",
            function (snapshot) {
                var progress_audio = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setprogress_audio(progress_audio);
            },
            (error) => {
                new AWN().alert(error.message);
            },
            () => {
                uploadtask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    setaudio({ ...audio, trackURL: downloadURL });
                });
            }
        );
    };

    useEffect(() => {
        firedb
            .collection("audio")
            .doc(id)
            .get()
            .then((res) => {
                if (res.data()) {
                    setaudio(res.data());
                }
            });
    }, []);

    function createAudio() {
        firedb
            .collection("audio")
            .doc(id)
            .set(audio)
            .then(() => {
                new AWN().success("success");
                history.replace("/panel/assets/audio");
            })
            .catch((e) => {
                new AWN().alert(e.message);
            });

    }




    return (
        <div className="bg-dashboard_bg min-h-screen text-white">
            <div className="h-24 border-b border-border border-opacity-10 items-center flex px-10">
                <h1 className="text-4xl font-medium">Create New Audio</h1>
            </div>
            <div className="lg:px-16 px-5 mt-10 pb-32">
                <div className="bg-card_bg">
                    <div className="border-b flex justify-between ml-8 mr-8 py-5 items-center">
                        <h1 className="text-lg tracking-wide">Artwork</h1>
                    </div>
                    <div className="p-8">
                        <div className="flex lg:flex-row flex-col gap-16">
                            {!audio?.artwork ? <div className="relative">
                                <div className="lg:w-72 lg:h-72 w-64 h-64 ">
                                    <div className="absolute lg:w-72 lg:h-72 w-64 h-64 hover:shadow-inner cursor-pointer">
                                        <div className="flex justify-end ">
                                            <input type="file" accept=".jpg,.png,.jpeg" className="lg:w-72 lg:h-72 w-64 h-64 opacity-0" onChange={(e) => imageupload(e)} />
                                        </div>
                                    </div>
                                    <div className="w-full h-full bg-input flex flex-col items-center justify-between">
                                        <p className="text-5xl font-extralight text-theme mt-24">+</p>
                                        <p className="text-xs md:text-xs lg:text-sm  text-black tracking-wide mb-4 ">Drag your file here or click to upload</p>
                                    </div>
                                </div>
                            </div>
                                : <div className="lg:w-72 lg:h-72 w-64 h-64 relative hover:shadow-inner">
                                    <div className="absolute right-0 cursor-pointer">
                                        <input type="file" accept=".jpg,.png,.jpeg" className="h-8 w-8 opacity-0 absolute" onChange={(e) => imageupload(e)} />
                                        <img src={Edit} alt="" className="w-8 h-8" onChange={(e) => imageupload(e)} />
                                    </div>
                                    <img src={audio?.artwork} alt="" className="h-full w-full" />
                                </div>
                            }

                            <div className="">
                                <div>
                                    <p className="font-medium pb-2">Please follow these rules so your release isn't rejected by the stores & services:</p>
                                    <ul className="list-disc tracking-wide text-sm px-8">

                                        <li>File format: PNG, JPG or JPEG</li>
                                        <li>Color space: RGB</li>
                                        <li>Minimum dimensions: 1400x1400 pixels, but recommend 3000x3000px pixels.</li>
                                        <li>Sqaure image: width and height must be in 1:1 ratio.</li>
                                        <li>Your image cannot be stretched, upscaled, or appear to be low-resolution.</li>
                                        <li>The information on your cover art must match your album title and artist name.</li>
                                        <li>Website addresses, social media links and contact information are not permitted on album artwork.</li>
                                        <li>Your cover art may not include sexually explicit imagery.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </div>
                    {audio?.artwork || progress_artwork > 0 ? (
                        <div className="mx-8 pb-8">
                            <div className="">
                                {progress_artwork <= 99
                                    ?
                                    <div className="bg-input text-black py-4 my-4 px-8 flex items-center justify-between text-sm">
                                        <p className=" truncate w-40 md:w-64 lg:w-full">in progress... &nbsp;<span>{Math.floor(progress_artwork) + "%"}</span></p>
                                    </div>
                                    :
                                    <div className="bg-input text-black py-4 my-4 px-8 flex items-center justify-between text-sm">
                                        <p className=" truncate w-40 md:w-64 lg:w-96">{audio?.artwork}</p>
                                    </div>
                                }
                            </div>
                        </div>
                    ) : (<div className="">{audio?.artwork}</div>)}
                </div>
                <div className="bg-card_bg mt-10">
                    <div className="border-b flex justify-between ml-8 mr-8 py-5 items-center">
                        <h1 className="text-lg tracking-wide">Audio</h1>
                    </div>
                    <div className="px-8 py-5">
                        <p className="text-sm tracking-wide mt-2"><span className="text-error ">IMPORTANT:</span> Make sure you are uploading complete audio. We do not accept audio snippets.</p>



                        {audio?.trackURL || progress_audio > 0 ? (
                            <div className="">
                                <div className="">
                                    {progress_audio <= 99
                                        ?
                                        <div className="bg-input text-black py-4 my-4 px-8 flex items-center justify-between text-sm">
                                            <p className=" truncate w-40 md:w-64 lg:w-full">in progress... &nbsp;<span>{Math.floor(progress_audio) + "%"}</span></p>
                                        </div>
                                        :
                                        <div>
                                            <div className="bg-input text-black py-4 my-4 px-8 flex items-center justify-between text-sm">
                                                <div>
                                                    <p className="truncate w-40 md:w-64 lg:w-96">{audio?.trackURL}</p>
                                                </div>
                                                <div className="w-20 relative">
                                                    <input type="file" accept="audio/mp3, audio/wav" className="w-20 opacity-0 absolute  cursor-pointer" onChange={(e) => audio_upload(e)} />
                                                    <p className="w-max underline underline-offset-2">replace</p>
                                                </div>
                                            </div>
                                            <div className="bg-input text-black flex items-center justify-between text-sm">
                                                <audio src={audio?.trackURL} className="w-full appearance-none outline-none focus:outline-none " controls></audio>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        ) : (<div className="bg-input text-black h-12 my-4 px-8 flex items-center text-sm tracking-wide cursor-pointer relative  shadow-inner hover:shadow-inner">
                            <input type="file" accept="audio/mp3, audio/wav" className="h-12 opacity-0 my-4 px-8 w-full absolute  cursor-pointer " onChange={(e) => audio_upload(e)} />
                            <p className="text-lg text-success font-medium">+</p>
                            <p className="px-3 truncate text-sidetext">Drag your file here or click to upload (stereo WAV file only. Recommended min bit depth: 16 bit; sample rate: 44.1 kHz)</p>
                        </div>)}

                    </div>

                </div>

                <div className="bg-card_bg mt-10">
                    <div className="border-b flex justify-between ml-8 mr-8 py-5 items-center">
                        <h1 className="text-lg tracking-wide">Title</h1>
                    </div>
                    <div className="py-6">
                        <div className="grid lg:grid-cols-2 lg:grid-flow-col px-8 py-3 gap-x-5">
                            <div className="">
                                <p className="text-lg font-medium tracking-wide pb-2">Title</p>
                                <input
                                    type="text"
                                    className="h-12 w-full p-5 appearance-none outline-none focus:outline-none border-2 focus:border-hover text-black"
                                    placeholder="Enter the name of the track"
                                    onChange={(e) =>
                                        setaudio({ ...audio, title: e.target.value })
                                    } />
                            </div>
                            <div className="">
                                <p className="text-lg font-medium tracking-wide pb-2">Title version</p>
                                <input
                                    type="text"
                                    className="h-12 w-full p-5 appearance-none outline-none focus:outline-none border-2 focus:border-hover text-black"
                                    placeholder="For example: Remix or Bonus Track"
                                    onChange={(e) =>
                                        setaudio({ ...audio, title_version: e.target.value })
                                    }
                                />
                            </div>

                        </div>
                    </div>
                </div>
                <div className="bg-card_bg mt-10">
                    <div className="border-b flex justify-between ml-8 mr-8 py-5 items-center">
                        <h1 className="text-lg tracking-wide">Artist</h1>
                    </div>
                    <div className="py-6">

                        <div className="px-8 py-3">
                            <p className="text-lg font-medium tracking-wide pb-2">Artist</p>
                            <input
                                type="text"
                                className="h-12 w-full p-5 appearance-none outline-none focus:outline-none border-2 focus:border-hover text-black"
                                placeholder="Artist Name"
                                onChange={(e) =>
                                    setaudio({ ...audio, artist: e.target.value })
                                }
                            />
                        </div>
                        <div className="px-8 py-3">
                            <p className="text-lg font-medium tracking-wide pb-2">Producer</p>
                            <input
                                type="text"
                                className="h-12 w-full p-5 appearance-none outline-none focus:outline-none border-2 focus:border-hover text-black"
                                placeholder="Producer name"
                                onChange={(e) =>
                                    setaudio({ ...audio, producer: e.target.value })
                                }
                            />
                        </div>
                        <div className="grid lg:grid-cols-2 lg:grid-flow-col px-8 py-3 gap-x-5">

                            <div className="">
                                <p className="text-lg font-medium tracking-wide pb-2">Composer</p>
                                <p className="text-sm tracking-wide mb-1"><span className="text-error ">IMPORTANT: </span>Composer Name must be orignal name not stage name</p>

                                <input
                                    type="text"
                                    className="h-12 w-full p-5 appearance-none outline-none focus:outline-none border-2 focus:border-hover text-black"
                                    placeholder="Composer Name"
                                    onChange={(e) =>
                                        setaudio({ ...audio, composer: e.target.value })
                                    }
                                />
                            </div>
                            <div className="">
                                <p className="text-lg font-medium tracking-wide pb-2">Lyricst</p>
                                <p className="text-sm tracking-wide mb-1"><span className="text-error ">IMPORTANT: </span>Lyricst Name must be orignal name not stage name</p>

                                <input
                                    type="text"
                                    className="h-12 w-full p-5 appearance-none outline-none focus:outline-none border-2 focus:border-hover text-black"
                                    placeholder="Lyricst Name"
                                    onChange={(e) =>
                                        setaudio({ ...audio, lyricst: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-card_bg mt-10">
                    <div className="border-b flex justify-between ml-8 mr-8 py-5 items-center">
                        <h1 className="text-lg tracking-wide">Advanced info</h1>
                    </div>
                    <div className="py-6">
                        <div className="grid lg:grid-cols-2 lg:grid-flow-col px-8 py-3 gap-x-5">
                            <div className="">
                                <p className="text-lg font-medium tracking-wide pb-2">Language</p>
                                <select name="genre1" id="genre1"
                                    className="h-12 w-full bg-white border-b focus:outline-none focus:border-indigo-500 text-black px-5 appearance-none "
                                    onChange={(e) =>
                                        setaudio({ ...audio, Language: e.target.value })
                                    }
                                >
                                    <option value="" disabled selected hidden>Please Select</option>
                                    <option value="Bengali" className="">Bengali</option>
                                    <option value="English" className="">English</option>
                                    <option value="Hindi" className="">Hindi</option>
                                    <option value="Instrumental" className="">Instrumental</option>
                                    <option value="Malyalam" className="">Malyalam</option>
                                    <option value="Punjabi" className="">Punjabi</option>
                                    <option value="Santhali" className="">Santhali</option>
                                    <option value="Spanish" className="">Spanish</option>
                                    <option value="Swedish" className="">Swedish</option>
                                    <option value="Tamil" className="">Tamil</option>
                                    <option value="Telgu" className="">Telgu</option>
                                </select>
                            </div>
                            <div className="">
                                <p className="text-lg font-medium tracking-wide pb-2">Mood</p>
                                <select name="genre2" id="genre2"
                                    className="h-12 w-full bg-white border-b focus:outline-none focus:border-indigo-500 text-black px-5 appearance-none "
                                    onChange={(e) =>
                                        setaudio({ ...audio, mood: e.target.value })
                                    }
                                >
                                    <option value="" disabled selected hidden>Please Select</option>
                                    <option value="Sad" className="">Happy</option>
                                    <option value="Party" className="">Party</option>
                                    <option value="Romantic" className="">Romantic</option>
                                    <option value="Romantic" className="">Sad</option>
                                    <option value="Unplugged" className="">Unplugged</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid lg:grid-cols-2 lg:grid-flow-col px-8 py-3 gap-x-5">
                            <div className="">
                                <p className="text-lg font-medium tracking-wide pb-2">Genre 1</p>
                                <select name="genre1" id="genre1"
                                    className="h-12 w-full bg-white border-b focus:outline-none focus:border-indigo-500 text-black px-5 appearance-none "
                                    onChange={(e) =>
                                        setaudio({ ...audio, genre1: e.target.value })
                                    }
                                >
                                    <option value="" disabled selected hidden>Please Select</option>
                                    <option value="Acoustic">Acoustic</option>
                                    <option value="Bollywood">Bollywood</option>
                                    <option value="Brazallian">Brazallian</option>
                                    <option value="Classical">Classical</option>
                                    <option value="Dance">Dance</option>
                                    <option value="Electronic">Electronic</option>
                                    <option value="Folk">Folk</option>
                                    <option value="Hip/Pop">Hip/Pop</option>
                                    <option value="New Age">New Age</option>
                                    <option value="Indian">Indian</option>
                                    <option value="Indian Classical">Indian Classical</option>
                                    <option value="Pop">Pop</option>
                                    <option value="Rap">Rap</option>
                                    <option value="Rock">Rock</option>
                                    <option value="Soundtrack">Soundtrack </option>
                                    <option value="Spoken Word">Spoken Word</option>
                                    <option value="Vocal">Vocal</option>
                                    <option value="World">World</option>
                                </select>
                            </div>
                            <div className="">
                                <p className="text-lg font-medium tracking-wide pb-2">Genre 2</p>
                                <select name="genre2" id="genre2"
                                    className="h-12 w-full bg-white border-b focus:outline-none focus:border-indigo-500 text-black px-5 appearance-none "
                                    onChange={(e) =>
                                        setaudio({ ...audio, genre2: e.target.value })
                                    }
                                >
                                    <option value="" disabled selected hidden>Please Select</option>
                                    <option value="Acoustic">Acoustic</option>
                                    <option value="Bollywood">Bollywood</option>
                                    <option value="Brazallian">Brazallian</option>
                                    <option value="Classical">Classical</option>
                                    <option value="Dance">Dance</option>
                                    <option value="Electronic">Electronic</option>
                                    <option value="Folk">Folk</option>
                                    <option value="Hip/Pop">Hip/Pop</option>
                                    <option value="New Age">New Age</option>
                                    <option value="Indian">Indian</option>
                                    <option value="Indian Classical">Indian Classical</option>
                                    <option value="Pop">Pop</option>
                                    <option value="Rap">Rap</option>
                                    <option value="Rock">Rock</option>
                                    <option value="Soundtrack">Soundtrack </option>
                                    <option value="Spoken Word">Spoken Word</option>
                                    <option value="Vocal">Vocal</option>
                                    <option value="World">World</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid lg:grid-cols-2 lg:grid-flow-col px-8 py-3 gap-x-5">
                            <div className="">
                                <p className="text-lg font-medium tracking-wide pb-2">C line</p>
                                <input
                                    type="text"
                                    className="h-12 w-full p-5 appearance-none outline-none focus:outline-none border-2 focus:border-hover text-black"
                                    placeholder="2021 Armus Digital Ltd."
                                    onChange={(e) =>
                                        setaudio({ ...audio, cline: e.target.value })
                                    }
                                />
                            </div>
                            <div className="">
                                <p className="text-lg font-medium tracking-wide pb-2">P line</p>
                                <input
                                    type="text"
                                    className="h-12 w-full p-5 appearance-none outline-none focus:outline-none border-2 focus:border-hover text-black"
                                    placeholder="2021 Armus Digital Ltd."
                                    onChange={(e) =>
                                        setaudio({ ...audio, pline: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid lg:grid-cols-2 lg:grid-flow-col px-8 py-3 gap-x-5">
                            <div className="">
                                <p className="text-lg font-medium tracking-wide pb-2">Label Name</p>
                                <input
                                    type="text"
                                    className="h-12 w-full p-5 appearance-none outline-none focus:outline-none border-2 focus:border-hover text-black"
                                    placeholder="Armus Digital Ltd."
                                    onChange={(e) =>
                                        setaudio({ ...audio, label: e.target.value })
                                    }
                                />
                            </div>
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
                        onClick={() => createAudio()}
                        className="bg-theme hover:bg-hover text-black px-7  py-3 rounded font-medium">
                        Submit
                    </button>
                </div>
            </div>
        </div >
    )
}

export default Audio
