# Height Roofing website

The one-page website for **Height Roofing**, commercial, residential and torch-on roofing in Surrey, BC.

It's a plain static site: HTML, CSS and a little JavaScript. There is no build step, no framework and nothing to install.

## What's in the folder

| File | What it is |
| --- | --- |
| `index.html` | The page itself: all the text, links, phone number and SEO tags |
| `styles.css` | Colours, fonts, sizes and layout (including the mobile layout) |
| `script.js` | Animations, the service tabs, the form chips and the contact form |
| `height/` | The logo and job photos |
| `404.html` | The "page not found" page |
| `robots.txt` | Tells search engines they're allowed to index the site |

## Preview it on your computer

Open a terminal in this folder and run:

```
python3 -m http.server
```

Then go to <http://localhost:8000> in your browser. Press `Ctrl+C` in the terminal to stop it.

(You can also double-click `index.html`, but a few things, like the 404 page, only behave properly through a server.)

## Put it online

The whole folder is the website, so you just upload it:

- **Netlify:** log in, open "Sites", and drag this folder onto the page. That's it.
- **Vercel:** create a new project from this Git repository, choose "Other" as the framework, and leave the build command empty.
- **GitHub Pages:** in the repository go to Settings → Pages, choose "Deploy from a branch", pick `main` and `/ (root)`. The 404 page links to `/`, so it works best with a custom domain (for example `www.heightroofing.ca`).

Once you have a domain, open `index.html` and fill in the commented-out `canonical` and `og:url` lines near the top, and add `"url"` to the business details block (the `application/ld+json` script). Search engines and social sites like full image addresses, so change `height/job7.jpg` in the `og:image` / `twitter:image` lines to `https://your-domain/height/job7.jpg`.

## Changing the text, phone number or email

Everything is in `index.html`. Use your editor's "Find" to locate it:

- **Phone number:** search for `778` . The shown number looks like `(778) 318-1979`, and the link behind it looks like `tel:17783181979`. Change both. It appears in the header, the hero, the contact section, the footer, the mobile bar, the business details block and `404.html`.
- **Email:** search for `sam@heightroofing.ca` (it appears in the contact section and the business details block).
- **Address:** search for `14715`.
- **Other text:** just find the sentence and edit it. Leave the `<tags>` around it as they are.
- **Colours and fonts:** they're at the top of `styles.css` under `:root`.

## Hooking up the contact form

There's no server, so the form needs a form service to email you the messages. [Formspree](https://formspree.io) is a simple option (it has a free plan):

1. Create a Formspree account and a new form. Formspree gives you an address like `https://formspree.io/f/abcdwxyz`.
2. Open `script.js`. At the very top, change
   ```js
   const FORM_ENDPOINT = '';
   ```
   to
   ```js
   const FORM_ENDPOINT = 'https://formspree.io/f/abcdwxyz';
   ```
3. Upload the site again and send yourself a test message. Formspree asks you to confirm the first one.

What gets sent: `first_name`, `last_name`, `email`, `message`, and `services` (the chips the visitor tapped, e.g. "Commercial, Torch-on"). The form is sent with `fetch` as `FormData` with an `Accept: application/json` header, so any service that accepts that will also work (Formspree, Getform, Basin and others).

- **While `FORM_ENDPOINT` is empty,** the form still shows the "Thanks. We'll be in touch." message, but **nothing is sent**. The browser console shows a warning saying so.
- **If sending fails,** the form stays on the page and shows a short error message asking the visitor to try again or call.

## Notes

- The page respects the "reduce motion" setting on phones and computers: animations are switched off for those visitors.
- Without JavaScript, everything is still visible. Only the animations and the service tabs need it.
