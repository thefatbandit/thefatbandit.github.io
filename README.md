# thefatbandit.github.io

Source for my personal site, built with [Hugo](https://gohugo.io) and the
[Toha](https://github.com/hugo-toha/toha) theme (pulled in as a Hugo module).

## Run it locally

Needs Hugo (extended), Go, Node and Dart Sass.

```sh
hugo mod tidy && hugo mod npm pack && npm install
hugo server
```

## Deploy

Every push to `main` builds the site and publishes it to GitHub Pages through
`.github/workflows/deploy.yml`.

## Where things live

- `data/en/` – author info and homepage sections (about, experience, education)
- `content/posts/` – blog posts, one folder per category
- `layouts/404.html`, `assets/scripts/hippo-pond.js` – the ASCII hippo pond 404 page
- `assets/styles/override.scss` – custom styles
- `layouts/partials/custom-footer.html`, `assets/scripts/golu.js` – a little secret on the homepage
