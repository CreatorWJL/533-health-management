package com.health533.controller;

import com.health533.common.Result;
import com.health533.model.DeviceData;
import com.health533.service.DeviceDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/device")
@RequiredArgsConstructor
public class DeviceDataController {
    
    private final DeviceDataService deviceDataService;
    
    @PostMapping("/upload")
    public Result<DeviceData> uploadData(@RequestBody DeviceData data) {
        deviceDataService.save(data);
        return Result.success(data);
    }
    
    @GetMapping("/data")
    public Result<List<DeviceData>> getDeviceData(@RequestParam Long userId) {
        return Result.success(deviceDataService.list(
            new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<DeviceData>()
                .eq(DeviceData::getUserId, userId)
                .orderByDesc(DeviceData::getDataTime)
                .last("LIMIT 100")
        ));
    }
}
