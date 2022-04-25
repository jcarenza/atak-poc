/* eslint-disable import/no-webpack-loader-syntax */
import { useEffect, useState } from "react"
import mapboxgl from "mapbox-gl"
import { MapboxLayer } from "@deck.gl/mapbox"
import { ScatterplotLayer } from "@deck.gl/layers"
import {calcOptimalFrameRate} from "utils/frameRate"
import WebWorker from "worker-loader!./realtime.worker"
import "mapbox-gl/dist/mapbox-gl.css"

const { REACT_APP_MAPBOX_TOKEN } = process.env
const worker = new WebWorker() // <-- should be initialized at the app level

export default function MapboxView () {
    const [rate, setRate] = useState(10000)

    useEffect(() => {
        // mount mapbox
        const map = new mapboxgl.Map({
            container: "map",
            accessToken: REACT_APP_MAPBOX_TOKEN,
            style: "mapbox://styles/jcarenza/ckjc254l96fjp19s8zbsmfjrr",
            center: [-74.5, 40], // starting position [lng, lat]
            zoom: 2,
        })
        const myScatterplotLayer = new MapboxLayer({
            id: "my-scatterplot",
            type: ScatterplotLayer,
            data: {
                length: 0,
                attributes: {
                    getPosition: { value: new Float32Array([]), size: 3, offset: 0, stride: 24, normalized: false },
                    getFillColor: { value: new Float32Array([]), size: 3, offset: 12, stride: 24, normalized: false },
                }
            },
            pickable: true,
            opacity: 0.8,
            filled: true,
            radiusMinPixels: 4,
            radiusMaxPixels: 4,
            getPosition: (d) => d.position,
            getFillColor: [255, 0, 0],
        })

        // wait for map to be ready
        map.on("load", () => {
            // add to mapbox
            map.addLayer(myScatterplotLayer);
            map.on('zoomend', () => {
                // optimize render refresh rate as "frames per pixel" 
                const frameRate = calcOptimalFrameRate(map.getZoom())
                setRate(frameRate < 1000 ? `${frameRate} ms` : `${(frameRate/1000).toFixed(1)} s`)
                worker.postMessage({msg: 'changeFPS', frameRate })
            })
            // initialize worker
            worker.onmessage = ({ data }) => {
                myScatterplotLayer.setProps({
                    data: {
                        length: data?.count || 0,
                        attributes: {
                            getPosition: { value: data?.binaryData || new Float32Array([]), size: 3, offset: 0, stride: 24, normalized: false },
                            getFillColor: { value: data?.binaryData || new Float32Array([]), size: 3, offset: 12, stride: 24, normalized: false },
                        },
                    }
                });
            }
            worker.postMessage({ msg: "init", frameRate: 10000 })
            return () => {
                worker.postMessage({ msg: "close" })
            }
        })
    }, [])

    return <div id="map"><div className="control">{rate}</div></div>
}
