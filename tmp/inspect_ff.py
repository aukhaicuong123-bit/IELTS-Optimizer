import urllib.request, re, json

headers = {'User-Agent': 'Mozilla/5.0'}
html = urllib.request.urlopen(urllib.request.Request('https://www.forumflashstudy.com/', headers=headers), timeout=10).read().decode('utf-8', errors='ignore')

print('HTML length:', len(html))
# Find all script src
scripts = re.findall(r'<script[^>]+src=["\']([^"\']+)["\']', html)
print('Scripts count:', len(scripts))
for s in scripts:
    print('Script:', s)

links = re.findall(r'<a[^>]+href=["\']([^"\']+)["\']', html)
print('Links count:', len(links))
for l in set(links):
    print('Link:', l)
