import { initializeApp } from "firebase/app";
import { get, getDatabase, ref, set } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAyButGwy_9KQ_UMC0AnurKyupd4yRgVwo",
  authDomain: "lobby-eef07.firebaseapp.com",
  databaseURL: "https://lobby-eef07-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "lobby-eef07",
  storageBucket: "lobby-eef07.appspot.com",
  messagingSenderId: "292889344397",
  appId: "1:292889344397:web:f21d0e77fa0b090c1de5c4"
};

const app = initializeApp(firebaseConfig);

// Get a reference to the database service
const db = getDatabase();

const dbRef = (directory, id = "") => {
  return ref(db, `${directory}/` + id);
}

// Then we are setting the data we want in that reference point
export const setDoc = async (directory, id, data) => {
  set(dbRef(directory, id), data);
}

export const createGame = async () => {

  let gameCreated = false; 

  do {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'.toUpperCase();
    const charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  
    const value = await getDoc("lobbies", result)
    
    if(value === null){
      setDoc("lobbies", result)
      gameCreated = true; 
    }
  }while (gameCreated !== false)

  console.log("hej");

}

export const getDoc = async (directory, id = "") => {
  return get(dbRef(directory, id))
    .then((snapshot) => {
      if(snapshot.exists()){
        return snapshot.val();
      }
      else {
        return null
      }
    })
}