import { useEffect, useState } from "react"
import { ThemeContext } from "context";

// 1. look for a stored theme value in localStorage
// 2. check os `prefers-color-scheme` for theme value
// 3. default to 'light' theme
// user should be able to choose a specific theme (store that value in localStorage)
// make theme value and setter available to app through Context.Provider

function getInitialThemeValue(){
    const savedValue = localStorage.getItem('theme')
    const osValue = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    return savedValue || osValue
}

export default function ThemeControl({children}){
    const [theme, setTheme] = useState(getInitialThemeValue())

    useEffect(() => {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            // only apply this change if user has not chosen a specific mode (eg. 'auto')
            const savedValue = localStorage.getItem('theme')
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

    console.log({theme})

    return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}