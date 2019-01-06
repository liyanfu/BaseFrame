//jqGrid的配置信息
//$.jgrid.defaults.width = 1000;
//$.jgrid.defaults.responsive = true;
//$.jgrid.defaults.styleUI = 'Bootstrap';

var baseURL = "../../";

//工具集合Tools
window.T = {};

// 获取请求参数
// 使用示例
// location.href = http://localhost:8080/index.html?id=123
// T.p('id') --> 123;
var url = function(name) {
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null)return  unescape(r[2]); return null;
};
T.p = url;

/**
 * id
 * 表格Id
 * toolbarId
 * 工具按钮ID
 * url
 * 访问url
 * cols
 * 列名
 */
var getTableDefaults = function(id,toolbarId,url,cols){
	 var table = layui.table;
		  table.render({
		    elem: '#'+id
		    ,url: baseURL + url
		    ,height: 312
		    ,toolbar:toolbarId
		    ,parseData:function(res){ //res 即为原始返回的数据
		    	    return {
		    	      "code": res.code, //解析接口状态
		    	      "msg": res.msg, //解析提示文本
		    	      "count": res.page.totalCount, //解析数据长度
		    	      "data": res.page.list //解析数据列表
		    	    };
		    }
		    ,page: true //开启分页
		    ,cellMinWidth: 140 
		    ,cols: cols,
		    done:function(r){
		    	//加载完之后执行
		    	$('.layui-table-page').css('overflow-x','auto');
		    }
		  });
	return table;
}


//全局配置
$.ajaxSetup({
	dataType: "json",
	cache: false
});

//重写alert
window.alert = function(msg, callback){
	parent.layer.alert(msg, function(index){
		parent.layer.close(index);
		if(typeof(callback) === "function"){
			callback("ok");
		}
	});
}

//重写confirm式样框
window.confirm = function(msg, callback){
	parent.layer.confirm(msg, {btn: ['确定','取消']},
	function(){//确定事件
		if(typeof(callback) === "function"){
			callback("ok");
		}
	});
}


//选择一条记录 返回整条数据
function getSelectedRow(table,tableId) {
	var checkStatus = table.checkStatus(tableId); //tableId 即为基础参数 id 对应的值
    if(checkStatus.data.length==0){
    	alert("请选择一条记录!");
    	return null;
    }
    
    if(checkStatus.data.length > 1){
    	alert("只能选择一条记录!");
    	return null;
    }
    
    return checkStatus.data[0];
}

//选择多条记录 返回全部数据
function getSelectedRows(table,tableId) {
	var checkStatus = table.checkStatus(tableId); //tableId 即为基础参数 id 对应的值
    if(checkStatus.data.length==0){
    	alert("请至少选择一条记录!");
    	return null;
    }
    return checkStatus.data;
}

//判断是否为空
function isBlank(value) {
    return !value || !/\S/.test(value)
}
