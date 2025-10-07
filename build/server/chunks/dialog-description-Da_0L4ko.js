import { q as push, O as spread_attributes, E as bind_props, u as pop } from './index-d9yomiCc.js';
import { u as useId, b as box, m as mergeProps } from './noop-kcrjqjA1.js';
import { d as useDialogDescription } from './dialog-overlay-D99JmK3L.js';

function Dialog_description($$payload, $$props) {
  push();
  let {
    id = useId(),
    children,
    child,
    ref = null,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const descriptionState = useDialogDescription({
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v)
  });
  const mergedProps = mergeProps(restProps, descriptionState.props);
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

export { Dialog_description as D };
//# sourceMappingURL=dialog-description-Da_0L4ko.js.map
