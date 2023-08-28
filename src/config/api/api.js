export async function fetchSong(track, artist){
    const response = await fetch(`http://localhost:3001/deezer/search/?track=${encodeURIComponent(track)}&artist=${encodeURIComponent(artist)}`)
    const data = response.json().then((data) => {
        return data
    })
    return data
} 
    
