

package io.frame.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.frame.datasources.DataSourceNames;
import io.frame.datasources.annotation.DataSource;
import io.frame.modules.sys.entity.SysUserEntity;
import io.frame.modules.sys.service.SysUserService;

/**
 * 测试多数据源
 *
 * @author Fury
 *
 */
@Service
public class DataSourceTestService {
    @Autowired
    private SysUserService sysUserService;

    public SysUserEntity queryUser(Long userId){
        return sysUserService.selectById(userId);
    }

    @DataSource(name = DataSourceNames.SECOND)
    public SysUserEntity queryUser2(Long userId){
        return sysUserService.selectById(userId);
    }
}
