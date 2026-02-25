import { describe, it, expect, beforeEach } from 'vitest'
import { VocabularyDeck } from './vocabulary.js'

describe('VocabularyDeck', () => {
  let deck

  beforeEach(() => {
    deck = new VocabularyDeck([
      { word: 'ability', definition: 'the power or skill to do something', example: 'She has the ability to learn quickly.' },
      { word: 'accept', definition: 'agree to receive or take something', example: 'Please accept my apology.' },
      { word: 'account', definition: 'a record of money received and spent', example: 'I checked my bank account.' },
      { word: 'achieve', definition: 'to succeed in doing something difficult', example: 'She worked hard to achieve her goal.' },
      { word: 'action', definition: 'the process of doing something', example: 'It is time for action.' },
    ])
  })

  describe('initial state', () => {
    it('holds the provided word list', () => {
      expect(deck.size()).toBe(5)
    })

    it('has zero known words at start', () => {
      expect(deck.getProgress().known).toBe(0)
    })

    it('has all words unknown at start', () => {
      expect(deck.getProgress().unknown).toBe(5)
    })
  })

  describe('getNextCard()', () => {
    it('returns a card object with word, definition, and example', () => {
      const card = deck.getNextCard()
      expect(card).toHaveProperty('word')
      expect(card).toHaveProperty('definition')
      expect(card).toHaveProperty('example')
    })

    it('returns null when all cards are known', () => {
      deck.markKnown('ability')
      deck.markKnown('accept')
      deck.markKnown('account')
      deck.markKnown('achieve')
      deck.markKnown('action')
      expect(deck.getNextCard()).toBeNull()
    })

    it('does not return a known card', () => {
      deck.markKnown('ability')
      const seen = new Set()
      for (let i = 0; i < 10; i++) {
        const card = deck.getNextCard()
        if (card) seen.add(card.word)
      }
      expect(seen.has('ability')).toBe(false)
    })
  })

  describe('markKnown(word)', () => {
    it('increments known count', () => {
      deck.markKnown('ability')
      expect(deck.getProgress().known).toBe(1)
    })

    it('decrements unknown count', () => {
      deck.markKnown('ability')
      expect(deck.getProgress().unknown).toBe(4)
    })

    it('does not double-count marking the same word known twice', () => {
      deck.markKnown('ability')
      deck.markKnown('ability')
      expect(deck.getProgress().known).toBe(1)
    })
  })

  describe('markUnknown(word)', () => {
    it('keeps the word in rotation', () => {
      deck.markKnown('ability')
      deck.markUnknown('ability')
      expect(deck.getProgress().known).toBe(0)
      expect(deck.getProgress().unknown).toBe(5)
    })
  })

  describe('getProgress()', () => {
    it('returns correct percentage', () => {
      deck.markKnown('ability')
      deck.markKnown('accept')
      expect(deck.getProgress().percent).toBe(40)
    })

    it('returns 100% when all words are known', () => {
      deck.markKnown('ability')
      deck.markKnown('accept')
      deck.markKnown('account')
      deck.markKnown('achieve')
      deck.markKnown('action')
      expect(deck.getProgress().percent).toBe(100)
    })
  })

  describe('reset()', () => {
    it('resets all known words back to unknown', () => {
      deck.markKnown('ability')
      deck.markKnown('accept')
      deck.reset()
      expect(deck.getProgress().known).toBe(0)
      expect(deck.getProgress().unknown).toBe(5)
    })
  })

  describe('isComplete()', () => {
    it('returns false when words remain unknown', () => {
      expect(deck.isComplete()).toBe(false)
    })

    it('returns true when all words are known', () => {
      deck.markKnown('ability')
      deck.markKnown('accept')
      deck.markKnown('account')
      deck.markKnown('achieve')
      deck.markKnown('action')
      expect(deck.isComplete()).toBe(true)
    })
  })
})
