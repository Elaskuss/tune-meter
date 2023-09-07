export async function fetchSong(track, artist) {
    let retryCount = 0;
    const maxRetries = 5;
    
    while (retryCount < maxRetries) {
      try {
        const response = await fetch(`https://express-tune-meter.onrender.com/deezer/search/?track=${encodeURIComponent(track)}&artist=${encodeURIComponent(artist)}`);
        
        if (response.ok) {
          const data = await response.json();
          return data;
        }
      } catch (error) {
        console.log("Didnt manage to fetch song");
      }
      
      await new Promise(resolve => setTimeout(resolve, 300));
      retryCount++;
    }
    
    throw new Error('Failed to fetch data after multiple retries');
  }
  