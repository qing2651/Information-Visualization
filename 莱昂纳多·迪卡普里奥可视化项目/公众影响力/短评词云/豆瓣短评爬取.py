import os
os.environ['HTTP_PROXY'] = ''
os.environ['HTTPS_PROXY'] = ''

import requests
from bs4 import BeautifulSoup
import time

def fetch_douban_featured_comments(movie_id, max_pages=20):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
    }
    comments = []
    for page in range(max_pages):
        start = page * 20
        url = f'https://movie.douban.com/subject/{movie_id}/comments?start={start}&limit=20&sort=new_score&status=P'
        try:
            resp = requests.get(url, headers=headers, proxies={"http": None, "https": None})
            if resp.status_code != 200:
                print(f'请求失败，状态码：{resp.status_code}，停止爬取')
                break
            soup = BeautifulSoup(resp.text, 'html.parser')
            comment_divs = soup.find_all('div', class_='comment')
            if not comment_divs:
                print('没有更多评论，结束爬取')
                break
            for div in comment_divs:
                short_span = div.find('span', class_='short')
                if short_span:
                    comment = short_span.get_text(strip=True)
                    comments.append(comment)
            print(f'第{page+1}页爬取完成，共爬取{len(comments)}条评论')
            time.sleep(1.5)
        except Exception as e:
            print(f'请求异常：{e}，停止爬取')
            break
    return comments

if __name__ == '__main__':
    movie_id = '3541415'
    comments = fetch_douban_featured_comments(movie_id, max_pages=20)
    if comments:
        with open('douban_comments.txt', 'w', encoding='utf-8') as f:
            for c in comments:
                f.write(c + '\n')
        print(f'爬取完成，保存到 douban_comments.txt，共{len(comments)}条评论')
    else:
        print('没有爬取到任何评论')


