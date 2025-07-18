import jieba
from wordcloud import WordCloud, ImageColorGenerator
import numpy as np
from PIL import Image
import matplotlib.pyplot as plt
from matplotlib import rcParams

# 中文支持
rcParams['font.sans-serif'] = ['Microsoft YaHei']
rcParams['axes.unicode_minus'] = False

with open('douban_comments.txt', encoding='utf-8') as f:
    text = f.read()

#停用词列表
default_stopwords = set([
    "的", "了", "是", "我", "也", "很", "都", "在", "就", "和", "不", "有", "人", "你", "他", "她", "它",
    "这个", "一个", "没有", "我们", "他们", "觉得", "还有", "什么", "但是", "因为", "所以", "非常", "不是", "就是", "看", "电影", "影片"
])

#分词 去除停用词
words = jieba.cut(text)
filtered_words = [word for word in words if word.strip() and word not in default_stopwords]
filtered_text = ' '.join(filtered_words)

mask_img = Image.open('mask.png').convert('L')
mask_array = np.array(mask_img)
w, h = mask_img.size

#自动生成彩色渐变图
gradient = np.zeros((h, w, 3), dtype=np.uint8)
for x in range(w):
    r = int(255 * x / w)
    g = 120
    b = 255 - r
    gradient[:, x, :] = [r, g, b]
mask_color = gradient

wc = WordCloud(
    font_path='C:/Windows/Fonts/msyh.ttc',
    background_color=None,
    mode='RGBA',
    max_words=300,
    max_font_size=250,
    width=w,
    height=h,
    mask=mask_array,
    random_state=42
).generate(filtered_text)

#渲染
image_colors = ImageColorGenerator(mask_color)
plt.figure(figsize=(w / 100, h / 100), dpi=150)
plt.imshow(wc.recolor(color_func=image_colors), interpolation='bilinear')
plt.axis('off')
plt.title('豆瓣精选短评词云图', fontsize=28, fontweight='bold', pad=20)
plt.tight_layout()
plt.show()

wc.to_file('douban_wordcloud_final.png')
print("✅ 已保存高清词云图：douban_wordcloud_final.png")









