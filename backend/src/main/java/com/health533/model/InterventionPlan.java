package com.health533.model;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("intervention_plan")
public class InterventionPlan {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private Long userId;
    private Long assessmentId;
    private String planType;
    private String planName;
    private String content;
    private String goals;
    private Integer duration;
    private Integer status;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
    
    @TableLogic
    private Integer deleted;
}
