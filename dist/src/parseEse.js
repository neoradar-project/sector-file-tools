import { isLatitude, isLongitude, Position } from './position.js';
const sections = ['POSITIONS', 'SIDSSTARS', 'AIRSPACE', 'RADAR', 'FREETEXT', 'GROUND'];
const splitter = /:/g;
function getParts(str) {
    return str
        .split(';')[0]
        .trim()
        .split(splitter)
        .map((part) => part.trim());
}
export default function parseEse(sct, input) {
    const lines = input.split('\n').map((line) => line.trim());
    let currentSection = null;
    const freetext = {};
    const positions = [];
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        const lineNumber = i + 1;
        function errorWithLine(message) {
            return new Error(`Error on line ${lineNumber}: ${message}`);
        }
        if (line === '') {
            continue;
        }
        else if (line.indexOf(';') === 0) {
            continue;
        }
        else if (line.indexOf('[') === 0) {
            const nameMatch = /\[(.*)\]/.exec(line);
            if (!nameMatch || nameMatch.length !== 2) {
                throw errorWithLine(`Syntax error, expected [***] with some section name between the brackets.`);
            }
            const matchedName = nameMatch[1].toUpperCase();
            let matched = sections.find((section) => matchedName === section);
            if (matched === undefined) {
                throw errorWithLine(`Unknown section type "${matchedName}"`);
            }
            currentSection = matched;
        }
        else if (currentSection === 'FREETEXT') {
            const [lat, lon, section, text, color, mainValue] = getParts(line);
            let colorConverted = null;
            if (!freetext[section]) {
                freetext[section] = [];
            }
            if (isLatitude(lat) && isLongitude(lon)) {
                const position = Position.latlon(lat, lon);
                if (color && sct.defines[color.toLowerCase()]) {
                    colorConverted = sct.defines[color.toLowerCase()];
                }
                freetext[section].push({
                    position,
                    text: text,
                    ...(mainValue && { description: mainValue }),
                    color: colorConverted,
                });
            }
            else {
                throw errorWithLine(`The input ${lat} ${lon} is not a valid latitude/longitude position.`);
            }
        }
        else if (currentSection === 'POSITIONS') {
            const [name, radioCallsign, frequency, identifier, middleLetter, prefix, suffix, // not in use // not in use
            , , startRange, endRange, ...visibilityCenterCoords] = line.split(';')[0].trim().split(':');
            const centers = [];
            for (let i = 0; i + 1 < visibilityCenterCoords.length; i += 2) {
                centers.push(Position.latlon(visibilityCenterCoords[i], visibilityCenterCoords[i + 1]));
            }
            positions.push({
                name,
                radioCallsign,
                frequency,
                identifier,
                middleLetter,
                prefix,
                suffix,
                startRange: parseInt(startRange),
                endRange: parseInt(endRange),
                centers,
            });
        }
        else if (currentSection === 'SIDSSTARS') {
            // TODO implement
        }
        else if (currentSection === 'AIRSPACE') {
            // TODO implement
        }
        else if (currentSection === 'RADAR') {
            // TODO implement
        }
        else if (currentSection === 'GROUND') {
            // TODO implement
        }
        else {
            throw errorWithLine('Unsure what this line really means');
        }
    }
    return {
        freetext,
        positions,
    };
}
//# sourceMappingURL=parseEse.js.map