
package io.frame.modules.job.dao;

import java.util.Map;

import com.baomidou.mybatisplus.mapper.BaseMapper;

import io.frame.modules.job.entity.ScheduleJobEntity;

/**
 * 定时任务
 *
 * @author Fury
 *
 */
public interface ScheduleJobDao extends BaseMapper<ScheduleJobEntity> {
	
	/**
	 * 批量更新状态
	 */
	int updateBatch(Map<String, Object> map);
}
