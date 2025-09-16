package com.finki.ukim.mk.booksbackend.web;

import com.finki.ukim.mk.booksbackend.domain.Book;
import com.finki.ukim.mk.booksbackend.repository.BookRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Optional;

@RestController
@RequestMapping("/api/books")
@Validated
public class BookController {

    private final BookRepository bookRepository;

    public BookController(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @GetMapping
    public PageResponse<Book> list(@RequestParam(value = "q", required = false) String q,
                                   @RequestParam(value = "page", defaultValue = "0") int page,
                                   @RequestParam(value = "size", defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Book> result = (q == null || q.isBlank())
                ? bookRepository.findAll(pageable)
                : bookRepository.searchByTitleOrAuthorRegex(q, pageable);
        return PageResponse.from(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> getOne(@PathVariable String id) {
        return bookRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    public record BookRequest(
            @NotBlank String title,
            @NotBlank String author,
            BigDecimal price,
            String publishedDate,
            String isbn
    ) { }

    // Stable DTO for page responses
    public static record PageResponse<T>(
            java.util.List<T> content,
            int page,
            int size,
            long totalElements,
            int totalPages,
            boolean first,
            boolean last,
            boolean empty
    ) {
        public static <T> PageResponse<T> from(Page<T> page) {
            return new PageResponse<>(
                    page.getContent(),
                    page.getNumber(),
                    page.getSize(),
                    page.getTotalElements(),
                    page.getTotalPages(),
                    page.isFirst(),
                    page.isLast(),
                    page.isEmpty()
            );
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody BookRequest request) {
        Book book = Book.builder()
                .title(request.title())
                .author(request.author())
                .price(request.price())
                .publishedDate(parseInstant(request.publishedDate()))
                .isbn(request.isbn())
                .build();
        Book saved = bookRepository.save(book);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @Valid @RequestBody BookRequest request) {
        Optional<Book> existing = bookRepository.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        Book toUpdate = existing.get();
        toUpdate.setTitle(request.title());
        toUpdate.setAuthor(request.author());
        toUpdate.setPrice(request.price());
        toUpdate.setPublishedDate(parseInstant(request.publishedDate()));
        toUpdate.setIsbn(request.isbn());
        Book saved = bookRepository.save(toUpdate);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        if (!bookRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        bookRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private Instant parseInstant(String iso) {
        if (iso == null || iso.isBlank()) return null;
        return Instant.parse(iso);
    }
}


