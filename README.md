# Tali page

Static bilingual landing page for Russian and Hebrew audiences.

## Local preview

```bash
python3 -m http.server 8080
```

Open `http://127.0.0.1:8080/`.

## Easy configuration

- `assets/js/config.js` — name, default language, optional profile photo and form delivery.
- `assets/js/content.js` — all Russian and Hebrew text.
- `assets/css/theme.css` — the complete colour scheme, shadows, radii and page width.
- `assets/css/site.css` — responsive layout.

To add a photo, copy it into `assets/images/` and set `profilePhoto` in `config.js`.

## Contact form

The draft uses `contact.mode: "preview"`. Required fields are validated, but personal information is not transmitted.
Before publishing, connect a server-side endpoint and change the mode to `endpoint`. Never store Telegram bot tokens or SMTP passwords in browser JavaScript.

## Language policy

Russian text may use `логопедическая работа`. Hebrew text uses development-oriented wording and does not claim a regulated professional title.
