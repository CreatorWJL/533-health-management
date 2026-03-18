package com.health533.controller;

import com.health533.common.Result;
import com.health533.model.HealthAssessment;
import com.health533.service.HealthAssessmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assessment")
@RequiredArgsConstructor
public class HealthAssessmentController {
    
    private final HealthAssessmentService assessmentService;
    
    @PostMapping("/create")
    public Result<HealthAssessment> createAssessment(@RequestBody HealthAssessment assessment) {
        assessmentService.save(assessment);
        return Result.success(assessment);
    }
    
    @GetMapping("/list")
    public Result<List<HealthAssessment>> getAssessments(@RequestParam Long userId) {
        return Result.success(assessmentService.list(
            new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<HealthAssessment>()
                .eq(HealthAssessment::getUserId, userId)
                .orderByDesc(HealthAssessment::getAssessmentDate)
        ));
    }
    
    @GetMapping("/detail")
    public Result<HealthAssessment> getAssessment(@RequestParam Long id) {
        return Result.success(assessmentService.getById(id));
    }
}
