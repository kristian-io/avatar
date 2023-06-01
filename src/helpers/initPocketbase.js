import PocketBase from 'pocketbase';



// you can place this helper in a separate file so that it can be reused
export default function initPocketBase() {
    // const pb = new PocketBase('http://127.0.0.1:8090');
    // console.log("API", process.env.REACT_APP_API_END_POINT)

    const pb = new PocketBase(process.env.REACT_APP_API_END_POINT);

    return pb
}