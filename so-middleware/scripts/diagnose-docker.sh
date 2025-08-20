#!/bin/bash

echo "🔍 Diagnóstico do Docker"
echo "======================="

echo "📋 Docker version:"
docker --version

echo ""
echo "📋 Docker system info:"
docker system info | head -20

echo ""
echo "📋 Docker disk usage:"
docker system df

echo ""
echo "📋 Running containers:"
docker ps

echo ""
echo "📋 All containers:"
docker ps -a

echo ""
echo "📋 Docker images:"
docker images

echo ""
echo "📋 Docker volumes:"
docker volume ls

echo ""
echo "📋 Docker networks:"
docker network ls

echo ""
echo "🧹 Cleaning up stopped containers and unused resources..."
docker container prune -f
docker image prune -f
docker volume prune -f
docker network prune -f

echo ""
echo "✅ Limpeza concluída!"