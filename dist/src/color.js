export class Color {
    name;
    value;
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }
    toRGB() {
        return [this.value & 0xff, (this.value >> 8) & 0xff, this.value >> 16];
    }
    static withNameAndValue(name, value) {
        return new Color(name, value);
    }
}
//# sourceMappingURL=color.js.map