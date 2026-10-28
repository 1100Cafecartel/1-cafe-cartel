# Store Website

A simple, fast showcase website for the store. It is plain HTML, CSS and JavaScript with no build step, and it is hosted free on GitHub Pages.

## Changing the content

Almost everything is in **`content.js`**: store name, tagline, about text, phone, email, address, hours, social links and products.

- **Product photos:** put the image files in `images/` (for example `images/bread.jpg`) and set `image: "images/bread.jpg"` on the product.
- **Colors:** change the values at the top of `css/style.css` (`--brand`, `--accent`).
- **Map:** the map is generated from `address` automatically.

You can edit the files directly on github.com (open the file, click the pencil, then **Commit changes**). You can also edit them on your computer and push. The live site updates about a minute after each commit.

## Preview on your computer

Open `index.html` in a browser. No server is needed.

## Going live on GitHub Pages (one-time setup)

1. Push this folder to your GitHub repository.
2. On GitHub, go to **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, then select `main` and `/ (root)`, and click **Save**.
3. Under **Custom domain**, enter your domain (for example `www.yourstore.com`) and click **Save**. This creates a `CNAME` file in the repo.
4. At your domain registrar, add these DNS records:
   - `CNAME` record: `www` → `<your-github-username>.github.io`
   - `A` records for the bare domain (`@`): `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
5. Once DNS has propagated (from a few minutes up to 24 hours), tick **Enforce HTTPS** in Settings → Pages.

## Managing it from another computer

```bash
git clone https://github.com/<owner>/<repo>.git
cd <repo>
# edit content.js, add photos to images/ ...
git add -A
git commit -m "Update products"
git push
```
