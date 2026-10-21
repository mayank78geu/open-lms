package com.lms.openlms.controller;

import com.lms.openlms.dto.AuthDtos;
import com.lms.openlms.entity.Role;
import com.lms.openlms.entity.User;
import com.lms.openlms.repository.RoleRepository;
import com.lms.openlms.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, RoleRepository roleRepository,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthDtos.RegisterRequest request) {
        String name = trim(request.getName());
        String email = normalizeEmail(request.getEmail());
        String password = request.getPassword();

        if (name.isBlank() || email.isBlank() || password == null || password.isBlank()) {
            return error(HttpStatus.BAD_REQUEST, "Name, email, and password are required.");
        }
        if (userRepository.findByEmail(email).isPresent()) {
            return error(HttpStatus.CONFLICT, "An account with this email already exists.");
        }

        String roleName = normalizeRole(request.getRoleName());
        Role role = roleRepository.findByRoleNameIgnoreCase(roleName)
            .orElse(null);
        if (role == null) {
            return error(HttpStatus.INTERNAL_SERVER_ERROR,
                "The " + roleName + " role is not configured in the database.");
        }

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setRole(role);
        user.setIsActive(true);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(userRepository.save(user)));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthDtos.LoginRequest request) {
        String email = normalizeEmail(request.getEmail());
        String password = request.getPassword();
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null || password == null || !passwordEncoder.matches(password, user.getPasswordHash())) {
            return error(HttpStatus.UNAUTHORIZED, "Invalid email or password.");
        }
        if (!Boolean.TRUE.equals(user.getIsActive())) {
            return error(HttpStatus.FORBIDDEN, "This account is inactive.");
        }
        return ResponseEntity.ok(toResponse(user));
    }

    private AuthDtos.AuthResponse toResponse(User user) {
        Role role = user.getRole();
        String roleName = role.getRoleName().equalsIgnoreCase("FACULTY")
            ? "PROFESSOR" : role.getRoleName().toUpperCase(Locale.ROOT);
        return new AuthDtos.AuthResponse(
            user.getUserId(), user.getName(), user.getEmail(), roleName,
            role.getRoleId(), "session-" + user.getUserId(), user.getIsActive());
    }

    private static String normalizeEmail(String email) {
        return trim(email).toLowerCase(Locale.ROOT);
    }

    private static String normalizeRole(String roleName) {
        return "PROFESSOR".equalsIgnoreCase(trim(roleName)) || "FACULTY".equalsIgnoreCase(trim(roleName))
            ? "FACULTY" : "STUDENT";
    }

    private static String trim(String value) {
        return value == null ? "" : value.trim();
    }

    private static ResponseEntity<Map<String, String>> error(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(Map.of("message", message));
    }
}
