const ReactEcharts = (props) => {
  const { option, style } = props;

  const chartRef = React.useRef(null);  // 用来勾住图表的容器

  // 监听 option 的变化，变化时重新渲染图表
  React.useEffect(() => {
    if (chartRef.current) {
      const echartInstance = echarts.init(chartRef.current);
      echartInstance.setOption(option);
    }
  }, [option]);

  return (
    <div ref={chartRef} style={style} />
  );
}
