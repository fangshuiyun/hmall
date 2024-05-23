package com.hmall.domain.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * <p>
 * 订单详情表
 * </p>
 *
 * @author 虎哥
 * @since 2023-05-05
 */
@Data
@ApiModel(description = "购物车VO实体")
public class CartVO {
    @ApiModelProperty("购物车条目id ")
    private Long id;
    @ApiModelProperty("sku商品id")
    private Long itemId;
    @ApiModelProperty("购买数量")
    private Integer num;
    @ApiModelProperty("商品标题")
    private String name;
    @ApiModelProperty("商品动态属性键值集")
    private String spec;
    @ApiModelProperty("价格,单位：分")
    private Integer price;
    @ApiModelProperty("商品最新价格")
    private Integer newPrice;
    @ApiModelProperty("商品最新状态")
    private Integer status = 1;
    @ApiModelProperty("商品最新库存")
    private Integer stock = 10;
    @ApiModelProperty("商品图片")
    private String image;
    @ApiModelProperty("创建时间")
    private LocalDateTime createTime;

}
