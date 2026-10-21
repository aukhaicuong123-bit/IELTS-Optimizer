import urllib.request, re, json

url = 'https://www.forumflashstudy.com/_next/static/chunks/app/page-c646c3b446caee6f.js'
headers = {'User-Agent': 'Mozilla/5.0'}
data = urllib.request.urlopen(urllib.request.Request(url, headers=headers), timeout=20).read().decode('utf-8', errors='ignore')

# Let's inspect the UI tabs or sections
print('Searching for Tab names or button labels in Vietnamese:')
vn_strings = re.findall(r'\"([^\"]*[\u00C0-\u1EF9][^\"]*)\"', data)
print(f'Total VN strings: {len(vn_strings)}')

# Unique strings of interest
study_strings = [s for s in set(vn_strings) if any(k in s.lower() for k in ['học', 'từ vựng', 'ngữ pháp', 'luyện', 'chủ đề', 'bài', 'câu', 'bậc', 'cefr'])]
print(f'Study-related VN strings: {len(study_strings)}')
for s in sorted(study_strings)[:30]:
    print(' -', s)
