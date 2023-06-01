import React, { useState } from 'react';
import initPocketBase from '../helpers/initPocketbase';
import { useAuthUser } from 'react-auth-kit';
import { useRef } from 'react';
import Notification from './Notification';
import GalleryDashboard from './Gallery';
import { IoCloudUploadOutline } from 'react-icons/io5';


const defaultStatus = { message: "", type: "info", delay: 5000 }


const FileUploader = () => {
    const [files, setFiles] = useState([]);
    const [status, setStatus] = useState(defaultStatus)
    const [refreshTrigger, setRefreshTrigger] = useState(true)
    const [isUploading, setIsUploading] = useState(false)

    const ref = useRef(null);

    const pb = initPocketBase();
    const auth = useAuthUser()

    const handleFileChange = (event) => setFiles(event.target.files);




    const handleSubmit = async (event) => {
        event.preventDefault();
        setStatus(defaultStatus)
        setIsUploading(true)
        const formData = new FormData();
        try {
            for (let file of files) {
                formData.append('image', file);
            }
            formData.append('users_id', auth().id)

            // upload and create new record
            const createdRecord = await pb.collection('gallery').create(formData);

            // Perform further action/logic here based on the newly created record
            console.log(createdRecord);
            ref.current.value = ""
            let info = {}
            info = { message: "Upload successful", type: "info" }
            setStatus(status => ({
                ...status,
                ...info
            }))
            setIsUploading(false)
            // trigger refresh of the galery by flipping it
            setRefreshTrigger(!refreshTrigger)
        }

        catch (error) {
            console.error(error)
            let info = {}
            info = { message: "Upload failed!", type: "error" }
            setStatus(status => ({
                ...status,
                ...info
            }))
            setIsUploading(false)
        }
    };

    return (
        <>
            < form onSubmit={handleSubmit} >
                <div className="m-4  p-2 lg:p-6 border border-slate-800 bg-slate-900 rounded justify-center large:w-3/5 small:w-full" >
                    <h1 className='flex justify-center text-center my-8  text-xl'>Upload your Photos to create a new Gallery</h1>
                    <div className='flex justify-center'>
                        {/* <label > */}
                        {/* <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="fileInput">Upload multiple files</label> */}


                        {/* <input className="block  text-lg border  rounded-lg cursor-pointer  text-gray-400 focus:outline-none bg-gray-700 border-gray-600 placeholder-gray-400" ref={ref} id="fileInput" type="file" multiple required onChange={handleFileChange}></input> */}


                        {/* <label className="appearance-none block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="multiple_files">
                            Upload multiple files
                        </label> */}

                        <input className="appearance-none large:w-3/5 small:w-full block text-lg text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" ref={ref} type="file" required multiple onChange={handleFileChange}>
                        </input>


                        {/* 
                             <input className="text-lg rounded file:text-white file:bg-inherit file:border-2 " ref={ref} id="fileInput" type="file" multiple onChange={handleFileChange} /> 
                             </label>  */}
                    </div>
                    <div className='flex justify-center'>
                        <div className=''>

                            <button disabled={isUploading} className="flex items-center gap-2 mx-4 my-4 px-3 py-1 border rounded border-slate-600 hover:border-slate-400 hover:shadow transition duration-250" type="submit">
                                <IoCloudUploadOutline className='min-h-full' />
                                <span className='text-center '>{isUploading ? "Uploading..." : "Create Gallery"}</span>
                            </button>
                        </div>
                    </div>
                </div >
            </form >
            {
                status.message &&
                <Notification message={status.message} type={status.type} delay={status.delay} />
            }
            <GalleryDashboard refreshTriggerParent={refreshTrigger} />
        </>
    );
};

export default FileUploader;