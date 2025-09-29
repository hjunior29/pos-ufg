#!/bin/bash

API_BASE="http://localhost:3000/api/notes"
USER_ID=1

log_with_timestamp() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

log_request() {
    local method=$1
    local url=$2
    local body=$3
    
    log_with_timestamp "🚀 REQUEST: $method $url"
    if [[ -n "$body" ]]; then
        log_with_timestamp "📦 BODY: $body"
    fi
}

log_response() {
    local status_code=$1
    local response_body=$2
    
    if [[ $status_code -ge 200 && $status_code -lt 300 ]]; then
        log_with_timestamp "✅ RESPONSE ($status_code): SUCCESS"
    elif [[ $status_code -ge 400 && $status_code -lt 500 ]]; then
        log_with_timestamp "⚠️  RESPONSE ($status_code): CLIENT ERROR"
    elif [[ $status_code -ge 500 ]]; then
        log_with_timestamp "❌ RESPONSE ($status_code): SERVER ERROR"
    else
        log_with_timestamp "❓ RESPONSE ($status_code): UNKNOWN"
    fi
    
    log_with_timestamp "📄 RESPONSE BODY: $response_body"
}

create_note() {
    local title="$1"
    local content="$2"
    local request_body="{\"title\":\"$title\",\"content\":\"$content\",\"userId\":$USER_ID}"
    
    log_with_timestamp "📝 CRUD_CREATE: Iniciando criação de nova nota"
    log_request "POST" "$API_BASE" "$request_body"
    
    response=$(curl -s -w "\n%{http_code}" -X POST "$API_BASE" \
        -H "Content-Type: application/json" \
        -d "$request_body")
    
    status_code=$(echo "$response" | tail -n1)
    response_body=$(echo "$response" | sed '$d')
    
    log_response "$status_code" "$response_body"
    log_with_timestamp "🏁 CRUD_CREATE: Operação finalizada"
}

read_notes() {
    local url="$API_BASE?userId=$USER_ID"
    
    log_with_timestamp "📚 CRUD_READ: Iniciando busca de todas as notas"
    log_request "GET" "$url"
    
    response=$(curl -s -w "\n%{http_code}" "$url")
    
    status_code=$(echo "$response" | tail -n1)
    response_body=$(echo "$response" | sed '$d')
    
    log_response "$status_code" "$response_body"
    log_with_timestamp "🏁 CRUD_READ: Operação finalizada"
}

read_note() {
    local note_id="$1"
    local url="$API_BASE/$note_id?userId=$USER_ID"
    
    log_with_timestamp "🔍 CRUD_READ: Iniciando busca da nota ID $note_id"
    log_request "GET" "$url"
    
    response=$(curl -s -w "\n%{http_code}" "$url")
    
    status_code=$(echo "$response" | tail -n1)
    response_body=$(echo "$response" | sed '$d')
    
    log_response "$status_code" "$response_body"
    log_with_timestamp "🏁 CRUD_READ: Operação finalizada"
}

edit_note() {
    local note_id="$1"
    local title="$2"
    local content="$3"
    local request_body="{\"title\":\"$title\",\"content\":\"$content\",\"userId\":$USER_ID}"
    local url="$API_BASE/$note_id"
    
    log_with_timestamp "✏️  CRUD_UPDATE: Iniciando edição da nota ID $note_id"
    log_request "PUT" "$url" "$request_body"
    
    response=$(curl -s -w "\n%{http_code}" -X PUT "$url" \
        -H "Content-Type: application/json" \
        -d "$request_body")
    
    status_code=$(echo "$response" | tail -n1)
    response_body=$(echo "$response" | sed '$d')
    
    log_response "$status_code" "$response_body"
    log_with_timestamp "🏁 CRUD_UPDATE: Operação finalizada"
}

delete_note() {
    local note_id="$1"
    local url="$API_BASE/$note_id?userId=$USER_ID"
    
    log_with_timestamp "🗑️  CRUD_DELETE: Iniciando deleção da nota ID $note_id"
    log_request "DELETE" "$url"
    
    response=$(curl -s -w "\n%{http_code}" -X DELETE "$url")
    
    status_code=$(echo "$response" | tail -n1)
    response_body=$(echo "$response" | sed '$d')
    
    log_response "$status_code" "$response_body"
    log_with_timestamp "🏁 CRUD_DELETE: Operação finalizada"
}

