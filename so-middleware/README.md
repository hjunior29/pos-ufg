# Sistema de Ingestão de Dados do Censo 2022

Trabalho Final - Analista de Sistemas Operacionais e Middleware

## Descrição

Este projeto implementa um sistema completo de ingestão de dados para processar arquivos CSV do Censo 2022 do IBGE utilizando Kafka como middleware de mensageria entre dois agentes:

- **load-app**: Carrega dados de arquivos CSV e envia para o Kafka
- **store-app**: Consome dados do Kafka e armazena no MinIO S3 em formato Parquet

## Arquitetura

```
CSVs → load-app → Kafka → store-app → MinIO S3 (Parquet)
                    ↓
                Grafana + Jaeger (Tracing)
```

## Estrutura do Projeto

```
├── load-app/                 # Aplicação de carregamento
│   ├── src/
│   ├── config/
│   ├── Dockerfile
│   └── requirements.txt
├── store-app/                # Aplicação de armazenamento
│   ├── src/
│   ├── config/
│   ├── Dockerfile
│   └── requirements.txt
├── k8s/                      # Manifests Kubernetes
│   ├── kafka/
│   ├── minio/
│   ├── grafana/
│   └── apps/
├── docker/                   # Configurações Docker
├── data/                     # Diretório para arquivos CSV
└── docker-compose.yml
```

## Pré-requisitos

- Docker e Docker Compose
- Minikube (para deployment Kubernetes)
- kubectl

## Como Executar

### 1. Preparar os Dados

Baixe os arquivos CSV de municípios do site do IBGE:
https://www.ibge.gov.br/estatisticas/sociais/populacao/38734-cadastro-nacional-de-enderecos-para-fins-estatisticos.html

Coloque os arquivos CSV no diretório `data/`:

```bash
mkdir -p data
# Copie seus arquivos CSV para o diretório data/
```

### 2. Executar com Docker Compose

```bash
# Construir e iniciar todos os serviços
docker-compose up --build -d

# Verificar logs
docker-compose logs -f load-app
docker-compose logs -f store-app

# Parar os serviços
docker-compose down
```

### 3. Executar no Minikube

#### Preparar o ambiente:

```bash
# Iniciar minikube
minikube start

# Configurar Docker para usar o registro do minikube
eval $(minikube docker-env)

# Construir as imagens no ambiente do minikube
docker build -t load-app:latest ./load-app
docker build -t store-app:latest ./store-app

# Copiar dados CSV para o minikube
minikube mount ./data:/tmp/census-data &
```

#### Deploy dos serviços:

```bash
# Aplicar todos os manifests
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/kafka/
kubectl apply -f k8s/minio/
kubectl apply -f k8s/grafana/
kubectl apply -f k8s/apps/

# Verificar o status dos pods
kubectl get pods -n census-system

# Verificar logs
kubectl logs -f deployment/load-app -n census-system
kubectl logs -f deployment/store-app -n census-system
```

#### Acessar os serviços:

```bash
# Grafana (admin/admin)
kubectl port-forward service/grafana 3000:3000 -n census-system

# Jaeger UI
kubectl port-forward service/jaeger 16686:16686 -n census-system

# MinIO Console (minioadmin/minioadmin)
kubectl port-forward service/minio 9001:9001 -n census-system
```

## Monitoramento

### Grafana
- URL: http://localhost:3000
- Usuário: admin
- Senha: admin
- Datasource Jaeger já configurado

### Jaeger
- URL: http://localhost:16686
- Visualize traces dos serviços load-app e store-app

### MinIO
- Console: http://localhost:9001
- API: http://localhost:9000
- Usuário: minioadmin
- Senha: minioadmin

## Funcionalidades

### Load App
- Lê arquivos CSV em lotes configuráveis
- Converte dados para JSON
- Envia mensagens para Kafka com metadados
- Instrumentação de tracing com OpenTelemetry

### Store App
- Consome mensagens do Kafka
- Agrupa dados por arquivo fonte
- Converte para formato Parquet
- Armazena no MinIO S3 com compressão Snappy
- Instrumentação de tracing com OpenTelemetry

## Configuração

### Variáveis de Ambiente

#### Load App
- `KAFKA_BOOTSTRAP_SERVERS`: Endereço do Kafka
- `KAFKA_TOPIC`: Tópico Kafka
- `CSV_DATA_PATH`: Caminho dos arquivos CSV
- `BATCH_SIZE`: Tamanho do lote
- `JAEGER_ENDPOINT`: Endpoint do Jaeger

#### Store App
- `KAFKA_BOOTSTRAP_SERVERS`: Endereço do Kafka
- `KAFKA_TOPIC`: Tópico Kafka
- `KAFKA_GROUP_ID`: Grupo do consumidor
- `S3_ENDPOINT`: Endpoint do MinIO
- `S3_ACCESS_KEY`: Chave de acesso
- `S3_SECRET_KEY`: Chave secreta
- `S3_BUCKET`: Nome do bucket
- `BATCH_SIZE`: Tamanho do lote
- `FLUSH_INTERVAL`: Intervalo de flush (segundos)

## Troubleshooting

### Problemas Comuns

1. **Kafka não conecta**: Verifique se o Zookeeper está funcionando
2. **MinIO não acessível**: Confirme as credenciais e endpoint
3. **Pods com falha no Kubernetes**: Verifique recursos disponíveis
4. **Arquivos CSV não encontrados**: Confirme o mount do diretório

### Comandos Úteis

```bash
# Verificar tópicos Kafka
kubectl exec -it deployment/kafka -n census-system -- kafka-topics --list --bootstrap-server localhost:9092

# Verificar buckets MinIO
kubectl exec -it deployment/minio -n census-system -- mc ls minio/

# Limpar namespace
kubectl delete namespace census-system
```

## Estrutura dos Dados

Os dados são armazenados no MinIO com a seguinte estrutura:

```
census-data/
├── municipio1/
│   ├── 20240820_143022_123456.parquet
│   └── 20240820_143045_789012.parquet
└── municipio2/
    ├── 20240820_143100_345678.parquet
    └── 20240820_143125_901234.parquet
```

Cada arquivo Parquet contém um lote de registros do censo com compressão Snappy para otimização de armazenamento.