#!/bin/bash

set -e

echo "🧹 Limpando containers existentes..."
docker-compose down -v 2>/dev/null || true
docker container prune -f 2>/dev/null || true

echo ""
echo "🚀 Iniciando serviços passo a passo..."

echo "📋 1. Iniciando Zookeeper..."
docker-compose up -d zookeeper
sleep 10

echo "📋 2. Iniciando Kafka..."
docker-compose up -d kafka
sleep 15

echo "📋 3. Iniciando MinIO..."
docker-compose up -d minio
sleep 10

echo "📋 4. Iniciando Jaeger..."
docker-compose up -d jaeger
sleep 10

echo "📋 5. Iniciando Grafana..."
docker-compose up -d grafana
sleep 10

echo "📋 6. Construindo e iniciando aplicações..."
docker-compose up -d --build load-app store-app

echo ""
echo "✅ Todos os serviços foram iniciados!"
echo ""
echo "📊 Status dos containers:"
docker-compose ps

echo ""
echo "🔗 URLs de acesso:"
echo "   Grafana: http://localhost:3000 (admin/admin)"
echo "   Jaeger:  http://localhost:16686"
echo "   MinIO:   http://localhost:9001 (minioadmin/minioadmin)"
echo ""
echo "📋 Para verificar logs:"
echo "   docker-compose logs -f load-app"
echo "   docker-compose logs -f store-app"