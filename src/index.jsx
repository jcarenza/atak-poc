import { StrictMode } from "react"
import ReactDOM from "react-dom"
import { ErrorBoundary } from "react-error-boundary"
import ErrorFallback from "components/ErrorFallback"
import Theme from "components/Theme"
import { BrowserRouter } from "react-router-dom"
import { useAuth } from "hooks/auth"
import Login from "pages/Login"
import App from "./App"
import reportWebVitals from "./reportWebVitals"
import { postWebVitalAnalytics, postErrorException } from "utils/analytics"
import "normalize.css"
import "focus-visible"
import "./index.css"

const AuthCheck = ({ children }) => {
    const { isAuthenticated } = useAuth()
    return !isAuthenticated ? <Login /> : <>{children}</>
}

ReactDOM.render(
    <StrictMode>
        <ErrorBoundary FallbackComponent={ErrorFallback} onError={postErrorException}>
            <BrowserRouter>
                <Theme>
                    <AuthCheck>
                        <App />
                    </AuthCheck>
                </Theme>
            </BrowserRouter>
        </ErrorBoundary>
    </StrictMode>,
    document.getElementById("root")
)

// post performance metrics to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(process.env.NODE_ENV === "production" ? postWebVitalAnalytics : console.log)
