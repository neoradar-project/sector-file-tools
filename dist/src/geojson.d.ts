import { SCT } from './sct.js';
import type { FeatureCollection } from 'geojson';
import { ASR } from './asr.js';
import { ESE } from './ese.js';
export type CoordinateSystem = 'UTM' | 'WGS84';
export declare function toGeoJson(sct: SCT, ese: ESE, asr: ASR | null, useSctLabels?: boolean, system?: CoordinateSystem): FeatureCollection;
