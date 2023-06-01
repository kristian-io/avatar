import React, { useState, useEffect } from 'react';
import initPocketBase from '../helpers/initPocketbase';
import { useAuthUser } from 'react-auth-kit';
import { IoTrashOutline } from 'react-icons/io5';
import { MdRocketLaunch } from 'react-icons/md';
import { Link } from "react-router-dom"

export default function GalleryDashboard({ refreshTriggerParent }) {
    const pb = initPocketBase();
    const auth = useAuthUser()
    const [galeries, setGaleries] = useState([])
    const [token, setToken] = useState("fake")
    const [refreshTrigger, setRefreshTrigger] = useState(refreshTriggerParent)




    const getUserGalleryData = async () => {
        try {
            const galleries = await pb.collection('gallery').getFullList({
                sort: '-created',
            });

            let updated_galleries = [];
            for (let gallery of galleries) {
                const trainingJobInfo = await getTrainingJobStatus(gallery.id);
                if (trainingJobInfo) {
                    console.log(`GalleryID: ${gallery.id} training job id: ${trainingJobInfo.id} training job status: ${trainingJobInfo.status}`);
                    updated_galleries.push({ ...gallery, job_id: trainingJobInfo.id, job_status: trainingJobInfo.status });
                } else {
                    updated_galleries.push({ ...gallery });
                }
            }

            // console.log(`Updated galleries data with job status`, updated_galleries);
            setGaleries(updated_galleries)
            const fileToken = await pb.files.getToken();
            setToken(fileToken)

        } catch (error) {
            console.log(error)
        }
    };

    const getUrl = (galleryId, filename, fileToken) => {
        // retrieve an example protected file url (will be valid ~5min)
        const url = pb.files.getUrl(galleryId, filename, { 'token': fileToken, 'thumb': '0x300' });
        // console.log(url)
        return url
    }




    const deleteGalleryPhotos = async (galleryId, photoIds) => {

        console.log(`Deleting galleryId: ${galleryId} photosIds: ${photoIds}`)

        if (!photoIds) {
            // delete all "documents" files
            await pb.collection('gallery').delete(galleryId);
            // update the gallery
            setRefreshTrigger(!refreshTrigger)

        }
        else {
            // delete individual files
            await pb.collection('gallery').update(galleryId, {
                'image-': photoIds,
            });
            // update the gallery
            setRefreshTrigger(!refreshTrigger)

        }

    }

    async function getTrainingJobStatus(galleryId) {

        console.log(`Getting status of training job for galleryId: ${galleryId} `)

        try {
            // const trainingJob = await pb.collection('training_jobs').getList(1, 1, {
            //     filter: `gallery_id="${galleryId}"`
            // })

            const trainingJob = await pb.collection('training_jobs').getFirstListItem(`gallery_id="${galleryId}"`);
            console.log(trainingJob)
            return trainingJob
        } catch (error) {
            // console.log(error)
            // } finally {
            //     return false
            // }
        }
        return false
    }


    async function createTrainingJob(galleryId, settings) {
        console.log(`Creating training job for userId: ${auth().id} \ngalleryID: ${galleryId} \nsettings: ${settings}`)
        try {
            const data = {
                "user_id": auth().id,
                "settings": settings,
                "gallery_id": galleryId,
                "status": "new"
            };
            const record = await pb.collection('training_jobs').create(data);
            console.log(record)
        } catch (error) {
            console.log(error)
        }
    }


    async function fetchData() {
        await getUserGalleryData();
    }


    // =====================================================================================================

    useEffect(() => {
        // monitor update trigger from the parent element (on files upload) and trigger the state change 
        setRefreshTrigger(!refreshTrigger)
    }, [refreshTriggerParent]);


    useEffect(() => {
        // when our internal (on gallery delete) trigger changes update the gallery...
        console.log("gallery update triggered...")
        fetchData()


    }, [refreshTrigger])


    return (
        <div >
            <ul className="flex justify-center">
                <div className='w-full lg:w-4/5 '>
                    {galeries.map((gallery) => (
                        <div key={gallery.id} className="mx-4 my-4 p-2 lg:p-6 border-2 border-slate-500 bg-slate-900 rounded">
                            <div className='flex justify-between flex-wrap items-center  gap-4 p-2 mt-2 mb-2 rounded bg-cyan-800 opacity-75 '>
                                <li >{gallery.name} | ({gallery.id})</li>
                                {!gallery.job_status && <button onClick={() => createTrainingJob(gallery.id)}
                                    className='flex items-center gap-1 px-4 py-2 border-2  bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 font-extrabold border-slate-200 rounded-lg text-white hover:border-fuchsia-800 hover:shadow transition duration-250 animate-pulse'
                                    disabled={gallery.job_status === "wip"}>
                                    <MdRocketLaunch className='w-6 h-auto ' />
                                </button>}
                                {gallery.job_status === "wip" && "AI is learning..."}
                                {gallery.job_status === "done" && <button><Link to={"/gallery"}>
                                    Results
                                </Link>

                                </button>
                                }
                                <button onClick={() => deleteGalleryPhotos(gallery.id)}
                                    className='flex items-center border border-slate-400 hover:border-slate-200 rounded-lg p-2 transition duration-250'>
                                    <IoTrashOutline size={25} className="cursor-pointer" />
                                    Delete Gallery
                                </button>
                            </div>
                            <ul className='flex flex-wrap gap-2 '>
                                {gallery.image.map((filename) => (
                                    <li className="flex-shrink flex-grow-0 " key={filename}>
                                        <img className="h-36 lg:h-56 w-auto rounded-lg hover:opacity-100 hover:scale-110 transition duration-200  " loading="lazy" alt="" src={getUrl(gallery, filename, token)} />
                                        {/* TODO : we should get the imageURL only once for browser cashing ... This way it does not get cached. */}
                                        {/* w-24 h-auto  */}
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