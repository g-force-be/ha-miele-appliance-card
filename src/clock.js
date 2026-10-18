// The cards read the time here, so the dev harness can replay a cycle faster than real time.
export const now = () => (typeof globalThis.__MIELE_NOW__ === "function" ? globalThis.__MIELE_NOW__() : Date.now());
