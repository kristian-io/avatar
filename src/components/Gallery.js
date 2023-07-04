import React, { useState, useEffect } from "react";
import initPocketBase from "../helpers/initPocketbase";
import { useAuthUser } from "react-auth-kit";
import { IoTrashOutline } from "react-icons/io5";
import { MdRocketLaunch } from "react-icons/md";
import { FaSpinner } from "react-icons/fa";
import { Link } from "react-router-dom";

const MAX_GALLERIES_FETCHED = 3;

export default function GalleryDashboard({ refreshTriggerParrent }) {
    const pb = initPocketBase();
    const auth = useAuthUser();
    const [galleries, setGalleries] = useState([]);
    const [maxResults, setMaxResults] = useState(MAX_GALLERIES_FETCHED);
    const [pageResults, setPageResults] = useState(1);
    const [loadingResults, setLoadingResults] = useState(true);
    const [showError, setShowError] = useState(false);
    // const [refreshTrigger, setRefreshTrigger] = useState(refreshTriggerParrent);

    pb.autoCancellation(false);

    const getUserGalleryData = async (page) => {
        console.log("fetching data");
        setLoadingResults(true);
        try {
            const results = await pb
                .collection("gallery")
                .getList(page, maxResults, {
                    sort: "-created",
                });

            const fetchedGalleries = results.items;
            const fileToken = await pb.files.getToken();

            const updatedGalleries = fetchedGalleries.map(async (gallery) => {
                const imageUrls = gallery.image.map((imageName) =>
                    getUrl(gallery, imageName, fileToken)
                );
                const trainingJobInfo = await getTrainingJobStatus(gallery.id);

                if (trainingJobInfo) {
                    return {
                        ...gallery,
                        imageUrls,
                        job_id: trainingJobInfo.id,
                        job_status: trainingJobInfo.status,
                    };
                }
                return {
                    ...gallery,
                    imageUrls,
                };
            });

            Promise.all(updatedGalleries).then((updatedGalleries) => {
                console.log("Updated galleries", updatedGalleries);
                // setGalleries([...galleries, ...updatedGalleries]);
                setGalleries([...updatedGalleries]);
                setLoadingResults(false);
            });
        } catch (error) {
            console.warn(error);
            setShowError(true);
        } finally {
            setLoadingResults(false);
        }
    };

    const getUrl = (galleryId, filename, fileToken) => {
        // retrieve a protected file url (will be valid ~5min)
        const url = pb.files.getUrl(galleryId, filename, {
            token: fileToken,
            thumb: "0x300",
        });
        // console.log(url)
        return url;
    };

    const loadMoreResults = async () => {
        setPageResults(pageResults + 1);
        await getUserGalleryData(pageResults + 1);
    };

    const deleteGalleryPhotos = async (galleryId, photoIds) => {
        // console.log(`Deleting galleryId: ${galleryId} photosIds: ${photoIds}`)
        if (!photoIds) {
            // delete all "documents" files
            await pb.collection("gallery").delete(galleryId);
            // update the gallery
        } else {
            // delete individual files
            await pb.collection("gallery").update(galleryId, {
                "image-": photoIds,
            });
            // update the gallery
        }
        // setRefreshTrigger(!refreshTrigger);
        removeGalleryPhotos(galleryId);
    };

    const removeGalleryPhotos = (galleryId) => {
        const updatedGalleries = [];
        for (let gallery of galleries) {
            if (gallery.id !== galleryId) {
                updatedGalleries.push(gallery);
            }
        }
        setGalleries(updatedGalleries);
    };

    async function getTrainingJobStatus(galleryId) {
        try {
            const trainingJob = await pb
                .collection("training_jobs")
                .getFirstListItem(`gallery_id="${galleryId}"`);
            return trainingJob;
        } catch (error) {
            // console.log(error)
            // } finally {
            //     return false
            // }
        }
        return false;
    }

    async function createTrainingJob(galleryId, settings) {
        // console.log(`Creating training job for userId: ${auth().id} \ngalleryID: ${galleryId} \nsettings: ${settings}`)
        try {
            const data = {
                user_id: auth().id,
                settings: settings,
                gallery_id: galleryId,
                status: "new",
            };
            const record = await pb.collection("training_jobs").create(data);
            // console.log(record)
        } catch (error) {
            console.log(error);
        }
    }

    // useEffect(() => {
    //     // monitor update trigger from the parent element (on files upload) and trigger the state change
    //     // setRefreshTrigger(!refreshTrigger);
    //     getUserGalleryData(pageResults);
    // }, [refreshTrigger]);

    useEffect(() => {
        // monitor update trigger from the parent element (on files upload) and trigger the state change
        // setRefreshTrigger(!refreshTrigger);
        getUserGalleryData(pageResults);
    }, []);

    useEffect(() => {
        getUserGalleryData(pageResults);
    }, [refreshTriggerParrent]);

    return (
        <div className="bg-slate-950">
            {showError && (
                <div className="z-0 relative bg-slate-950 min-h-full h-[calc(100vh-25vh)] overflow-hidden min-w-full text-white">
                    <div className="flex justify-center">
                        <div className="m-4 p-4">
                            <h1 className="text-2xl text-slate-200 shadow-lg">
                                Failed to load your generated photos.
                            </h1>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex justify-center">
                <div className="w-full lg:w-4/5 ">
                    {galleries.map((gallery) => (
                        <div
                            key={gallery.id}
                            className="mx-4 my-4 p-2 lg:p-6 border-2 border-slate-500 bg-slate-900 rounded"
                        >
                            <div className="flex justify-between flex-wrap items-center gap-4 p-2 mt-2 mb-2 rounded bg-cyan-800 opacity-75 ">
                                <li>
                                    {gallery.name} | ({gallery.id})
                                </li>
                                {!gallery.job_status && (
                                    <button
                                        onClick={() =>
                                            createTrainingJob(gallery.id)
                                        }
                                        className="flex items-center gap-1 px-4 py-2 border-2  bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 font-extrabold border-slate-200 rounded-lg text-white hover:border-fuchsia-800 hover:shadow transition duration-250 animate-pulse"
                                        disabled={gallery.job_status === "wip"}
                                    >
                                        <MdRocketLaunch className="w-6 h-auto " />
                                        Train AI Model
                                    </button>
                                )}
                                {gallery.job_status === "wip" &&
                                    "AI is learning..."}
                                {gallery.job_status === "done" && (
                                    <button>
                                        <Link to={"/gallery"}>Results</Link>
                                    </button>
                                )}
                                <button
                                    onClick={() =>
                                        deleteGalleryPhotos(gallery.id)
                                    }
                                    className="flex items-center border border-slate-400 hover:border-slate-200 rounded-lg p-2 transition duration-250"
                                >
                                    <IoTrashOutline
                                        size={25}
                                        className="cursor-pointer"
                                    />
                                    Delete Gallery
                                </button>
                            </div>
                            <ul className="flex flex-wrap gap-2 ">
                                {gallery.imageUrls.map((url) => (
                                    <li
                                        className="flex-shrink flex-grow-0 "
                                        key={url}
                                    >
                                        <img
                                            className="h-36 lg:h-56 w-auto rounded-lg hover:opacity-100 hover:scale-110 transition duration-200  "
                                            loading="lazy"
                                            alt=""
                                            src={url}
                                        />
                                        {/* TODO : we should get the imageURL only once for browser cashing ... This way it does not get cached. */}
                                        {/* w-24 h-auto  */}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            {loadingResults && (
                <div className="flex justify-center">
                    <div className="m-4 p-4">
                        <FaSpinner
                            className="animate-spin m-auto p-2"
                            size={55}
                        />
                        <h1 className="text-2xl text-slate-200 shadow-lg">
                            Loading your galleries...
                        </h1>
                    </div>
                </div>
            )}
            {galleries.length !== 0 && (
                <div className="flex justify-center">
                    <button
                        className="flex items-center border border-slate-400 hover:border-slate-200 rounded-lg p-2 m-4 mb-6 transition duration-250"
                        onClick={loadMoreResults}
                    >
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
}
