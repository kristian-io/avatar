import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { saveAs } from "file-saver";

import initPocketBase from "../helpers/initPocketbase";
import ImagePreview from "./ImagePreview";
import ImageResultSection from "./ImageResultSection";

const MAX_GALLERIES_FETCHED = 10;

export default function GalleryResults() {
    const pb = initPocketBase();
    const [galleries, setGalleries] = useState([]);
    const [showPreview, setShowPreview] = useState(false);
    const [previewUrl, setPreviewUrl] = useState("");
    const [loadingResults, setLoadingResults] = useState(true);
    const [maxResults, setMaxResults] = useState(MAX_GALLERIES_FETCHED);
    const [pageResults, setPageResults] = useState(1);
    const [showError, setShowError] = useState(false);

    const closePreview = () => {
        setShowPreview(false);
        // setPreviewUrl("")
    };

    const handlePreview = (url) => {
        setPreviewUrl(url);
        setShowPreview(true);
    };

    const handleDownload = (url) => {
        // random 8 char name
        const filename =
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);
        saveAs(url, filename);
    };

    const getUserGalleryData = async (page) => {
        setLoadingResults(true);
        try {
            const results = await pb
                .collection("gallery_out")
                .getList(page, maxResults, {
                    sort: "-created",
                });

            const fetchedGalleries = results.items;
            const fileToken = await pb.files.getToken();

            const updatedGalleries = fetchedGalleries.map((gallery) => {
                const imageUrls = gallery.image.map((imageName) =>
                    getUrl(gallery, imageName, fileToken)
                );
                return { ...gallery, imageUrls };
            });
            setGalleries([...galleries, ...updatedGalleries]);
            setLoadingResults(false);
        } catch (error) {
            setShowError(true);
        } finally {
            setLoadingResults(false);
        }
    };

    const loadMoreResults = async () => {
        setPageResults(pageResults + 1);
        await getUserGalleryData(pageResults + 1);
    };

    const getUrl = (galleryId, filename, fileToken) => {
        const url = pb.files.getUrl(galleryId, filename, { token: fileToken });
        return url;
    };

    useEffect(() => {
        getUserGalleryData(pageResults);
    }, []);

    const renderNoGalleries = () => (
        <div className="z-0 relative bg-slate-950 min-h-full h-[calc(100vh-25vh)] overflow-hidden min-w-full text-white">
            <div className="flex justify-center">
                <div className="m-4 p-4">
                    <h1 className="text-2xl text-slate-200 shadow-lg">
                        You do not have any generated photos yet.
                    </h1>
                </div>
            </div>
            <div className="flex justify-center">
                <div className="w-1/2 leading-4">
                    <p className="leading-4">1. Upload your selfies. (1min)</p>
                    <p>2. Train an AI model with 1 click. (50min)</p>
                    <p>
                        3. Model generates your photos from expertly crafted
                        prompts. (10min)
                    </p>
                    <p>4. Magic: Get your results.</p>
                </div>
            </div>
            <Link to="/dashboard">
                <div className="flex justify-center m-4 p-4 ">
                    <button className="text_shadow mb-1 m-4 p-2 font-bold text-2xl rounded  border-2  hover:bg-slate-100 bg-pink-700 hover:text-pink-700 border-pink-700 transition duration-700">
                        Get started
                    </button>
                </div>
            </Link>
        </div>
    );

    if (galleries.length === 0 && !loadingResults && !showError) {
        return renderNoGalleries();
    }

    return (
        <div className="z-0 relative bg-slate-950">
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
            {loadingResults && (
                <div>
                    <div className="flex justify-center">
                        <div className="m-4 p-4">
                            <h1 className="text-2xl text-slate-200 shadow-lg">
                                Loading your generated galleries...
                            </h1>
                            {/* spinner */}
                        </div>
                    </div>
                </div>
            )}
            {showPreview && (
                <ImagePreview
                    url={previewUrl}
                    setPreviewUrl={setPreviewUrl}
                    closePreview={closePreview}
                />
            )}
            <ul className="flex justify-center">
                <div className="w-full lg:w-4/5 ">
                    {galleries.map((gallery) => (
                        <div
                            key={gallery.id}
                            className="mx-4 my-4 p-2 lg:p-6 border-2 border-slate-500 bg-slate-900 rounded"
                        >
                            <div className="flex justify-between flex-wrap items-center  gap-4 p-2 mt-2 mb-2 rounded bg-cyan-800 opacity-75 ">
                                <li>
                                    {gallery.name} | ({gallery.gallery_id})
                                </li>
                            </div>
                            <div className="flex flex-wrap gap-2 ">
                                {gallery.imageUrls.map((url) => (
                                    <ImageResultSection
                                        url={url}
                                        handleDownload={handleDownload}
                                        handlePreview={handlePreview}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </ul>
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
