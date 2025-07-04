package hannah.mind.ADHDay.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import hannah.mind.ADHDay.config.jwt.DTO.CreateAccessTokenRequest;
import hannah.mind.ADHDay.config.jwt.JwtFactory;
import hannah.mind.ADHDay.config.jwt.JwtProperties;
import hannah.mind.ADHDay.config.jwt.refreshToken.RefreshToken;
import hannah.mind.ADHDay.config.jwt.refreshToken.RefreshTokenRepository;
import hannah.mind.ADHDay.user.User;
import hannah.mind.ADHDay.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class TokenApiControllerTest {

    @Autowired
    protected MockMvc mockMvc;
    @Autowired
    protected ObjectMapper objectMapper;
    @Autowired
    private WebApplicationContext context;
    @Autowired
    JwtProperties jwtProperties;
    @Autowired
    UserRepository userRepository;
    @Autowired
    RefreshTokenRepository refreshTokenRepository;

    @BeforeEach
    public void setMockMvc(){
        this.mockMvc = MockMvcBuilders.webAppContextSetup(context)
                .build();
        userRepository.deleteAll();
    }

    @DisplayName("createNewAccessToken : 새로운 액세스 토큰을 발급한다")
    @Test
    public void createNewAccessToken() throws Exception {
        
        //given
        final String url = "/api/token";

        User testUser = userRepository.save(User.builder()
                .email("user@email.com")
                .password("test-password-longerlonger")
                .build());

        String refreshToken = JwtFactory.builder()
                .claims(Map.of("id", testUser.getId()))
                .build()
                .createToken(jwtProperties);
        
        refreshTokenRepository.save(new RefreshToken(testUser.getId(), refreshToken));

        CreateAccessTokenRequest request = new CreateAccessTokenRequest();
        request.setRefreshToken(refreshToken);
        final String requestBody = objectMapper.writeValueAsString(request);
        
        //when
        ResultActions resultActions = mockMvc.perform(post(url)
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(requestBody));
        
        //then
        resultActions
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.accessToken").isNotEmpty());
        
    }




}