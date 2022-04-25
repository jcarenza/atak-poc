import { useAuth } from "hooks/auth"
import { ReactComponent as Logo } from "./logo.svg"
import Avatar from "components/Avatar"
import style from "./nav.module.css"

export default function Nav () {
    const { user } = useAuth()
    return (
        <header className={style.header}>
            <Logo />
            <nav className={style.nav}>
                {/* future app links here */}
            </nav>
            <Avatar name={user?.Name || user?.Username} />
        </header>
    )
}
