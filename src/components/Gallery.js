import React, { useState, useEffect } from "react";
import { useAuthUser } from "react-auth-kit";
import { IoTrashOutline } from "react-icons/io5";
import { MdRocketLaunch } from "react-icons/md";
import { FaSpinner } from "react-icons/fa";
import { Link } from "react-router-dom";
import ErrorMessage from "./ErrorMessage";
import initPocketBase from "../helpers/initPocketbase";

const MAX_GALLERIES_FETCHED = 3;

const NO_ERROR = {
    error: false,
    message: "",
};

export default function GalleryDashboard({ refreshTriggerParrent }) {
    const pb = initPocketBase();
    const auth = useAuthUser();
    const [galleries, setGalleries] = useState([]);
    const [maxResults, setMaxResults] = useState(MAX_GALLERIES_FETCHED);
    const [pageResults, setPageResults] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loadingResults, setLoadingResults] = useState(true);
    const [showLoadingError, setShowLoadingError] = useState(false);
    const [generalError, setGeneralError] = useState(NO_ERROR);

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
            setTotalPages(results.totalPages);
            console.log("pages", results.totalPages);
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
                setGalleries([...updatedGalleries]);
                setLoadingResults(false);
            });
        } catch (error) {
            console.warn(error);
            setShowLoadingError(true);
        } finally {
            setLoadingResults(false);
        }
    };

    const getUrl = (galleryId, filename, fileToken) => {
        const url = pb.files.getUrl(galleryId, filename, {
            token: fileToken,
            thumb: "0x300",
        });
        return url;
    };

    const loadMoreResults = async () => {
        setPageResults(pageResults + 1);
        await getUserGalleryData(pageResults + 1);
    };

    const deleteGalleryPhotos = async (galleryId, photoIds) => {
        setGeneralError(NO_ERROR);
        try {
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
            removeGalleryPhotos(galleryId);
        } catch (error) {
            console.log(error);
            setGeneralError({
                error: true,
                message: "Failed to delete gallery.",
            });
        }
        // setRefreshTrigger(!refreshTrigger);
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
        setGeneralError(NO_ERROR);
        try {
            const trainingJob = await pb
                .collection("training_jobs")
                .getFirstListItem(`gallery_id="${galleryId}"`);
            return trainingJob;
        } catch (error) {}
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
            await pb.collection("training_jobs").create(data);
            // console.log(record)
        } catch (error) {
            setGeneralError({
                error: true,
                message: "Failed to start training the model.",
            });
        }
    }

    useEffect(() => {
        getUserGalleryData(pageResults);
    }, []);

    useEffect(() => {
        // monitor update trigger from the parent element (on files upload) and trigger the state change
        getUserGalleryData(pageResults);
    }, [refreshTriggerParrent]);

    return (
        <div className="bg-slate-950">
            <div className="flex justify-center">
                <div className="w-full lg:w-4/5 ">
                    {galleries.map((gallery) => (
                        <div
                            key={gallery.id}
                            className="mx-4 my-4 p-2 lg:p-6 border-2 border-slate-500 bg-slate-900 rounded"
                        >
                            {generalError.error && (
                                <ErrorMessage message={generalError.message} />
                            )}
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
                                    <button className="flex items-center border border-slate-400 hover:border-slate-200 rounded-lg p-2 transition duration-250">
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
            {showLoadingError && (
                <div className="z-0 relative bg-slate-950  text-white">
                    <div className="flex justify-center">
                        <div className="m-4 p-4">
                            <h1 className="text-2xl text-slate-200 shadow-lg">
                                Failed to load your generated galleries.
                            </h1>
                        </div>
                    </div>
                </div>
            )}

            {pageResults < totalPages && (
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
