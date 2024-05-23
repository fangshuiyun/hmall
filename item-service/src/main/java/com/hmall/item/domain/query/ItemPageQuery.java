package com.hmall.item.domain.query;

import com.hmall.common.domain.PageQuery;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@ApiModel(description = "商品分页查询条件")
public class ItemPageQuery extends PageQuery {
    @ApiModelProperty("搜索关键字")
    private String key;
    @ApiModelProperty("商品分类")
    private String category;
    @ApiModelProperty("商品品牌")
    private String brand;
    @ApiModelProperty("价格最小值")
    private Integer minPrice;
    @ApiModelProperty("价格最大值")
    private Integer maxPrice;
}
