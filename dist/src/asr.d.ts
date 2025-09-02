import type { Position } from './position.js';
export type Freetext = {
    [section: string]: string[];
};
export type Runways = {
    [runway: string]: string[];
};
export type Viewport = [Position, Position];
export interface ASR {
    sectorFile: string;
    sectorTitle: string;
    artcc: string[];
    artccHigh: string[];
    artccLow: string[];
    freetext: Freetext;
    geo: string[];
    regions: string[];
    stars: string[];
    vors: string[];
    ndbs: string[];
    fixes: string[];
    runways: Runways;
    viewport: Viewport | null;
}
