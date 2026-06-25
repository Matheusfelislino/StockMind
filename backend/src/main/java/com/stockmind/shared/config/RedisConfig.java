package com.stockmind.shared.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableCaching
public class RedisConfig {

    // ================================================
    // TEMPLATE — Operações manuais no Redis
    // ================================================

    @Bean
    public RedisTemplate<String, Object> redisTemplate(
            RedisConnectionFactory connectionFactory) {

        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new GenericJackson2JsonRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(new GenericJackson2JsonRedisSerializer());
        template.afterPropertiesSet();
        return template;
    }

    // ================================================
    // CACHE MANAGER — Gerencia TTL por cache
    // ================================================

    @Bean
    public CacheManager cacheManager(RedisConnectionFactory connectionFactory) {

        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration
                .defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(30))
                .serializeKeysWith(
                        RedisSerializationContext.SerializationPair
                                .fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(
                        RedisSerializationContext.SerializationPair
                                .fromSerializer(new GenericJackson2JsonRedisSerializer()))
                .disableCachingNullValues();

        Map<String, RedisCacheConfiguration> cacheConfigs = new HashMap<>();

        // KPIs do dashboard — atualizam só à noite, TTL longo
        cacheConfigs.put("dashboard:overview",
                defaultConfig.entryTtl(Duration.ofHours(6)));

        cacheConfigs.put("dashboard:expiration-risk",
                defaultConfig.entryTtl(Duration.ofHours(6)));

        cacheConfigs.put("dashboard:rupture",
                defaultConfig.entryTtl(Duration.ofHours(6)));

        // Recomendações — mudam quando o gerente aprova/rejeita, TTL curto
        cacheConfigs.put("dashboard:recommendations",
                defaultConfig.entryTtl(Duration.ofMinutes(5)));

        // Catálogo — muda raramente, TTL longo
        cacheConfigs.put("products",
                defaultConfig.entryTtl(Duration.ofHours(12)));

        cacheConfigs.put("stores",
                defaultConfig.entryTtl(Duration.ofHours(12)));

        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(defaultConfig)
                .withInitialCacheConfigurations(cacheConfigs)
                .build();
    }

}