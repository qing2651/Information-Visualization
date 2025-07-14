function UIInit() {
    // 初始化滑块
    $("#slider").slider({
        value: 50,
        min: 0,
        max: 100,
        slide: function(event, ui) {
            console.log("滑块值:", ui.value);
        }
    });

    // 美化按钮
    $("#open-dialog-btn").button();

    // 初始化对话框
    $("#my-dialog").dialog({
        autoOpen: false,
        modal: true,
        title: "对话框标题",
        buttons: {
            "关闭": function() {
                $(this).dialog("close");
            }
        }
    });

    // 按钮绑定打开对话框事件
    $("#open-dialog-btn").on("click", function() {
        $("#my-dialog").dialog("open");
    });

    // 阻止默认行为（如果需要）
    $("button, input, a").on("click", function(event){
        event.preventDefault();
    });
}

