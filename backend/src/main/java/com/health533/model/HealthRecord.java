package com.health533.model;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("health_record")
public class HealthRecord {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private Long userId;
    private Double height;
    private Double weight;
    private Double bmi;
    private Integer bloodType;
    private Integer bloodPressureHigh;
    private Integer bloodPressureLow;
    private Integer heartRate;
    private Double bloodSugar;
    private String medicalHistory;
    private String allergyHistory;
    private String familyHistory;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
    
    @TableLogic
    private Integer deleted;
}
