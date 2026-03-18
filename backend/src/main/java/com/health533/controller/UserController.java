package com.health533.controller;

import com.health533.common.Result;
import com.health533.model.User;
import com.health533.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    @PostMapping("/register")
    public Result<User> register(@RequestBody User user) {
        return Result.success(userService.register(user));
    }
    
    @PostMapping("/login")
    public Result<User> login(@RequestBody User user) {
        return Result.success(userService.login(user.getUsername(), user.getPassword()));
    }
    
    @GetMapping("/info")
    public Result<User> getUserInfo(@RequestParam Long userId) {
        return Result.success(userService.getById(userId));
    }
    
    @PutMapping("/update")
    public Result<Void> updateUser(@RequestBody User user) {
        userService.updateById(user);
        return Result.success();
    }
}
