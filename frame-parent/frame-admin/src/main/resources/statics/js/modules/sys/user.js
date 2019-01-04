$(function () {
	layui.use('table', function(){
	 var table = layui.table;
	  table.render({
	    elem: '#tableGrid'
	    ,url: baseURL + 'sys/user/list'
	    ,height: 312
	    ,toolbar:''
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
	    ,cols: [[
	       {type: 'checkbox'}
	      ,{field:'userId',  title: '用户ID', sort: true}
	      ,{field:'username',  title: '用户名'}
	      ,{field:'deptName',  title: '所属部门'}
	      ,{field:'email',  title: '邮箱'}
	      ,{field:'mobile', title: '手机号'} 
	      ,{field:'status', title: '状态', templet: function(d){
				return d.status === 0 ? 
						'<span class="label label-danger">禁用</span>' : 
						'<span class="label label-success">正常</span>';
				}}
	      ,{field:'createTime', title: '创建时间'}
	      
	    ]]
	  });
	});
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
    methods: {
        query: function () {
            vm.reload();
        },
        add: function(){
            vm.showList = false;
            vm.title = "新增";
            vm.roleList = {};
            vm.user = {deptName:null, deptId:null, status:1, roleIdList:[]};
            console.info(1);
            //获取角色信息
            this.getRoleList();
            console.info(3);
            vm.getDept();
            console.info(4);
            var form = layui.form;
        	form.render();
        	 console.info(5);
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
            var userId = getSelectedRow();
            if(userId == null){
                return ;
            }

            vm.showList = false;
            vm.title = "修改";

            vm.getUser(userId);
            //获取角色信息
            this.getRoleList();
        },
        del: function () {
            var userIds = getSelectedRows();
            if(userIds == null){
                return ;
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
            });
        },
        getRoleList: function(){
        	$.ajax({  
        	    type : "get",  
        	    url : baseURL + "sys/role/select",  
        	    async : false,//取消异步  
        	    success : function(r){  
        	    	 vm.roleList = r.list;
                     console.info(2);
        	    }
        	});
        },
        deptTree: function(){
            layer.open({
                type: 1,
                offset: '50px',
                skin: 'layui-layer-molv',
                title: "选择部门",
                area: ['300px', '450px'],
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
                }
            });
        },
        reload: function () {
            vm.showList = true;
            var page = $("#jqGrid").jqGrid('getGridParam','page');
            $("#jqGrid").jqGrid('setGridParam',{
                postData:{'username': vm.q.username},
                page:page
            }).trigger("reloadGrid");
        }
    }
});