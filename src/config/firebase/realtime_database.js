import {
   equalTo,
   get,
   orderByChild,
   ref,
   set,
   query,
   onValue,
   remove,
   update,
   push,
   onDisconnect,
   getDatabase,
} from "firebase/database";
import { dbRealtime } from "./firebase.config";
import { v4 as uuidv4 } from "uuid";


const db = dbRealtime;


//#region Realtime database
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

const directoryListeners = {};

export const onDataChange = async (directory, key, value, update, reconnect = false) => {
   if (directoryListeners[directory]) {
      directoryListeners[directory]();
   }
   const collectionRef = ref(db, directory);
   const q = query(collectionRef, orderByChild(key), equalTo(value));

   let unsubscribe; // Define unsubscribe here
   if (directory === "players") {
      unsubscribe = onValue(q, async (snapshot) => {
         const dataArray = [];
         snapshot.forEach((childSnapshot) => {
            dataArray.push(childSnapshot.val());
         });
         const filteredArray = dataArray.filter(player => player.online === true);
         update(filteredArray, reconnect);
      });
   } else if (directory === "lobbies") {
      unsubscribe = onValue(q, async (snapshot) => {
         if (snapshot.val()) {
            update(snapshot.val()[value]);
         }
      });
   }
   // Store the unsubscribe function for this directory
   directoryListeners[directory] = unsubscribe;
};



export const queryValue = async (directory, key, value) => {
   const collectionRef = ref(db, directory);
   const q = query(collectionRef, orderByChild(key), equalTo(value));

   const dataArray = [];

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

export const updateDoc = async (directory, data) => {
   if (data !== undefined) {
      update(dbRef(directory), data);
   } else {
      console.error("Cannot set undefined data to the database.");
   }
};

export const addToDoc = async (directory, array, updatePlayer, player) => {
   array.forEach((item) => {
      push(dbRef(directory), item);
   });
   updatePlayer({ ...player });
};

export const removeDoc = async (directory) => {
   await remove(dbRef(directory));
};

export const createPlayer = async () => {
   const id = uuidv4();
   if (!localStorage.getItem("id")) {
      localStorage.setItem("id", id);
      return id;
   }
   return localStorage.getItem("id");
};

export const createGame = async () => {
   let gameCreated = false;
   let gameKey = "";

   do {
      const characters = "abcdefghijklmnopqrstuvwxyz0123456789".toUpperCase();
      const charactersLength = characters.length;
      for (let i = 0; i < 6; i++) {
         gameKey += characters.charAt(
            Math.floor(Math.random() * charactersLength)
         );
      }

      const value = await getDoc("lobbies/" + gameKey);

      if (value === null) {
         gameCreated = true;
      }
   } while (gameCreated === false);

   return gameKey;
};

export const joinGame = async (
   gameKey,
   displayName,
   updatePlayer,
   updatePlayers,
   updateLobby,
   host = false,
) => {

   const id = await createPlayer();
   if (host) {
      await setDoc("lobbies/" + gameKey, { host: id, catagory: "Top 100", round: 0, gameKey: gameKey, canJoin: true, roundOver: false, });
   }

   const value = await getDoc("lobbies/" + gameKey);

   if (value === null) {
      throw new Error("Game not found");
   }

   if (!value.canJoin) {
      throw new Error("Game is already active");
   }


   const sameName = await queryValue("players", "gameKey", gameKey);

   if (sameName !== null) {
      sameName.forEach((player) => {
         if (player.displayName === displayName) {
            throw new Error("Username is already in use");
         }
      });
   }

   const reUseId = await getDoc("players/" + id);
   if (reUseId?.gameKey === gameKey) {
      await updatePlayer({ ...reUseId, displayName: displayName.toUpperCase(), online: true, status: "Not Ready" });
   } else {
      await updatePlayer({ id: id, gameKey: gameKey, displayName: displayName.toUpperCase(), online: true });
   }

   await disconnect(id);
   onDataChange("lobbies", "gameKey", gameKey, updateLobby);
   onDataChange("players", "gameKey", gameKey, updatePlayers);
};

export const reconnectGame = async (player, updatePlayer, updatePlayers, updateLobby) => {
   updatePlayer(player);
   onDataChange("lobbies", "gameKey", player.gameKey, updateLobby);
   onDataChange("players", "gameKey", player.gameKey, updatePlayers, true);
};

export const disconnect = async (id) => {
   const db = getDatabase();
   const playersRef = ref(db, `players/${id}`);
   await onDisconnect(playersRef).update({ displayName: "", online: false });
};

export const disconnectNow = async (id) => {
   const db = getDatabase();
   const playersRef = ref(db, `players/${id}`);
   await update(playersRef, { displayName: "", online: false });
};
