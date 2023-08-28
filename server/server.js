const express = require("express");
const app = express();
const port = 3001; // You can change this port

app.use(express.json());

// Set up CORS middleware
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

app.use((req, res, next) => {
    if (req.method !== "GET") {
        res.status(405).json({ error: "Method not allowed" });
    } else {
        next();
    }
});

app.get("/deezer/search/", async (req, res) => {
    const artist = req.query.artist;
    const track = req.query.track;

    if (!artist || !track) {
        return res
            .status(400)
            .json({ error: "Missing artist or track query parameters" });
    }

    const deezerApiUrl = `https://api.deezer.com/search?q=artist:"${artist}"track:"${track}"`;

    try {
        const response = await fetch(deezerApiUrl);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({
            error: "An error occurred while fetching data from Deezer.",
        });
    }
});

app.listen(port, () => console.log("Example app is listening on port 3000."));
