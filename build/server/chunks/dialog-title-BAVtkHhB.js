import { q as push, O as spread_attributes, E as bind_props, u as pop } from './index-d9yomiCc.js';
import { u as useId, b as box, m as mergeProps } from './noop-kcrjqjA1.js';
import { e as useDialogTitle } from './dialog-overlay-D99JmK3L.js';

function Dialog_title($$payload, $$props) {
  push();
  let {
    id = useId(),
    ref = null,
    child,
    children,
    level = 2,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const titleState = useDialogTitle({
    id: box.with(() => id),
    level: box.with(() => level),
    ref: box.with(() => ref, (v) => ref = v)
  });
  const mergedProps = mergeProps(restProps, titleState.props);
  if (child) {
    $$payload.out += "<!--[-->";
    child($$payload, { props: mergedProps });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div${spread_attributes({ ...mergedProps }, null)}>`;
    children?.($$payload);
    $$payload.out += `<!----></div>`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { ref });
  pop();
}

export { Dialog_title as D };
//# sourceMappingURL=dialog-title-BAVtkHhB.js.map
