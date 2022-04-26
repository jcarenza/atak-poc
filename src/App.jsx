import { Switch, Route } from "react-router-dom"
import Nav from "components/Nav"
import DeckView from "pages/Deck"
// import MapboxView from "pages/Mapbox"

/*
    POC: Test raw Mapbox rendering vs. Deck.gl + Static Mapbox implementation
        - How fast can we render live data (FPS)? 60 FPS, but bottleneck is still the time to seralize the state store and create the array buffer
        - Can we store/process all data in a webworker to keep the main thread free? YES
        - Will transferable objects make a noticable difference in webworker message? YES (but only in large datasets)
        - Can we optimize Deck.gl rendering using array buffers and avoiding "accessors"? YES 
    Results: 
        - Perceptual results were nearly identical
        - Profiling metrics were similar, slight edge to Deck.gl
        - CPU usage was signifcantly better with Deck.gl
        - Mapbox cannot utilize array buffers, so JSON serialization on large datasets could be problematic
        - Deck.gl has many built-in perf optimizations already that utilize array buffers
*/

export default function App () {
    return (
        <div className="app" data-cy="app">
            <Nav />
            <Switch>
                <Route exact path="/" component={DeckView} />
            </Switch>
        </div>
    )
}
