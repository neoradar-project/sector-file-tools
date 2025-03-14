import { toMercator } from '@turf/projection'

type InternalData =
    | { type: 'latlon'; lat: string; lon: string }
    | { type: 'latlonFloat'; lat: number; lon: number };

export class Position {
    private readonly internalData: InternalData;

    get latFloat(): number {
        if (this.internalData.type === 'latlonFloat') {
            return this.internalData.lat;
        } else {
            return latitudeToDecimal(this.internalData.lat);
        }
    }

    get lonFloat(): number {
        if (this.internalData.type === 'latlonFloat') {
            return this.internalData.lon;
        } else {
            return longitudeToDecimal(this.internalData.lon);
        }
    }

    private constructor(internalData: InternalData) {
        this.internalData = internalData;
    }

    toUTM(): [number, number] {
        const converted = toMercator([this.lonFloat, this.latFloat]);
        if (converted.length !== 2 || converted.some((x) => Number.isNaN(x) || x === null)) {
            console.error(`Failed to convert ${this.internalData} to UTM`);
            return [0, 0];
        }
        return converted as [number, number];
    }

    // Convers to decimal degrees WGS84 with a precision of 6 decimals
    // This gives a real world precision of about 10cm
    toWGS84(): [number, number] {
        return [
            this.reduceDecimalPrecision(this.lonFloat),
            this.reduceDecimalPrecision(this.latFloat),
        ];
    }

    reduceDecimalPrecision(decimal: number): number {
        let pow = Math.pow(10, 6); // Base 10, 6 decimals precision
        return Math.round(decimal * pow) / pow;
    }

    static latlon(lat: string, lon: string): Position {
        return new Position({ type: 'latlon', lat, lon });
    }

    static latlonFloat(lat: number, lon: number): Position {
        return new Position({ type: 'latlonFloat', lat, lon });
    }

    static navaid(name: string, lat: string, lon: string): Position {
        return Position.latlon(lat, lon);
    }
}

const latitudeMatch = /^[NnSs][0-9\.]+$/;
export function isLatitude(input: string): boolean {
    return input.match(latitudeMatch) != null;
}

const longitudeMatch = /^[EeWw][0-9\.]+$/;
export function isLongitude(input: string): boolean {
    return input.match(longitudeMatch) != null;
}

function latitudeToDecimal(lat: string): number {
    if (!lat) throw new Error('Invalid latitude (empty)');
    const direction = lat[0].toUpperCase() === 'N' ? 1 : -1;
    const [degrees, minutes, secondsOptional, decimalsOptional] = lat.substr(1).split('.');

    const seconds = secondsOptional || '0';
    const decimals = decimalsOptional || '0';

    if (Number.isNaN(parseInt(minutes))) throw new Error(`Invalid latitude ${lat}`);
    if (Number.isNaN(parseInt(seconds))) throw new Error(`Invalid latitude ${lat}`);
    if (Number.isNaN(parseInt(decimals))) throw new Error(`Invalid latitude ${lat}`);

    const result =
        direction *
        (parseInt(degrees) + parseInt(minutes) / 60 + parseFloat(`${seconds}.${decimals}`) / 3600);

    if (Number.isNaN(result)) {
        throw new Error(`Invalid latitude ${lat}`);
    }
    return result;
}

function longitudeToDecimal(lon: string): number {
    if (!lon) {
        debugger;
        throw new Error('Invalid longitude (empty)');
    }
    const direction = lon[0].toUpperCase() === 'E' ? 1 : -1;
    const [degrees, minutes, secondsOptional, decimalsOptional] = lon.substr(1).split('.');

    const seconds = secondsOptional || '0';
    const decimals = decimalsOptional || '0';

    if (Number.isNaN(parseInt(minutes))) throw new Error(`Invalid longitude ${lon}`);
    if (Number.isNaN(parseInt(seconds))) throw new Error(`Invalid longitude ${lon}`);
    if (Number.isNaN(parseInt(decimals))) throw new Error(`Invalid longitude ${lon}`);

    const result =
        direction *
        (parseInt(degrees) + parseInt(minutes) / 60 + parseFloat(`${seconds}.${decimals}`) / 3600);

    if (Number.isNaN(result)) {
        throw new Error(`Invalid longitude ${lon}`);
    }
    return result;
}
