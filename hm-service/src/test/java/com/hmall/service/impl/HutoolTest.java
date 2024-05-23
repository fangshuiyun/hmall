package com.hmall.service.impl;

import cn.hutool.core.bean.BeanUtil;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.junit.jupiter.api.Test;

public class HutoolTest {

    @Test
    void name() {
        User jack = User.of(1L, "jack");
        User2 u2 = new User2();
        BeanUtil.copyProperties(jack, u2);
        System.out.println("user2 = " + u2);
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor(staticName = "of")
    static class User {
        Long id;
        String name;
    }

    @Data
    static class User2 {
        String id;
        String name;
    }
}
