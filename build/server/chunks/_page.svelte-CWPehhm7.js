import { q as push, V as copy_payload, W as assign_payload, u as pop } from './index-d9yomiCc.js';
import { p as page } from './index3-DMvwsHdR.js';
import { G as Gift_card_details } from './gift-card-details--ZA_W9WE.js';
import { g as getWalletItemsStore } from './wallet-store.svelte-BkvzBmRt.js';
import './client2-yWJSv2LX.js';
import './client-BNK9U2wL.js';
import './exports-J2AlltLs.js';
import './button-B_xSpjF_.js';
import './utils-CCkZTMVc.js';
import './marketplace-context.svelte-kqZeQ73y.js';
import './translate-DAfkGQ1n.js';
import '@baragaun/bg-node-client';
import './bg-node-client-CQb-2czA.js';
import './my-user-context.svelte-C7pZorxo.js';
import './shared-server-i79vVjEm.js';
import './constants-BjqueA94.js';
import 'jspdf';
import './runtime-Bj_FdU8B.js';
import './wallet_gift_card_terms_and_conditions-BAY_pcpI.js';
import './Icon-CCGd_g73.js';
import './Toaster.svelte_svelte_type_style_lang-s80CJFld.js';
import './marketplace-store.svelte-BNG63Gai.js';
import './arrow-left-ByyUiPBJ.js';
import './gift-BIYfkpvh.js';

function _page($$payload, $$props) {
  push();
  const walletItemId = page.params.id;
  let walletItem = getWalletItemsStore().find((p) => p.id === walletItemId);
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    if (!walletItem) {
      $$payload2.out += "<!--[-->";
      $$payload2.out += `<div class="flex h-[60vh] items-center justify-center"><div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div></div>`;
    } else {
      $$payload2.out += "<!--[!-->";
      Gift_card_details($$payload2, {
        get walletItem() {
          return walletItem;
        },
        set walletItem($$value) {
          walletItem = $$value;
          $$settled = false;
        }
      });
    }
    $$payload2.out += `<!--]-->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  pop();
}

export { _page as default };
//# sourceMappingURL=_page.svelte-CWPehhm7.js.map
