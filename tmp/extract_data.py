import urllib.request, re, json

url = 'https://www.forumflashstudy.com/_next/static/chunks/app/page-c646c3b446caee6f.js'
headers = {'User-Agent': 'Mozilla/5.0'}
data = urllib.request.urlopen(urllib.request.Request(url, headers=headers), timeout=20).read().decode('utf-8', errors='ignore')

print('Downloaded data len:', len(data))

# Let's inspect J=[{id:"a1" ...
pos_j = data.find('J=[{id:"a1"')
if pos_j != -1:
    print('J is at', pos_j)
    end_j = data.find(';function', pos_j)
    if end_j == -1: end_j = pos_j + 1500
    print('J snippet:', data[pos_j:end_j])

# Let's search for what other major datasets exist in this file
# Often there are variables like const topics = ... or var X = ...
# Search for array definitions with multiple objects:
arrays = re.findall(r'([A-Za-z0-9_$]+=\[\{[^\]]+\])', data)
print(f'Found {len(arrays)} object arrays')
for a in arrays[:10]:
    name = a.split('=')[0]
    print(f'Array {name}: len {len(a)} | preview: {a[:120]}...')
