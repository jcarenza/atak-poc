import { useEffect, useState, useCallback } from "react"
import { ThemeContext } from "context";

// 1. look for a stored theme value in localStorage
// 2. check os `prefers-color-scheme` for theme value
// 3. default to 'light' theme
// user should be able to choose a specific theme (store that value in localStorage)
// make theme value and setter available to app through Context.Provider

const SAVED_THEME_KEY = 'theme'

function getInitialThemeValue(){
    return localStorage.getItem(SAVED_THEME_KEY) || getCurrentOSPreference()
}

function getCurrentOSPreference(){
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function ThemeControl({children}){
    const [theme, setTheme] = useState(getInitialThemeValue())

    const changeTheme = useCallback(
        (value) => {
            if(value === 'light' || value === 'dark'){
                // persist selected theme value in localStorage
                localStorage.setItem(SAVED_THEME_KEY, value)
                setTheme(value)
            }else {
                // clear any previously selected theme value from localStorage ('auto')
                localStorage.removeItem(SAVED_THEME_KEY)
                setTheme(getCurrentOSPreference())
            }
        },
        [setTheme]
    )

    useEffect(() => {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            // only apply os theme changes when in 'auto' mode (no persisted value)
            const savedValue = localStorage.getItem(SAVED_THEME_KEY)
            if(!savedValue){
                setTheme(event.matches ? "dark" : "light")
            }
        });
    }, [])

    useEffect(() => {
        if(theme === 'dark'){
            document.body.classList.add('dark')
        }else{
            document.body.classList.remove('dark')
        }
    }, [theme])

    return <ThemeContext.Provider value={{theme, changeTheme}}>{children}</ThemeContext.Provider>
}