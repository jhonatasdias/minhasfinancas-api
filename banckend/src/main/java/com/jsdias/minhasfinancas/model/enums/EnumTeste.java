package com.jsdias.minhasfinancas.model.enums;

public enum EnumTeste {
	PENDENTE("Pendente") {
		@Override
		void salvar() {
			
			
		}
	},
	CANCELADO("Cancelado") {
		@Override
		void salvar() {
			// TODO Auto-generated method stub
			
		}
	},
	EFETIVADO("Efetivado") {
		@Override
		void salvar() {
			// TODO Auto-generated method stub
			
		}
	};
	
	private String nome;
	
	EnumTeste(String nome) {
		this.nome = nome;
	}
	
	public String getNome() {
		return this.nome;
	}
	
	abstract void salvar();
}
