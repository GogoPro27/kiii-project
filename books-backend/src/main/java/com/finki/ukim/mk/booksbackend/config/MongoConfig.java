package com.finki.ukim.mk.booksbackend.config;

import com.finki.ukim.mk.booksbackend.domain.Book;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.Index;
import org.springframework.data.mongodb.core.index.IndexOperations;
import org.springframework.data.mongodb.core.index.IndexResolver;
import org.springframework.data.mongodb.core.index.MongoPersistentEntityIndexResolver;
import org.springframework.data.mongodb.core.mapping.MongoMappingContext;

@Configuration
@EnableMongoAuditing
public class MongoConfig {

    @Bean
    public Boolean ensureIndexesOnStartup(MongoTemplate mongoTemplate, MongoMappingContext mappingContext) {
        IndexOperations indexOps = mongoTemplate.indexOps(Book.class);
        // Ensure simple indices
        indexOps.ensureIndex(new Index().on("title", Sort.Direction.ASC));
        indexOps.ensureIndex(new Index().on("author", Sort.Direction.ASC));
        // Ensure annotated indices (e.g., isbn unique sparse)
        IndexResolver resolver = new MongoPersistentEntityIndexResolver(mappingContext);
        resolver.resolveIndexFor(Book.class).forEach(indexOps::ensureIndex);
        return Boolean.TRUE;
    }
}


