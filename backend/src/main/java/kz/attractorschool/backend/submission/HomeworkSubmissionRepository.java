package kz.attractorschool.backend.submission;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface HomeworkSubmissionRepository extends JpaRepository<HomeworkSubmission, UUID> {

    @Query("SELECT hs FROM HomeworkSubmission hs " +
           "JOIN FETCH hs.student " +
           "WHERE hs.homework.id = :homeworkId " +
           "ORDER BY hs.submittedAt DESC")
    List<HomeworkSubmission> findByHomeworkId(@Param("homeworkId") UUID homeworkId);

    @Query("SELECT hs FROM HomeworkSubmission hs " +
           "WHERE hs.homework.id = :homeworkId " +
           "AND hs.student.id = :studentId")
    Optional<HomeworkSubmission> findByHomeworkIdAndStudentId(
            @Param("homeworkId") UUID homeworkId,
            @Param("studentId") UUID studentId);

    @Query("SELECT hs FROM HomeworkSubmission hs " +
           "JOIN FETCH hs.homework h " +
           "JOIN FETCH h.lesson " +
           "WHERE hs.id = :id")
    Optional<HomeworkSubmission> findByIdWithHomeworkAndLesson(@Param("id") UUID id);

    @Query("SELECT COUNT(hs) FROM HomeworkSubmission hs WHERE hs.homework.id = :homeworkId")
    long countByHomeworkId(@Param("homeworkId") UUID homeworkId);

    @Query("SELECT COUNT(hs) FROM HomeworkSubmission hs " +
           "WHERE hs.homework.id = :homeworkId AND hs.grade IS NOT NULL")
    long countGradedByHomeworkId(@Param("homeworkId") UUID homeworkId);

    @Query("SELECT COUNT(hs) FROM HomeworkSubmission hs " +
           "WHERE hs.homework.id = :homeworkId AND hs.grade IS NULL")
    long countPendingByHomeworkId(@Param("homeworkId") UUID homeworkId);

    boolean existsByHomeworkIdAndStudentId(UUID homeworkId, UUID studentId);
}
