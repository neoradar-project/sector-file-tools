export declare class Color {
    readonly name: string;
    readonly value: number;
    private constructor();
    toRGB(): readonly [number, number, number];
    static withNameAndValue(name: string, value: number): Color;
}
