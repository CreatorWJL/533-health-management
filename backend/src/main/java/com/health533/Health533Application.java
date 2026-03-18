package com.health533;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.health533.mapper")
public class Health533Application {
    public static void main(String[] args) {
        SpringApplication.run(Health533Application.class, args);
    }
}
