// hear we but li ligic to our login and authentication 
import { useState, useEffect } from 'react'
import axios from "axios"
export default function useAuth(code) {
    // the is all three pieces all we nead
    const [accessToken, setAccessToken] = useState()
    const [refreshToken, setRefreshToken] = useState()
    const [expiresIN, setExpiresIN] = useState()



    // use axios to post  the code  to  the server
    useEffect(() => {
        axios.post("http://localhost:3001/login", {
            code
        }).then(res => {
            setAccessToken(res.data.accessToken)
            setRefreshToken(res.data.refreshToken) // to refresh the login 
            setExpiresIN(res.data.expiresIn) // the login well expires in ..... min
            window.history.pushState({}, null, "/") // when i have Data delet the code 
        }).catch(() => {
            // window.location = "/"
        })

    }, [code])


    // refreshToken access form hear

    useEffect(() => {
        if (!refreshToken || !expiresIN) return
        const interval = setInterval(() => {
            axios
                .post("http://localhost:3001/refresh", {
                    refreshToken,
                })
                .then(res => {
                    setAccessToken(res.data.accessToken)
                    setExpiresIN(res.data.expiresIn)
                })
                .catch(() => {
                    window.location = "/"
                })
        }, (expiresIN - 60) * 1000)

        return () => clearInterval(interval)
    }, [refreshToken, expiresIN])

    return accessToken

}
