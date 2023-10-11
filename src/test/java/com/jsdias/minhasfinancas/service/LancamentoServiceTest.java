package com.jsdias.minhasfinancas.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.data.domain.Example;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import com.jsdias.minhasfinancas.exception.RegraNegocioException;
import com.jsdias.minhasfinancas.model.entity.Lancamento;
import com.jsdias.minhasfinancas.model.entity.Usuario;
import com.jsdias.minhasfinancas.model.enums.StatusLancamento;
import com.jsdias.minhasfinancas.model.enums.TipoLancamento;
import com.jsdias.minhasfinancas.model.repository.LancamentoRepository;
import com.jsdias.minhasfinancas.service.impl.LancamentoServiceImpl;

@ExtendWith( SpringExtension.class )
@ActiveProfiles( "teste" )
public class LancamentoServiceTest {
	
	@SpyBean
	LancamentoServiceImpl lancamentoService;
	
	@MockBean
	LancamentoRepository lancamentoRepository;
	
	Lancamento lancamento;
	
	Usuario usuario;
	
	@BeforeEach
	public void setUp() {
		lancamento = Lancamento.builder()
						.ano(2019)
						.mes(1)
						.descricao("lancamento")
						.valor(BigDecimal.valueOf(10))
						.tipo(TipoLancamento.RECEITA)
						.status(StatusLancamento.PENDENTE)
						.dataCadastro(LocalDate.now())
						.build();
		
		usuario = Usuario.builder()
					.nome("usuario")
					.senha("senha")
					.email("usuario@email.com")
					.build();
	}
	
	@Test
	public void deveSalvarUmLancamento() {
		
		Lancamento lancamentoASalvar = lancamento;
		Mockito.doNothing().when(lancamentoService).validar(lancamentoASalvar);
		
		Lancamento lancamentoSalvo = lancamento;
		lancamentoSalvo.setId(1l); // id = 1 / l = tipo Long
		lancamentoSalvo.setStatus(StatusLancamento.PENDENTE);
		Mockito.when(lancamentoRepository.save(lancamento)).thenReturn(lancamentoSalvo);
		
		lancamento = lancamentoRepository.save(lancamento);
		
		Assertions.assertThat(lancamento.getId()).isEqualTo(lancamentoSalvo.getId());
		Assertions.assertThat(lancamento.getStatus()).isEqualTo(StatusLancamento.PENDENTE);
	}
	
	@Test
	public void naoDeveSalvarLancamentoQuandoHouverErroDeValidacao() {
		
		Lancamento lancamentoASalvar = lancamento;
		Mockito.doThrow(RegraNegocioException.class).when(lancamentoService).validar(lancamentoASalvar);
		
		Assertions.catchThrowableOfType( () -> 
						lancamentoService.salvar(lancamentoASalvar), 
								RegraNegocioException.class);
		
		Mockito.verify(lancamentoRepository, Mockito.never()).save(lancamentoASalvar);
	}
	
	@Test
	public void deveAtualizarUmLancamento() {
		
		Lancamento lancamentoSalvo = lancamento;
		lancamentoSalvo.setId(1l); // id = 1 / l = tipo Long
		lancamentoSalvo.setStatus(StatusLancamento.PENDENTE);
		
		Mockito.doNothing().when(lancamentoService).validar(lancamentoSalvo);
		
		Mockito.when(lancamentoRepository.save(lancamentoSalvo)).thenReturn(lancamentoSalvo);
		
		lancamentoService.atualizar(lancamentoSalvo);
		
		Mockito.verify(lancamentoRepository, Mockito.times(1)).save(lancamentoSalvo);
		
	}
	
	@Test
	public void deveLancarErroAoTentarAtualizarUmLancamentoQueAindaNaoFoiSalvo() {
		
		Lancamento lancamentoASalvar = lancamento;
		Mockito.doThrow(RegraNegocioException.class).when(lancamentoService).validar(lancamentoASalvar);
		
		Assertions.catchThrowableOfType( () -> 
								lancamentoService.atualizar(lancamentoASalvar), 
								NullPointerException.class);
		
		Mockito.verify(lancamentoRepository, Mockito.never()).save(lancamentoASalvar);
	}
	
	@Test
	public void deveDeletarUmLancamento() {
		
		lancamento.setId(1l);
		
		lancamentoService.deletar(lancamento);
		
		Mockito.verify(lancamentoRepository).delete(lancamento);
	}
	
	@Test
	public void deveLancarErroAoTentarDeletarUmLancamentoQueAindaNaoFoiSalvo() {
		
		Assertions.catchThrowableOfType( () -> 
								lancamentoService.deletar(lancamento), 
								NullPointerException.class);
		
		Mockito.verify(lancamentoRepository, Mockito.never()).delete(lancamento);
	}
	
	@Test
	public void deveFiltrarLancamentos() {
		
		lancamento.setId(1l);
		
		List<Lancamento> lista = Arrays.asList(lancamento);
		Mockito.when(lancamentoRepository.findAll(Mockito.any(Example.class))).thenReturn(lista);
		
		List<Lancamento> resultado = lancamentoService.busca(lancamento);
		
		Assertions.assertThat(resultado).isNotEmpty().hasSize(1).contains(lancamento);
	}
	
