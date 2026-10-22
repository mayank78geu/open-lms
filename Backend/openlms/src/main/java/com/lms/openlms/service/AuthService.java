package com.lms.openlms.service;

import com.lms.openlms.dto.AuthDtos;
import com.lms.openlms.entity.Role;
import com.lms.openlms.entity.User;
import com.lms.openlms.exception.BadRequestException;
import com.lms.openlms.exception.ConflictException;
import com.lms.openlms.exception.ForbiddenException;
import com.lms.openlms.exception.ResourceNotFoundException;
import com.lms.openlms.exception.UnauthorizedException;
import com.lms.openlms.repository.RoleRepository;
import com.lms.openlms.repository.UserRepository;
import com.lms.openlms.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthDtos.AuthResponse register(AuthDtos.RegisterRequest request) {
        String name = request.getName() != null ? request.getName().trim() : "";
        String email = request.getEmail() != null ? request.getEmail().trim().toLowerCase(Locale.ROOT) : "";
        String password = request.getPassword();
        String inputRole = request.getRoleName() != null ? request.getRoleName().trim().toUpperCase(Locale.ROOT) : "STUDENT";

        String normalizedRole;
        if ("PROFESSOR".equals(inputRole) || "FACULTY".equals(inputRole)) {
            normalizedRole = "FACULTY";
        } else if ("STUDENT".equals(inputRole)) {
            normalizedRole = "STUDENT";
        } else {
            throw new BadRequestException("Role must be STUDENT or FACULTY");
        }

        if (userRepository.findByEmail(email).isPresent()) {
            throw new ConflictException("Email already registered");
        }

        Role role = roleRepository.findByRoleNameIgnoreCase(normalizedRole)
                .orElseThrow(() -> new BadRequestException("Role not configured"));

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setRole(role);
        user.setIsActive(true);

        User savedUser = userRepository.save(user);
        String token = jwtService.generateToken(savedUser);

        return new AuthDtos.AuthResponse(
                savedUser.getUserId(),
                savedUser.getName(),
                savedUser.getEmail(),
                role.getRoleName().toUpperCase(Locale.ROOT),
                role.getRoleId(),
                token,
                savedUser.getIsActive()
        );
    }

    public AuthDtos.AuthResponse login(AuthDtos.LoginRequest request) {
        String email = request.getEmail() != null ? request.getEmail().trim().toLowerCase(Locale.ROOT) : "";
        String password = request.getPassword();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (password == null || !passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            throw new ForbiddenException("Account disabled");
        }

        String token = jwtService.generateToken(user);
        Role role = user.getRole();
        String roleName = role != null ? role.getRoleName().toUpperCase(Locale.ROOT) : "STUDENT";
        Long roleId = role != null ? role.getRoleId() : null;

        return new AuthDtos.AuthResponse(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                roleName,
                roleId,
                token,
                user.getIsActive()
        );
    }

    @Transactional(readOnly = true)
    public AuthDtos.UserResponse getMe(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Role role = user.getRole();
        String roleName = role != null ? role.getRoleName().toUpperCase(Locale.ROOT) : "STUDENT";
        Long roleId = role != null ? role.getRoleId() : null;

        return new AuthDtos.UserResponse(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                roleName,
                roleId,
                user.getIsActive()
        );
    }
}
