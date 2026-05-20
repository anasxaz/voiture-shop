package org.cours.SpringDataRest.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.cours.SpringDataRest.modele.User;
import org.cours.SpringDataRest.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");

        User user = userRepository.findByUsername(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setUsername(email);
            newUser.setPassword(null);
            newUser.setRole("ROLE_USER");
            return userRepository.save(newUser);
        });

        String token = jwtUtil.generateToken(user.getUsername());
        String redirectUrl = "http://localhost:3000/oauth2/callback"
                + "?token=" + token
                + "&username=" + user.getUsername()
                + "&role=" + user.getRole();

        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
