const ScatterChart = (props) => {
  const { option } = props;

  return (
    <ReactEcharts option={option} style={{ height: '40vh', width: '90vw' }} />
  );
}