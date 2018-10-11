import {isEqual} from 'lodash'
import randomKey from './randomKey'

// For a block with _type 'block' (text), join spans where possible
export default function normalizeBlock(block) {
  let newIndex = 0
  if (!block._key) {
    block._key = randomKey(12)
  }
  if (block._type !== 'block') {
    return block
  }
  if (!block.children) {
    block.children = []
  }
  if (!block.markDefs) {
    block.markDefs = []
  }
  const lastChild = block.children.slice(-1)[0]
  block.children = block.children
    .filter((child, index) => {
      const previousChild = block.children[index - 1]
      if (
        previousChild &&
        child._type === 'span' &&
        previousChild._type === 'span' &&
        isEqual(previousChild.marks, child.marks)
      ) {
        if (lastChild && lastChild === child && child.text === '' && block.children.length > 1) {
          return false
        }
        previousChild.text += child.text
        return false
      }
      return child
    })
    .map(child => {
      child._key = `${block._key}${newIndex++}`
      if (!child.marks) {
        child.marks = []
      }
      return child
    })
  return block
}
