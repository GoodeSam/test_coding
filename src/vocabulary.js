export class VocabularyDeck {
  constructor(words) {
    this._words = words
    this._known = new Set()
    this._index = 0
  }

  size() {
    return this._words.length
  }

  getNextCard() {
    const unknown = this._words.filter(w => !this._known.has(w.word))
    if (unknown.length === 0) return null
    const card = unknown[this._index % unknown.length]
    this._index++
    return card
  }

  markKnown(word) {
    this._known.add(word)
  }

  markUnknown(word) {
    this._known.delete(word)
  }

  getProgress() {
    const known = this._known.size
    const total = this._words.length
    const unknown = total - known
    const percent = total === 0 ? 0 : Math.round((known / total) * 100)
    return { known, unknown, total, percent }
  }

  reset() {
    this._known.clear()
    this._index = 0
  }

  isComplete() {
    return this._known.size === this._words.length
  }
}
