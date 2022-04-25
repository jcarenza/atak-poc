import { useCallback, useEffect, useMemo, useState } from "react"
import Cookies from "universal-cookie"

const { REACT_APP_COOKIE_NAME } = process.env
const cookieName = REACT_APP_COOKIE_NAME || ""
const cookies = new Cookies()

function readUserCookie() {
    const cookie = cookies.get(cookieName)
    const now = Date.now() / 1000
    if (!cookie || typeof cookie.RefreshExpires !== "number" || cookie.RefreshExpires < now) {
        return
    }
    return cookie
}

export const useAuth = () => {
    const [auth, setAuth] = useState(readUserCookie())

    const updater = useCallback(
        ({ name, value }) => {
            // check if the auth cookie changed
            if (name === cookieName) {
                // update new auth cookie value
                setAuth(value ? JSON.parse(value) : value)
            }
        },
        [setAuth]
    )

    useEffect(() => {
        // listen for cookie changes
        cookies.addChangeListener(updater)
        // on unmount, cleanup listener
        return () => cookies.removeChangeListener(updater)
    }, [updater])

    return useMemo(() => {
        const jwtUser = auth?.User
        return {
            isAuthenticated: !!jwtUser,
            user: jwtUser,
        }
    }, [auth])
}
