package com.hmall.domain.po;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * <p>
 * 
 * </p>
 *
 * @author 虎哥
 * @since 2023-05-05
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("order_logistics")
public class OrderLogistics implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 订单id，与订单表一对一
     */
    @TableId(value = "order_id", type = IdType.INPUT)
    private Long orderId;

    /**
     * 物流单号
     */
    private String logisticsNumber;

    /**
     * 物流公司名称
     */
    private String logisticsCompany;

    /**
     * 收件人
     */
    private String contact;

    /**
     * 收件人手机号码
     */
    private String mobile;

    /**
     * 省
     */
    private String province;

    /**
     * 市
     */
    private String city;

    /**
     * 区
     */
    private String town;

    /**
     * 街道
     */
    private String street;

    /**
     * 创建时间
     */
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    private LocalDateTime updateTime;


}
