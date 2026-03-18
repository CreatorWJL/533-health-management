package com.health533.service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.health533.mapper.HealthRecordMapper;
import com.health533.model.HealthRecord;
import org.springframework.stereotype.Service;

@Service
public class HealthRecordService extends ServiceImpl<HealthRecordMapper, HealthRecord> {
}
