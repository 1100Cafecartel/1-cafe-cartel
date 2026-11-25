# Cafe Cartel Website

A simple, fast showcase website for Cafe Cartel ([cafecartel.club](https://cafecartel.club)). It is plain HTML, CSS and JavaScript with no build step, and it is hosted free on GitHub Pages.

## Changing the content

Almost everything is in **`content.js`**: café name, tagline, story, phone, email, address, hours, social links, the rewards text and the pickup/delivery cards.

- **The full menu and prices live on the ordering site** (order.cafecartel.club, edited in *Menu & hours*). This page only shows highlights and sends people there, so prices are never out of date here.
- **House favorites** (`favorites:`): photo cards. Each has a name, price, short description, photo (`images/menu/...jpg`) and the item's number on the order site (`id`). Open the item on the order site; the number is at the end of the address, e.g. `#i/22`.
- **Menu sections** (`sections:`): one photo card per section. The `name` must match the section name in Menu & hours.
- **Colors:** change the values at the top of `css/style.css` (`--red`, `--yellow`, `--blue`, `--ink`).

You can edit the files directly on github.com (open the file, click the pencil, then **Commit changes**). You can also edit them on your computer and push. The live site updates about a minute after each commit.

The original artwork uploads stay in `images/` for reference; the site uses the smaller `.webp` copies.

## Preview on your computer

Open `index.html` in a browser. No server is needed.

## Going live on GitHub Pages (one-time setup)

The `CNAME` file in this repo already contains the domain `cafecartel.club`.

1. On GitHub, open the repo, go to **Settings → Pages**. Under **Build and deployment → Source**, choose **GitHub Actions**. The included workflow (`.github/workflows/pages.yml`) publishes the site on every push to `main`; to re-run it, go to the **Actions** tab → **Deploy website** → **Run workflow**.
2. Under **Custom domain**, make sure `cafecartel.club` is entered, and click **Save**.
3. In Namecheap, go to **Domain List → cafecartel.club → Manage → Advanced DNS**. Delete any existing "URL Redirect" or parking records for `@` and `www`, then add:

   | Type         | Host  | Value                         |
   |--------------|-------|-------------------------------|
   | A Record     | `@`   | `185.199.108.153`             |
   | A Record     | `@`   | `185.199.109.153`             |
   | A Record     | `@`   | `185.199.110.153`             |
   | A Record     | `@`   | `185.199.111.153`             |
   | CNAME Record | `www` | `1100cafecartel.github.io.`   |

4. Wait for DNS to update (usually under an hour, at most 24 hours). Then tick **Enforce HTTPS** in GitHub Settings → Pages.

## Managing it from another computer

```bash
git clone https://github.com/1100Cafecartel/1-cafe-cartel.git
cd 1-cafe-cartel
# edit content.js, add photos to images/ ...
git add -A
git commit -m "Update menu"
git push
```
