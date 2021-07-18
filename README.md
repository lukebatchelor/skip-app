# Skip App

This is a super small microsite that basically justs acts as a gateway to [https://archive.ph/](https://archive.ph/) which in turn can sometimes help render certain websites a lot more visible.

It works in four ways:

- Simple static website with a search bar - allows pasting in a url and getting redirected
- Javascript bookmarklet - can be saved to bookmarks then clicked from any url
- PWA app - can be saved to phone to access website as an installed app
  - Also acts as a "Share target" allowing the user to share the url to the app and be redirected with only 2 clicks

See it live at: [https://skip.lbat.ch](https://skip.lbat.ch) (or [https://outline.lbat.ch](https://outline.lbat.ch) if you find that easier to remember!).

## Running your own instance of this

This project is running on a small Digital Ocean vps along with a few other projects of mine. Getting this running yourself should be simple:

```sh
# assuming your are ssh'd into your remote machine
# start by cloning this project:
git clone git@github.com:lukebatchelor/skip-app.git

# cd into the directory and install all it's deps
cd skip-app
yarn --production

# No need to build package, we can pull the current version prebuilt from github
yarn release:pull

# we should now have a `.next` dir, next run that server. I'm running it with pm2 so that I can leave it running, read logs, trigger restarts, etc.
# Optionally also set a custom port to run on
PORT="3004" pm2 start yarn --name "skip-app" --interpreter bash -- start

# now set up nginx to reverse proxy traffic to our server (edit this however you like, personally I use rmate with the vscode extension)
rmate /etc/nginx/sites-available/your.site.nginx
```

Your nginx config should look something like this

```
server {
    # serve the site under multiple aliases
    server_name skip.lbat.ch outline.lbat.ch;

    # rewrite any url that starts with http as the path and put it into a query param instead
    rewrite ^/(https?:.*)$ /?url=$1 redirect; # uses 302 (temporary) redirect

    location / {
        # proxy traffic to our local server running on custom port 3004
        proxy_pass http://localhost:3004;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

After restarting nginx you should be able to set up a DNS A Record pointing to your vps and you should be live!
