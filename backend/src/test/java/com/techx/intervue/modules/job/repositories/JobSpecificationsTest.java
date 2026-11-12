package com.techx.intervue.modules.job.repositories;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.techx.intervue.modules.job.entities.Job;
import com.techx.intervue.modules.job.enums.JobSort;
import com.techx.intervue.modules.job.requests.SearchJobsRequest;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Order;
import jakarta.persistence.criteria.Root;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.ArgumentMatchers;
import org.mockito.Mockito;

@SuppressWarnings("unchecked")
class JobSpecificationsTest {

    private static final Instant NOW = Instant.parse("2026-11-12T00:00:00Z");
    private static final LocalDate TODAY = LocalDate.of(2026, 11, 12);
    private static final long USD_TO_VND = 25_000L;

    private Root<Job> root;
    private CriteriaQuery<Job> query;
    private CriteriaBuilder builder;

    @BeforeEach
    void setUp() {
        root = mock(Root.class, Mockito.RETURNS_DEEP_STUBS);
        query = mock(CriteriaQuery.class);
        builder = mock(CriteriaBuilder.class, Mockito.RETURNS_DEEP_STUBS);
        when(query.getResultType()).thenReturn(Job.class);
    }

    @Test
    void defaultSortOrdersByRecencyOnly() {
        List<Order> orders = orderingFor(null, null);

        assertThat(orders).hasSize(2);
        verify(builder, never()).selectCase();
    }

    @Test
    void newestSortOrdersByRecencyOnly() {
        List<Order> orders = orderingFor(JobSort.NEWEST, null);

        assertThat(orders).hasSize(2);
        verify(builder, never()).selectCase();
    }

    @Test
    void salarySortConvertsUsdToVndBeforeComparing() {
        List<Order> orders = orderingFor(JobSort.SALARY_DESC, null);

        assertThat(orders).hasSize(3);
        verify(builder).prod(ArgumentMatchers.<Expression<Long>>any(), eq(USD_TO_VND));
    }

    @Test
    void deadlineSortOrdersByNearestDeadlineFirst() {
        List<Order> orders = orderingFor(JobSort.DEADLINE_ASC, null);

        assertThat(orders).hasSize(3);
        verify(builder).asc(root.get("deadline"));
    }

    @Test
    void postedWithinKeepsOnlyJobsNewerThanTheWindow() {
        orderingFor(null, 7);

        verify(builder)
                .greaterThanOrEqualTo(
                        ArgumentMatchers.<Expression<Instant>>any(),
                        eq(NOW.minus(Duration.ofDays(7))));
    }

    @Test
    void withoutPostedWithinNoRecencyWindowIsApplied() {
        orderingFor(null, null);

        verify(builder, never())
                .greaterThanOrEqualTo(
                        ArgumentMatchers.<Expression<Instant>>any(), any(Instant.class));
    }

    private List<Order> orderingFor(JobSort sort, Integer postedWithinDays) {
        SearchJobsRequest request =
                new SearchJobsRequest(
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        postedWithinDays,
                        sort,
                        null,
                        null);

        JobSpecifications.publicListing(request, TODAY, NOW).toPredicate(root, query, builder);

        ArgumentCaptor<List<Order>> captor = ArgumentCaptor.forClass(List.class);
        verify(query).orderBy(captor.capture());
        return captor.getValue();
    }
}
