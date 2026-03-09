package kz.attractorschool.backend.attendance;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, UUID> {

    @Query("SELECT a FROM Attendance a " +
           "JOIN FETCH a.student " +
           "WHERE a.lesson.id = :lessonId " +
           "ORDER BY a.student.lastName, a.student.firstName")
    List<Attendance> findByLessonId(@Param("lessonId") UUID lessonId);

    @Query("SELECT a FROM Attendance a " +
           "WHERE a.lesson.id = :lessonId AND a.student.id = :studentId")
    Optional<Attendance> findByLessonIdAndStudentId(
            @Param("lessonId") UUID lessonId,
            @Param("studentId") UUID studentId);

    @Query("SELECT a FROM Attendance a " +
           "JOIN FETCH a.lesson l " +
           "JOIN FETCH l.course " +
           "WHERE a.id = :id")
    Optional<Attendance> findByIdWithLessonAndCourse(@Param("id") UUID id);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.lesson.id = :lessonId")
    long countByLessonId(@Param("lessonId") UUID lessonId);

    boolean existsByLessonIdAndStudentId(UUID lessonId, UUID studentId);
}
