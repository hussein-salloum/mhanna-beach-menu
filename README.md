# Mhanna Beach Menu

A mobile-first Arabic QR menu prepared for Render static hosting.

## Files
- `index.html`: public menu
- `menu-data.js`: restaurant details, categories, items, and prices
- `admin.html`: visual editor that downloads a replacement `menu-data.js`
- `styles.css`: beach-inspired design
- `render.yaml`: Render configuration

## Deploy to Render
1. Create a new GitHub repository and upload all files from this folder.
2. In Render, choose **New > Static Site** and connect the repository.
3. Build command: leave empty. Publish directory: `.`
4. Deploy. Render will provide a public HTTPS URL.
5. Generate a QR code using the final Render URL.

## Update menu prices
Open `/admin.html`, make edits, download the new `menu-data.js`, replace the old file in GitHub, and commit. Render redeploys automatically.

Important: because this version has no database, the editor cannot publish changes directly for all clients. Supabase would be needed for secure online publishing from the admin page.
