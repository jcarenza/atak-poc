import { COLORS } from "utils/swatches"
import css from "./avatar.module.css"


export default function Avatar({ name }) {
    const char = (name || "?").charAt(0).toUpperCase()
    const color = COLORS.get(char)?.color || ""
    const bkd = COLORS.get(char)?.background || ""
    const style = { "--avatar-color": color, "--avatar-bkd": bkd }
    return (
        <button type="button" className={css.avatar} style={style}>
            {char}
        </button>
    )
}
