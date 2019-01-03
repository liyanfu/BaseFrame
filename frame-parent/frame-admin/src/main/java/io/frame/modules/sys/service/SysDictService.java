package io.frame.modules.sys.service;

import java.util.Map;

import com.baomidou.mybatisplus.service.IService;

import io.frame.common.utils.PageUtils;
import io.frame.modules.sys.entity.SysDictEntity;

/**
 * 数据字典
 *
 * @author Fury
 *
 */
public interface SysDictService extends IService<SysDictEntity> {

    PageUtils queryPage(Map<String, Object> params);
}

