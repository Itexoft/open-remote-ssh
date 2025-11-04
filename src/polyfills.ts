// Neutralize Node.js global navigator getter for VS Code extension host.
(() => {
    const globalObj = globalThis as typeof globalThis & { navigator?: unknown; process?: unknown };
    const processLike = (globalObj as { process?: { versions?: { node?: string } } }).process;

    if (!processLike || !processLike.versions || !processLike.versions.node) {
        // In browsers or other environments, leave navigator untouched.
        return;
    }

    const descriptor = Object.getOwnPropertyDescriptor(globalObj, 'navigator');
    if (!descriptor || !descriptor.configurable) {
        return;
    }

    try {
        Object.defineProperty(globalObj, 'navigator', {
            value: undefined,
            writable: false,
            enumerable: descriptor.enumerable ?? false,
            configurable: true
        });
    } catch {
        // If redefine fails we silently continue, VS Code will keep throwing migration warning.
    }
})();
