package com.jsdias.minhasfinancas.api.resource;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jsdias.minhasfinancas.api.DTO.AtualizarStatusDTO;
import com.jsdias.minhasfinancas.api.DTO.LancamentoDTO;
import com.jsdias.minhasfinancas.exception.RegraNegocioException;
import com.jsdias.minhasfinancas.model.entity.Lancamento;
import com.jsdias.minhasfinancas.model.entity.Usuario;
import com.jsdias.minhasfinancas.model.enums.StatusLancamento;
import com.jsdias.minhasfinancas.model.enums.TipoLancamento;
import com.jsdias.minhasfinancas.service.LancamentoService;
import com.jsdias.minhasfinancas.service.UsuarioService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/lancamentos")
@RequiredArgsConstructor
public class LancamentoResource {

	// Com final nos atributos inicialização obrigatoria (Lombok)
	private final LancamentoService lancamentoService;
	private final UsuarioService usuarioService;
	
//	public LancamentoResource( LancamentoService lancamentoService, UsuarioService usuarioService ) {
//		this.lancamentoService = lancamentoService;
//		this.usuarioService = usuarioService;
//	}
	
	@GetMapping
	public ResponseEntity buscar(
			// Outro metodo a ser implementado como opção, entretanto todos as chaves são opcionais
			// @RequestParam java.util.Map <String, String> params;
			
			@RequestParam(value = "descricao", required = false) String descricao,
			@RequestParam(value = "mes", required = false) Integer mes,
			@RequestParam(value = "ano", required = false) Integer ano,
			@RequestParam("usuario") Long idUsuario
			) {
		Lancamento lancamentoFiltro = new Lancamento();
		lancamentoFiltro.setDescricao(descricao);
		lancamentoFiltro.setMes(mes);
		lancamentoFiltro.setAno(ano);
		
		Optional<Usuario> usuario = usuarioService.obterPorId(idUsuario);
		if(usuario.isEmpty()) {
			return ResponseEntity
					.badRequest()
					.body("Não foi possivel realizar a consulta. Usuario não encontrado para o id informado");
		} else {
			lancamentoFiltro.setUsuario(usuario.get());
		}
		
		List<Lancamento> lancamentos = lancamentoService.busca(lancamentoFiltro);
		return ResponseEntity.ok(lancamentos);
	}
	
	@PostMapping
	public ResponseEntity salvar( @RequestBody LancamentoDTO dto ) {
		try {
			try {
				Lancamento entidade = converter(dto);
				//adicionado pessoalmente
				entidade.setDataCadastro(LocalDate.now());
				entidade = lancamentoService.salvar(entidade);
				return new ResponseEntity(entidade, HttpStatus.CREATED);
			} catch (RegraNegocioException e) {
				return ResponseEntity.badRequest().body(e.getMessage());
			}
		} catch (RegraNegocioException e) {			
			return ResponseEntity.badRequest().body(e.getMessage());		
		}
		
	}
	
	@PutMapping("{id}")
	public ResponseEntity atualizar( @PathVariable("id") Long id, @RequestBody LancamentoDTO dto ) {
		return lancamentoService.obterPorId(id).map( entity -> {
			Lancamento lancamento = converter(dto);
			lancamento.setId(entity.getId());
			lancamentoService.atualizar(lancamento);
			return ResponseEntity.ok(lancamento);
		}).orElseGet( () -> 
			new ResponseEntity("Lançamento não encontrado na base de dados", HttpStatus.BAD_REQUEST ) );
	}
	
	@PutMapping("{id}/atualiza-status")
	public ResponseEntity atualizarStatus( @PathVariable("id") Long id, @RequestBody AtualizarStatusDTO dto ) {
		return lancamentoService.obterPorId(id).map( entity -> {
			StatusLancamento statusSelecionado = StatusLancamento.valueOf(dto.getStatus());
			if(statusSelecionado == null) {
				return ResponseEntity
						.badRequest()
						.body("Não foi possivel atualizar o status do lançamento, envie um Status válido");
			}
			try {
				entity.setStatus(statusSelecionado);
				lancamentoService.atualizar(entity);
				return ResponseEntity.ok( entity );				
			} catch(RegraNegocioException e) {
				return ResponseEntity.badRequest().body(e.getMessage());
			}
		}).orElseGet( () -> 
		new ResponseEntity("Lançamento não encontrado na base de dados", HttpStatus.BAD_REQUEST ) );
	}
	
	@DeleteMapping("{id}")
	public ResponseEntity deletar( @PathVariable("id") Long id ) {
		return lancamentoService.obterPorId(id).map( entidade -> {
			lancamentoService.deletar(entidade);
			return new ResponseEntity( HttpStatus.NO_CONTENT );
		}).orElseGet( () -> 
			new ResponseEntity("Lançamento não encontrado na base de dados", HttpStatus.BAD_REQUEST ) );
	}
	
	private Lancamento converter(LancamentoDTO dto) {
		Lancamento lancamento = new Lancamento();
		lancamento.setId(dto.getId());
		lancamento.setDescricao(dto.getDescricao());
		lancamento.setMes(dto.getMes());
		lancamento.setAno(dto.getAno());
		lancamento.setValor(dto.getValor());
		
		Usuario usuario = usuarioService
				.obterPorId(dto.getUsuario())
				.orElseThrow( () -> new RegraNegocioException("Usuario não encontrado para o Id informado") );
		
		lancamento.setUsuario(usuario);
		
		if(dto.getTipo() != null) {
			lancamento.setTipo(TipoLancamento.valueOf(dto.getTipo()));			
		}
		
		if(dto.getStatus() != null) {
			lancamento.setStatus(StatusLancamento.valueOf(dto.getStatus()));			
		}
		
		
		return lancamento;
	}
}
