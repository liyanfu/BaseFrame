
package io.frame.modules.oss.service;

import java.util.Map;

import com.baomidou.mybatisplus.service.IService;

import io.frame.common.utils.PageUtils;
import io.frame.modules.oss.entity.SysOssEntity;

/**
 * 文件上传
 * 
 * @author Fury
 *
 *
 */
public interface SysOssService extends IService<SysOssEntity> {

	PageUtils queryPage(Map<String, Object> params);
}