get_first_note_id() {
    local response=$(curl -s "$API_BASE?userId=$USER_ID")
    echo "$response" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2
}

case "$1" in
    create)
        create_note "Minha Nova Nota" "Este é o conteúdo da nota criada automaticamente pelo script de teste."
        ;;
    read)
        read_notes
        ;;
    read_one)
        log_with_timestamp "🔍 Buscando primeira nota disponível..."
        first_id=$(get_first_note_id)
        if [[ -n "$first_id" ]]; then
            log_with_timestamp "🆔 Primeira nota encontrada: ID $first_id"
            read_note "$first_id"
        else
            log_with_timestamp "❌ Nenhuma nota encontrada"
        fi
        ;;
    edit)
        log_with_timestamp "✏️ Buscando primeira nota para editar..."
        first_id=$(get_first_note_id)
        if [[ -n "$first_id" ]]; then
            log_with_timestamp "🆔 Editando nota ID $first_id"
            edit_note "$first_id" "Nota Editada" "Conteúdo da nota foi atualizado pelo script de teste."
        else
            log_with_timestamp "❌ Nenhuma nota encontrada para editar"
        fi
        ;;
    delete)
        log_with_timestamp "🗑️ Buscando primeira nota para deletar..."
        first_id=$(get_first_note_id)
        if [[ -n "$first_id" ]]; then
            log_with_timestamp "🆔 Deletando nota ID $first_id"
            delete_note "$first_id"
        else
            log_with_timestamp "❌ Nenhuma nota encontrada para deletar"
        fi
        ;;
    test_all)
        log_with_timestamp "🧪 INICIANDO TESTE COMPLETO DE CRUD"
        log_with_timestamp ""
        
        # Criar nota e capturar ID
        log_with_timestamp "📝 CRUD_CREATE: Iniciando criação de nova nota"
        request_body="{\"title\":\"Nota de Teste Completo\",\"content\":\"Conteúdo inicial da nota de teste\",\"userId\":$USER_ID}"
        log_request "POST" "$API_BASE" "$request_body"
        
        response=$(curl -s -w "\n%{http_code}" -X POST "$API_BASE" \
            -H "Content-Type: application/json" \
            -d "$request_body")
        
        status_code=$(echo "$response" | tail -n1)
        response_body=$(echo "$response" | sed '$d')
        
        log_response "$status_code" "$response_body"
        log_with_timestamp "🏁 CRUD_CREATE: Operação finalizada"
        
        # Extrair ID da resposta
        if [[ $status_code -eq 201 ]]; then
            note_id=$(echo "$response_body" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
            log_with_timestamp "🆔 ID capturado: $note_id"
        else
            log_with_timestamp "❌ Falha ao criar nota, usando ID padrão 2"
            note_id="2"
        fi
        
        log_with_timestamp ""
        read_notes
        log_with_timestamp ""
        read_note "$note_id"
        log_with_timestamp ""
        edit_note "$note_id" "Nota Editada no Teste" "Conteúdo modificado durante o teste"
        log_with_timestamp ""
        read_note "$note_id"
        log_with_timestamp ""
        delete_note "$note_id"
        log_with_timestamp ""
        log_with_timestamp "🏆 TESTE COMPLETO FINALIZADO"
        ;;
    *)
        log_with_timestamp "❌ CRUD_ERROR: Comando inválido!"
        log_with_timestamp "📖 USAGE: $0 {create|read|read_one|edit|delete|test_all}"
        log_with_timestamp ""
        log_with_timestamp "📝 create - Criar nova nota (dados mockados)"
        log_with_timestamp "📚 read - Ler todas as notas"
        log_with_timestamp "🔍 read_one - Ler primeira nota disponível"
        log_with_timestamp "✏️  edit - Editar primeira nota disponível (dados mockados)"
        log_with_timestamp "🗑️  delete - Deletar primeira nota disponível"
        log_with_timestamp "🧪 test_all - Executar teste completo CRUD"
        log_with_timestamp ""
        log_with_timestamp "🌐 API Base: $API_BASE"
        log_with_timestamp "👤 User ID: $USER_ID"
        ;;
esac