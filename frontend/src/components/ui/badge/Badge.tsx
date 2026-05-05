import style from "./Badge.module.css";

const Badge = ({text}: {text: string}) => {
    return (
        <span className={`badge ${style.componentBadge} small fw-semibold mb-2 d-inline-block`}>
            {text}
        </span>
    )
}

export default Badge;