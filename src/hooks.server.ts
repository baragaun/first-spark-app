import { paraglideMiddleware } from '@/paraglide/server';
import type { Handle } from '@sveltejs/kit';

// creating a handle to use the paraglide middleware
const paraglideHandle: Handle = ({ event, resolve }) =>
  paraglideMiddleware(event.request, ({ request: localizedRequest, locale }) => {

    // See https://github.com/sveltejs/kit/issues/13743
    // Or: https://docs.google.com/document/d/1rfKPnxsNuXhnF7AiQZhu9kIwdiMS5hnAI05HBwFuBSM/edit?tab=t.0#heading=h.7nki9mck5t64
    if (event.url.pathname.startsWith('/.well-known/appspecific/com.chrome.devtools')) {
      return new Response(null, { status: 204 }); // Return empty response with 204 No Content
    }

    event.request = localizedRequest;
    return resolve(event, {
      transformPageChunk: ({ html }) => {
        return html.replace('%lang%', locale);
      },
    });
  });

export const handle: Handle = paraglideHandle;
