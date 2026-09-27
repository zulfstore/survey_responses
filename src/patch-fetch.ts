// Ensures window.fetch has both a getter and setter to prevent "Cannot set property fetch of #<Window> which has only a getter"
(function ensureFetchSetter() {
  if (typeof window === 'undefined') return;
  try {
    let curFetch = window.fetch;
    const getF = () => curFetch;
    const setF = (fn: typeof fetch) => {
      curFetch = fn;
    };

    try {
      Object.defineProperty(window, 'fetch', {
        get: getF,
        set: setF,
        configurable: true,
        enumerable: true,
      });
    } catch {}

    if (typeof Window !== 'undefined' && Window.prototype) {
      try {
        Object.defineProperty(Window.prototype, 'fetch', {
          get: getF,
          set: setF,
          configurable: true,
          enumerable: true,
        });
      } catch {}
    }

    if (typeof globalThis !== 'undefined' && (globalThis as unknown) !== window) {
      try {
        Object.defineProperty(globalThis, 'fetch', {
          get: getF,
          set: setF,
          configurable: true,
          enumerable: true,
        });
      } catch {}
    }
  } catch {}
})();
