package com.finki.ukim.mk.booksbackend.repository;

import com.finki.ukim.mk.booksbackend.domain.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface BookRepository extends MongoRepository<Book, String> {

    @Query("{ $or: [ { 'title': { $regex: ?0, $options: 'i' } }, { 'author': { $regex: ?0, $options: 'i' } } ] }")
    Page<Book> searchByTitleOrAuthorRegex(String query, Pageable pageable);
}


