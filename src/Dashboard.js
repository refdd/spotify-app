import React, { useState, useEffect } from 'react'
import useAuth from './useAuth'
import { Container, Form } from "react-bootstrap"
import SpotifyWebApi from 'spotify-web-api-node'
import TrackSearchResukt from "./TrackSearchResukt"
import Player from './Player'
import axios from 'axios'

const spotifyApi = new SpotifyWebApi({ //use the library to get the items 
    clientId: "fb4aceea4e9f46d5beceddc1cfab4db7"
})

export default function Dashboard({ code }) {
    const accessToken = useAuth(code)
    const [search, setSearch] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [playingTrack, setPlayingTrack] = useState()
    const [lyrics, setLyrics] = useState("")



    function chooseTrack(track) {
        setPlayingTrack(track)
        setSearch("")
        setLyrics("")
    }


    // sent accessToken to the library to get the items 
    useEffect(() => {
        if (!accessToken) return
        spotifyApi.setAccessToken(accessToken)
    }, [accessToken]) // ever changes on accessToken work agien 

    useEffect(() => {
        if (!playingTrack) return

        axios
            .get("http://localhost:3001/lyrics", {
                params: {
                    track: playingTrack.title,
                    artist: playingTrack.artist,
                },
            })
            .then(res => {
                setLyrics(res.data.lyrics)
            })
    }, [playingTrack])




    // make request to get the data use search 
    useEffect(() => {
        if (!search) return setSearchResults([]) // make sure is we are searching 
        if (!accessToken) return // make sure accessToken is existing
        let cancel = false
        // becouse when i finsh typeing to cancel 
        spotifyApi.searchTracks(search).then(res => {
            if (cancel) return  // if true don't do anything
            setSearchResults(
                res.body.tracks.items.map((tracks) => {
                    const smallestAlbumImage = tracks.album.images.reduce((smallest, image) => {
                        if (image.height < smallest.height) return image
                        return smallest
                    }, tracks.album.images[0])
                    return {
                        artist: tracks.artists[0].name,
                        title: tracks.name,
                        uri: tracks.uri,
                        albumUrl: smallestAlbumImage.url

                    }
                }))
        })

        return () => cancel = true
    }, [search, accessToken])

    return (
        <Container className="d-flex flex-column py-2" style={{ height: "100vh" }} >
            <Form.Control
                type='search '
                placeholder='Search Songs/Artists'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex-grow-1 my-2">
                {searchResults.map(track => (
                    <TrackSearchResukt track={track} key={track.uri} chooseTrack={chooseTrack} />
                ))}
                {searchResults.length === 0 && (
                    <div className="text-center" style={{ whiteSpace: "pre" }}>
                        {lyrics}
                    </div>
                )}
            </div>
            <div><Player accessToken={accessToken} trackUri={playingTrack?.uri} /></div>
        </Container>
    )
}
