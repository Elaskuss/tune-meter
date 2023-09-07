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
} from "firebase/database";
import { dbRealtime } from "./firebase.config";
import { getAuth, signInAnonymously } from "firebase/auth";

const db = dbRealtime;
const auth = getAuth();

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

let unsubscribeDataChange = () => {};

export const onDataChange = async (directory, key, value, updatePlayers) => {
    const collectionRef = ref(db, directory);
    const q = query(collectionRef, orderByChild(key), equalTo(value));

    unsubscribeDataChange();

    unsubscribeDataChange = onValue(q, (snapshot) => {
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

export const createPlayer = async (displayName, gameKey) => {
    return signInAnonymously(auth)
        .then(() => {
            const player = {
                id: auth.currentUser.uid,
                displayName: displayName.toUpperCase(),
                status: "Not Ready",
                gameKey: gameKey,
                gameActive: false,
                points: 0,
                guessed: false,
                round: 0,
            };

            sessionStorage.setItem("id", auth.currentUser.uid);
            return player;
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        });
};

export const createGame = async (displayName, updatePlayer, updatePlayers) => {
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
            const player = await createPlayer(displayName, gameKey);

            await setDoc("lobbies/" + gameKey, { gameActive: false });

            updatePlayer(player);
            onDataChange("players", "gameKey", gameKey, updatePlayers);

            gameCreated = true;
        }
    } while (gameCreated === false);
};

export const joinGame = async (
    gameKey,
    displayName,
    updatePlayer,
    updatePlayers
) => {
    const value = await getDoc("lobbies/" + gameKey);

    if (value === null) {
        throw new Error("Game not found");
    }

    const sameName = await queryValue("players", "gameKey", gameKey);

    sameName.forEach((player) => {
        if (player.displayName === displayName.toUpperCase()) {
            throw new Error("Username is already in use");
        }
    });

    const player = await createPlayer(displayName, gameKey);

    updatePlayer(player);
    onDataChange("players", "gameKey", gameKey, updatePlayers);
};

export const reconnectGame = async (player, updatePlayer, updatePlayers) => {
    updatePlayer(player);
    onDataChange("players", "gameKey", player.gameKey, updatePlayers);
};

//#endregion
