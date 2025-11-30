package com.rohllet.services.dashboard.auth.jwt;

import com.rohllet.constant.dashboard.dashboard;
import com.rohllet.models.User;
import com.rohllet.models.UserRepository;
import com.rohllet.utils.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class JwtAuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public JwtAuthService(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    public String register(String email, String password, String firstName, String lastName) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException(dashboard.email_already_exists);
        }

        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setRole("USER"); // default role

        userRepository.save(user);

        return jwtUtil.generateToken(email, user.getRole());
    }

    public String login(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty() || !passwordEncoder.matches(password, userOpt.get().getPasswordHash())) {
            throw new RuntimeException(dashboard.invalid_credentials);
        }

        User user = userOpt.get();
        return jwtUtil.generateToken(email, user.getRole());
    }

    public Optional<User> getUserFromToken(String token) {
        if (!jwtUtil.validateToken(token)) {
            return Optional.empty();
        }

        String email = jwtUtil.extractEmail(token);
        return userRepository.findByEmail(email);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public boolean validateToken(String token) {
        return jwtUtil.validateToken(token);
    }
}