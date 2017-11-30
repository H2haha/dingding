$(document).ready(function() {
    //弹窗关闭
    $(".delete").click(function() {
        $(".gray,.boxbg").hide();
        document.getElementById("entry-input").value = "";
    });
    var host = "http://192.168.1.20:5189/";

    $(".input-item").on('input propertychange', function() {
        var phoneReg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/;

        var phone = $(".input-item").val();

        if (phoneReg.test(phone) || phone.length < 11) {
            $(".obtain").css("color", "#ff4c4b");
        }
    });
    $(".obtain").click(function() {
        var phone = $(".input-item").val();
        localStorage.setItem("telPhone", "value"); //存储变量名为key，值为value的变量  
        localStorage.telPhone = phone;
        validate();
    });

    //手机校验
    function validate() {
        //正则表达式，十一位数字的电话号码
        var phoneReg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/;
        var phone = $(".input-item").val();

        //验证输入的电话号码是否是11位数字
        if (!phoneReg.test(phone)) {
            layer('请输入正确的手机号码！')
        } else {
            $(".gray,.boxbg").show();
            //获取二维码图片
            document.getElementById("erwi").src = host + "dingding-open-api/open/kaptcha/?telPhone=" + phone;
            var phoneget = localStorage.getItem("telPhone");
            $("#erwi").click(function() {
                $("#erwi").attr('src', host + "dingding-open-api/open/kaptcha/?telPhone=" + phoneget);
            });
            //弹窗确认

            $(".entry-input").on('input propertychange', function() {
                if (($.trim($('.entry-input').val()) !== "")) {
                    $(".sure").css("background", "url(/images/blue.png) repeat");
                }
            });


            $(".sure").click(function() {
                sendMessage();
            });
            //获取验证码
            var InterValObj; //timer变量，控制时间
            var count = 90; //间隔函数，1秒执行
            var curCount; //当前剩余秒数
            function sendMessage() {
                curCount = count;
                // 设置button效果，开始计时
                document.getElementById("btnSendCode").setAttribute("disabled", "true"); //设置按钮为禁用状态
                document.getElementById("btnSendCode").value = curCount + "秒"; //更改按钮文字
                $("#btnSendCode").css({ "color": "#999999" });
                InterValObj = window.setInterval(SetRemainTime, 1000); // 启动计时器timer处理函数，1秒执行一次
                // 向后台发送处理数据
                var param = {};
                param.telPhone = $(".input-item").val();
                param.valiCode = $(".entry-input").val();
                $.ajax({
                    async: true,
                    url: host + "dingding-open-api/open/message/",
                    type: "get",
                    dataType: "jsonp", // 返回的数据类型，设置为JSONP方式
                    jsonp: 'callback', //指定一个查询参数名称来覆盖默认的 jsonp 回调参数名 callback
                    jsonpCallback: 'handleResponse', //设置回调函数名
                    data: param,
                    success: function(response) {
                        if (response.code == 200) {
                            $(".gray,.boxbg").hide();
                            document.getElementById("entry-input").value = "";
                            console.log(response.message);
                        } else if (response.code == 1101) {
                            layer("您的图形验证码输入错误，请重新输入！");
                        } else if (response.code == 500) {
                            layer("服务器异常！");
                        }
                    },
                    error: function() {}
                });
                //短信倒计时
                function SetRemainTime() {
                    if (curCount == 0) {
                        window.clearInterval(InterValObj); // 停止计时器
                        document.getElementById("btnSendCode").removeAttribute("disabled"); //移除禁用状态改为可用
                        document.getElementById("btnSendCode").value = "获取验证码";

                        $("#btnSendCode").css("color", "#ff4c4b");
                    } else {
                        curCount--;
                        document.getElementById("btnSendCode").value = curCount + "秒";
                    }
                }
                //SetRemainTime end
            } //倒计时end

        } //手机号码正确 end
    }
    //H5注册
    $(".code-check").on('input propertychange', function() {
        if (($.trim($('.code-check').val()) !== "")) {
            $(".obtain2").css({ "background": "url(/images/blue.png) repeat", "color": "#ffffff" });

        }
    });
    $(".obtain2").click(function() {
        login();
    });

    function login() {

        function GetQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
            var context = "";
            if (r != null)
                context = r[2];
            reg = null;
            r = null;
            return context == null || context == "" || context == "undefined" ? "" : context;
        }
        var phone = $(".input-item").val();
        var code = $(".code-check").val();
        var param = {};
        // var couponId = GetQueryString("cityCode");
        // alert(couponId);
        param.telPhone = phone;
        param.code = code;
        param.channel = GetQueryString("channel");
        param.cityCode = GetQueryString("cityCode");
        param.couponId = GetQueryString("couponId");
        // param.channel = "qerewq";
        // param.cityCode = "010";
        // param.couponId = "123";
        // 
        $.ajax({
            async: true,
            url: host + "dingding-open-api/open/h5/receiveCoupon",
            type: "get",
            dataType: "jsonp", // 返回的数据类型，设置为JSONP方式
            jsonp: 'callback', //指定一个查询参数名称来覆盖默认的 jsonp 回调参数名 callback
            jsonpCallback: 'handleResponse', //设置回调函数名
            data: param,
            success: function(response) {
                if (response.code == 200) {
                    layer('请求成功');
                    window.location.href = "success.html";
                } else if (response.code == 8102) {
                    window.location.href = "receive.html";
                } else if (response.code == 1102) {
                    layer('短信验证码错误');
                } else if (response.code == 500) {
                    layer('服务器异常');
                } else if (response.code == 1007) {
                    layer('参数错误');
                } else if (response.code == 8101) {
                    layer('优惠券失效');
                } else if (response.code == 8103) {
                    layer('城市不匹配');
                } else if (response.code == 7012) {
                    layer('渠道无效');
                }
            },
            error: function() {

            }
        });
    } //登录 end
    //提示
    function layer(msg, fun) {
        var str = $('<div id="layer"><div class="layer-bg" style="position: fixed;top: 0;left: 0;width: 100%;height: 100%;z-index: 9999;background-color:transparent;"></div><div class="my_layer" style="position:fixed;top:6rem;left: 50%;z-index:10000;width:80%;margin-left:-40%;opacity:0.8;background:#222222;border-radius:100px;"><div style="color:#ffffff!important;height:50px;line-height:50px; text-align:center;">' + msg + '</div></div></div>');
        $('body').append(str);
        setTimeout(function() {
            $('#layer').remove();
            fun && fun();
        }, 2000);
    }
    //layer end
});