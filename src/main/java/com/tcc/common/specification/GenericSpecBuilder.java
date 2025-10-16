package com.tcc.common.specification;

import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class GenericSpecBuilder<T> {
    private final List<SearchCriteria> params = new ArrayList<>();

    public GenericSpecBuilder<T> with(String key, String op, Object value) {
        params.add(new SearchCriteria(key, op, value));
        return this;
    }


    public Specification<T> build() {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            for (SearchCriteria p : params) {
                Path<?> path = root;
                String key = p.getKey();

                if (key.contains(".")) {
                    String[] parts = key.split("\\.");
                    for (String part : parts) {
                        path = path.get(part);
                    }
                } else {
                    path = root.get(key);
                }

                switch (p.getOp().toLowerCase()) {
                    case "=" -> predicates.add(cb.equal(path, p.getValue()));
                    case "like" -> predicates.add(
                            cb.like(cb.lower(path.as(String.class)), "%" + p.getValue().toString().toLowerCase() + "%")
                    );
                    case ">" -> predicates.add(cb.greaterThan(path.as(String.class), p.getValue().toString()));
                    case "<" -> predicates.add(cb.lessThan(path.as(String.class), p.getValue().toString()));
                    case ">=" -> predicates.add(cb.greaterThanOrEqualTo(path.as(String.class), p.getValue().toString()));
                    case "<=" -> predicates.add(cb.lessThanOrEqualTo(path.as(String.class), p.getValue().toString()));
                    case "!=" -> predicates.add(cb.notEqual(path, p.getValue()));
                    case "in" -> {
                        if (p.getValue() instanceof Collection<?> collection && !collection.isEmpty()) {
                            predicates.add(path.in(collection));
                        } else {
                            throw new IllegalArgumentException("Value for 'in' operation must be a non-empty collection.");
                        }
                    }
                    case "not in" -> {
                        if (p.getValue() instanceof Collection<?> collection && !collection.isEmpty()) {
                            predicates.add(cb.not(path.in(collection)));
                        }
                    }
                    default -> throw new IllegalArgumentException("Operation '" + p.getOp() + "' is not supported.");
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }



}
