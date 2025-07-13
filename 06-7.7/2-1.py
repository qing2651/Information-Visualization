from urllib.request import urlopen
from bs4 import BeautifulSoup
import jieba
from collections import Counter
import json

html = urlopen("http://chenhui.li/courses/infovis2025/04-EcnuNews.html")
bsObj = BeautifulSoup(html.read(), "html.parser");
table = bsObj.table

links = []
for a in table.find_all('a', href=True, string=True):
    href = a['href']
    #拼成完整链接
    if href.startswith('/'):
        full_url = "https://www.ecnu.edu.cn" + href
    else:
        full_url = href
    links.append(full_url)

#取前5条新闻链接
news_urls = links[:5]
all_text = ""

for url in news_urls:
    print(f"正在抓取：{url}")
    html = urlopen(url)
    bsObj = BeautifulSoup(html.read(), "html.parser")
    #正文在class="v_news_content" 的 div里
    content_div = bsObj.find('div', class_='v_news_content')
    if content_div:
        text = content_div.get_text(separator="\n", strip=True)
        all_text += text + "\n"
    else:
        print(f"正文未找到：{url}")

words = jieba.lcut(all_text)#jieba分词
counter = Counter(words)#统计词频


print("\n词频大于3的前20个词：")
count = 0
for word, freq in counter.most_common():
    if freq > 3:
        print(f"{word}: {freq}")
        count += 1
        if count >= 40:
            break

#筛选词频大于3的词
filtered_words = [(word, freq) for word, freq in counter.items() if freq > 3]
top_words = filtered_words[:20]
#保存json
with open("word_freq.json", "w", encoding="utf-8") as f:
    json.dump(top_words, f, ensure_ascii=False, indent=2)

print("词频数据已保存到 word_freq.json")

#python -m http.server 8000
#http://localhost:8000/2-2.html