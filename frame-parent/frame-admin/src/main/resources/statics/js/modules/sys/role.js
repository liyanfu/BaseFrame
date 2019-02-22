$(function () {
	
	var cols =  [[
	       {type: 'checkbox'}
		      ,{field:'roleId',  title: '角色ID', width:80, sort: true}
		      ,{field:'roleName',  title: '角色名称'}
		      ,{field:'deptName',  title: '所属部门'}
		      ,{field:'remark',  title: '备注'}
		      ,{field:'createTime', title: '创建时间',minWidth:140}
		      
		    ]];
	
		vm.tableId = 'tableGrid';
		vm.table = getTableDefaults(vm.tableId,null,'sys/role/list',cols);
		//先加载一遍，否则选择框不起作用//先加载一遍，否则选择框不起作用
		$('.layui-table-page').css('overflow-x','auto');
});


//菜单树
var menu_ztree;
var menu_setting = {
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
    },
    check:{
        enable:true,
        nocheckInherit:true
    }
};

//部门结构树
var dept_ztree;
var dept_setting = {
    data: {
        simpleData: {
            enable: true,
            idKey: "deptId",
            pIdKey: "parentId",
            rootPId: -1
        },
        key: {
            url:"nourl"
        }
    }
};

//数据树
var data_ztree;
var data_setting = {
    data: {
        simpleData: {
            enable: true,
            idKey: "deptId",
            pIdKey: "parentId",
            rootPId: -1
        },
        key: {
            url:"nourl"
        }
    },
    check:{
        enable:true,
        nocheckInherit:true,
        chkboxType:{ "Y" : "", "N" : "" }
    }
};

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            roleName: null
        },
        showList: true,
        title:null,
        role:{
            deptId:null,
            deptName:null
        }
    },
    table:null,
    tableId: null,
    methods: {
        query: function () {
            vm.reload();
        },
        add: function(){
            vm.showList = false;
            vm.title = "新增";
            vm.role = {deptName:null, deptId:null};
            vm.getMenuTree(null);

            vm.getDept();

            vm.getDataTree();
        },
        update: function () {
            var rowData = getSelectedRow(vm.table,vm.tableId);
        	if(rowData == null){
                 return ;
            }
        	var roleId = rowData.roleId;

            vm.showList = false;
            vm.title = "修改";
            vm.getDataTree();
            vm.getMenuTree(roleId);

            vm.getDept();
        },
        del: function () {
            var rowDatas = getSelectedRows(vm.table,vm.tableId);
            if(rowDatas == null){
                return ;
            }
            
            var roleIds = [];
            for (var i = 0; i < rowDatas.length; i++) {
            	roleIds[i] = rowDatas[i].roleId;
			}
            
            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "sys/role/delete",
                    contentType: "application/json",
                    data: JSON.stringify(roleIds),
                    success: function(r){
                        if(r.code == 0){
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
        getRole: function(roleId){
            $.get(baseURL + "sys/role/info/"+roleId, function(r){
                vm.role = r.role;

                //勾选角色所拥有的菜单
                var menuIds = vm.role.menuIdList;
                for(var i=0; i<menuIds.length; i++) {
                    var node = menu_ztree.getNodeByParam("menuId", menuIds[i]);
                    menu_ztree.checkNode(node, true, false);
                }

                //勾选角色所拥有的部门数据权限
                var deptIds = vm.role.deptIdList;
                for(var i=0; i<deptIds.length; i++) {
                    var node = data_ztree.getNodeByParam("deptId", deptIds[i]);
                    data_ztree.checkNode(node, true, false);
                }

                vm.getDept();
            });
        },
        saveOrUpdate: function () {
            //获取选择的菜单
            var nodes = menu_ztree.getCheckedNodes(true);
            var menuIdList = new Array();
            for(var i=0; i<nodes.length; i++) {
                menuIdList.push(nodes[i].menuId);
            }
            vm.role.menuIdList = menuIdList;

            //获取选择的数据
            var nodes = data_ztree.getCheckedNodes(true);
            var deptIdList = new Array();
            for(var i=0; i<nodes.length; i++) {
                deptIdList.push(nodes[i].deptId);
            }
            vm.role.deptIdList = deptIdList;

            var url = vm.role.roleId == null ? "sys/role/save" : "sys/role/update";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.role),
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
        getMenuTree: function(roleId) {
            //加载菜单树
            $.get(baseURL + "sys/menu/list", function(r){
                menu_ztree = $.fn.zTree.init($("#menuTree"), menu_setting, r);
                //展开所有节点
                menu_ztree.expandAll(true);

                if(roleId != null){
                    vm.getRole(roleId);
                }
            });
        },
        getDataTree: function(roleId) {
            //加载菜单树
            $.get(baseURL + "sys/dept/list", function(r){
                data_ztree = $.fn.zTree.init($("#dataTree"), data_setting, r);
                //展开所有节点
                data_ztree.expandAll(true);
            });
        },
        getDept: function(){
            //加载部门树
            $.get(baseURL + "sys/dept/list", function(r){
                dept_ztree = $.fn.zTree.init($("#deptTree"), dept_setting, r);
                var node = dept_ztree.getNodeByParam("deptId", vm.role.deptId);
                if(node != null){
                    dept_ztree.selectNode(node);

                    vm.role.deptName = node.name;
                }
            })
        },
        deptTree: function(){
            layer.open({
                type: 1,
                offset: '50px',
                skin: 'layui-layer-molv',
                title: "选择部门",
                area: ['200px', '250px'],
                shade: 0,
                shadeClose: false,
                content: jQuery("#deptLayer"),
                btn: ['确定', '取消'],
                btn1: function (index) {
                    var node = dept_ztree.getSelectedNodes();
                    //选择上级部门
                    vm.role.deptId = node[0].deptId;
                    vm.role.deptName = node[0].name;
                    layer.close(index);
                    //隐藏部门弹出框
                    $('#deptLayer').hide();
                },
                btn2:function(){
                	//取消
                	 $('#deptLayer').hide();
                },
                cancel: function(){ 
                    //右上角关闭回调
                	$('#deptLayer').hide();
                }
            });
        },
        reload: function () {
        	 vm.showList = true;
             vm.table.reload(vm.tableId, {
             	  where:{'roleName': vm.q.roleName}
             	  ,page: {
             	    curr: 1 //重新从第 1 页开始
             	  }
             	});
        }
    }
});