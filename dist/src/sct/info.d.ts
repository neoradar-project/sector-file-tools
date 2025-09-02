import { Position } from '../position.js';
export type Info = {
    sectorFilename?: string;
    defaultCallsign?: string;
    defaultAirport?: string;
    center?: Position;
    nmPerLatDegree?: number;
    nmPerLonDegree?: number;
    magneticVariation?: number;
    sectorScale?: number;
};
export declare function structuredInfo(lines: string[]): Info;
