import { q as push, u as pop } from './index-d9yomiCc.js';
import { A as Account_settings } from './account-settings-u7Y2hay5.js';
import { N as Notification_settings } from './notification-settings-DRMiSWfP.js';
import './runtime-Bj_FdU8B.js';
import './setting_account-BoTCKCEe.js';
import './client-BNK9U2wL.js';
import './exports-J2AlltLs.js';
import './utils-CCkZTMVc.js';
import './button-B_xSpjF_.js';
import './superForm-DTuNRgSU.js';
import './spin-load-indicator-CKSC_Q6z.js';
import './Icon-CCGd_g73.js';
import './noop-kcrjqjA1.js';
import './index-server2-_G0R5Qhl.js';
import './input-BHwyyuIe.js';
import '@baragaun/bg-node-client';
import './check-B2yEnkD1.js';
import './app-7kTdB7Wo.js';
import 'zod';
import './index-server-DeHLhTK0.js';
import './translate-DAfkGQ1n.js';
import './setting_buttons_cancel-Cp1uCP5H.js';
import 'throttle-debounce';
import './index6-BjPfDKpj.js';
import './dialog-content-C9LiXPSH.js';
import './dialog-overlay-D99JmK3L.js';
import './kbd-constants-tqlk3Es5.js';
import './scroll-lock-BMUvnJ8g.js';
import './events-CdTAYaIN.js';
import './is--6Wd6KIW.js';
import './x-CT7gPnZT.js';
import './dialog-title-BAVtkHhB.js';
import './dialog-description-Da_0L4ko.js';
import './msa-listener-handler.svelte-Bv4sHlq9.js';
import './shared-server-i79vVjEm.js';

function _page($$payload, $$props) {
  push();
  let { data } = $$props;
  let currentTab = data.currentTab;
  if (currentTab === "account") {
    $$payload.out += "<!--[-->";
    Account_settings($$payload, { data });
  } else if (currentTab === "notifications") {
    $$payload.out += "<!--[1-->";
    Notification_settings($$payload, {});
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  pop();
}

export { _page as default };
//# sourceMappingURL=_page.svelte-tieHQliZ.js.map
