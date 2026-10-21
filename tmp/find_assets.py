import urllib.request, re, json, os

headers = {'User-Agent': 'Mozilla/5.0'}
html = urllib.request.urlopen(urllib.request.Request('https://www.forumflashstudy.com/', headers=headers), timeout=10).read().decode('utf-8', errors='ignore')

# Check all next/static scripts or json files
matches = re.findall(r'/_next/static/[^"\'\s>]+', html)
print('Static assets in html:', len(matches))
for m in set(matches):
    print(' ', m)

# Let's also check if there is a build manifest or page manifest
build_manifest_url = 'https://www.forumflashstudy.com/_next/static/buildManifest.js' # or check webpack
for manifest in ['_buildManifest.js', '_ssgManifest.js']:
    try:
        # find the build id
        m_id = re.search(r'\"buildId\":\s*\"([^\"]+)\"', html)
        print('Build id in html:', m_id.group(1) if m_id else 'none')
    except Exception as e:
        pass
