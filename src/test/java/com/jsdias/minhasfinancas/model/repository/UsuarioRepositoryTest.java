package com.jsdias.minhasfinancas.model.repository;

import java.util.Optional;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import com.jsdias.minhasfinancas.model.entity.Usuario;

@ExtendWith( SpringExtension.class )
@ActiveProfiles("test")
@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.NONE)
public class UsuarioRepositoryTest {
	
	@Autowired
	UsuarioRepository repository;
	
	@Autowired
	TestEntityManager entityManager;
	
	Usuario usuario;
	
	@BeforeEach
    public void setUp() {
        // Limpe o banco de dados antes de cada teste (opcional, mas recomendado)
        // repository.deleteAll(); => com DataJpaTest não é mais necessário
		usuario = Usuario.builder()
				.nome("usuario")
				.email("usuario@email.com")
				.senha("1234").build();
    }

    @AfterEach
    public void tearDown() {
        // Limpe o banco de dados após cada teste (opcional, mas recomendado)
        // repository.deleteAll(); => com DataJpaTest não é mais necessário
    }
	
	@Test
	public void deveVerficarAExistenciaDeUmEmail() {
		// cenário
		// Usuario usuario = new Usuario("usuario", "usuario@email.com", "1234");
		//Usuario usuario = Usuario.builder().nome("usuario").email("usuario@email.com").senha("1234").build();
		//repository.save(usuario);
		entityManager.persist(usuario);
		
		// ação / execução
		boolean result = repository.existsByEmail("usuario@email.com");
		
		
		// verificação
		Assertions.assertThat(result).isTrue();
		
	}
	
	@Test
	public void deveRetornarFalsoQuandoNaoHouverUsuarioCadastradoComOEmail() {
		
		boolean result = repository.existsByEmail("usuario@email.com");
		
		Assertions.assertThat( result ).isFalse();
		
	}
	
	@Test
	public void devePersistirUmUsuarioNaBaseDeDados() {
		
		Usuario usuarioSalvo = repository.save(usuario);
		
		Assertions.assertThat(usuarioSalvo.getId()).isNotNull();
	}
	
	@Test
	public void deveBuscarUmUsuarioPorEmail() {
		
		entityManager.persist(usuario);
		
		Optional<Usuario> result = repository.findByEmail("usuario@email.com");
		
		Assertions.assertThat( result.isPresent() ).isTrue();
	}
	
	@Test
	public void deveRetornarVazioAoBuscarUsuarioPorEmailQuandoNaoExisteNaBase() {
		
		Optional<Usuario> result = repository.findByEmail("usuario@email.com");
		
		Assertions.assertThat( result.isEmpty() ).isTrue();
	}
	
}
