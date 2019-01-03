
package io.frame.common.validator;

import org.apache.commons.lang.StringUtils;

import io.frame.common.exception.RRException;

/**
 * 数据校验
 * @author Fury
 *
 *
 */
public abstract class Assert {

    public static void isBlank(String str, String message) {
        if (StringUtils.isBlank(str)) {
            throw new RRException(message);
        }
    }

    public static void isNull(Object object, String message) {
        if (object == null) {
            throw new RRException(message);
        }
    }
}
