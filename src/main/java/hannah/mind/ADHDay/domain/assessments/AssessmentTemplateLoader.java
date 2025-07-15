package hannah.mind.ADHDay.domain.assessments;

import com.fasterxml.jackson.databind.ObjectMapper;
import hannah.mind.ADHDay.domain.assessments.dto.AssessmentTemplate;
import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

//한 번만 읽고 Map<Long, Template>에 캐싱
@Component
@RequiredArgsConstructor
@Getter
public class AssessmentTemplateLoader {

    private final ObjectMapper objectMapper = new ObjectMapper();

    private final Map<Long, AssessmentTemplate> templateCache = new HashMap<>();

    @PostConstruct
    public void init() throws Exception {
        loadTemplate(1L, "assessments/asrs.json");
        loadTemplate(2L, "assessments/gad7.json");
        loadTemplate(3L, "assessments/phq9.json");
    }

    private void loadTemplate(Long typeId, String path) throws IOException {

        AssessmentTemplate template = objectMapper.readValue(
                new ClassPathResource(path).getInputStream(), AssessmentTemplate.class
        );
        templateCache.put(typeId, template);
    }


    public AssessmentTemplate getTemplate(Long typeId) {
        return templateCache.get(typeId);
    }


}
