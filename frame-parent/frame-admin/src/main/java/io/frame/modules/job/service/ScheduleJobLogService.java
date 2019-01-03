
package io.frame.modules.job.service;

import java.util.Map;

import com.baomidou.mybatisplus.service.IService;

import io.frame.common.utils.PageUtils;
import io.frame.modules.job.entity.ScheduleJobLogEntity;

/**
 * 定时任务日志
 *
 * @author Fury
 *
 */
public interface ScheduleJobLogService extends IService<ScheduleJobLogEntity> {

	PageUtils queryPage(Map<String, Object> params);
	
}