	@Test
	public void deveAtualizarOStatusDeUmLancamento() {
		
		lancamento.setId(1l);
		
		StatusLancamento novoStatus = StatusLancamento.EFETIVADO;
		Mockito.doReturn(lancamento).when(lancamentoService).atualizar(lancamento);
		
		lancamentoService.atualizarStatus(lancamento, novoStatus);
		
		Assertions.assertThat(lancamento.getStatus()).isEqualTo(novoStatus);
		Mockito.verify(lancamentoService).atualizar(lancamento);
	}
	
	@Test
	public void deveObterUmLancamentoPorId() {
		Long id = 1l;
		
		lancamento.setId(id);
		
		Mockito.when(lancamentoRepository.findById(id)).thenReturn(Optional.of(lancamento));
		
		Optional<Lancamento> resultado = lancamentoService.obterPorId(id);
		
		Assertions.assertThat(resultado.isPresent()).isTrue();
	}
	
	@Test
	public void deveRetornarVazioQuandoOIdNaoExiste() {
		Long id = 1l;
		
		lancamento.setId(id);
		
		Mockito.when(lancamentoRepository.findById(id)).thenReturn(Optional.empty());
		
		Optional<Lancamento> resultado = lancamentoService.obterPorId(id);
		
		Assertions.assertThat(resultado.isPresent()).isFalse();
	}
	
	@Test
	public void deveLancarErrosAoValidarUmLancamento() {
		
		Lancamento lancamento = new Lancamento();
		
		Throwable erro = Assertions.catchThrowable( () -> lancamentoService.validar(lancamento));
		Assertions.assertThat(erro).isInstanceOf(RegraNegocioException.class)
									.hasMessage("Informe uma Descriçãoo válida");
		
		Assertions.catchThrowableOfType( () -> lancamento.getDescricao(), RegraNegocioException.class);
		
		lancamento.setDescricao("");
		
		erro = Assertions.catchThrowable( () -> lancamentoService.validar(lancamento));
		Assertions.assertThat(erro).isInstanceOf(RegraNegocioException.class)
									.hasMessage("Informe uma Descriçãoo válida");
		
		lancamento.setDescricao("Salario");
		
		erro = Assertions.catchThrowable( () -> lancamentoService.validar(lancamento));
		
		Assertions.assertThat(erro).isInstanceOf(RegraNegocioException.class)
									.hasMessage("Informe um Mês válido");
		
		lancamento.setMes(0);
		
		erro = Assertions.catchThrowable( () -> lancamentoService.validar(lancamento));
		
		Assertions.assertThat(erro).isInstanceOf(RegraNegocioException.class)
									.hasMessage("Informe um Mês válido");
		
		lancamento.setMes(15);
		
		erro = Assertions.catchThrowable( () -> lancamentoService.validar(lancamento));
		
		Assertions.assertThat(erro).isInstanceOf(RegraNegocioException.class)
									.hasMessage("Informe um Mês válido");
		
		lancamento.setMes(11);
		
		erro = Assertions.catchThrowable( () -> lancamentoService.validar(lancamento));

		Assertions.assertThat(erro).isInstanceOf(RegraNegocioException.class)
									.hasMessage("Informe un Ano válido");
		
		lancamento.setAno(215); // somente aceito com 4 digitos
		
		erro = Assertions.catchThrowable( () -> lancamentoService.validar(lancamento));

		Assertions.assertThat(erro).isInstanceOf(RegraNegocioException.class)
									.hasMessage("Informe un Ano válido");
		
		lancamento.setAno(2015);
		
		erro = Assertions.catchThrowable( () -> lancamentoService.validar(lancamento));

		Assertions.assertThat(erro).isInstanceOf(RegraNegocioException.class)
									.hasMessage("Informe um Usuario");
		
		lancamento.setUsuario(usuario); // usuario foi criado entretando está sem o id, 
										// logo não é válido
		
		erro = Assertions.catchThrowable( () -> lancamentoService.validar(lancamento));

		Assertions.assertThat(erro).isInstanceOf(RegraNegocioException.class)
									.hasMessage("Informe um Usuario");
		
		lancamento.setUsuario(new Usuario());
		lancamento.getUsuario().setId(1l);
		
		erro = Assertions.catchThrowable( () -> lancamentoService.validar(lancamento));

		Assertions.assertThat(erro).isInstanceOf(RegraNegocioException.class)
									.hasMessage("Informe um valor válido");
		
		lancamento.setValor(BigDecimal.ZERO);
		
		erro = Assertions.catchThrowable( () -> lancamentoService.validar(lancamento));

		Assertions.assertThat(erro).isInstanceOf(RegraNegocioException.class)
									.hasMessage("Informe um valor válido");
		
		lancamento.setValor(BigDecimal.valueOf(1));
		
		erro = Assertions.catchThrowable( () -> lancamentoService.validar(lancamento));

		Assertions.assertThat(erro).isInstanceOf(RegraNegocioException.class)
									.hasMessage("Informe um tipo de Lançamento");
		
		
	}
}
