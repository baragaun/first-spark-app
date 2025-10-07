import { q as push, B as escape_html, z as ensure_array_like, A as attr, u as pop, M as sanitize_props, I as spread_props, T as slot } from './index-d9yomiCc.js';
import { g as goto } from './client-BNK9U2wL.js';
import { B as Button } from './button-B_xSpjF_.js';
import { m as marketplaceContext } from './marketplace-context.svelte-kqZeQ73y.js';
import '@baragaun/bg-node-client';
import { a as toast } from './Toaster.svelte_svelte_type_style_lang-s80CJFld.js';
import { g as getMarketplaceData } from './marketplace-store.svelte-BNG63Gai.js';
import { R as Root, A as Alert_dialog_content, a as Alert_dialog_header, b as Alert_dialog_footer, c as Alert_dialog_title, d as Alert_dialog_description, e as Alert_dialog_action, f as cart_okay } from './index5-DCZzZTQV.js';
import { g as getLocale, t as trackMessageCall } from './runtime-Bj_FdU8B.js';
import { m as myUserContext } from './my-user-context.svelte-C7pZorxo.js';
import { g as giftCardImageDomain } from './constants-BjqueA94.js';
import { I as IsMobile } from './is-mobile.svelte-C1SEZM9M.js';
import { I as Icon } from './Icon-CCGd_g73.js';
import './exports-J2AlltLs.js';
import './utils-CCkZTMVc.js';
import './translate-DAfkGQ1n.js';
import './bg-node-client-CQb-2czA.js';
import './noop-kcrjqjA1.js';
import './index-server2-_G0R5Qhl.js';
import './dialog-overlay-D99JmK3L.js';
import './kbd-constants-tqlk3Es5.js';
import './scroll-lock-BMUvnJ8g.js';
import './events-CdTAYaIN.js';
import './index-server-DeHLhTK0.js';
import './is--6Wd6KIW.js';
import './dialog-description-Da_0L4ko.js';
import './dialog-title-BAVtkHhB.js';
import './shared-server-i79vVjEm.js';

