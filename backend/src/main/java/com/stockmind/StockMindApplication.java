package com.stockmind;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class StockMindApplication {

    public static void main(String[] args) {
        SpringApplication.run(StockMindApplication.class, args);
    }

}