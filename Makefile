# ==============================================================================
# Makefile — Winsta AI Frontend
# ==============================================================================

.PHONY: help build up dev dev-down dev-restart dev-logs dev-shell down restart logs shell clean prune

GREEN  := \033[0;32m
YELLOW := \033[1;33m
BLUE   := \033[0;34m
NC     := \033[0m

help:
	@echo ""
	@echo "$(BLUE)╔══════════════════════════════════════════════════════════╗$(NC)"
	@echo "$(BLUE)║       Winsta AI — Docker Commands                        ║$(NC)"
	@echo "$(BLUE)╚══════════════════════════════════════════════════════════╝$(NC)"
	@echo ""
	@echo "$(GREEN)🔥 Development (Hot Reload — auto update on code change):$(NC)"
	@echo "  make dev           Start ALL services (frontend + backend + DB)"
	@echo "  make dev-down      Stop dev services"
	@echo "  make dev-restart   Restart dev services"
	@echo "  make dev-logs      View all dev logs"
	@echo "  make dev-shell-fe  Open shell in frontend dev container"
	@echo "  make dev-shell-api Open shell in backend dev container"
	@echo ""
	@echo "$(GREEN)Production:$(NC)"
	@echo "  make build         Build production Docker image"
	@echo "  make up            Start frontend (production)"
	@echo "  make down          Stop production services"
	@echo "  make logs          View production logs"
	@echo "  make shell         Open shell in production container"
	@echo ""
	@echo "$(GREEN)Utility:$(NC)"
	@echo "  make clean         Stop + remove volumes"
	@echo "  make prune         Clean ALL Docker resources"
	@echo ""
	@echo "$(YELLOW)Dev URLs:$(NC)"
	@echo "  Frontend:  http://localhost:3001  (hot reload 🔥)"
	@echo "  Backend:   http://localhost:3000  (hot reload 🔥)"
	@echo "  Swagger:   http://localhost:3000/api/docs"
	@echo ""

# ==============================================================================
# 🔥 DEVELOPMENT — Hot Reload (auto-update on code change)
# ==============================================================================

dev:
	@echo "$(GREEN)🔥 Starting ALL services with HOT RELOAD...$(NC)"
	@echo ""
	@echo "  Frontend → http://localhost:3001 (Next.js + Turbopack)"
	@echo "  Backend  → http://localhost:3000 (NestJS --watch)"
	@echo "  Swagger  → http://localhost:3000/api/docs"
	@echo ""
	@echo "$(YELLOW)Edit any file — changes appear instantly!$(NC)"
	@echo ""
	docker compose -f docker-compose.dev.yaml up -d --build
	@echo ""
	@echo "$(GREEN)✅ All services running! Use 'make dev-logs' to watch logs.$(NC)"

dev-down:
	@echo "$(YELLOW)Stopping dev services...$(NC)"
	docker compose -f docker-compose.dev.yaml down

dev-restart:
	@echo "$(YELLOW)Restarting dev services...$(NC)"
	docker compose -f docker-compose.dev.yaml restart

dev-logs:
	docker compose -f docker-compose.dev.yaml logs -f

dev-shell-fe:
	@echo "$(BLUE)Opening shell in frontend dev container...$(NC)"
	docker compose -f docker-compose.dev.yaml exec frontend sh

dev-shell-api:
	@echo "$(BLUE)Opening shell in backend dev container...$(NC)"
	docker compose -f docker-compose.dev.yaml exec api sh

# ==============================================================================
# PRODUCTION
# ==============================================================================

build:
	@echo "$(GREEN)Building production Docker image...$(NC)"
	docker compose build

up:
	@echo "$(GREEN)Starting frontend (production)...$(NC)"
	docker compose up -d
	@echo ""
	@echo "$(GREEN)App running at:$(NC) http://localhost:$${APP_PORT:-3000}"

down:
	@echo "$(YELLOW)Stopping services...$(NC)"
	docker compose down

restart:
	@echo "$(YELLOW)Restarting services...$(NC)"
	docker compose restart

logs:
	docker compose logs -f

shell:
	@echo "$(BLUE)Opening shell in production container...$(NC)"
	docker compose exec app sh

# ==============================================================================
# Utility
# ==============================================================================

clean:
	@echo "$(YELLOW)Stopping and removing volumes...$(NC)"
	docker compose -f docker-compose.dev.yaml down -v 2>/dev/null || true
	docker compose down -v 2>/dev/null || true

prune:
	@echo "$(YELLOW)Cleaning up ALL Docker resources...$(NC)"
	docker system prune -a -f
