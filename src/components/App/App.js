import React from "react";
import "./App.css";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";
import Spotify from "../../utils/Spotify"

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'My Playlist',
      playlistTracks: []
    };

    // bind method for list editing;
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.setPlaylistName = this.setPlaylistName.bind(this);
    // bind method for save list;
    this.savePlaylist = this.savePlaylist.bind(this);
    // bind method for search
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    // 如何在多个对象中寻找某一特定值；
    const playlist = this.state.playlistTracks;
    if (
      playlist.find(savedTrack => savedTrack.id === track.id)
    ) {
      return;
    }
    playlist.push(track); //push()同时会返回一个arraylength的number
    this.setState({
      playlistTracks: playlist
    });
  }

  removeTrack(track){
    const playlist = this.state.playlistTracks;
    console.log("!");
    //可以用array.filter()更简单的完成；
    for(let index in playlist){
      const currentTrack = playlist[index];
      if(currentTrack.id === track.id){
        playlist.splice(index,1);
        console.log(playlist);
        this.setState({
          playlistTracks: playlist
        })
        return;
      }
    }
  }

  setPlaylistName(name){
    this.setState({
      playlistName:name
    })
  }

  savePlaylist(){
    const trackURIs = this.state.playlistTracks;
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
      })
    })
  }

  search(term){
    Spotify.search(term).then((searchResults) => {
      this.setState({searchResults:searchResults})
    })
  }

  render() {
    return (
      <div>
        <h1>
          Ja<span className="highlight">mmm</span>ing
        </h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults
              onAdd={this.addTrack}
              searchResults={this.state.searchResults}
            />
            <Playlist
              onRemove={this.removeTrack}
              onNameChange={this.setPlaylistName}
              onSave={this.savePlaylist}
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
