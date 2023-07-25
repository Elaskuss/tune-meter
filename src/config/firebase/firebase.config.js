import { initializeApp } from "firebase/app";
import {
  equalTo,
  get,
  getDatabase,
  orderByChild,
  ref,
  set,
  query,
  onValue,
  remove,
} from "firebase/database";
import { v4 as uuidv4 } from "uuid";

const firebaseConfig = {
  apiKey: "AIzaSyAyButGwy_9KQ_UMC0AnurKyupd4yRgVwo",
  authDomain: "lobby-eef07.firebaseapp.com",
  databaseURL:
    "https://lobby-eef07-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "lobby-eef07",
  storageBucket: "lobby-eef07.appspot.com",
  messagingSenderId: "292889344397",
  appId: "1:292889344397:web:f21d0e77fa0b090c1de5c4",
};

initializeApp(firebaseConfig);

// Get a reference to the database service
const db = getDatabase();

const dbRef = (directory) => {
  return ref(db, `${directory}`);
};

export const getDoc = async (directory) => {
  return get(dbRef(directory)).then((snapshot) => {
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return null;
    }
  });
};

export const onDataChange = async (directory, key, value, updatePlayers) => {
  const collectionRef = ref(db, directory);
  const q = query(collectionRef, orderByChild(key), equalTo(value));

  onValue(q, (snapshot) => {
   
    const dataArray = [];

    snapshot.forEach((childSnapshot) => {
      dataArray.push(childSnapshot.val());
    });

    updatePlayers(dataArray);
  });
};

export const queryValue = async (directory, key, value) => {
   const collectionRef = ref(db, directory);
   const q = query(collectionRef, orderByChild(key), equalTo(value));
 
   const dataArray = []

   const snapshot = await get(q);
 
   if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
         dataArray.push(childSnapshot.val());
      });
     return dataArray;
   } else {
     return null;
   }
 };
 

export const setDoc = async (directory, data) => {
  if (data !== undefined) {
    set(dbRef(directory), data);
  } else {
    console.error("Cannot set undefined data to the database.");
  }
};

export const removeDoc = async (directory) => {
     await remove(dbRef(directory));
 };


export const createPlayer = async (displayName, gameKey) => {
  const id = uuidv4();

  const player = {
    id: id,
    displayName: displayName,
    status: "not ready",
    gameKey: gameKey,
  };

  return player;
};

export const createGame = async (displayName, updatePlayer) => {
  let gameCreated = false;
  let result = "";

  do {
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789".toUpperCase();
    const charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    const value = await getDoc("lobbies/" + result);

    if (value === null) {
      const player = await createPlayer(displayName, result);

      localStorage.setItem("gameKey", result);
      localStorage.setItem("player", JSON.stringify(player));

      await setDoc("lobbies/" + result, {gameActive: false});

      updatePlayer(player);

      gameCreated = true;
    }
  } while (gameCreated === false);
};

export const joinGame = async (gameKey, displayName, updatePlayer) => {
  const value = await getDoc("lobbies/" + gameKey);

  if (value === null) {
    throw new Error("Game not found");
  }

  const sameName = await queryValue("players", "gameKey", gameKey);

  sameName.forEach((player) => {
   if(player.displayName === displayName){
      throw new Error("Username is already in use");
   }
  })

  const player = await createPlayer(displayName, gameKey);

  const players = [...value.players, player.id];

  localStorage.setItem("gameKey", gameKey);
  localStorage.setItem("player", JSON.stringify(player));

  await setDoc("lobbies/" + gameKey, {
    players: players,
  });

  updatePlayer(player);
};
