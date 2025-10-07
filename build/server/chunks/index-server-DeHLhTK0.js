import { a8 as current_component } from './index-d9yomiCc.js';

class Previous {
  #previous = void 0;
  #curr;
  constructor(getter) {
  }
  get current() {
    return this.#previous;
  }
}

function lifecycle_function_unavailable(name) {
  const error = new Error(`lifecycle_function_unavailable
\`${name}(...)\` is not available on the server
https://svelte.dev/e/lifecycle_function_unavailable`);
  error.name = "Svelte error";
  throw error;
}
function onDestroy(fn) {
  var context = (
    /** @type {Component} */
    current_component
  );
  (context.d ??= []).push(fn);
}
function mount() {
  lifecycle_function_unavailable("mount");
}
function unmount() {
  lifecycle_function_unavailable("unmount");
}
async function tick() {
}

export { Previous as P, mount as m, onDestroy as o, tick as t, unmount as u };
//# sourceMappingURL=index-server-DeHLhTK0.js.map
