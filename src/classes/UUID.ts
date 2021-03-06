/**
 * based on:
 * https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript/2117523#2117523
 */
export default class UUID {
    public static uuid(): string {
        return ('' + 1e7 + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
            (parseInt(c) ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> parseInt(c) / 4).toString(16)
        );
    }
}
