import { getDocs, collection } from "firebase/firestore";
import { dbFirestore } from "./firebase.config";

const db = dbFirestore;

export const getSongs = async () => {
    const songs = []
    try {
        const querySnapshot = await getDocs(collection(db, "songs"));
        querySnapshot.forEach((doc) => {
            songs.push(doc.data());
        });
        return songs; 
    } catch (error) {
        console.error("Error getting songs: ", error);
    }
};
