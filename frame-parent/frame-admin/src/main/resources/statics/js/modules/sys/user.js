$(function () {
	
	var cols =  [[
	       {type: 'checkbox'}
		      ,{field:'userId',  title: '用户ID', width:80, sort: true}
		      ,{field:'username',  title: '用户名'}
		      ,{field:'deptName',  title: '所属部门'}
		      ,{field:'email',  title: '邮箱'}
		      ,{field:'mobile', title: '手机号'} 
		      ,{field:'status', title: '状态', width:60,  templet: function(d){
					return d.status === 0 ? 
							'<div style="color:#f3290e">禁用</div>' : 
							'<div style="color:#21d06d">正常</div>';
					}}
		      ,{field:'createTime', title: '创建时间',minWidth:140}
		      
		    ]];
	
		vm.tableId = 'tableGrid';
		vm.table = getTableDefaults(vm.tableId,null,'sys/user/list',cols);
		//先加载一遍，否则选择框不起作用
		vm.getRoleList();
		$('.layui-table-page').css('overflow-x','auto');
});
var setting = {
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
var ztree;

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            username: null
        },
        showList: true,
        title:null,
        roleList:{},
        user:{
            status:1,
            deptId:null,
            deptName:null,
            roleIdList:[]
        }
    },
    table:null,
    tableId: null,
    selectId:'selectRoleIds',
    methods: {
        query: function () {
            vm.reload();
        },
        add: function(){
            vm.showList = false;
            vm.title = "新增";
            vm.roleList = {};
            vm.user = {deptName:null, deptId:null, status:1, roleIdList:[]};
            //获取角色信息
            this.getRoleList();
            vm.getDept();
            layui.form.render('radio');
        },
        getDept: function(){
            //加载部门树
            $.get(baseURL + "sys/dept/list", function(r){
                ztree = $.fn.zTree.init($("#deptTree"), setting, r);
                var node = ztree.getNodeByParam("deptId", vm.user.deptId);
                if(node != null){
                    ztree.selectNode(node);
                    vm.user.deptName = node.name;
                }
            })
        },
        update: function () {
        	var rowData = getSelectedRow(vm.table,vm.tableId);
        	if(rowData == null){
                 return ;
            }
        	var userId = rowData.userId;
        	vm.user.status = rowData.status;
            vm.showList = false;
            vm.title = "修改";
            vm.getUser(userId);
            //获取角色信息
            this.getRoleList();
        },
        del: function () {
            var rowDatas = getSelectedRows(vm.table,vm.tableId);
            if(rowDatas == null){
                return ;
            }
            
            var userIds = [];
            for (var i = 0; i < rowDatas.length; i++) {
            	userIds[i] = rowDatas[i].userId;
			}

            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "sys/user/delete",
                    contentType: "application/json",
                    data: JSON.stringify(userIds),
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
        saveOrUpdate: function () {
            var url = vm.user.userId == null ? "sys/user/save" : "sys/user/update";
            vm.user.roleIdList = layui.formSelects.value('selectRoleIds', 'val');
            vm.user.status = $('input[name="status"]:checked ').val();
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.user),
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
        getUser: function(userId){
            $.get(baseURL + "sys/user/info/"+userId, function(r){
                vm.user = r.user;
                vm.user.password = null;

                vm.getDept();
                //多选赋值
                layui.formSelects.value('selectRoleIds', vm.user.roleIdList); 
                //渲染 单选框
                layui.form.render('radio');
            });
        },
        getRoleList: function(){
        	$.ajax({  
        	    type : "get",  
        	    url : baseURL + "sys/role/select",  
        	    async : false,//取消异步  
        	    success : function(r){  
        	    	 vm.roleList = r.list;
        	    	 layui.formSelects.render('selectRoleIds');
        	    }
        	});
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
                    var node = ztree.getSelectedNodes();
                    //选择上级部门
                    vm.user.deptId = node[0].deptId;
                    vm.user.deptName = node[0].name;
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
            	  where:{'username': vm.q.username}
            	  ,page: {
            	    curr: 1 //重新从第 1 页开始
            	  }
            	});
        }
    }
});