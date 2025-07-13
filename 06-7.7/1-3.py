from urllib.request import urlopen
from bs4 import BeautifulSoup

html = urlopen("https://www.ecnu.edu.cn/info/1094/59213.htm")
bsObj = BeautifulSoup(html.read(), "html.parser")

rs = bsObj.find_all(attrs={"name": "description"})
print(rs[0]['content'])
print(rs[1]['content'])
