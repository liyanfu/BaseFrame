
package io.frame.modules.sys.service;


import java.util.Map;

import com.baomidou.mybatisplus.service.IService;

import io.frame.common.utils.PageUtils;
import io.frame.modules.sys.entity.SysRoleEntity;


/**
 * 角色
 * 
 * @author Fury
 *
 *
 */
public interface SysRoleService extends IService<SysRoleEntity> {

	PageUtils queryPage(Map<String, Object> params);

	void save(SysRoleEntity role);

	void update(SysRoleEntity role);
	
	void deleteBatch(Long[] roleIds);

}
