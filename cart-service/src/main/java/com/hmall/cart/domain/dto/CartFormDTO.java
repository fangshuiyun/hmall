package com.hmall.cart.domain.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel(description = "新增购物车商品表单实体")
public class CartFormDTO {
    @ApiModelProperty("商品id")
    private Long itemId;
    @ApiModelProperty("商品标题")
    private String name;
    @ApiModelProperty("商品动态属性键值集")
    private String spec;
    @ApiModelProperty("价格,单位：分")
    private Integer price;
    @ApiModelProperty("商品图片")
    private String image;
}
