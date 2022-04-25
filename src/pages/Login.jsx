import Cookies from "universal-cookie"

const { REACT_APP_COOKIE_NAME } = process.env
const cookieName = REACT_APP_COOKIE_NAME || ""
const cookies = new Cookies()

/* 
    Dummy login, two auth cookies will be set via HTTP headers:
    - oAuth token --> HttpOnly, Secure, Same-Site
    - user session data --> Secure, Same-Site (for POC purposes, this the cookie we're setting here)
*/

export default function Login (){
    return <>
        <button onClick={() => {
            cookies.set(cookieName, JSON.stringify({
                isAuthenticated: true, 
                User: {Name: 'John Doe', Username: 'jdoe'},
                RefreshExpires: 999999999999999
            }))
            document.location.reload()
        }}>Login</button>
        <div className="instrux">dummy auth validation (click button to set auth cookie)</div>
    </>
}