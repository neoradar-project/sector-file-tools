import { Position } from './position.js';
export default function parseAsr(input) {
    let sectorTitle = '';
    let sectorFile = '';
    const artcc = [];
    const artccHigh = [];
    const artccLow = [];
    const freetext = {};
    const geo = [];
    const regions = [];
    const stars = [];
    const vors = [];
    const ndbs = [];
    const fixes = [];
    const runways = {};
    let viewport = null;
    input
        .split('\n')
        .map((str) => str.trim().split(':'))
        .filter((parts) => parts.length > 0)
        .forEach((parts) => {
        const [key, ...rest] = parts;
        if (key === 'SECTORFILE') {
            sectorFile = rest[0];
        }
        else if (key === 'SECTORTITLE') {
            sectorTitle = rest[0];
        }
        else if (key === 'ARTCC boundary') {
            artcc.push(rest[0]);
        }
        else if (key === 'ARTCC high boundary') {
            artccHigh.push(rest[0]);
        }
        else if (key === 'ARTCC low boundary') {
            artccLow.push(rest[0]);
        }
        else if (key === 'Free Text') {
            const [section, label] = rest[0].split('\\');
            freetext[section] = freetext[section] || [];
            freetext[section].push(label);
        }
        else if (key === 'Geo') {
            geo.push(rest[0]);
        }
        else if (key === 'Regions') {
            regions.push(rest[0]);
        }
        else if (key === 'Fixes') {
            fixes.push(rest[0]);
        }
        else if (key === 'Runways') {
            const name = rest[0];
            runways[name] = runways[name] || [];
            runways[name].push(rest[1]);
        }
        else if (key === 'WINDOWAREA') {
            viewport = [
                Position.latlonFloat(parseFloat(rest[0]), parseFloat(rest[1])),
                Position.latlonFloat(parseFloat(rest[2]), parseFloat(rest[3])),
            ];
        }
    });
    return {
        sectorTitle,
        sectorFile,
        artcc,
        artccHigh,
        artccLow,
        freetext,
        geo,
        regions,
        stars,
        vors,
        ndbs,
        fixes,
        runways,
        viewport,
    };
}
//# sourceMappingURL=parseAsr.js.map