package br.com.mybudgets.service;

import br.com.mybudgets.domain.entity.User;
import br.com.mybudgets.dto.request.LoginRequest;
import br.com.mybudgets.dto.request.RegisterRequest;
import br.com.mybudgets.dto.response.AuthResponse;
import br.com.mybudgets.exception.EmailAlreadyExistsException;
import br.com.mybudgets.exception.InvalidCredentialsException;
import br.com.mybudgets.repository.UserRepository;
import br.com.mybudgets.security.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthService authService;

    @Test
    void shouldRegisterUserSuccessfully() {
        // Arrange
        var request = new RegisterRequest("João Silva", "joao@email.com", "senha123");

        when(userRepository.existsByEmail("joao@email.com"))
                .thenReturn(false);

        when(passwordEncoder.encode("senha123"))
                .thenReturn("$2a$10$hashbcrypt");

        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> {
                    User user = invocation.getArgument(0);
                    user.setId(1L);
                    return user;
                });

        when(jwtService.generateToken(1L, "joao@email.com"))
                .thenReturn("token.jwt.gerado");

        // Act
        AuthResponse response = authService.register(request);

        // Assert
        assertThat(response.token()).isEqualTo("token.jwt.gerado");
        assertThat(response.name()).isEqualTo("João Silva");
        assertThat(response.email()).isEqualTo("joao@email.com");

        verify(passwordEncoder).encode("senha123");
        verify(userRepository).save(any(User.class));
        verify(jwtService).generateToken(1L, "joao@email.com");
    }

    @Test
    void shouldThrowWhenEmailAlreadyExists() {
        // Arrange
        var request = new RegisterRequest("João Silva", "joao@email.com", "senha123");

        when(userRepository.existsByEmail("joao@email.com"))
                .thenReturn(true);

        // Act & Assert
        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(EmailAlreadyExistsException.class);

        verify(userRepository, never()).save(any());
        verify(passwordEncoder, never()).encode(any());
        verify(jwtService, never()).generateToken(any(), any());
    }

    @Test
    void shouldLoginSuccessfully() {
        // Arrange
        var request = new LoginRequest("joao@email.com", "senha123");

        var user = User.builder()
                .id(1L)
                .name("João Silva")
                .email("joao@email.com")
                .password("$2a$10$hashbcrypt")
                .build();

        when(userRepository.findByEmail("joao@email.com"))
                .thenReturn(Optional.of(user));

        when(jwtService.generateToken(1L, "joao@email.com"))
                .thenReturn("token.jwt.gerado");

        // Act
        AuthResponse response = authService.login(request);

        // Assert
        assertThat(response.token()).isEqualTo("token.jwt.gerado");
        assertThat(response.name()).isEqualTo("João Silva");
        assertThat(response.email()).isEqualTo("joao@email.com");

        verify(authenticationManager).authenticate(any());
        verify(jwtService).generateToken(1L, "joao@email.com");
    }

    @Test
    void shouldThrowWhenCredentialsAreInvalid() {
        // Arrange
        var request = new LoginRequest("joao@email.com", "senhaerrada");

        doThrow(new BadCredentialsException("credenciais inválidas"))
                .when(authenticationManager).authenticate(any());

        // Act & Assert
        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(InvalidCredentialsException.class);

        verify(userRepository, never()).findByEmail(any());
        verify(jwtService, never()).generateToken(any(), any());
    }

    @Test
    void shouldThrowWhenUserNotFoundAfterAuthentication() {
        // Arrange
        var request = new LoginRequest("joao@email.com", "senha123");

        when(userRepository.findByEmail("joao@email.com"))
                .thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(InvalidCredentialsException.class);

        verify(jwtService, never()).generateToken(any(), any());
    }
}