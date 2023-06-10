import React, { useState, useEffect } from 'react';
import initPocketBase from '../helpers/initPocketbase';
import { useAuthUser } from 'react-auth-kit';
import { Link, useNavigate } from "react-router-dom";

export default function GalleryResults({ refreshTriggerParent }) {
    const pb = initPocketBase();
    const auth = useAuthUser()
    const [galeries, setGaleries] = useState([])
    const [token, setToken] = useState("fake")
    const [refreshTrigger, setRefreshTrigger] = useState(refreshTriggerParent)
    // const navigate = useNavigate()



    const getUserGalleryData = async () => {
        try {
            const galleries = await pb.collection('gallery_out').getFullList({
                sort: '-created',
            });
            const fileToken = await pb.files.getToken();
            setToken(fileToken)

            let updated_galleries = [];
            for (let gallery of galleries) {
                const imageUrls = []
                for (let imageName of gallery["image"]) {
                    const url = getUrl(gallery, imageName, fileToken, "")
                    imageUrls.push(url)
                }
                updated_galleries.push({ ...gallery, "imageUrls": imageUrls })

            }
            console.log(`Galleries`, updated_galleries);
            setGaleries(updated_galleries)
        }
        catch (error) {
            console.log(error)
        }

    };


    // '0x300'
    const getUrl = (galleryId, filename, fileToken, thumb = "") => {
        // retrieve an example protected file url (will be valid ~5min)
        const url = pb.files.getUrl(galleryId, filename, { 'token': fileToken });
        // console.log(url)
        return url
    }




    // const deleteGalleryPhotos = async (galleryId, photoIds) => {

    //     console.log(`Deleting galleryId: ${galleryId} photosIds: ${photoIds}`)

    //     if (!photoIds) {
    //         // delete all "documents" files
    //         await pb.collection('gallery').delete(galleryId);
    //         // update the gallery
    //         setRefreshTrigger(!refreshTrigger)

    //     }
    //     else {
    //         // delete individual files
    //         await pb.collection('gallery').update(galleryId, {
    //             'image-': photoIds,
    //         });
    //         // update the gallery
    //         setRefreshTrigger(!refreshTrigger)

    //     }

    // }



    async function fetchData() {
        await getUserGalleryData();
    }


    // =====================================================================================================

    // useEffect(() => {
    //     // monitor update trigger from the parent element (on files upload) and trigger the state change 
    //     setRefreshTrigger(!refreshTrigger)
    // }, [refreshTriggerParent]);


    useEffect(() => {
        // when our internal (on gallery delete) trigger changes update the gallery...
        console.log("gallery update triggered...")
        fetchData()
    }, [refreshTrigger])

    useEffect(() => {
        const id = setInterval(() => {
            console.log("Fetching data ...")
            fetchData()
        }, 5 * 60 * 1000)
        return () => clearInterval(id)
    }, [])


    if (galeries.length === 0) {
        return (
            <div className="bg-slate-950 min-h-full h-[calc(100vh-25vh)] overflow-hidden min-w-full text-white">
                <div className="flex justify-center">
                    <div className='m-4 p-4'>
                        <h1 className='text-2xl text-slate-200 shadow-lg'>You do not have any galleries yet.</h1>
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
    }
    else return (
        <div className="bg-slate-950">
            <ul className="flex justify-center">
                <div className='w-full lg:w-4/5 '>
                    {galeries.map((gallery) => (
                        <div key={gallery.id} className="mx-4 my-4 p-2 lg:p-6 border-2 border-slate-500 bg-slate-900 rounded">
                            <div className='flex justify-between flex-wrap items-center  gap-4 p-2 mt-2 mb-2 rounded bg-cyan-800 opacity-75 '>
                                <li >{gallery.name} | ({gallery.gallery_id})</li>

                                <button>
                                    Download All Photos
                                </button>

                            </div>
                            <ul className='flex flex-wrap gap-2 '>
                                {gallery.imageUrls.map((url) => (
                                    <li className="flex-shrink flex-grow-0 " key={url}>
                                        <img className="h-36 lg:h-56 w-auto rounded-lg hover:opacity-100 hover:scale-110 transition duration-200  " loading="lazy" alt="" src={url + "&thumb=0x300"} />
                                    </li>
                                ))}
                            </ul>

                        </div>
                    ))}
                </div>
            </ul >
        </div >
    )
}