import { Position } from '../position.js';
export function structuredInfo(lines) {
    const map = {};
    const [sectorFilename, defaultCallsign, defaultAirport, lat, lon, nmPerLatDegree, nmPerLonDegree, magneticVariation, sectorScale,] = lines;
    if (sectorFilename !== undefined) {
        map.sectorFilename = sectorFilename;
    }
    if (defaultCallsign !== undefined) {
        map.defaultCallsign = defaultCallsign;
    }
    if (defaultAirport !== undefined) {
        map.defaultAirport = defaultAirport;
    }
    if (lat !== undefined && lon !== undefined) {
        map.center = Position.latlon(lat, lon);
    }
    if (nmPerLatDegree !== undefined) {
        map.nmPerLatDegree = parseInt(nmPerLatDegree);
    }
    if (nmPerLonDegree !== undefined) {
        map.nmPerLonDegree = parseInt(nmPerLonDegree);
    }
    if (magneticVariation !== undefined) {
        map.magneticVariation = parseInt(magneticVariation);
    }
    if (sectorScale !== undefined) {
        map.sectorScale = parseInt(sectorScale);
    }
    return map;
}
//# sourceMappingURL=info.js.map