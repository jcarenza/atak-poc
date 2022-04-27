/* eslint-disable import/no-webpack-loader-syntax */
import { useContext, useEffect, useState } from "react"
import DeckGL from "@deck.gl/react"
import { ScatterplotLayer } from "@deck.gl/layers"
import Map from "react-map-gl"
import WebWorker from "worker-loader!./realtime.worker"
import { ThemeContext } from "context"
import "mapbox-gl/dist/mapbox-gl.css"

const { REACT_APP_MAPBOX_TOKEN } = process.env
const workerThread = new WebWorker()

export default function RealtimeDeck () {
    const [pointData, setPointData] = useState(undefined)
    const [frameRate, setFrameRate] = useState(33)
    const {theme, changeTheme} = useContext(ThemeContext)

    const INITIAL_VIEW_STATE = {
        longitude: -106.47917753619672,
        latitude: 23.309516144433793,
        zoom: 16,
        pitch: 0,
        bearing: 0,
    }

    useEffect(() => {
        workerThread.onmessage = ({ data }) => {
            requestAnimationFrame(() => {
                setPointData(data)
            })
        }
        workerThread.postMessage({ msg: "init", frameRate: 1000 })
        return () => {
            workerThread.postMessage({ msg: "close" })
        }
    }, [])

    useEffect(() => {
        workerThread.postMessage({msg: 'changeFPS', frameRate })
    }, [frameRate])

    const handleChange = (e) => {
        setFrameRate(e.target.value)
    }

    const layer = new ScatterplotLayer({
        id: "scatterplot-layer",
        data: {
            length: pointData?.count || 0,
            attributes: {
                getPosition: { value: pointData?.binaryData || new Float32Array([]), size: 3, offset: 0, stride: 24, normalized: false },
                getFillColor: { value: pointData?.binaryData || new Float32Array([]), size: 3, offset: 12, stride: 24, normalized: false },
            },
        },
        pickable: true,
        opacity: 0.8,
        filled: true,
        radiusMinPixels: 6,
        radiusMaxPixels: 6,
        parameters: {
            depthTest: false
        }
    })
    
    return (
        <DeckGL 
            initialViewState={INITIAL_VIEW_STATE} 
            controller={{ doubleClickZoom: false }}
            onViewStateChange={({viewState, interactionState, oldViewState}) => {
                // TODO: based on zoom level change, adjust fps
            }}
            layers={[layer]}
        >
            <Map
                attributionControl={false}
                mapboxAccessToken={REACT_APP_MAPBOX_TOKEN}
                mapStyle={theme === 'dark' ? 'mapbox://styles/jcarenza/ckjc254l96fjp19s8zbsmfjrr' : 'mapbox://styles/jcarenza/ckfujel203jsu19lqqts2cwsg'}
            />
            <div className="control" onChange={handleChange}>
                <div><button onClick={() => changeTheme(theme === 'dark' ? 'light' : 'dark')}>Toggle Theme</button></div>
                <div><input type="radio" value={33} name="frameRate" defaultChecked /> 30 fps</div>
                <div><input type="radio" value={66} name="frameRate" /> 15 fps</div>
                <div><input type="radio" value={125} name="frameRate" /> 8 fps</div>
                <div><input type="radio" value={333} name="frameRate" /> 3 fps</div>
                <div><input type="radio" value={500} name="frameRate" /> 2 fps</div>
                <div><input type="radio" value={1000} name="frameRate" /> 1 fps</div>
            </div>
        </DeckGL>
    )
}
