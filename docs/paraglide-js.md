# Using Paraglide JS Messages

## Adding Messages

Messages are added to the json files in the `messages` directory, there is one file per language. The locales
are defined in `project.inlang/settings.json`, 3 are currently supported:

- `en` - English (default)
- `de` - German
- `hi` - Hindi

When adding a new message, make sure to add it to all languages. If you are not a fluent speaker of a language, you 
can machine translate the message and note the message's name in `messages/todo.txt` to be verified or corrected later
by a fluent speaker. Alternatively, you can add `TODO` as a placeholder message and note the message's name in 
`messages/todo.txt` to be translated later.

## Compiling Messages

Paraglide JS does not pull messages from the json files at runtime, they are compiled into a JavaScript file. This
compilation is done by the Vite plugin when building the project (`pnpm run build`). Compilation is required after
adding or changing messages.

## Importing Messages

Messages are imported from the compiled JavaScript file, located in `src/lib/paraglide/messages.js`.

```svelte
<script>
  import { m } from '$lib/paraglide/messages.js';
</script>
```

## Using Messages

Messages are functions that return the translated string.

If the message has no parameters, you can call it directly:

```svelte
<h1>{m.welcome()}</h1>
```

If the message has parameters, you can pass them as arguments:

```svelte
<h1>{m.welcome({ name: 'Evan' })}</h1>
```

If the message key contains special characters, you can use bracket notation:

```svelte
<h1>{m['welcome!']()}</h1>
```

If the message key is a variable, you can use bracket notation with a variable:

```svelte
<script>
  let key = 'welcome';
</script>
<h1>{m[key]()}</h1>
```

You can also force a specific locale:

```svelte
console.log(m.greeting({ name: "Evan" }, { locale: "de" }));
```

## Using Nested Messages

Messages can be nested. If the messages file includes nested keys, Paraglide flattens them using dot notation.

Example `messages.json`:

```json
{
    "auth": {
    "login": "Log in",
    "logout": "Log out",
    "error": {
        "invalid": "Invalid credentials"
    }
  }
}
```

To access the nested message, use dot notation:

```svelte
<p>{m['auth.login']()}</p>
<p>{m['auth.error.invalid']()}</p>
```

## Script Usage

Messages work just as well inside script logic:

```svelte
<script>
  import { m } from '$paraglide/messages';
  const errorMessage = m['auth.error.invalid']();
</script>

<p>{errorMessage}</p>
```