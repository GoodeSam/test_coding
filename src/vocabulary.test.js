import { describe, it, expect, beforeEach } from 'vitest'
import { VocabularyDeck } from './vocabulary.js'

describe('VocabularyDeck', () => {
  let deck

  beforeEach(() => {
    deck = new VocabularyDeck([
      { word: 'ability', phonetic: '/ə\'bɪlɪtɪ/', definitions: ['n. 能力，才能'], forms: 'ability(10)', totalCount: 10, paperCount: 8, inList: true },
      { word: 'accept', phonetic: '/ək\'sept/', definitions: ['v. 接受，认可'], forms: 'accept(8)', totalCount: 8, paperCount: 7, inList: true },
      { word: 'account', phonetic: '/ə\'kaʊnt/', definitions: ['n. 账户，描述', 'v. 说明，解释'], forms: 'account(6)', totalCount: 6, paperCount: 6, inList: true },
      { word: 'achieve', phonetic: '/ə\'tʃiːv/', definitions: ['v. 完成，达到'], forms: 'achieve(5)', totalCount: 5, paperCount: 5, inList: true },
      { word: 'action', phonetic: '/\'ækʃən/', definitions: ['n. 行动，行为'], forms: 'action(9)', totalCount: 9, paperCount: 7, inList: true },
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
    it('returns a card object with word, phonetic, and definitions', () => {
      const card = deck.getNextCard()
      expect(card).toHaveProperty('word')
      expect(card).toHaveProperty('phonetic')
      expect(card).toHaveProperty('definitions')
      expect(Array.isArray(card.definitions)).toBe(true)
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
