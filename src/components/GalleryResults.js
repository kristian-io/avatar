import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { saveAs } from 'file-saver';
import { FaDownload } from "react-icons/fa";
import { MdOutlineOpenInNew } from "react-icons/md";

import initPocketBase from '../helpers/initPocketbase';
import ImagePreview from './ImagePreview';

export default function GalleryResults() {
    const pb = initPocketBase();
    const [galleries, setGaleries] = useState([])
    const [showPreview, setShowPreview] = useState(false)
    const [previewUrl, setPreviewUrl] = useState("")
    const [loadingResults, setLoadingResults] = useState(true)
    const [maxResults, setMaxResults] = useState(10)
    const [pageResults, setPageResults] = useState(1)
    const [showError, setShowError] = useState(false)


    const closePreview = () => {
        setShowPreview(false)
        // setPreviewUrl("")
    }

    const handlePreview = (url) => {
        setPreviewUrl(url)
        setShowPreview(true)
    }

    const handleDownload = (url) => {
        // random 8 char name
        const filename = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        saveAs(url, filename);
    }

    const getUserGalleryData = async (page) => {
        setLoadingResults(true)
        try {
            const results = await pb.collection('gallery_out').getList(page, maxResults, {
                sort: '-created'
            });

            const fetchedGalleries = results.items
            const fileToken = await pb.files.getToken();

            const updatedGalleries = fetchedGalleries.map(gallery => {
                const imageUrls = gallery.image.map(imageName =>
                    getUrl(gallery, imageName, fileToken)
                );
                return { ...gallery, imageUrls }
            });
            setGaleries([...galleries, ...updatedGalleries])
            setLoadingResults(false)
        }
        catch (error) {
            setShowError(true)
        }
        finally {
            setLoadingResults(false)
        }
    };

    const loadMoreResults = async () => {
        setPageResults(pageResults + 1)
        await getUserGalleryData(pageResults + 1);
    }

    const getUrl = (galleryId, filename, fileToken) => {
        const url = pb.files.getUrl(galleryId, filename, { 'token': fileToken });
        return url
    }

    useEffect(() => {
        getUserGalleryData(pageResults)
    }, [])

    const renderNoGalleries = () => (
        <div className="z-0 relative bg-slate-950 min-h-full h-[calc(100vh-25vh)] overflow-hidden min-w-full text-white">
            <div className="flex justify-center">
                <div className='m-4 p-4'>
                    <h1 className='text-2xl text-slate-200 shadow-lg'>You do not have any generated photos yet.</h1>
                </div>
            </div>
            <div className="flex justify-center">
                <div className="w-1/2 leading-4">
                    <p className="leading-4">1. Upload your selfies. (1min)</p>
                    <p>2. Train an AI model with 1 click. (50min)</p>
                    <p>3. Model generates your photos from expertly crafted prompts. (10min)</p>
                    <p>4. Magic: Get your results.</p>
                </div>
            </div>
            <Link to="/dashboard">
                <div className='flex justify-center m-4 p-4 '>
                    <button className="text_shadow mb-1 m-4 p-2 font-bold text-2xl rounded  border-2  hover:bg-slate-100 bg-pink-700 hover:text-pink-700 border-pink-700 transition duration-700" >
                        Get started
                    </button>
                </div>
            </Link>
        </div>
    )


    if (galleries.length === 0 && !loadingResults && !showError) {
        return renderNoGalleries();
    }

    return (
        <div className="z-0 relative bg-slate-950">
            {showError && <div className="z-0 relative bg-slate-950 min-h-full h-[calc(100vh-25vh)] overflow-hidden min-w-full text-white">
                <div className="flex justify-center">
                    <div className='m-4 p-4'>
                        <h1 className='text-2xl text-slate-200 shadow-lg'>Failed to load your generated photos.</h1>
                    </div>
                </div>
            </div>}
            {loadingResults && <div>
                <div className="flex justify-center">
                    <div className='m-4 p-4'>
                        <h1 className='text-2xl text-slate-200 shadow-lg'>Loading your generated galleries...</h1>
                        {/* spinner */}
                    </div>
                </div>
            </div>}
            {showPreview && <ImagePreview url={previewUrl} setPreviewUrl={setPreviewUrl} closePreview={closePreview} />}
            <ul className="flex justify-center">
                <div className='w-full lg:w-4/5 '>
                    {galleries.map((gallery) => (
                        <div key={gallery.id} className="mx-4 my-4 p-2 lg:p-6 border-2 border-slate-500 bg-slate-900 rounded">
                            <div className='flex justify-between flex-wrap items-center  gap-4 p-2 mt-2 mb-2 rounded bg-cyan-800 opacity-75 '>
                                <li >{gallery.name} | ({gallery.gallery_id})</li>
                            </div>
                            <ul className='flex flex-wrap gap-2 '>
                                {gallery.imageUrls.map((url) => (
                                    <li className="flex-shrink flex-grow-0" key={url}>
                                        <div className="z-20 h-36 lg:h-56 w-36 lg:w-56 rounded-lg">
                                            <div
                                                style={{ "--image-url": `url(${url + "&thumb=0x300"})` }}
                                                className="bg-[image:var(--image-url)] h-36 lg:h-56 w-36 lg:w-56 rounded-lg bg-contain">
                                                <dir className="text-slate-900 p-0 m-0 z-30 hover:opacity-70 opacity-0 bg-slate-300 w-full h-full rounded-lg transition delay-50 duration-300">
                                                    <div className="flex justify-center items-end align-middle h-1/2">
                                                        <button
                                                            className="m-2"
                                                            onClick={() => handlePreview(url)}>
                                                            <MdOutlineOpenInNew size={30} />
                                                        </button>
                                                    </div>
                                                    <div className="flex justify-center items-start">
                                                        <button
                                                            className="m-2"
                                                            onClick={() => handleDownload(url)}>
                                                            <FaDownload size={30} />
                                                        </button>
                                                    </div>
                                                </dir>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </ul >
            {galleries.length !== 0 && <div className="flex justify-center">
                <button
                    className="flex items-center border border-slate-400 hover:border-slate-200 rounded-lg p-2 m-4 mb-6 transition duration-250"
                    onClick={loadMoreResults}>Load More</button>
            </div>}
        </div >
    )
}