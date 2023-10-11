package com.jsdias.minhasfinancas.model.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jsdias.minhasfinancas.model.entity.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
	
	// Revisar aula 24
	// Revisar aula 26
	// Revisar aula 27
	// Revisar aula 29
	
	boolean existsByEmail(String email);
	
	Optional<Usuario> findByEmail(String email);
	
}
