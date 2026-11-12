package com.techx.intervue.common.seed;

import java.util.Collections;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@Profile("local")
@RequiredArgsConstructor
public class SeedDatabase {

    private static final int BATCH_SIZE = 200;

    private final JdbcTemplate jdbc;

    public JdbcTemplate jdbc() {
        return jdbc;
    }

    public boolean allEmpty(String... tables) {
        for (String table : tables) {
            Boolean hasRows =
                    jdbc.queryForObject(
                            "SELECT EXISTS(SELECT 1 FROM " + table + ")", Boolean.class);
            if (Boolean.TRUE.equals(hasRows)) {
                return false;
            }
        }
        return true;
    }

    public IdSequence sequence(String table) {
        Long maxId = jdbc.queryForObject("SELECT COALESCE(MAX(id), 0) FROM " + table, Long.class);
        return new IdSequence(maxId == null ? 0 : maxId);
    }

    public void insert(String table, List<String> columns, List<Object[]> rows) {
        String placeholders = String.join(", ", Collections.nCopies(columns.size(), "?"));
        batch(
                "INSERT INTO "
                        + table
                        + " ("
                        + String.join(", ", columns)
                        + ") VALUES ("
                        + placeholders
                        + ")",
                rows);
    }

    public void batch(String sql, List<Object[]> rows) {
        if (rows.isEmpty()) {
            return;
        }
        jdbc.batchUpdate(
                sql,
                rows,
                BATCH_SIZE,
                (statement, row) -> {
                    for (int index = 0; index < row.length; index++) {
                        statement.setObject(index + 1, row[index]);
                    }
                });
    }
}
