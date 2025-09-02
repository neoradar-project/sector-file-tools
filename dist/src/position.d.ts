export declare class Position {
    private readonly internalData;
    get latFloat(): number;
    get lonFloat(): number;
    private constructor();
    toUTM(): [number, number];
    toWGS84(): [number, number];
    reduceDecimalPrecision(decimal: number): number;
    static latlon(lat: string, lon: string): Position;
    static latlonFloat(lat: number, lon: number): Position;
    static navaid(name: string, lat: string, lon: string): Position;
}
export declare function isLatitude(input: string): boolean;
export declare function isLongitude(input: string): boolean;
