import requests
import json
import time
import random
import os
import re
from datetime import datetime

def get_headers(cookie=None):
    return {
        'User-Agent': random.choice([
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Safari/605.1.15'
        ]),
        'Referer': 'https://www.bilibili.com/',
        'Accept': 'application/json',
        'Cookie': cookie or ''
    }

def load_cookie():
    cookie_file = os.path.join(os.path.dirname(__file__), 'bilibili_cookie.txt')
    if os.path.exists(cookie_file):
        with open(cookie_file, 'r', encoding='utf-8') as f:
            return f.read().strip()
    return input("请输入B站Cookie: ").strip()

def search_bilibili(keyword, max_videos=100, max_pages=10):
    url = "https://api.bilibili.com/x/web-interface/search/type"
    cookie = load_cookie()
    headers = get_headers(cookie)
    results = []
    session = requests.Session()

    for page in range(1, max_pages + 1):
        if len(results) >= max_videos:
            break
        print(f"抓取第 {page} 页...")
        time.sleep(random.uniform(2, 4))
        params = {
            'search_type': 'video',
            'keyword': keyword,
            'page': page
        }
        try:
            r = session.get(url, headers=headers, params=params, timeout=10)
            if r.status_code != 200:
                print(f"请求失败：{r.status_code}")
                break
            data = r.json()
            items = data.get('data', {}).get('result', [])
            for v in items:
                results.append({
                    '标题': re.sub(r'<[^>]+>', '', v.get('title', '')),
                    'UP主': v.get('author', ''),
                    '播放量': v.get('play', 0),
                    '弹幕数': v.get('danmaku', 0),
                    '收藏数': v.get('favorites', 0),
                    '点赞数': v.get('like', 0),
                    '发布时间': datetime.fromtimestamp(v.get('pubdate', 0)).strftime('%Y-%m-%d %H:%M:%S'),
                    '视频链接': f"https://www.bilibili.com/video/{v.get('bvid', '')}"
                })
                if len(results) >= max_videos:
                    break
        except Exception as e:
            print(f"异常: {e}")
            break

    return results[:max_videos]

def save_json(data, keyword):
    safe_name = re.sub(r'[\\/:*?"<>|]', '', keyword)
    output_path = os.path.join(os.path.expanduser("~"), "Desktop", "期末项目", "公众影响力", "粉丝增长趋势图")
    os.makedirs(output_path, exist_ok=True)
    file = os.path.join(output_path, f"bilibili_{safe_name}_videos.json")
    with open(file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"已保存 {len(data)} 条视频数据到：{file}")


if __name__ == '__main__':
    kw = "莱昂纳多"
    videos = search_bilibili(kw, max_videos=100)
    if videos:
        save_json(videos, kw)
    else:
        print("未获取到数据，请检查 Cookie 或稍后再试。")


