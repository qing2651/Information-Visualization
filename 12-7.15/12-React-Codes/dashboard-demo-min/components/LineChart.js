const LineChart = (props) => {
  const { option } = props;

  return (
    <ReactEcharts option={option} style={{ height: '30vh', width: '45vw' }} />
  );
}