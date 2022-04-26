export function calcOptimalFrameRate(zoomLevel) {
    // each zoom level correlates to a meters/pixel
    // at higher zoom levels, an object needs to travel farther to move 1 pixel on screen
    // therefore, the refresh rate can be lower to reduce the amount of subpixel frames

    if (typeof zoomLevel === "number" && zoomLevel < 11) {
        return 10000
    }
    switch (Math.floor(zoomLevel)) {
        case 11:
            return 8549
        case 12:
            return 4275
        case 13:
            return 2137
        case 14:
            return 1069
        case 15:
            return 534
        case 16:
            return 267
        case 17:
            return 134
        case 18:
            return 67
        default:
            return 33
    }
}
