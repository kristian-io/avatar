import PocketBase from "pocketbase";

export default function initPocketBase() {
    const pb = new PocketBase(process.env.REACT_APP_API_END_POINT);
    return pb;
}
