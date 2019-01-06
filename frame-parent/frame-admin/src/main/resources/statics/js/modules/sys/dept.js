$(function(){
	
	initTable();
	
});


var  initTable  = function(){
	var treetable = layui.treetable;
	treetable.render({
		 	treeColIndex: 2,          
	        treeSpid: 0,             
	        treeIdName: 'deptId',       
	        treePidName: 'parentId',     
	        treeDefaultClose: true,   //是否默认折叠
	        treeLinkage: false,        //父级展开时是否自动展开所有子级
	        elem: '#tableGrid'
		    ,url: baseURL + 'sys/dept/list'
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
	             ,{field: 'deptId', title: '部门ID'}
	             ,{field: 'name', title: '部门名称'}
	             ,{field: 'parentName', title: '上级部门'}
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
        showList: true,
        title: null,
        dept:{
            parentName:null,
            parentId:0,
            orderNum:0
        }
    },
    table:null,
    tableId: null,
    methods: {
        getDept: function(){
            //加载部门树
            $.get(baseURL + "sys/dept/select", function(r){
                ztree = $.fn.zTree.init($("#deptTree"), setting, r.deptList);
                var node = ztree.getNodeByParam("deptId", vm.dept.parentId);
                ztree.selectNode(node);

                vm.dept.parentName = node.name;
            })
        },
        add: function(){
            vm.showList = false;
            vm.title = "新增";
            vm.dept = {parentName:null,parentId:0,orderNum:0};
            vm.getDept();
        },
        update: function () {
        	var rowData = getSelectedRow(layui.table,vm.tableId);
        	if(rowData == null){
                 return ;
            }
        	var deptId = rowData.deptId;
            if(deptId == null){
                return ;
            }

            $.get(baseURL + "sys/dept/info/"+deptId, function(r){
                vm.showList = false;
                vm.title = "修改";
                vm.dept = r.dept;

                vm.getDept();
            });
        },
        del: function () {
        	var rowData = getSelectedRow(layui.table,vm.tableId);
        	if(rowData == null){
                 return ;
            }
        	var deptId = rowData.deptId;
            if(deptId == null){
                return ;
            }
            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "sys/dept/delete",
                    data: "deptId=" + deptId,
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
        saveOrUpdate: function (event) {
            var url = vm.dept.deptId == null ? "sys/dept/save" : "sys/dept/update";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.dept),
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
                    vm.dept.parentId = node[0].deptId;
                    vm.dept.parentName = node[0].name;

                    layer.close(index);
                }
            });
        },
        reload: function () {
            vm.showList = true;
            initTable();
        }
    }
});

var Dept = {
    id: "deptTable",
    table: null,
    layerIndex: -1
};
