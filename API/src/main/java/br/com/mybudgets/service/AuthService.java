package br.com.mybudgets.service;

import br.com.mybudgets.domain.entity.User;
import br.com.mybudgets.dto.request.LoginRequest;
import br.com.mybudgets.dto.request.RegisterRequest;
import br.com.mybudgets.dto.response.AuthResponse;
import br.com.mybudgets.exception.EmailAlreadyExistsException;
import br.com.mybudgets.exception.InvalidCredentialsException;
import br.com.mybudgets.repository.UserRepository;
import br.com.mybudgets.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyExistsException(request.email());
        }

        var user = User.builder()
                .name(request.name())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .build();

        userRepository.save(user);

        var token = jwtService.generateToken(user.getId(), user.getEmail());

        return new AuthResponse(token, user.getName(), user.getEmail());
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.email(),
                            request.password()
                    )
            );
        } catch (BadCredentialsException e) {
            throw new InvalidCredentialsException();
        }

        var user = userRepository.findByEmail(request.email())
                .orElseThrow(InvalidCredentialsException::new);

        var token = jwtService.generateToken(user.getId(), user.getEmail());

        return new AuthResponse(token, user.getName(), user.getEmail());
    }
}