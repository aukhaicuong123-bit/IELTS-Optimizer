import urllib.request, re, json

url = 'https://www.forumflashstudy.com/_next/static/chunks/app/page-c646c3b446caee6f.js'
headers = {'User-Agent': 'Mozilla/5.0'}
data = urllib.request.urlopen(urllib.request.Request(url, headers=headers), timeout=20).read().decode('utf-8', errors='ignore')

# Search for the function or variable where "200 mục từ" or topics are defined
pos = data.find('200 mục từ')
if pos != -1:
    print('Found "200 mục từ" at', pos)
    print('Context:')
    print(data[max(0, pos-600):min(len(data), pos+1000)])

pos_err = data.find('bị trùng giữa các chủ đề')
if pos_err != -1:
    print('\nFound error check at', pos_err)
    print('Context:')
    print(data[max(0, pos_err-800):min(len(data), pos_err+400)])
