package hannah.mind.ADHDay.domain.assessments;

import hannah.mind.ADHDay.domain.assessments.dto.AssessmentResultRequest;
import hannah.mind.ADHDay.domain.assessments.dto.AssessmentTemplate;
import hannah.mind.ADHDay.domain.assessments.entity.AssessmentType;
import hannah.mind.ADHDay.domain.user.User;
import hannah.mind.ADHDay.domain.user.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/assessments")
@RequiredArgsConstructor
@Tag(name = "Assessment API", description = "정신건강 평가 관련 API")
public class AssessmentApiController {

    private final AssessmentTemplateLoader templateLoader;
    private final UserAssessmentService userAssessmentService;
    private final UserService userService;


    @Operation(summary = "평가 템플릿 조회", description = "특정 유형의 평가 템플릿을 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "템플릿 조회 성공"),
            @ApiResponse(responseCode = "404", description = "템플릿을 찾을 수 없음")
    })
    @GetMapping("templates/{typeId}")
    public ResponseEntity<AssessmentTemplate> getTemplate(
            @Parameter(description = "평가 유형 ID", required = true)
            @PathVariable Long typeId) {
        AssessmentTemplate template = templateLoader.getTemplate(typeId);

        if (template == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(template);
    }

    @Operation(summary = "평가 진행 상태 조회", description = "사용자의 특정 평가 진행 상태를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "진행 상태 조회 성공"),
            @ApiResponse(responseCode = "404", description = "진행 상태를 찾을 수 없음")
    })
    @GetMapping("/progress/{typeId}")
    public ResponseEntity<?> getProgress(
            @Parameter(description = "평가 유형 ID", required = true)
            @PathVariable String typeId, 
            Principal principal) {
        // TODO: 실제 진행 상태 조회 로직 구현 필요
        return ResponseEntity.ok("진행 상태 조회 - 구현 예정");
    }


    @Operation(summary = "평가 결과 제출", description = "사용자의 평가 답안을 제출합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "답안 제출 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 데이터"),
            @ApiResponse(responseCode = "401", description = "인증 필요")
    })
    @PostMapping("/results")
    public ResponseEntity<?> submitAnswers(
            @RequestBody AssessmentResultRequest request,
            Authentication authentication
    ) {
        String email = authentication.getName();

//        userAssessmentService.saveAssessment(email, request.getAnswers().getId(), request);
        return ResponseEntity.ok("저장 완료");
    }



}
