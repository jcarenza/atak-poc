export default function ErrorFallback ({ error }) {
    return <div>{error?.message}</div>
}
