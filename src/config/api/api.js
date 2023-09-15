export async function fetchSong(track, artist) {
  let retryCount = 0;
  const maxRetries = 5;
  
  while (retryCount < maxRetries) {
    try {
      const response = await fetch(`https://us-central1-lobby-eef07.cloudfunctions.net/app/deezer/search/?track=${encodeURIComponent(track)}&artist=${encodeURIComponent(artist)}`);
      
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      // Handle any errors here, or you can simply retry on any error
    }
    
    // Wait for 300ms before the next retry
    await new Promise(resolve => setTimeout(resolve, 300));
    retryCount++;
  }
  
  throw new Error('Failed to fetch data after multiple retries');
}

export async function fetchCatagory(playlistID){
   let retryCount = 0;
  const maxRetries = 5;
  
  while (retryCount < maxRetries) {
    try {
      const response = await fetch(`https://us-central1-lobby-eef07.cloudfunctions.net/app/deezer/playlist/?playlist=${encodeURIComponent(playlistID)}`);
      
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      // Handle any errors here, or you can simply retry on any error
    }
    
    // Wait for 300ms before the next retry
    await new Promise(resolve => setTimeout(resolve, 300));
    retryCount++;
  }
  
  throw new Error('Failed to fetch data after multiple retries');
} 