type IconProps = {
    name: string
    className: string
    onClick?: any
}

export function Sprite({
    name,
    className,
    onClick
}: IconProps): JSX.Element {
    return (
        <svg onClick={onClick} className={className}>
            <use xlinkHref={`/sprite.svg#${name}`} />
        </svg>
    )
}