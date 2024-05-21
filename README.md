# Sistema de Gestão de Encomendas

## Descrição

Este sistema permite a gestão de entregas, incluindo funcionalidades para login, CRUD de entregadores, encomendas e destinatários, e notificações automáticas para alterações de status de encomendas. A aplicação segue princípios de DDD, Clean Architecture e integrações com serviços externos.

## Regras da Aplicação

- **Tipos de Usuário**: Entregador e/ou Admin
- **Login**: Realizado com CPF e Senha
- **CRUD**:
  - Entregadores
  - Encomendas
  - Destinatários
- **Status de Encomenda**:
  - Marcar como aguardando (Disponível para retirada)
  - Retirar encomenda
  - Marcar como entregue
  - Marcar como devolvida
- **Listagem**:
  - Encomendas com endereços de entrega próximos ao local do entregador
  - Entregas de um usuário específico
- **Alteração de Senha**
- **Notificações**: Enviar notificações ao destinatário a cada alteração no status da encomenda

## Regras de Negócio

- **Admin**:
  - CRUD de encomendas, entregadores e destinatários
  - Alterar senha de um usuário
- **Entregador**:
  - Somente o entregador que retirou a encomenda pode marcá-la como entregue
  - Obrigatório envio de foto para marcar uma encomenda como entregue
  - Não pode listar as encomendas de outro entregador

## Conceitos Praticados

- **DDD (Domain-Driven Design)**: Design centrado no domínio, modelagem de entidades e agregados.
- **Domain Events**: Eventos de domínio para notificação de alterações de status de encomendas.
- **Clean Architecture**: Separação de preocupações, mantendo a lógica de negócios isolada de detalhes de implementação.
- **Autenticação e Autorização (RBAC)**: Controle de acesso baseado em papéis (Role-Based Access Control).
- **Testes**:
  - Unitários: Garantir a funcionalidade de unidades individuais de código.
  - End-to-End (E2E): Testar o fluxo completo da aplicação.
- **Integração com Serviços Externos**: Notificações e geolocalização para listar encomendas próximas.

## Checklist

### Regras da Aplicação

- [ ] Tipos de Usuário: Entregador e/ou Admin
- [ ] Login com CPF e Senha
- [x] CRUD dos Entregadores
- [x] CRUD das Encomendas
- [x] CRUD dos Destinatários
- [x] Marcar encomenda como aguardando (Disponível para retirada)
- [x] Retirar encomenda
- [x] Marcar encomenda como entregue
- [x] Marcar encomenda como devolvida
- [X] Listar encomendas com endereços de entrega próximos ao local do entregador
- [ ] Alterar a senha de um usuário
- [x] Listar as entregas de um usuário
- [x] Notificar o destinatário a cada alteração no status da encomenda

### Regras de Negócio

- [ ] Somente usuário do tipo admin pode realizar operações de CRUD nas encomendas
- [ ] Somente usuário do tipo admin pode realizar operações de CRUD dos entregadores
- [ ] Somente usuário do tipo admin pode realizar operações de CRUD dos destinatários
- [x] Para marcar uma encomenda como entregue é obrigatório o envio de uma foto
- [x] Somente o entregador que retirou a encomenda pode marcá-la como entregue
- [ ] Somente o admin pode alterar a senha de um usuário
- [x] Não deve ser possível um entregador listar as encomendas de outro entregador

## Conceitos Praticados

DDD (Domain-Driven Design)
Domain Events
Clean Architecture
Autenticação e Autorização (RBAC)
Testes Unitários
Testes End-to-End (E2E)
Integração com Serviços Externos

## Como Executar


