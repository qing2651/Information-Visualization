function loadAndCluster() {
  const fileName = document.getElementById("imageSelect").value; // 获取图片文件名
  const k = parseInt(document.getElementById("kValue").value);   // 获取聚类数 k

  const canvas = document.getElementById("canvas");               // 获取画布元素
  const ctx = canvas.getContext("2d", { willReadFrequently: true }); // 2D 上下文，开启频繁读取优化

  const img = new Image();  //创建图片对象
  img.src = `images/${fileName}`; //设置路径

  img.onload = function () {
    //设置画布大小与图片一致，并绘制图片
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    //提取图像像素数据
    const imageData = ctx.getImageData(0, 0, img.width, img.height);
    const data = imageData.data;

    //提取RGB像素点（忽略Alpha通道）
    let pixels = [], i = 0;
    while (i < data.length) {
      pixels.push([data[i], data[i + 1], data[i + 2]]); //每4个为一组 RGB
      i += 4;
    }

    //执行kMeans聚类
    const { clusters, centroids, counts } = kMeans(pixels, k);

    //绘制图表（柱状图/饼图/雷达图）
    renderChart(centroids, counts);

    //将原始图像重新上色，用聚类中心替代原像素值
    for (let j = 0; j < clusters.length; j++) {
      let clusterId = clusters[j];
      data[j * 4] = centroids[clusterId][0];     
      data[j * 4 + 1] = centroids[clusterId][1]; 
      data[j * 4 + 2] = centroids[clusterId][2]; 
    }
    ctx.putImageData(imageData, 0, 0); 
    $("#resultHint").show();          
  };
}

function renderChart(centroids, counts) {
  const chart = echarts.init(document.getElementById("chart")); // 初始化图表
  const chartType = document.getElementById("chartType").value; // 获取图表类型

  //准备图表数据：每个类簇一个颜色与数量
  const data = centroids.map((c, i) => ({
    value: counts[i],
    name: `类 ${i + 1}`,
    itemStyle: { color: `rgb(${c.map(Math.round).join(',')})` } // 将 RGB 转为颜色字符串
  }));

  let option;

  if (chartType === "pie") {
    option = {
      title: { text: '聚类颜色分布（饼图）', left: 'center' },
      tooltip: { trigger: 'item' },
      series: [{
        name: '颜色类簇',
        type: 'pie',
        radius: '60%',
        data
      }]
    };
  }
  else if (chartType === "bar") {
    option = {
      title: { text: '聚类颜色分布（柱状图）', left: 'center' },
      tooltip: {},
      xAxis: {
        type: 'category',
        data: data.map(d => d.name),
        axisLabel: { rotate: 30 }
      },
      yAxis: { type: 'value' },
      series: [{
        name: '像素数',
        type: 'bar',
        data: data.map(d => ({
          value: d.value,
          itemStyle: d.itemStyle
        }))
      }]
    };
  }
  else if (chartType === "radar") {
    option = {
      title: { text: '聚类颜色分布（雷达图）', left: 'center' },
      tooltip: {},
      radar: {
        indicator: data.map(d => ({
          name: d.name,
          max: Math.max(...data.map(x => x.value)) * 1.1
        })),
        shape: 'circle',
        radius: '60%'
      },
      series: [{
        name: '像素数',
        type: 'radar',
        data: [{
          value: data.map(d => d.value),
          itemStyle: { color: '#5470c6' },
          areaStyle: { opacity: 0.2 }
        }]
      }]
    };
  }
  chart.setOption(option); //设置图表配置
}

//K-Means聚类算法
function kMeans(points, k, maxIter = 10) {
  //初始化：从原始点中随机选前k个作为初始中心
  let centroids = points.slice(0, k).map(p => [...p]);
  let clusters = new Array(points.length);  //每个点所属的类簇索引
  let counts = new Array(k).fill(0);  //每个类簇的点数

  for (let iter = 0; iter < maxIter; iter++) {
    counts.fill(0); //每轮开始时重置计数
    let newCentroids = Array(k).fill().map(() => [0, 0, 0]); 

    //每个点分配到最近的中心
    for (let i = 0; i < points.length; i++) {
      let minDist = Infinity, label = 0;
      for (let j = 0; j < k; j++) {
        let d = distance(points[i], centroids[j]);
        if (d < minDist) {
          minDist = d;
          label = j;
        }
      }
      clusters[i] = label;
      counts[label]++;
      newCentroids[label][0] += points[i][0];
      newCentroids[label][1] += points[i][1];
      newCentroids[label][2] += points[i][2];
    }

    //更新新的聚类中心（取平均）
    for (let j = 0; j < k; j++) {
      if (counts[j]) {
        newCentroids[j][0] /= counts[j];
        newCentroids[j][1] /= counts[j];
        newCentroids[j][2] /= counts[j];
      } else {
        //避免空聚类，随机重新选一个点作为中心
        newCentroids[j] = points[Math.floor(Math.random() * points.length)];
      }
    }
    centroids = newCentroids; //更新中心点
  }
  return { clusters, counts, centroids };
}

//欧几里得距离（颜色空间的平方距离）
function distance(a, b) {
  return (a[0]-b[0])**2 + (a[1]-b[1])**2 + (a[2]-b[2])**2;
}

//ui优化界面-下拉框、手风琴、按钮
$(function () {
  $("#control-panel").accordion({ collapsible: true, active: 0 }); // 可折叠面板
  $("select").selectmenu();                                        // 美化 select 元素
  $("#kValue").spinner({ min: 2, max: 20 });                       // 增加 k 值微调器
  $("#analyzeBtn").button();                                      // 美化按钮
  $("#analyzeBtn").on("click", loadAndCluster);                   // 点击绑定分析函数
});
