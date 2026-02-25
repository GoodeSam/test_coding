# Vocab — High-Frequency English Flashcards

A minimal flashcard app for learning the 100 most common English words.
Built with vanilla HTML/JS, tested with Vitest, version-controlled with Git —
following the five indispensable skills from [vmark.app](https://vmark.app/guide/users-as-developers/what-are-indispensable.html).

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Serve locally (required — ES modules block file:// imports)
npx serve .

# 3. Open in browser
open http://localhost:3000
```

> **Why can't I just double-click index.html?**
> The page uses ES module `import` statements. Browsers block these over
> the `file://` protocol for security reasons. You must serve it over HTTP.

---

## How to Use

| Action | Button | Keyboard |
|---|---|---|
| Mark current word as known | **I Know It** | `→` |
| Keep current word for review | **Still Learning** | `←` |
| Reset all progress | — | `R` |
| Show / hide full word list | **Show all 100 words** | — |

Progress is saved automatically in `localStorage` — closing and reopening
the browser will resume where you left off.

---

## Using This Project in VMark

VMark ([vmark.app](https://vmark.app)) is a Markdown-based note editor.
Here is a suggested workflow:

**1. Open a VMark note for today's session**

Create a daily note, e.g. `2026-02-25 Vocab Session`, and paste this template:

```markdown
## Vocab session — 2026-02-25

- Words reviewed:
- New words learned:
- Words to revisit:

### Notes on difficult words

| Word | Why it's tricky | My memory hook |
|------|-----------------|----------------|
|      |                 |                |
```

**2. Run the flashcard app side-by-side**

Arrange your browser (flashcard) and VMark window side by side.
As you work through cards, jot down words you found difficult in your VMark note.

**3. After the session**

Copy the "Known" count from the app's progress bar into your note.
Over time, your VMark notes become a learning diary you can search and review.

---

## Project Structure

```
test_coding/
├── index.html          # Flashcard UI (single file, no build step)
├── src/
│   ├── words.js        # 100 high-frequency words with definitions & examples
│   ├── vocabulary.js   # VocabularyDeck class (core logic)
│   └── vocabulary.test.js  # 15 Vitest tests
└── package.json
```

---

## Development — TDD Workflow

```bash
# Run tests once
npm test

# Watch mode (re-runs on save)
npm run test:watch
```

The project follows the **RED → GREEN → REFACTOR** cycle:

| Commit | Phase | Description |
|---|---|---|
| `chore: set up project with Vitest` | Setup | npm + Vitest configured |
| `test(RED): write failing tests` | Red | 15 tests written before any implementation |
| `feat(GREEN): implement VocabularyDeck` | Green | All 15 tests pass |
| `feat: build flashcard UI` | Refactor | UI wired to the tested logic |

---

## Git History

```
b7de08a  fix: resolve two bugs causing UI clicks to produce no visible changes
b2abd15  docs: update README with project overview and learning guide
4ead330  feat: build flashcard UI with 100 high-frequency words
da46abd  feat(GREEN): implement VocabularyDeck — all 15 tests pass
32e1d5b  test(RED): write failing tests for VocabularyDeck
44a52d2  chore: set up project with Vitest for TDD
f052501  first commit
```
