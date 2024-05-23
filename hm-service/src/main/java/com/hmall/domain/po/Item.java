package com.hmall.domain.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * <p>
 * 商品表
 * </p>
 *
 * @author 虎哥
 * @since 2023-05-05
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("item")
public class Item implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 商品id
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * SKU名称
     */
    private String name;

    /**
     * 价格（分）
     */
    private Integer price;

    /**
     * 库存数量
     */
    private Integer stock;

    /**
     * 商品图片
     */
    private String image;

    /**
     * 类目名称
     */
    private String category;

    /**
     * 品牌名称
     */
    private String brand;

    /**
     * 规格
     */
    private String spec;

    /**
     * 销量
     */
    private Integer sold;

    /**
     * 评论数
     */
    private Integer commentCount;

    /**
     * 是否是推广广告，true/false
     */
    @TableField("isAD")
    private Boolean isAD;

    /**
     * 商品状态 1-正常，2-下架，3-删除
     */
    private Integer status;

    /**
     * 创建时间
     */
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    private LocalDateTime updateTime;

    /**
     * 创建人
     */
    private Long creater;

    /**
     * 修改人
     */
    private Long updater;


}
