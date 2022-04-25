export function postWebVitalAnalytics(metric) {
    const body = JSON.stringify({ [metric.name]: metric.value })
    const url = process.env.REACT_APP_ANALYTICS_API_URL || ""
    if (!url) {
        return
    }
    if (navigator.sendBeacon) {
        navigator.sendBeacon(url, body)
    } else {
        fetch(url, { body, method: "POST", keepalive: true })
    }
}

export function postErrorException(error, info) {
    fetch(process.env.REACT_APP_API_URL + "/errors", {
        method: "post",
        body: JSON.stringify({ error, info }),
    })
}
