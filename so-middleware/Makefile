.PHONY: help build up down logs clean k8s-deploy k8s-clean

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@egrep '^(.+)\s*:.*?##\s*(.+)' $(MAKEFILE_LIST) | column -t -c 2 -s ':#'

build: ## Build Docker images
	docker-compose build

up: ## Start all services with Docker Compose
	docker-compose up -d

down: ## Stop all services
	docker-compose down

logs: ## Show logs for all services
	docker-compose logs -f

clean: ## Clean up Docker resources
	docker-compose down -v --rmi all

k8s-build: ## Build images for Kubernetes
	eval $$(minikube docker-env) && \
	docker build -t load-app:latest ./load-app && \
	docker build -t store-app:latest ./store-app

k8s-deploy: ## Deploy to Kubernetes
	kubectl apply -f k8s/namespace.yaml
	kubectl apply -f k8s/kafka/
	kubectl apply -f k8s/minio/
	kubectl apply -f k8s/grafana/
	kubectl apply -f k8s/apps/

k8s-clean: ## Clean Kubernetes deployment
	kubectl delete namespace census-system --ignore-not-found=true

k8s-status: ## Check Kubernetes deployment status
	kubectl get all -n census-system

k8s-logs-load: ## Show load-app logs
	kubectl logs -f deployment/load-app -n census-system

k8s-logs-store: ## Show store-app logs
	kubectl logs -f deployment/store-app -n census-system

port-forward: ## Set up port forwarding for services
	@echo "Starting port forwarding..."
	@echo "Grafana: http://localhost:3000 (admin/admin)"
	@echo "Jaeger: http://localhost:16686"
	@echo "MinIO: http://localhost:9001 (minioadmin/minioadmin)"
	kubectl port-forward service/grafana 3000:3000 -n census-system &
	kubectl port-forward service/jaeger 16686:16686 -n census-system &
	kubectl port-forward service/minio 9001:9001 -n census-system &
	@echo "Port forwarding started in background"

mount-data: ## Mount data directory to minikube
	minikube mount ./data:/tmp/census-data