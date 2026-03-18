package com.health533.controller;

import com.health533.common.Result;
import com.health533.model.InterventionPlan;
import com.health533.service.InterventionPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/intervention")
@RequiredArgsConstructor
public class InterventionPlanController {
    
    private final InterventionPlanService planService;
    
    @PostMapping("/create")
    public Result<InterventionPlan> createPlan(@RequestBody InterventionPlan plan) {
        planService.save(plan);
        return Result.success(plan);
    }
    
    @GetMapping("/list")
    public Result<List<InterventionPlan>> getPlans(@RequestParam Long userId) {
        return Result.success(planService.list(
            new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<InterventionPlan>()
                .eq(InterventionPlan::getUserId, userId)
                .orderByDesc(InterventionPlan::getCreateTime)
        ));
    }
    
    @PutMapping("/update")
    public Result<Void> updatePlan(@RequestBody InterventionPlan plan) {
        planService.updateById(plan);
        return Result.success();
    }
}
