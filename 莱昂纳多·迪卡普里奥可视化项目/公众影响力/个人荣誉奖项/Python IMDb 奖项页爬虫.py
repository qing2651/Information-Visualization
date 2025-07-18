import requests
from bs4 import BeautifulSoup
import csv
import re

url = "https://www.imdb.com/name/nm0000138/awards"
headers = {
    "User-Agent": "Mozilla/5.0"
}

response = requests.get(url, headers=headers, proxies={"http": None, "https": None})

soup = BeautifulSoup(response.text, 'html.parser')

rows = soup.select("div.article table.awards tr")

data = []

for row in rows:
    if row.find("td", class_="award_year"):
        year = row.find("td", class_="award_year").text.strip()
        award = row.find("td", class_="award_category").text.strip()
        result = row.find("td", class_="award_outcome").find("b").text.strip()
        category = row.find("td", class_="award_outcome").contents[-1].strip()

        # 尝试提取电影名
        movie_tag = row.find("td", class_="award_description")
        if movie_tag:
            movie_match = re.search(r'for\s+(.+)', movie_tag.text.strip())
            movie = movie_match.group(1) if movie_match else ""
        else:
            movie = ""

        data.append([year, award, category, result, movie])

with open("awards_dicaprio.csv", "w", newline='', encoding="utf-8-sig") as f:
    writer = csv.writer(f)
    writer.writerow(["year", "award", "category", "result", "movie"])
    writer.writerows(data)

print("爬取完成，数据保存为 awards_dicaprio.csv")
