#!/bin/bash

set -e

echo "🚀 Deploy do Sistema de Ingestão de Dados do Censo 2022"
echo "======================================================="

# Verificar se minikube está rodando
if ! minikube status &> /dev/null; then
    echo "❌ Minikube não está rodando. Iniciando..."
    minikube start
else
    echo "✅ Minikube está rodando"
fi

# Configurar Docker environment para minikube
echo "🔧 Configurando Docker environment..."
eval $(minikube docker-env)

# Construir imagens
echo "🏗️  Construindo imagens Docker..."
docker build -t load-app:latest ./load-app
docker build -t store-app:latest ./store-app

# Deploy no Kubernetes
echo "📦 Fazendo deploy no Kubernetes..."
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/kafka/
kubectl apply -f k8s/minio/
kubectl apply -f k8s/grafana/
kubectl apply -f k8s/apps/

# Aguardar pods ficarem prontos
echo "⏳ Aguardando pods ficarem prontos..."
kubectl wait --for=condition=ready pod -l app=zookeeper -n census-system --timeout=300s
kubectl wait --for=condition=ready pod -l app=kafka -n census-system --timeout=300s
kubectl wait --for=condition=ready pod -l app=minio -n census-system --timeout=300s
kubectl wait --for=condition=ready pod -l app=jaeger -n census-system --timeout=300s
kubectl wait --for=condition=ready pod -l app=grafana -n census-system --timeout=300s

echo "🎉 Deploy concluído com sucesso!"
echo ""
echo "📊 Para acessar os serviços, execute em terminais separados:"
echo "   Grafana:  kubectl port-forward service/grafana 3000:3000 -n census-system"
echo "   Jaeger:   kubectl port-forward service/jaeger 16686:16686 -n census-system"
echo "   MinIO:    kubectl port-forward service/minio 9001:9001 -n census-system"
echo ""
echo "🔗 URLs de acesso:"
echo "   Grafana: http://localhost:3000 (admin/admin)"
echo "   Jaeger:  http://localhost:16686"
echo "   MinIO:   http://localhost:9001 (minioadmin/minioadmin)"
echo ""
echo "📁 Para montar dados CSV:"
echo "   minikube mount ./data:/tmp/census-data &"
echo ""
echo "📋 Verificar status:"
echo "   kubectl get pods -n census-system"