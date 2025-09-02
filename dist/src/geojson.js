function regionToGeo(region, system = 'UTM') {
    return region.polygons.map((polygon) => ({
        type: 'Feature',
        geometry: {
            type: 'Polygon',
            coordinates: system === 'UTM'
                ? [polygon.points.map((point) => point.toUTM())] // Coordinate system is UTM
                : [polygon.points.map((point) => point.toWGS84())], // Coordinate system is WGS84
        },
        properties: {
            type: 'region',
            region: region.id,
            color: polygon.color?.toRGB(),
        },
    }));
}
function toUtm(point) {
    if (point.position != undefined) {
        return point.position.toUTM();
    }
    else {
        return point.toUTM();
    }
}
function toWGS84(point) {
    if (point.position != undefined) {
        return point.position.toWGS84();
    }
    else {
        return point.toWGS84();
    }
}
function geoToGeo(geo, type, system = 'UTM') {
    return geo.segments.map((segment) => ({
        type: 'Feature',
        geometry: {
            type: 'LineString',
            coordinates: system === 'UTM'
                ? [toUtm(segment.start), toUtm(segment.end)] // Coordinate system is UTM
                : [toWGS84(segment.start), toWGS84(segment.end)], // Coordinate system is WGS84
        },
        properties: {
            type: type,
            section: geo.id,
            color: segment.color?.toRGB(),
        },
    }));
}
function airportToGeo(airport, system = 'UTM') {
    return {
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: system === 'UTM'
                ? airport.position.toUTM() // Coordinate system is UTM
                : airport.position.toWGS84(), // Coordinate system is WGS84
        },
        properties: {
            name: airport.id,
            type: 'airport',
        },
    };
}
function vorToGeo(vor, system = 'UTM') {
    return {
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: system === 'UTM'
                ? vor.position.toUTM() // Coordinate system is UTM
                : vor.position.toWGS84(), // Coordinate system is WGS84
        },
        properties: {
            name: vor.id,
            freq: vor.frequency,
            type: 'vor',
        },
    };
}
function ndbToGeo(ndb, system = 'UTM') {
    return {
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: system === 'UTM'
                ? ndb.position.toUTM() // Coordinate system is UTM
                : ndb.position.toWGS84(), // Coordinate system is WGS84
        },
        properties: {
            name: ndb.id,
            freq: ndb.frequency,
            type: 'ndb',
        },
    };
}
function fixToGeo(fix, system = 'UTM') {
    return {
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: system === 'UTM'
                ? fix.position.toUTM() // Coordinate system is UTM
                : fix.position.toWGS84(), // Coordinate system is WGS84
        },
        properties: {
            name: fix.id,
            type: 'fix',
        },
    };
}
function labelToGeo(label, system = 'UTM') {
    return {
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: system === 'UTM'
                ? label.position.toUTM() // Coordinate system is UTM
                : label.position.toWGS84(), // Coordinate system is WGS84
        },
        properties: {
            value: label.text,
            type: 'label',
            color: label.color?.toRGB(),
        },
    };
}
function freetextToGeo(section, label, system = 'UTM') {
    return {
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: system === 'UTM'
                ? label.position.toUTM() // Coordinate system is UTM
                : label.position.toWGS84(), // Coordinate system is WGS84
        },
        properties: {
            section,
            value: label.text,
            type: 'label',
            ...(label.description && { description: label.description }),
            color: label.color?.toRGB(),
        },
    };
}
function runwayToGeo(runway, system = 'UTM') {
    const id = `${runway.icao}: ${runway.id}`;
    return {
        id,
        type: 'Feature',
        geometry: {
            type: 'LineString',
            coordinates: system === 'UTM'
                ? [runway.start.toUTM(), runway.end.toUTM()] // Coordinate system is UTM
                : [runway.start.toWGS84(), runway.end.toWGS84()], // Coordinate system is WGS84
        },
        properties: {
            name: runway.id,
            oppositeId: runway.oppositeId,
            type: 'runway',
            icao: runway.icao,
            airport: runway.airportName,
        },
    };
}
function flatten(arr) {
    return [].concat(...arr);
}
export function toGeoJson(sct, ese, asr, useSctLabels = true, system = 'UTM') {
    const features = flatten([
        sct.regions
            .filter((region) => asr != null ? asr.regions.includes(region.id) : true)
            .flatMap((element) => regionToGeo(element, system)),
        sct.geo
            .filter((geo) => (asr != null ? asr.geo.includes(geo.id) : true))
            .flatMap((element) => geoToGeo(element, 'geo', system)),
        sct.airports.map((element) => airportToGeo(element, system)),
        sct.runways
            .filter((runway) => {
            if (asr == null) {
                return true;
            }
            const fullName = `${runway.icao} ${runway.airportName} ${runway.id}-${runway.oppositeId}`;
            return Object.keys(asr.runways).includes(fullName);
        })
            .map((element) => runwayToGeo(element, system)),
        sct.vor
            .filter((vor) => (asr != null ? asr.vors.includes(vor.id) : true))
            .map((element) => vorToGeo(element, system)),
        sct.ndb
            .filter((ndb) => (asr != null ? asr.ndbs.includes(ndb.id) : true))
            .map((element) => ndbToGeo(element, system)),
        sct.fixes
            .filter((fix) => (asr != null ? asr.fixes.includes(fix.id) : true))
            .map((element) => fixToGeo(element, system)),
        sct.sid.flatMap((element) => geoToGeo(element, 'sid', system)),
        sct.star
            .filter((star) => (asr != null ? asr.stars.includes(star.id) : true))
            .flatMap((element) => geoToGeo(element, 'star', system)),
        ...(useSctLabels
            ? [sct.labels.map((element) => labelToGeo(element, system))]
            : []),
        Object.entries(ese.freetext).flatMap(([section, labels]) => labels
            .filter((label) => asr != null
            ? asr.freetext[section] != null &&
                asr.freetext[section].includes(label.text)
            : true)
            .map((label) => freetextToGeo(section, label, system))),
        sct.artcc
            .filter((artcc) => (asr != null ? asr.artcc.includes(artcc.id) : true))
            .flatMap((artcc) => geoToGeo(artcc, 'artcc', system)),
        sct.artccLow
            .filter((artcc) => (asr != null ? asr.artccLow.includes(artcc.id) : true))
            .flatMap((artcc) => geoToGeo(artcc, 'artcc-low', system)),
        sct.artccHigh
            .filter((artcc) => asr != null ? asr.artccHigh.includes(artcc.id) : true)
            .flatMap((artcc) => geoToGeo(artcc, 'artcc-high', system)),
        sct.highAirway.flatMap((airway) => geoToGeo(airway, 'high-airway', system)),
        sct.lowAirway.flatMap((airway) => geoToGeo(airway, 'low-airway', system)),
    ]);
    return {
        type: 'FeatureCollection',
        features,
    };
}
//# sourceMappingURL=geojson.js.map