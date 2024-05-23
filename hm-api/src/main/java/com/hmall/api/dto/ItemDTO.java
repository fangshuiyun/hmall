package com.hmall.api.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel(description = "商品实体")
public class ItemDTO {
    @ApiModelProperty("商品id")
    private Long id;
    @ApiModelProperty("SKU名称")
    private String name;
    @ApiModelProperty("价格（分）")
    private Integer price;
    @ApiModelProperty("库存数量")
    private Integer stock;
    @ApiModelProperty("商品图片")
    private String image;
    @ApiModelProperty("类目名称")
    private String category;
    @ApiModelProperty("品牌名称")
    private String brand;
    @ApiModelProperty("规格")
    private String spec;
    @ApiModelProperty("销量")
    private Integer sold;
    @ApiModelProperty("评论数")
    private Integer commentCount;
    @ApiModelProperty("是否是推广广告，true/false")
    private Boolean isAD;
    @ApiModelProperty("商品状态 1-正常，2-下架，3-删除")
    private Integer status;
}
