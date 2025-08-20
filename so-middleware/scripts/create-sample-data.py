#!/usr/bin/env python3
"""
Script para criar dados de exemplo para teste do sistema
"""
import pandas as pd
import random
import os

def create_sample_csv(filename, num_records=5000):
    """Cria um arquivo CSV de exemplo com dados simulados do censo"""
    
    # Estados brasileiros (códigos IBGE)
    estados = ['11', '12', '13', '14', '15', '16', '17', '21', '22', '23', '24', '25', '26', '27', '28', '29']
    
    # Gerar dados de exemplo
    data = []
    for i in range(num_records):
        record = {
            'codigo_endereco': f"END{i:06d}",
            'uf': random.choice(estados),
            'codigo_municipio': f"{random.choice(estados)}{random.randint(1000, 9999)}",
            'nome_municipio': f"Municipio_{random.randint(1, 100)}",
            'codigo_distrito': f"DT{random.randint(1, 99):02d}",
            'nome_distrito': f"Distrito_{random.randint(1, 20)}",
            'codigo_subdistrito': f"SD{random.randint(1, 99):02d}",
            'nome_subdistrito': f"Subdistrito_{random.randint(1, 10)}",
            'logradouro': f"Rua {random.choice(['das Flores', 'Principal', 'do Centro', 'da Paz', 'da Liberdade'])}",
            'numero': random.randint(1, 9999),
            'complemento': random.choice(['', 'Apto 101', 'Casa A', 'Bloco 2', '']),
            'cep': f"{random.randint(10000, 99999)}{random.randint(100, 999)}",
            'latitude': round(random.uniform(-33.75, 5.27), 6),
            'longitude': round(random.uniform(-73.99, -34.79), 6),
            'situacao': random.choice(['OCUPADO', 'VAGO', 'EM_CONSTRUCAO']),
            'tipo_domicilio': random.choice(['CASA', 'APARTAMENTO', 'COMODO']),
            'populacao_estimada': random.randint(1, 10)
        }
        data.append(record)
    
    # Criar DataFrame e salvar
    df = pd.DataFrame(data)
    df.to_csv(filename, index=False, encoding='utf-8')
    print(f"✅ Arquivo criado: {filename} com {num_records} registros")

def main():
    # Criar diretório data se não existir
    os.makedirs('data', exist_ok=True)
    
    # Criar arquivos de exemplo
    create_sample_csv('data/municipio_rj_exemplo.csv', 3000)
    create_sample_csv('data/municipio_sp_exemplo.csv', 5000)
    create_sample_csv('data/municipio_mg_exemplo.csv', 2000)
    
    print("\n🎉 Dados de exemplo criados com sucesso!")
    print("📂 Arquivos criados no diretório 'data/':")
    print("   - municipio_rj_exemplo.csv (3000 registros)")
    print("   - municipio_sp_exemplo.csv (5000 registros)")
    print("   - municipio_mg_exemplo.csv (2000 registros)")
    print("\n💡 Agora você pode executar o sistema de ingestão!")

if __name__ == "__main__":
    main()