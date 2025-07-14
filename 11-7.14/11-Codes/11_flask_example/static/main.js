
var msgMgr = new MsgManager();

//0. Layout
$( "#mycontainer" ).load( "static/layout/main.html", function(){
    $( "#cssmenu" ).load( "static/layout/menu.html", function(){
        init();
        running();
    } );
} );

//1. Init
function init(){

  // UI-Menu
  $("#cssmenu").menumaker({
      title: "FlaskExample",
      format: "multitoggle"
  });

  // UI
  initMainUI();
}

//2. Update
function running(){
    requestAnimationFrame( running );
    msgMgr.run();
}

function buttonEventLoad() {
    // 取出选中的数值，parseFloat 转成数字类型
    const length = parseFloat($("#option_segnum").val());
    const width = parseFloat($("#option_density").val());
    const height = parseFloat($("#option_height").val());

    console.log('请求体积参数:', length, width, height);

    fetch(`/calculate_volume?length=${length}&width=${width}&height=${height}`)
      .then(res => res.json())
      .then(data => {
        if (data.volume !== undefined) {
          alert("计算体积为：" + data.volume);
          console.log("后端返回体积：", data.volume);
          $("#result").text(data.volume);
        } else {
          alert("体积计算失败");
          console.error("返回错误：", data);
        }
      })
      .catch(err => {
        alert("请求失败");
        console.error("网络错误：", err);
      });
}


