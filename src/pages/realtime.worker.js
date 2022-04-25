import activity1 from "../data/mx_2022-03-13T15:27:24Z.json"
import activity2 from "../data/mx_2022-03-13T19:24:41Z.json"
import activity3 from "../data/mx_2022-03-14T03:00:23Z.json"
import activity4 from "../data/mx_2022-03-19T01:14:06Z.json"
import activity5 from "../data/mx_2022-03-19T01:58:18Z.json"
import activity6 from "../data/mx_2022-03-19T02:19:10Z.json"
import activity7 from "../data/mx_2022-03-19T15:33:54Z.json"
import activity8 from "../data/mx_2022-03-19T16:18:13Z.json"
import activity9 from "../data/mx_2022-03-19T18:20:00Z.json"
import activity10 from "../data/mx_2022-03-19T18:31:15Z.json"

const sources = [activity1, activity2, activity3, activity4, activity5, activity6, activity7, activity8, activity9, activity10]
/*
    USE CASES
    - realtime: view all or "pin" x number of individuals
        - only units online in past x hours?
        - show last seen location?
        - differentiate based on time delta?
    - playback: view all/some units in history playback
        - sync'd timelines
        - dropped frames?
        - timeline "buffers" next x number of frames from socket, saves in store, play loop reads/transfers

    IDEAS TO EXPLORE
    - keep separate state stores for various needs (dictionary, lastlocation, playback)
    - chunk objects into separate map layers?
        - this might correlate to the websocket channels we must subscribe to
        - assign new objects to a new layer round-robin style ()
        - age-off objects not seen for a while to their own layer?
    - socket sends multiple data points per message
        - avoids too many incoming messages at the same time, messages are throttled
        - we store all (or x number) of the records
        - tick loop determines which timestamp to postMessage based on recency...can snap to last if behind in fps, etc
        - this is probably preferred for playback to keep timelines in sync
    - Dynamic frame rate rendering
        - based on zoom level? (postmessage on 'zoomend', updates variable read at next tick)
        - based on number of objects being shown
        - independent frame rates for an "All" view versus a "Follow" or "Close Up" view
    - Playback, post chunks (buffers) to main thread for playback
        - use worker to buffer/sequence the data
        - pass chunks of data to main thread per tick
        - main thread updates at a faster frame rate for rendering?
    - first-person-view HUD
        - map view (follow)
        - scalable, FPV 30/60 (fps) --> toggle on multiple?
*/

let init = false
let conn1 = undefined // only used for dummy socket connection
let upToDate = true
let lastUpdate = 0
const color = [39 / 255, 170 / 255, 255 / 255]
let frameRate = 30000

const store = new Map()

onmessage = async ($event) => {
    switch ($event.data.msg) {
        case "init":
            if ($event.data.frameRate) {
                frameRate = parseInt($event.data.frameRate)
            }
            connect()
            break
        case "close":
            close()
            break
        case "changeFPS":
            frameRate = parseInt($event.data.frameRate)
            break
        default:
    }
}

let frame = 0
function connect() {
    // prevent multiple connections
    if (!init) {
        init = true
        // connect to websocket
        console.log("connect")
        // listen for socket messages
        // Fake websocket connections with local dummy data
        conn1 = setInterval(() => {
            let data = []
            sources.forEach((src) => {
                if (frame < src.length) {
                    data.push({
                        id: src[frame]?.id,
                        coord: src[frame]?.coord,
                        color,
                    })
                }
            })
            // TODO: store values with timestamp for age-out evaluation
            updateStore(data)
            frame++
        }, 33)
        requestAnimationFrame(tick)
    }
}

function tick(timestamp) {
    if (!upToDate && timestamp > lastUpdate + frameRate) {
        lastUpdate = timestamp
        upToDate = true
        // TODO: when store size gets large (10k+), reduce frame rate to accomodate processing time (ensure it completes within tick headroom)
        // const now = Date.now() // check timestamp delta for age-out
        const binaryData = new Float32Array(
            Array.from(store.values()).flatMap((d) => [d.coord[0], d.coord[1], 0, d.color[0], d.color[1], d.color[2]])
        )
        postMessage({ count: store.size, binaryData }, [binaryData.buffer]) // sub-millisecond to transfer
    }
    requestAnimationFrame(tick)
}

function close() {
    console.log("disconnect")
    init = false
    clearInterval(conn1) // only used for dummy socket connection
}

function updateStore(data) {
    upToDate = false
    // TODO: partition results into chunks? by socket channel?
    // TODO: keep history? last x frames?
    for (const i of data) {
        store.set(i.id, { coord: i.coord, color: i.color })
    }
}
