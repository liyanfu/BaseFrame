$(function () {
	initTable();
	layui.form.on('radio(type)', function(data){
        vm.menu.type = data.value;
    });
});


var  initTable  = function(){
	var treetable = layui.treetable;
	treetable.render({
		 	treeColIndex: 2,          
	        treeSpid: 0,             
	        treeIdName: 'menuId',       
	        treePidName: 'parentId',     
	        treeDefaultClose: true,   //是否默认折叠
	        treeLinkage: false,        //父级展开时是否自动展开所有子级
	        elem: '#tableGrid'
		    ,url: baseURL + 'sys/menu/list'
		    ,height: 312
		    
		    ,toolbar:''
		    ,parseData:function(res){ //res 即为原始返回的数据
		    	    return {
		    	      "data": res //解析数据列表
		    	    };
		    }
		    ,cellMinWidth: 140 
		    ,cols:  [[
	        	 {type: 'radio'}
	             ,{field: 'menuId',width:80, title: '菜单ID'}
	             ,{field: 'name', title: '菜单名称'}
	             ,{field: 'parentName', title: '上级菜单'}
	             ,{field: 'icon', title: '图标', templet: function(item, index){
	 	            return item.icon == null ? '' : '<i class="'+item.icon+' fa-lg"></i>';
	 	        	}}
	             
	             ,{field: 'type', title: '类型',templet: function(item, index){
	 	            if(item.type === 0){
		                return '<span class="label label-primary">目录</span>';
		            }
		            if(item.type === 1){
		                return '<span class="label label-success">菜单</span>';
		            }
		            if(item.type === 2){
		                return '<span class="label label-warning">按钮</span>';
		            }
		        }}
	             ,{field: 'url', title: '菜单URL'}
	             ,{field: 'perms', title: '授权标识'}
	             ,{field: 'orderNum', title: '排序号'}
	         ]]
		  });
	
	
	
	vm.tableId = 'tableGrid';
	vm.table = treetable;
}


var setting = {
    data: {
        simpleData: {
            enable: true,
            idKey: "menuId",
            pIdKey: "parentId",
            rootPId: -1
        },
        key: {
            url:"nourl"
        }
    }
};
var ztree;

var vm = new Vue({
    el:'#rrapp',
    data:{
        showList: true,
        title: null,
        menu:{
            parentName:null,
            parentId:0,
            type:1,
            orderNum:0
        }
    },
    table:null,
    tableId: null,
    methods: {
        getMenu: function(menuId){
            //加载菜单树
            $.get(baseURL + "sys/menu/select", function(r){
                ztree = $.fn.zTree.init($("#menuTree"), setting, r.menuList);
                var node = ztree.getNodeByParam("menuId", vm.menu.parentId);
                ztree.selectNode(node);

                vm.menu.parentName = node.name;
            })
        },
        add: function(){
            vm.showList = false;
            vm.title = "新增";
            vm.menu = {parentName:null,parentId:0,type:1,orderNum:0};
            layui.form.render('radio');
            vm.getMenu();
        },
        update: function () {
        	
        	var rowData = getSelectedRow(layui.table,vm.tableId);
        	if(rowData == null){
                 return ;
            }
        	var menuId = rowData.menuId;
            if(menuId == null){
                return ;
            }
            vm.menu.type = rowData.type;
            $.get(baseURL + "sys/menu/info/"+menuId, function(r){
                vm.showList = false;
                vm.title = "修改";
                vm.menu = r.menu;
                layui.form.render('radio');
                vm.getMenu();
            });
        },
        del: function () {
        	
        	var rowData = getSelectedRow(layui.table,vm.tableId);
        	if(rowData == null){
                 return ;
            }
        	var menuId = rowData.menuId;
            if(menuId == null){
                return ;
            }

            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "sys/menu/delete",
                    data: "menuId=" + menuId,
                    success: function(r){
                        if(r.code === 0){
                            alert('操作成功', function(){
                                vm.reload();
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        saveOrUpdate: function () {
            if(vm.validator()){
                return ;
            }

            var url = vm.menu.menuId == null ? "sys/menu/save" : "sys/menu/update";
            $.ajax({
                type: "POST",
                url:  baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.menu),
                success: function(r){
                    if(r.code === 0){
                        alert('操作成功', function(){
                            vm.reload();
                        });
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },
        menuTree: function(){
            layer.open({
                type: 1,
                offset: '50px',
                skin: 'layui-layer-molv',
                title: "选择菜单",
                area: ['200px', '250px'],
                shade: 0,
                shadeClose: false,
                content: jQuery("#menuLayer"),
                btn: ['确定', '取消'],
                btn1: function (index) {
                    var node = ztree.getSelectedNodes();
                    //选择上级菜单
                    vm.menu.parentId = node[0].menuId;
                    vm.menu.parentName = node[0].name;

                    layer.close(index);
                    //隐藏部门弹出框
                    $('#menuLayer').hide();
                },
                btn2:function(){
                	//取消
                	 $('#menuLayer').hide();
                },
                cancel: function(){ 
                    //右上角关闭回调
                	$('#menuLayer').hide();
                }
            });
        },
        reload: function () {
            vm.showList = true;
            initTable();
        },
        validator: function () {
            if(isBlank(vm.menu.name)){
                alert("菜单名称不能为空");
                return true;
            }

            //菜单
            if(vm.menu.type === 1 && isBlank(vm.menu.url)){
                alert("菜单URL不能为空");
                return true;
            }
        }
    }
});
