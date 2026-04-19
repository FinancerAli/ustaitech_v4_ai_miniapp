import urllib.request
import json
import config

token = config.BOT_TOKEN
url = f"https://api.telegram.org/bot{token}/setChatMenuButton"
data = {
    "menu_button": {
        "type": "web_app",
        "text": "Open MiniApp",
        "web_app": {
            "url": "https://dist-ustai.vercel.app/"
        }
    }
}
req = urllib.request.Request(url, data=json.dumps(data).encode(), headers={'Content-Type': 'application/json'})
try:
    res = urllib.request.urlopen(req)
    print("Menu button updated:", res.read().decode())
except Exception as e:
    print("Error:", e)
