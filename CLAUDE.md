# Пепельная яма: правила для агента

Bitecs 0.4, three.js, React, Vite. Папки описаны в README.md, связи систем и данных в карте кода.

## Перед задачей

- Сначала прочитай README.md и запусти `npm run map`, потом `docs/code-atlas/code-atlas.json` (frame, systems, edges, findings).
- Любая задача приходит заготовкой: баланс, компоненты, события, порты и ассеты уже лежат в коде, найди их и используй, не плоди дубли. Пример: `DamageEvent` в `src/game/ecs/events.ts`, `ENEMIES` в `src/game/config/enemies.ts`, `SYSTEM_INTERVALS.pathfield` в `src/game/config/engine.ts`.
- Заготовку дописывай, а не переделывай: меняй только то, что нужно задаче.

## Функциональный подход, Flat ECS

- Без классов и `this`: состояние в замыкании и объекте. Пример: `createSpatialHash` в `src/game/physics/spatialHash.ts`.
- Без `export default`, только именованные экспорты. Пример: `export function cleanupSystem` в `src/game/ecs/systems/core/cleanupSystem.ts`.
- Фабрики называются `createX` и возвращают объект по интерфейсу. Пример: `createHudStore(): HudStore` в `src/app/hudStore.ts`.
- Компонент это только данные: объект типизированных массивов на `ENTITIES_MAX`. Пример: `Position` в `src/game/ecs/components/transform.ts`.
- Тег это пустой объект. Пример: `Destroyed = {}` в `src/game/ecs/components/lifetime.ts`.
- Перечисления это `as const` объект, не `enum`. Пример: `Side` в `src/game/ecs/components/health.ts`.
- Новый компонент экспортируется через `src/game/ecs/components/index.ts`.
- Сущность это число, данные читаются по индексу: `Position.x[entity]`.
- Иерархий нет, логика в системах и мелких чистых функциях. Пример: `followHeight`, `eyeHeight` в `src/game/ecs/systems/view/cameraSystem.ts`.

## Запросы

- Запрос это константа модуля через `defineQuery`, никогда внутри функции. Пример: `const lifetimeQuery = defineQuery([Lifetime])` в `lifetimeSystem.ts`.
- Имя запроса `<что>Query`. Пример: `shootableQuery` в `spatialSystem.ts`.
- Исключения через `Not(...)` в том же списке. Пример: `livingPlayerQuery` в `cameraSystem.ts`.
- Варианты состояния это несколько запросов, а не `if` в цикле. Пример: `PLAYER_STATES` в `cameraSystem.ts`.
- Если цикл удаляет сущности, копируй результат: `[...destroyedQuery(world)]` в `cleanupSystem.ts`.
- `query` из bitecs напрямую не вызывай, только `defineQuery` из `src/game/ecs/defineQuery.ts`.

## Системы

- Одна система на файл, файл назван как система, сигнатура `export function xSystem(world: GameWorld): void`.
- Система лежит в папке домена `src/game/ecs/systems/<домен>/` и экспортируется из `index.ts` этой папки. Пример: `systems/core/index.ts`.
- Новый домен это новая папка в `systems/` и строка о ней в README.md (тест `readme.test.ts`).
- Редкий запуск через `every(SYSTEM_INTERVALS.x, xSystem)` из `src/game/ecs/systems/schedule.ts`, интервал в конфиге.
- Удаление только через `destroyEntity(world, entity)` (ставит `Destroyed`), `removeEntity` зовет лишь `cleanupSystem`.
- Время только из `world.time.delta` и `world.time.elapsed`. Пример: `Lifetime.left[entity] -= world.time.delta`.
- Случайность только `world.random()`, не `Math.random()` (сид задается в `src/app/session.ts`).
- Соседи только через `world.hash.near(...)`, хеш заполняет `spatialSystem`.

## Порядок кадра

