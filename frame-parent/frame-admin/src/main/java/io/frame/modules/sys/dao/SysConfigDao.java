
package io.frame.modules.sys.dao;


import org.apache.ibatis.annotations.Param;

import com.baomidou.mybatisplus.mapper.BaseMapper;

import io.frame.modules.sys.entity.SysConfigEntity;

/**
 * 系统配置信息
 * 
 * @author Fury
 *
 *
 */
public interface SysConfigDao extends BaseMapper<SysConfigEntity> {

	/**
	 * 根据key，查询value
	 */
	SysConfigEntity queryByKey(String paramKey);

	/**
	 * 根据key，更新value
	 */
	int updateValueByKey(@Param("paramKey") String paramKey, @Param("paramValue") String paramValue);
	
}
