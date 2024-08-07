# tampermonkey-scripts
Personal scripts to be used with https://www.tampermonkey.net/scripts.php

## israeli-tv-downloader.js

works for any tv show on the following websites:
- https://www.mako.co.il
- https://13tv.co.il
- https://www.kan.org.il/
- https://play.hot.net.il/
- https://vod.walla.co.il

requirements:

download and install https://youtube-dl.org/

### Windows installation

```ps1
winget install --id youtube-dl.youtube-dl
```

### Using

- Browse to one of the supported websites
- Click to view a specific video
- One the alert opens, click OK
- Open a terminal and paste in the copied command

![israeli-tv-downloader.js](./israeli-tv-downloader.gif)

and play the video, even offline
![image](https://user-images.githubusercontent.com/9786571/177939175-5bb21c81-09bc-4d39-bb2d-49a6264abee9.png)

## 1337x-magnet-links.js

Adds torrent magnet links directly from the search results without needing to click on any result

![1337x-magnet-links.js](./1337x-magnet-links.gif)

works for any of the websites:
- https://1337x.to/
- https://1337xx.to/
- https://www.1337xxx.to/

## facebook-adblock.js

Removes sponsored ads after hovering over the `sponsored` text.

![facebook-adblock.js](./facebook-adblock.gif)
