import json, re, os

BASE = os.path.dirname(os.path.abspath(__file__))
if not BASE:
    BASE = os.getcwd()

with open(os.path.join(BASE, 'posts', 'posts.json'), 'r', encoding='utf-8-sig') as f:
    posts = json.load(f)

posts_json = json.dumps(posts, ensure_ascii=False, separators=(',', ':'))
data_block = f'<script>window.__POSTS__={posts_json};</script>'

for html_file in ['index.html', 'archive.html']:
    path = os.path.join(BASE, html_file)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    pattern = r'<!-- POSTS_DATA_START -->.*?<!-- POSTS_DATA_END -->'
    m = re.search(pattern, content, re.DOTALL)

    if not m:
        print(f'ERROR: markers not found in {html_file}')
        continue

    replacement = f'<!-- POSTS_DATA_START -->\n{data_block}\n<!-- POSTS_DATA_END -->'
    new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

    if new_content != content:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'{html_file}: updated ({len(posts)} posts)')
    else:
        print(f'{html_file}: already up to date ({len(posts)} posts)')

print('Done')
