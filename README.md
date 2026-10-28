# Cafe Cartel Website

A simple, fast showcase website for Cafe Cartel ([cafecartel.club](https://cafecartel.club)). It is plain HTML, CSS and JavaScript with no build step, and it is hosted free on GitHub Pages.

## Changing the content

Almost everything is in **`content.js`**: café name, tagline, about text, phone, email, address, hours, social links and menu items.

- **Product photos:** put the image files in `images/` (for example `images/latte.jpg`) and set `image: "images/latte.jpg"` on the menu item.
- **Colors:** change the values at the top of `css/style.css` (`--brand`, `--accent`).
- **Map:** the map is generated from `address` automatically.

You can edit the files directly on github.com (open the file, click the pencil, then **Commit changes**). You can also edit them on your computer and push. The live site updates about a minute after each commit.

## Preview on your computer

Open `index.html` in a browser. No server is needed.

## Going live on GitHub Pages (one-time setup)

The `CNAME` file in this repo already contains the domain `cafecartel.club`.

1. On GitHub, open the repo, go to **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, then select `main` and `/ (root)`, and click **Save**.
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
git clone https://github.com/<owner>/<repo>.git
cd <repo>
# edit content.js, add photos to images/ ...
git add -A
git commit -m "Update menu"
git push
```
