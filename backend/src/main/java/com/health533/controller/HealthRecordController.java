package com.health533.controller;

import com.health533.common.Result;
import com.health533.model.HealthRecord;
import com.health533.service.HealthRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/health")
@RequiredArgsConstructor
public class HealthRecordController {
    
    private final HealthRecordService healthRecordService;
    
    @PostMapping("/record")
    public Result<HealthRecord> addRecord(@RequestBody HealthRecord record) {
        healthRecordService.save(record);
        return Result.success(record);
    }
    
    @GetMapping("/records")
    public Result<List<HealthRecord>> getRecords(@RequestParam Long userId) {
        return Result.success(healthRecordService.list(
            new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<HealthRecord>()
                .eq(HealthRecord::getUserId, userId)
                .orderByDesc(HealthRecord::getCreateTime)
        ));
    }
    
    @GetMapping("/record/latest")
    public Result<HealthRecord> getLatestRecord(@RequestParam Long userId) {
        return Result.success(healthRecordService.getOne(
            new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<HealthRecord>()
                .eq(HealthRecord::getUserId, userId)
                .orderByDesc(HealthRecord::getCreateTime)
                .last("LIMIT 1")
        ));
    }
}
