package kz.attractorschool.backend.homework;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface HomeworkRepository extends JpaRepository<Homework, UUID> {

    @Query("SELECT h FROM Homework h WHERE h.lesson.id = :lessonId")
    Optional<Homework> findByLessonId(@Param("lessonId") UUID lessonId);

    @Query("SELECT h FROM Homework h JOIN FETCH h.lesson l JOIN FETCH l.course WHERE h.id = :id")
    Optional<Homework> findByIdWithLessonAndCourse(@Param("id") UUID id);

    @Query("SELECT COUNT(h) > 0 FROM Homework h WHERE h.lesson.id = :lessonId")
    boolean existsByLessonId(@Param("lessonId") UUID lessonId);
}