- Порядок кадра задается только в `src/game/ecs/systems/index.ts`, система вне списка не работает.
- Кадр: `clock, player*, targeting, chase, enemyCooldown, movement, hover, gravity, arena, spatial, separation, pathfield, ...spawn, contact, playerHurt, damage, lifetime, ...view, cleanup`.
- Логика ставится до `lifetimeSystem`, отрисовка в `viewPipeline` (`atmosphere, levelView, enemyPose, spriteDraw, camera, overlay, hud`), `cleanupSystem` всегда последний.
- `arenaSystem` сдвигает все `Position` при переезде арены, поэтому `spatialSystem` стоит после него.
- Системы спавна передаются в `simulation([...])`: отдельно для `pipeline` и `trainingPipeline`.
- `viewPipeline` крутится и на паузе (`runView`), поэтому в view-системах нет игровой логики.
- Система пишет данные раньше той, что их читает в этом кадре. Иначе это `nextFrame` в `edges` карты.
- `beginFrame` в `src/game/ecs/world.ts` чистит события кадра, система их не обнуляет сама.

## События и порты

- События кадра лежат в `world.events`, тип в `src/game/ecs/events.ts`, сброс в `clearFrameEvents`.
- Новое поле события добавь в `FrameEvents`, `createFrameEvents` и `clearFrameEvents`.
- Урон только событием `world.events.damage`: `contact` кладет, `playerHurt` гасит неуязвимостью, `damage` списывает HP и ставит `Dead`.
- Связь с внешним миром только через порты из `src/game/ecs/ports.ts`: `world.render`, `world.input`, `world.hud`.
- Пример порта: `world.render.setCamera(...)` в `cameraSystem.ts`.
- Новый метод порта реализуй в `src/platform` или `src/app` и в заглушке `tests/support/game.ts`.

## Слои

- `src/game` не знает про браузер: без `three`, `react`, `window`, `document` (тест `style.test.ts`).
- `src/game/config` только данные и типы, все числа баланса там. Пример: `CAMERA.bobRate` в `src/game/config/view.ts`.
- Магических чисел в системах нет, бери константу из конфига. Пример: `PLAYER.eye` в `cameraSystem.ts`.
- `src/app` собирает мир и порты, фазы игры. Пример: `createRun` в `src/app/session.ts`.
- `src/ui` (React) общается с игрой только через `src/app`: `HudStore` и `GameCommands`.
- `src/platform` реализует порты: ввод, рендер, ассеты, сохранение.

## Стиль кода

- TypeScript strict, без неиспользуемых переменных и параметров.
- Отступ 2 пробела, без точек с запятой, одинарные кавычки, LF.
- `import type` для типов (`verbatimModuleSyntax`). Пример: `import type { GameWorld } from '../../world'`.
- Короткие функции, имена полными словами: `invulnerabilityTime`, а не `invTime`.
- Комментарии не пишем, имя должно объяснять.

## Тесты

- Тесты в `tests/` без браузера, на vitest.
- Мир для теста `createTestRun(mode)`, прогон кадров `simulate(world, seconds)` из `tests/support/game.ts`.
- Новая механика получает тест через `simulate`, проверяй данные компонентов. Пример стиля: `tests/core/defineQuery.test.ts`.
- Имя теста описывает поведение: `'keeps worlds apart'`.

## Проверка перед сдачей

- `npm run typecheck` без ошибок.
- `npm test` зеленый, включая `style.test.ts` и `readme.test.ts`.
- `npm run map` и закоммить `docs/code-atlas`: CI сверяет карту через `npm run map:check`.
- Посмотри `findings` в карте: новых `write-only` полей быть не должно.
- `npm run build` проходит.

## Коммит

- Перед коммитом задай пользователю 5 коротких поверхностных вопросов одним сообщением и коммить только после ответов.
- 1. Что видно в браузере: совпадает ли с задачей? Пример: «туман меняет цвет на границе биомов?»
- 2. Нет ли в диффе чужих правок, которые не надо брать? Пример: `components/enemy.ts` не из этой задачи.
- 3. Какие числа конфига поменялись и устраивают ли? Пример: `ARENA.recenter` 14 → 20.
- 4. Что осталось болванкой и это ок? Пример: `level.path` пока никто не читает.
- 5. Одним коммитом или разбить, и какое сообщение? Пример: «Арена: пещеры, биомы, ходьба».
