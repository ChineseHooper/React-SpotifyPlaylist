const clientId = "7019e555a5924000a85124482389d475";
const redirectUri = "http://localhost:3000";
let accessToken;

const Spotify = {

    getAccessToken: function() {
        if (accessToken) {
            return accessToken;
        }
        //
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresIn[1]);
            // clear token when it expires;
            window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
            window.history.pushState("Access Token", null, "/");
            return accessToken;
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
            window.location = accessUrl; 
        }
    },

    search:function(term){
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,{
            method:'GET',
            headers:{
                Authorization: `Bearer ${accessToken}`
            } 
        }).then(res => res.json())
        .then(jsonRes => {
            if(!jsonRes.tracks){
                return [];
            }
            //map create a new array with the results of calling a provided function on every element in the calling array.
            return jsonRes.track.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }))
        })
    },

    savePlaylist:function(name,trackUris){
        if(!name || !trackUris.length){
            return;
        }
        const accessToken = Spotify.getAccessToken();
        const headers = {
            Authorization:`Bearer ${accessToken}`
        };

        let userId;
        return fetch('https://api.spotify.com/v1/me',{ headers:headers }
        ).then(res => res.json()
        ).then(jsonRes => {
            userId = jsonRes.id;
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,{
                headers:headers,
                method:'POST',
                body: JSON.stringify({name:name})
            }).then(res => res.json()
            ).then(jsonResponse => {
                const playlistId = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,{
                    headers:headers,
                    method:`POST`,
                    body:JSON.stringify({uris: trackUris})
                })
            })
        })
    }

};

export default Spotify;
