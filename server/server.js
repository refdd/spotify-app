/* 
__ we well use library spotify-web-api node 
- in the library we use authentication to sing in  in spotify 
-use  assesstoken and refreshToken  
*/
const express = require("express")
const cors = require("cors") // use becouse we have error localhost 3000 and localhost 3001
const SpotifyWebApi = require("spotify-web-api-node") //import the library to  use it 
const bodyParse = require("body-parser") // becouse body is not undefined
const lyricsFinder = require("lyrics-finder")


const app = express() //use it to mack end boint to assesstoken refreshToken
app.use(cors())// well fix all error
app.use(bodyParse.json())
app.use(bodyParse.urlencoded({ extended: true }))


// make route to refreshToken   

app.post("/refresh", (req, res) => {
    const refreshToken = req.body.refreshToken
    const spotifyApi = new SpotifyWebApi({
        redirectUri: "http://localhost:3000",
        clientId: "fb4aceea4e9f46d5beceddc1cfab4db7",
        clientSecret: "839e8217b9374863a717b2194a49d80d",
        refreshToken,
    })
    //refresh the accessToken  

    spotifyApi
        .refreshAccessToken()
        .then(data => {
            res.json({
                accessToken: data.body.access_token,
                expiresIn: data.body.expires_in
            })
        })
        .catch(err => {
            console.log(err)
            res.sendStatus(400)
        })
})


// first we well post the library 
app.post("/login", (req, res) => {
    const code = req.body.code
    const spotifyApi = new SpotifyWebApi({
        redirectUri: "http://localhost:3000",
        clientId: "fb4aceea4e9f46d5beceddc1cfab4db7",
        clientSecret: "839e8217b9374863a717b2194a49d80d"
    })
    spotifyApi.authorizationCodeGrant(code).then(data => { // ready to return API
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,//to refrish the API 
            expiresIn: data.body.expires_in // show if API expires 
        })
    })
        .catch(() => {
            res.sendStatus(400) //if the API have a error 400 mean not found
        })
})
app.get("/lyrics", async (req, res) => {
    const lyrics =
        (await lyricsFinder(req.query.artist, req.query.track)) || "No Lyrics Found"
    res.json({ lyrics })
})



app.listen(3001)

/*
-- we well use nodemon to swap to node to node
-- and go to json pack and add short ot use devStart : nodemon server.js
*/ 