function Minus($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [["path", { "d": "M5 12h14" }]];
  Icon($$payload, spread_props([
    { name: "minus" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {}, null);
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function Plus($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "M5 12h14" }],
    ["path", { "d": "M12 5v14" }]
  ];
  Icon($$payload, spread_props([
    { name: "plus" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {}, null);
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
const en_cart_title = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Shopping Cart`;
  }
);
const es_cart_title = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Carrito de compras`;
  }
);
const cart_title = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("cart_title", locale);
  if (locale === "en") return en_cart_title();
  if (locale === "es") return es_cart_title();
  return "cart.title";
};
const en_cart_continue_shopping = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Continue shopping`;
  }
);
const es_cart_continue_shopping = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Continuar comprando`;
  }
);
const cart_continue_shopping = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("cart_continue_shopping", locale);
  if (locale === "en") return en_cart_continue_shopping();
  if (locale === "es") return es_cart_continue_shopping();
  return "cart.continue_shopping";
};
const en_cart_total = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Total`;
  }
);
const es_cart_total = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Total`;
  }
);
const cart_total = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("cart_total", locale);
  if (locale === "en") return en_cart_total();
  if (locale === "es") return es_cart_total();
  return "cart.total";
};
const en_cart_remove = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Remove`;
  }
);
const es_cart_remove = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Eliminar`;
  }
);
const cart_remove = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("cart_remove", locale);
  if (locale === "en") return en_cart_remove();
  if (locale === "es") return es_cart_remove();
  return "cart.remove";
};
const en_cart_product = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Product`;
  }
);
const es_cart_product = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Producto`;
  }
);
const cart_product = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("cart_product", locale);
  if (locale === "en") return en_cart_product();
  if (locale === "es") return es_cart_product();
  return "cart.product";
};
const en_cart_amount = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Amount`;
  }
);
const es_cart_amount = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Monto`;
  }
);
const cart_amount = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("cart_amount", locale);
  if (locale === "en") return en_cart_amount();
  if (locale === "es") return es_cart_amount();
  return "cart.amount";
};
const en_cart_quantity = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Quantity`;
  }
);
const es_cart_quantity = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Cantidad`;
  }
);
const cart_quantity = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("cart_quantity", locale);
  if (locale === "en") return en_cart_quantity();
  if (locale === "es") return es_cart_quantity();
  return "cart.quantity";
};
const en_cart_place_order = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `PLACE ORDER`;
  }
);
const es_cart_place_order = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `REALIZAR PEDIDO`;
  }
);
const cart_place_order = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("cart_place_order", locale);
  if (locale === "en") return en_cart_place_order();
  if (locale === "es") return es_cart_place_order();
  return "cart.place_order";
};
const en_cart_order_placed = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Order placed!`;
  }
);
const es_cart_order_placed = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `¡Pedido realizado!`;
  }
);
const cart_order_placed = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("cart_order_placed", locale);
  if (locale === "en") return en_cart_order_placed();
  if (locale === "es") return es_cart_order_placed();
  return "cart.order_placed";
};
const en_cart_order_placed_description = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Your order has been placed successfully.`;
  }
);
const es_cart_order_placed_description = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Tu pedido ha sido realizado exitosamente.`;
  }
);
const cart_order_placed_description = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("cart_order_placed_description", locale);
  if (locale === "en") return en_cart_order_placed_description();
  if (locale === "es") return es_cart_order_placed_description();
  return "cart.order_placed_description";
};
function _page($$payload, $$props) {
  push();
  let marketplaceData = getMarketplaceData();
  let cartItems = [];
  let loadingItemId = null;
  let total = (() => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0))();
  let showOrderPlacedDialog = false;
  const isMobile = new IsMobile();
  async function updateItemQuantity(item, newQuantity) {
    if (item == null || item == void 0) return;
    loadingItemId = item.id;
    const minSpinnerTime = 500;
    const startTime = Date.now();
    if (newQuantity < 1) {
      await removeItem(item.id || "");
      const elapsed = Date.now() - startTime;
      if (elapsed < minSpinnerTime) {
        await new Promise((resolve) => setTimeout(resolve, minSpinnerTime - elapsed));
      }
      loadingItemId = null;
      return;
    }
    try {
      for (const cartItem of shoppingCart?.items ?? []) {
        if (cartItem.id != item.id && cartItem.productId === item.productId && cartItem.price === item.price) {
          await removeItem(cartItem.id);
        }
      }
      item.quantity = newQuantity;
      const result = await marketplaceContext.updateShoppingCartItem(item);
      if (result.error) {
        console.error("Error updating item quantity:", result.error);
        toast.error(`Failed to update quantity: ${result.error}`);
      } else if (result.object) {
        toast.success("Quantity updated!");
      }
    } catch (error) {
      console.error("Unexpected error updating quantity:", error);
      toast.error("An unexpected error occurred while updating quantity.");
    } finally {
      const elapsed = Date.now() - startTime;
      if (elapsed < minSpinnerTime) {
        await new Promise((resolve) => setTimeout(resolve, minSpinnerTime - elapsed));
      }
      loadingItemId = null;
    }
  }
  async function removeItem(id) {
    try {
      const result = await marketplaceContext.deleteShoppingCartItem(id);
      if (result.error) {
        console.error("Error deleting item:", result.error);
        toast.error(`Failed to remove item: ${result.error}`);
      } else {
        cartItems = cartItems.filter((item) => item.id !== id);
        toast.success("Item removed from cart!");
      }
    } catch (error) {
      console.error("Unexpected error deleting item:", error);
      toast.error("An unexpected error occurred while removing the item.");
    }
  }
  async function removeAllItems(item) {
    for (const cartItem of []) {
      if (cartItem.productId === item.productId && cartItem.price === item.price) {
        await removeItem(cartItem.id);
      }
    }
  }
  async function placeOrder() {
    const order = {
      shoppingCartId: myUserContext.myUserId,
      userId: myUserContext.myUserId,
      sumItemPrice: total,
      totalPrice: total,
      vat: 0
    };
    const response = await marketplaceContext.createPurchaseOrder(order);
    if (response.error) {
      console.error("Error creating purchase order:", response.error);
      toast.error(`Failed to create purchase order: ${response.error}`);
      return;
    }
    cartItems = [];
    showOrderPlacedDialog = true;
  }
  function findProductAndBrand(productId) {
    const product = marketplaceData.products.find((product2) => product2.id === productId);
    const brand = marketplaceData.brands.find((b) => b.id === product?.brandId);
    return [product, brand];
  }
  let shoppingCart = void 0;
  $$payload.out += `<div class="flex min-h-screen flex-col bg-background font-sans antialiased">`;
  if (!isMobile.current) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<header class="mb-6 px-3 pt-3"><h1 class="text-3xl font-bold text-foreground">${escape_html(/* @__PURE__ */ cart_title())}</h1></header>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <div class="container mx-auto flex-1 px-4 py-6">`;
  if (cartItems.length > 0) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="grid grid-cols-4 gap-4 border-b border-muted-foreground pb-2 text-sm font-medium text-muted-foreground md:grid-cols-6"><div class="col-span-2 text-center text-base md:col-span-3">${escape_html(/* @__PURE__ */ cart_product())}</div> <div class="text-center text-base">${escape_html(/* @__PURE__ */ cart_quantity())}</div> <div class="text-center text-base">${escape_html(/* @__PURE__ */ cart_amount())} <span class="currency text-xs md:block">(USD)</span></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  if (cartItems.length > 0) {
    $$payload.out += "<!--[-->";
    const each_array = ensure_array_like(cartItems);
    $$payload.out += `<!--[-->`;
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let item = each_array[$$index];
      const [product, brand] = findProductAndBrand(item.productId);
      $$payload.out += `<div class="grid grid-cols-4 items-center gap-4 border-b border-border py-4 md:grid-cols-6"><div class="col-span-2 flex items-center md:col-span-3"><div class="mr-4 h-10 w-16 flex-shrink-0 md:h-20 md:w-32"><img${attr("src", giftCardImageDomain + "/giftcards/" + product?.imageSourceFront)} alt="" class="h-full w-full rounded-[5px] object-contain" onload="this.__e=event" onerror="this.__e=event"/></div> <div class="flex flex-col"><span class="text-base font-medium text-foreground">${escape_html("$" + item.price / 1e3 + " Gift card to " + brand?.name)}</span> `;
      Button($$payload, {
        variant: "outline",
        size: "sm",
        class: "mt-1 h-6 w-fit rounded-full border-accent px-2 text-xs text-accent hover:bg-accent hover:text-accent-foreground",
        onclick: () => removeAllItems(item),
        children: ($$payload2) => {
          $$payload2.out += `<!---->${escape_html(/* @__PURE__ */ cart_remove())}`;
        },
        $$slots: { default: true }
      });
      $$payload.out += `<!----></div></div> <div class="flex items-center justify-center gap-2">`;
      Button($$payload, {
        variant: "outline",
        size: "icon",
        class: "h-8 w-8",
        onclick: () => updateItemQuantity(item, (item.quantity || 0) - 1),
        disabled: loadingItemId === item.id,
        children: ($$payload2) => {
          Minus($$payload2, { class: "h-4 w-4" });
        },
        $$slots: { default: true }
      });
      $$payload.out += `<!----> <span class="flex items-center justify-center text-foreground" style="min-width: 1.5em; min-height: 1.5em;">`;
      if (loadingItemId === item.id) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<span class="inline-block h-[1.5em] w-[1.5em] animate-spin rounded-full border-2 border-primary border-t-transparent"></span>`;
      } else {
        $$payload.out += "<!--[!-->";
        $$payload.out += `<span style="display:inline-block; width:1.5em; height:1.5em; text-align:center;">${escape_html(item.quantity || 0)}</span>`;
      }
      $$payload.out += `<!--]--></span> `;
      Button($$payload, {
        variant: "outline",
        size: "icon",
        class: "h-8 w-8",
        onclick: () => updateItemQuantity(item, (item.quantity || 0) + 1),
        disabled: loadingItemId === item.id,
        children: ($$payload2) => {
          Plus($$payload2, { class: "h-4 w-4" });
        },
        $$slots: { default: true }
      });
      $$payload.out += `<!----></div> <div class="text-center text-foreground">${escape_html((item.price / 1e3 || 0).toFixed(2))}</div></div>`;
    }
    $$payload.out += `<!--]--> <div class="mr-4 py-4 text-right text-foreground"><span class="text-lg font-bold">${escape_html(/* @__PURE__ */ cart_total())}: USD ${escape_html((total / 1e3).toFixed(2))}</span></div>`;
  } else {
    $$payload.out += "<!--[1-->";
    $$payload.out += `<div class="flex h-[60vh] items-center justify-center"><div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div></div>`;
  }
  $$payload.out += `<!--]--> <div>`;
  Button($$payload, {
    class: "mx-auto mb-6 block rounded-full border border-foreground bg-background text-foreground",
    onclick: () => goto(),
    children: ($$payload2) => {
      $$payload2.out += `<!---->${escape_html(/* @__PURE__ */ cart_continue_shopping())}`;
    },
    $$slots: { default: true }
  });
  $$payload.out += `<!----></div> `;
  if (cartItems.length > 0) {
    $$payload.out += "<!--[-->";
    Button($$payload, {
      class: "w-full rounded-full bg-nav-foreground py-3 text-lg font-bold text-nav hover:bg-nav-foreground/90",
      onclick: placeOrder,
      children: ($$payload2) => {
        $$payload2.out += `<!---->${escape_html(/* @__PURE__ */ cart_place_order())}`;
      },
      $$slots: { default: true }
    });
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  Root($$payload, {
    open: showOrderPlacedDialog,
    children: ($$payload2) => {
      Alert_dialog_content($$payload2, {
        children: ($$payload3) => {
          Alert_dialog_header($$payload3, {
            children: ($$payload4) => {
              Alert_dialog_title($$payload4, {
                children: ($$payload5) => {
                  $$payload5.out += `<!---->${escape_html(/* @__PURE__ */ cart_order_placed())}`;
                },
                $$slots: { default: true }
              });
              $$payload4.out += `<!----> `;
              Alert_dialog_description($$payload4, {
                children: ($$payload5) => {
                  $$payload5.out += `<!---->${escape_html(/* @__PURE__ */ cart_order_placed_description())}`;
                },
                $$slots: { default: true }
              });
              $$payload4.out += `<!---->`;
            },
            $$slots: { default: true }
          });
          $$payload3.out += `<!----> `;
          Alert_dialog_footer($$payload3, {
            children: ($$payload4) => {
              Alert_dialog_action($$payload4, {
                onclick: () => {
                  showOrderPlacedDialog = false;
                  goto();
                },
                children: ($$payload5) => {
                  $$payload5.out += `<!---->${escape_html(cart_okay())}`;
                },
                $$slots: { default: true }
              });
            },
            $$slots: { default: true }
          });
          $$payload3.out += `<!---->`;
        },
        $$slots: { default: true }
      });
    },
    $$slots: { default: true }
  });
  $$payload.out += `<!----></div></div>`;
  pop();
}

export { _page as default };
//# sourceMappingURL=_page.svelte-BHC5OQPB.js.map
