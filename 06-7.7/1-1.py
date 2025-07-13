from urllib.request import urlopen
strhtml = urlopen("http://chenhui.li/courses/infovis2025.html")
#print(strhtml.read())
print(strhtml.read().decode('utf-8'))
