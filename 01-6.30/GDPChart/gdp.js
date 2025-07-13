let gdpChart = echarts.init(document.getElementById('gdp'));

let gdpOption = {
    title: {
        text: '2022年GDP Top10（亿元）',
        left: 'center'
    },
    tooltip: {},
    xAxis: {
        type: 'category',
        data: ['广东', '江苏', '山东', '浙江', '河南', '四川', '湖北', '福建', '湖南', '安徽']
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        name: 'GDP',
        type: 'bar',
        data: [129118.58, 122875.6, 87435.2, 77712, 58903.2, 53658.7, 53734.9, 53105.3, 48720.9, 45006.7]
    }]
};

gdpChart.setOption(gdpOption);

