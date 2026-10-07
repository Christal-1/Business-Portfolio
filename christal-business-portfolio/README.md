# Christal Haines — Business Portfolio Package

A client-facing portfolio focused on websites, business tools and practical digital solutions.

## Package

- `portfolio/` — main business portfolio
- `pwa-business-quickquote/` — working quote-builder PWA
- `pwa-booking-enquiry/` — working booking/enquiry PWA
- `README.md` — setup and publishing notes

## Business positioning

The portfolio is intentionally **not a CV**. Education, employer status, salary and job-search details have been removed from the public-facing site.

The site is designed to help a potential client answer:
1. What can Christal build?
2. Is there proof?
3. What could I hire her for?
4. How do I contact her?

## Before publishing

Replace these placeholders:

- `YOUR-EMAIL@example.com`
- `YOURNUMBER`
- `https://www.linkedin.com/`

Files to update:
- `portfolio/index.html`
- `pwa-booking-enquiry/js/app.js`

Your GitHub profile is already linked as:
`https://github.com/Christal-1`

## Run locally

Because the PWAs use service workers, open them through a local HTTP server rather than directly with `file://`.

Example with Python:

```bash
python -m http.server 8000
```

Then open:
- `http://localhost:8000/portfolio/`
- `http://localhost:8000/pwa-business-quickquote/`
- `http://localhost:8000/pwa-booking-enquiry/`

## GitHub Pages

Upload the package to a repository and enable GitHub Pages.

If the repository is the root of the site, you can publish `portfolio/` as the site root by moving its contents to the repository root, or use the portfolio folder as your deployment source depending on your GitHub Pages setup.

## Important honesty rule

Items marked `WORKING DEMO` are functioning demonstrations.

Items marked `SERVICE` are capabilities you can offer.

Do not present example services as completed client work until you have actually delivered them to a client.
