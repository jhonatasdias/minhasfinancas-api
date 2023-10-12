package com.jsdias.minhasfinancas.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.junit.jupiter.api.Assertions.assertThrows; // Importe a classe assertThrows

import java.util.Optional;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;

import com.jsdias.minhasfinancas.exception.ErroAutenticacao;
import com.jsdias.minhasfinancas.exception.RegraNegocioException;
import com.jsdias.minhasfinancas.model.entity.Usuario;
import com.jsdias.minhasfinancas.model.repository.UsuarioRepository;
import com.jsdias.minhasfinancas.service.impl.UsuarioServiceImpl;

@ExtendWith( SpringExtension.class )
@SpringBootTest // inicializa o spring boot
@ActiveProfiles("test")
public class UsuarioServiceTest {

	@SpyBean
	UsuarioServiceImpl service; 
	
	@MockBean
	UsuarioRepository repository;
	
	Usuario usuario;
	
	@BeforeEach
	public void setUp() {
		usuario = Usuario.builder()
				.id(1l)
				.nome("usuario")
				.email("email@email.com")
				.senha("1234").build();
		
		// service = Mockito.spy(UsuarioServiceImpl.class);
		
		// repository = Mockito.mock(UsuarioRepository.class);
		// service = new UsuarioServiceImpl(repository);
		
	}
	
	// SALVAR USUARIO
	// 1o cenário
	@Test
	public void deveSalvarUmUsuario() {
		
		Mockito.doNothing().when(service).validarEmail(Mockito.anyString());
	
		Mockito.when(repository.save(Mockito.any(Usuario.class))).thenReturn(usuario);
		
		Usuario usuarioSalvo = service.salvarUsuario(new Usuario());
	
		Assertions.assertThat(usuarioSalvo).isNotNull();
		Assertions.assertThat(usuarioSalvo.getId()).isEqualTo(1l);
		Assertions.assertThat(usuarioSalvo.getNome()).isEqualTo("usuario");
		Assertions.assertThat(usuarioSalvo.getEmail()).isEqualTo("email@email.com");
		Assertions.assertThat(usuarioSalvo.getSenha()).isEqualTo("1234");
	}
	
	// 2 cenário
	@Test // esse teste esto com o seguinte erro com.jsdias.minhasfinancas.exception.RegraNegocioException
	public void naoDeveSalvarUmUsuarioComEmailJaCadastrado() {
		String email = "email@email.com";
		
		Usuario usuario2 = Usuario.builder().email(email).build();
		/*
		Mockito.doThrow(RegraNegocioException.class).when(service).validarEmail(email);
		
		service.salvarUsuario(usuario2);
		
		Mockito.verify( repository, Mockito.never() ).save(usuario2); */
		
		Mockito.doThrow(RegraNegocioException.class).when(service).validarEmail(email);
	    
	    // Certifique-se de que o método salvarUsuario seja chamado aqui
	    assertThrows(RegraNegocioException.class, () -> service.salvarUsuario(usuario2));
	    
	    // Certifique-se de que o método save do repositório não seja chamado
	    Mockito.verify(repository, Mockito.never()).save(Mockito.any(Usuario.class));
	}
	
	// AUTENTICAR
	// 1o cenário - sucesso
	@Test
	public void deveAutenticarUmUsuarioComSucesso() {
		
		String email = "email@email.com";
		String senha = "1234";
		
		Mockito.when( repository.findByEmail(email) ).thenReturn(Optional.of(usuario));
		
		Usuario result = service.autenticar(email, senha);
		
		Assertions.assertThat( result ).isNotNull();
	}
	// 2o cenário - Erro no email
	@Test
	public void deveLancarUmErroQuandoNaoEncontrarUsuarioCadastradoComOEmailInformado() {
		
		Mockito.when(repository.findByEmail(Mockito.anyString())).thenReturn(Optional.empty());
		
		// assertThrows(ErroAutenticacao.class, () -> service.autenticar("usuario@email", "senha"));
		
		Throwable catchThrowable = Assertions.catchThrowable( () -> service.autenticar("usuario@email", "senha") );
		
		Assertions.assertThat(catchThrowable)
				.isInstanceOf(ErroAutenticacao.class)
				.hasMessage("Usuario não encontrado para o email informado.");
	}
	
	// 3o cenário - Erro na senha
	@Test
	public void deveLancarErroQuandoASenhaNaoBater() {
		
		Mockito.when(repository.findByEmail(Mockito.anyString())).thenReturn(Optional.of(usuario));
		
		// 1- metodo sem mensagem de erro => caso coloque a sennha correto ira ocorrer erro no teste atendendo o objetivo
		// assertThrows(ErroAutenticacao.class, () -> service.autenticar("email@email.com", "123"));
		
		// 2 - verificacao com mensagem de erro
		Throwable catchThrowable = Assertions.catchThrowable( () -> service.autenticar("email@email.com", "123") );
		
		Assertions.assertThat(catchThrowable)
				.isInstanceOf(ErroAutenticacao.class)
				.hasMessage("Senha inválida");
	}
	
	@Test//(expected = Test.None.class) => não a necessidade de colocar essa parte
	public void deveValidarEmail() {
		
		repository.deleteAll();
		/**
		 * Quando cria um usuario e salva ele é armazenado no repositorio se usar o metodo validar
		 * email ele apresentara erro, pois o email já existe, esse erro é apresentado pelo
		 * metodo de Exeption da classe service.
		 * */
		repository.save(usuario);
		
		/**
		 * Nesse caso após apagar o repositorio não havera mais erro pois o repositorio está limpo
		 * então não a Exception error.
		 * */
		
		repository.deleteAll();
		
		service.validarEmail("email@email.com");
	}
	
	@Test
	public void deveValidarEmailMock() {
		
		Mockito.when(repository.existsByEmail(Mockito.anyString())).thenReturn(false);
		
		service.validarEmail("email@email.com");
	}
	
	@Test // ( expected = RegraNegocioException.class) não é usado no JUnit
	public void deveLancarErroAoValidarEmailQuandoExistirEmailCadastrado() {
		
		Mockito.when(repository.existsByEmail(Mockito.anyString())).thenReturn(true);

        // Act & Assert: Verifique se a exceção é lançada ao chamar o método
        assertThrows(RegraNegocioException.class, () -> service.validarEmail("email@email.com"));
	    
	}
}
