package com.health533.model;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("health_assessment")
public class HealthAssessment {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private Long userId;
    private String assessmentType;
    private Integer riskLevel;
    private String riskFactors;
    private String assessmentResult;
    private String recommendations;
    private LocalDateTime assessmentDate;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
    
    @TableLogic
    private Integer deleted;
}
