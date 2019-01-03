
package io.frame.modules.sys.service;


import java.util.Map;

import com.baomidou.mybatisplus.service.IService;

import io.frame.common.utils.PageUtils;
import io.frame.modules.sys.entity.SysLogEntity;


/**
 * 系统日志
 * 
 * @author Fury
 *
 *
 */
public interface SysLogService extends IService<SysLogEntity> {

    PageUtils queryPage(Map<String, Object> params);

}
