# Cafe Cartel Website

A simple, fast showcase website for Cafe Cartel ([cafecartel.club](https://cafecartel.club)). It is plain HTML, CSS and JavaScript with no build step, and it is hosted free on GitHub Pages.

## Changing the content

Almost everything is in **`content.js`**: café name, tagline, story, phone, email, address, hours, social links, delivery zones and **the menu**.

**Menu items** live under `menu:`, grouped by section (Coffee, Bakery, ...). Each item is one line:

```js
{ name: "Latte", sizes: { Reg: 4.85, Lg: 5.85 } },          // two sizes
{ name: "Espresso", price: 3.35 },                            // one price
{ name: "Muffin", price: 2.90, choices: ["Banana", "Mocha"] }, // customer picks one
{ name: "Pita Paisa", price: 8.99, desc: "Colombian chorizo, chimichurri, provolone" },
```

- To change a price, edit the number. To remove an item, delete its line. To add one, copy a line and edit it.
- Add `image: "images/latte.jpg"` to an item to show a photo next to it.
- Drink add-ons (iced, oat milk, flavors, extra shot) are under `extras:` and apply to sections marked `extras: true`.
- **Colors:** change the values at the top of `css/style.css` (`--red`, `--yellow`, `--blue`, `--ink`).
- **Online orders** are sent to `orderEmail`. Add the café cell number to `orderTextNumber` to let customers send orders by text.

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
