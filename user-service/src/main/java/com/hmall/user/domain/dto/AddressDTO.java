package com.hmall.user.domain.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel(description = "收货地址实体")
public class AddressDTO {
    @ApiModelProperty("id")
    private Long id;
    @ApiModelProperty("省")
    private String province;
    @ApiModelProperty("市")
    private String city;
    @ApiModelProperty("县/区")
    private String town;
    @ApiModelProperty("手机")
    private String mobile;
    @ApiModelProperty("详细地址")
    private String street;
    @ApiModelProperty("联系人")
    private String contact;
    @ApiModelProperty("是否是默认 1默认 0否")
    private Integer isDefault;
    @ApiModelProperty("备注")
    private String notes;
}
