# Автоматическая загрузка агентов с Qwen Code

## 📁 Расположение агентов

Агенты находятся в директории:
```
/Users/wer/projects/agents/
```

## ⚙️ Настройка MCP сервера

MCP сервер настроен в файле `~/.qwen/settings.json`:

```json
{
  "mcpServers": {
    "custom-agents": {
      "command": "node",
      "args": ["/Users/wer/mcp-agents/server.js"],
      "enabled": true
    }
  }
}
```

## 🚀 Как это работает

1. **При запуске Qwen Code** MCP сервер автоматически загружается
2. **Сервер сканирует** директорию `/Users/wer/projects/agents/`
3. **Загружает все файлы** агентов (`.md`, `.yaml`, `.yml`)
4. **Делает их доступными** через инструменты Qwen

## 📋 Доступные агенты

### Встроенные агенты (8):
- `coordinator` - Оркестрация между агентами
- `researcher` - Сбор и анализ информации
- `coder` - Генерация кода
- `architect` - Проектирование архитектуры
- `reviewer` - Проверка кода
- `tester` - Написание тестов
- `analyst` - Анализ производительности
- `optimizer` - Оптимизация кода

### Агенты из файлов (99+):
Все агенты из директории `/Users/wer/projects/agents/` по категориям:
- `core/` - coder, reviewer, researcher, tester, planner
- `v3/` - sparc-orchestrator, security-architect, memory-specialist
- `github/` - pr-manager, issue-tracker, release-manager
- `devops/`, `testing/`, `optimization/`, и другие

## ✅ Проверка работы

После запуска Qwen Code убедитесь, что агенты загружены:
- В логе должно быть: `✅ Загружено X агентов из /Users/wer/projects/agents`

## 🔧 Перезапуск MCP сервера

Если нужно перезапустить сервер:
1. Закройте Qwen Code
2. Откройте заново
3. MCP сервер загрузится автоматически
