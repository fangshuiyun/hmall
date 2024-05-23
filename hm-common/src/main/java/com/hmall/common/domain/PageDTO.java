package com.hmall.common.domain;


import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.hmall.common.utils.BeanUtils;
import com.hmall.common.utils.CollUtils;
import com.hmall.common.utils.Convert;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageDTO<T> {
    protected Long total;
    protected Long pages;
    protected List<T> list;

    public static <T> PageDTO<T> empty(Long total, Long pages) {
        return new PageDTO<>(total, pages, CollUtils.emptyList());
    }
    public static <T> PageDTO<T> empty(Page<?> page) {
        return new PageDTO<>(page.getTotal(), page.getPages(), CollUtils.emptyList());
    }

    public static <T> PageDTO<T> of(Page<T> page) {
        if(page == null){
            return new PageDTO<>();
        }
        if (CollUtils.isEmpty(page.getRecords())) {
            return empty(page);
        }
        return new PageDTO<>(page.getTotal(), page.getPages(), page.getRecords());
    }
    public static <T,R> PageDTO<T> of(Page<R> page, Function<R, T> mapper) {
        if(page == null){
            return new PageDTO<>();
        }
        if (CollUtils.isEmpty(page.getRecords())) {
            return empty(page);
        }
        return new PageDTO<>(page.getTotal(), page.getPages(),
                page.getRecords().stream().map(mapper).collect(Collectors.toList()));
    }
    public static <T> PageDTO<T> of(Page<?> page, List<T> list) {
        return new PageDTO<>(page.getTotal(), page.getPages(), list);
    }

    public static <T, R> PageDTO<T> of(Page<R> page, Class<T> clazz) {
        return new PageDTO<>(page.getTotal(), page.getPages(), BeanUtils.copyList(page.getRecords(), clazz));
    }

    public static <T, R> PageDTO<T> of(Page<R> page, Class<T> clazz, Convert<R, T> convert) {
        return new PageDTO<>(page.getTotal(), page.getPages(), BeanUtils.copyList(page.getRecords(), clazz, convert));
    }
}
