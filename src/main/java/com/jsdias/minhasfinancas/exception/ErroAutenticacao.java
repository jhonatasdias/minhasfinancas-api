package com.jsdias.minhasfinancas.exception;

public class ErroAutenticacao extends RuntimeException {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public ErroAutenticacao(String msg) {
		super(msg);
	}
}
