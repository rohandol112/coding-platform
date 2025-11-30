package com.rohllet.routes.dashboard.auth.jwt;

import com.rohllet.constant.portal.portal;
import com.rohllet.models.User;
import com.rohllet.services.dashboard.auth.jwt.JwtAuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * REST controller for JWT authentication routes.
 * Handles user registration, login, and profile retrieval.
 */
@RestController
@RequestMapping("/api/dashboard/auth/jwt")
public class JwtAuthController {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthController.class);

    private final JwtAuthService authService;

    /**
     * Constructor for JwtAuthController.
     *
     * @param authService the JWT authentication service
     */
    public JwtAuthController(JwtAuthService authService) {
        this.authService = authService;
    }

    @PostMapping(value = "/register", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String password = request.get("password");
            String firstName = request.get("firstName");
            String lastName = request.get("lastName");
            logger.info("User registration attempt for email: {}", email);
            String token = authService.register(email, password, firstName, lastName);
            Map<String, Object> response = new HashMap<>();
            response.put("message", portal.user_registered_successfully);
            response.put("token", token);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            String email = request.get("email");
            logger.warn("Registration failed for email: {} - {}", email, e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("message", portal.email_already_exists);
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping(value = "/login", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String password = request.get("password");
            logger.info("User login attempt for email: {}", email);
            String token = authService.login(email, password);
            Map<String, Object> response = new HashMap<>();
            response.put("message", portal.login_successful);
            response.put("token", token);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            String email = request.get("email");
            logger.warn("Login failed for email: {} - {}", email, e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("message", portal.invalid_credentials);
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping(value = "/profile", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getProfile() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();
            logger.info("Profile request for user: {}", email);
            Optional<User> userOpt = authService.getUserByEmail(email);
            if (userOpt.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Profile retrieved");
                response.put("user", userOpt.get());
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> error = new HashMap<>();
                error.put("message", portal.user_not_found);
                return ResponseEntity.status(404).body(error);
            }
        } catch (Exception e) {
            logger.error("Profile retrieval failed: {}", e.getMessage(), e);
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Internal server error");
            return ResponseEntity.status(500).body(error);
        }
    }
}