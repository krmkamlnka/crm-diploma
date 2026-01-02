package kz.attractorschool.backend.lesson;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, UUID> {

    @Query("SELECT l FROM Lesson l LEFT JOIN FETCH l.course WHERE l.id = :id")
    Optional<Lesson> findByIdWithCourse(@Param("id") UUID id);

    @Query("SELECT l FROM Lesson l WHERE l.course.id = :courseId ORDER BY l.scheduledAt ASC")
    Page<Lesson> findByCourseId(@Param("courseId") UUID courseId, Pageable pageable);

    /**
     * КРИТИЧЕСКИЙ МЕТОД: Проверка конфликтов расписания уроков
     *
     * Бизнес-правило: Не допускается создание урока, если в пределах 2 часов
     * до или после уже есть другой урок для того же курса.
     *
     * Логика проверки:
     * 1. Новый урок начинается в scheduledAt и заканчивается в (scheduledAt + durationMinutes)
     * 2. Проверяем, нет ли уроков, которые пересекаются с окном [scheduledAt - 2 часа, endTime + 2 часа]
     *
     * @param courseId ID курса
     * @param scheduledAt Время начала нового урока
     * @param durationMinutes Продолжительность нового урока
     * @param excludeLessonId ID урока, который нужно исключить из проверки (для обновления)
     * @return Список конфликтующих уроков
     */
    @Query("SELECT l FROM Lesson l WHERE l.course.id = :courseId " +
            "AND (:excludeLessonId IS NULL OR l.id <> :excludeLessonId) " +
            "AND l.status <> 'CANCELLED' " +
            "AND (" +
            "  (l.scheduledAt >= :windowStart AND l.scheduledAt < :windowEnd) " +
            "  OR " +
            "  (FUNCTION('TIMESTAMPADD', MINUTE, l.durationMinutes, l.scheduledAt) > :windowStart " +
            "   AND FUNCTION('TIMESTAMPADD', MINUTE, l.durationMinutes, l.scheduledAt) <= :windowEnd) " +
            "  OR " +
            "  (l.scheduledAt < :windowStart " +
            "   AND FUNCTION('TIMESTAMPADD', MINUTE, l.durationMinutes, l.scheduledAt) > :windowEnd)" +
            ")")
    List<Lesson> findConflictingLessons(
            @Param("courseId") UUID courseId,
            @Param("windowStart") LocalDateTime windowStart,
            @Param("windowEnd") LocalDateTime windowEnd,
            @Param("excludeLessonId") UUID excludeLessonId
    );

    @Query("SELECT l FROM Lesson l " +
            "WHERE l.course.instructor.id = :instructorId " +
            "ORDER BY l.scheduledAt DESC")
    Page<Lesson> findByInstructorId(@Param("instructorId") UUID instructorId, Pageable pageable);

    @Query("SELECT l FROM Lesson l " +
            "WHERE l.course.instructor.id = :instructorId " +
            "AND l.course.id = :courseId " +
            "ORDER BY l.scheduledAt ASC")
    Page<Lesson> findByInstructorIdAndCourseId(
            @Param("instructorId") UUID instructorId,
            @Param("courseId") UUID courseId,
            Pageable pageable
    );

    @Query("SELECT COUNT(l) FROM Lesson l WHERE l.course.id = :courseId")
    Long countByCourseId(@Param("courseId") UUID courseId);
}
