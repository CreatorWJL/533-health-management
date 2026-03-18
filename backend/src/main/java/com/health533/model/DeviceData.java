package com.health533.model;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("device_data")
public class DeviceData {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private Long userId;
    private String deviceId;
    private String deviceType;
    private String dataType;
    private String dataValue;
    private LocalDateTime dataTime;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    @TableLogic
    private Integer deleted;
}
