export async function fetchSong(track, artist){
    const response = await fetch(`https://express-tune-meter.onrender.com/deezer/search/?track=${encodeURIComponent(track)}&artist=${encodeURIComponent(artist)}`)
    const data = response.json().then((data) => {
        return data
    })
    return data
} 
    
