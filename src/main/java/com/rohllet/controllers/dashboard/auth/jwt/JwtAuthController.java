package com.rohllet.controllers.dashboard.auth.jwt;

import com.rohllet.dto.dashboard.auth.jwt.AuthDto;
import com.rohllet.models.User;
import com.rohllet.services.dashboard.auth.jwt.JwtAuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/dashboard/auth/jwt")
public class JwtAuthController {

    private final JwtAuthService authService;

    public JwtAuthController(JwtAuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthDto.AuthResponse> register(@Valid @RequestBody AuthDto.RegisterRequest request) {
        try {
            String token = authService.register(request.getEmail(), request.getPassword(),
                    request.getFirstName(), request.getLastName());
            return ResponseEntity.ok(new AuthDto.AuthResponse(token, "Registration successful"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new AuthDto.AuthResponse(null, e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthDto.AuthResponse> login(@Valid @RequestBody AuthDto.LoginRequest request) {
        try {
            String token = authService.login(request.getEmail(), request.getPassword());
            return ResponseEntity.ok(new AuthDto.AuthResponse(token, "Login successful"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new AuthDto.AuthResponse(null, e.getMessage()));
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body("Invalid token");
        }

        String token = authHeader.substring(7);
        Optional<User> user = authService.getUserFromToken(token);

        if (user.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid or expired token");
        }

        return ResponseEntity.ok(new AuthDto.ProfileResponse(user.get().getEmail(), user.get().getFirstName(),
                user.get().getLastName(), user.get().getRole()));
    }

    // DTOs moved to com.rohllet.dto.dashboard.auth.jwt.AuthDto
}