class GrabScroll {
  #saved_page_x = 0
  #saved_scroll_left = 0

  constructor($el) {
    this.element = $el
    this.listeners = [
      ['mouseup', this.mouseUp],
      ['mouseleave', this.resetParams],
      ['mousemove', this.mouseMove],
      ['mousedown', this.mouseDown],
      ['mousewheel', this.mousewheel]
    ]
  }

  setCursorStyleValue = (value = 'default') => {
    this.element.style.cursor = value
  }
  setScrollLeftValue = value => {
    this.element.scrollLeft = value
  }
  setSavedPageXValue = value => {
    this.#saved_page_x = value
  }
  saveScrollLeftValue = () => {
    this.#saved_scroll_left = this.element.scrollLeft
  }

  setElementChildrenPointerEvents = (value = 'auto') => {
    for (const child of this.element.children) {
      child.style.pointerEvents = value
    }
  }

  mouseDown = event => {
    event.preventDefault()
    this.setSavedPageXValue(event.pageX)
    this.saveScrollLeftValue()
  }

  getDelta = value => {
    return Math.max(-1, Math.min(1, value)) * 100
  }

  mousewheel = event => {
    event.preventDefault()

    if (this.#saved_page_x) return

    this.setScrollLeftValue(this.element.scrollLeft - this.getDelta(event.wheelDelta || -event.detail))
    this.saveScrollLeftValue()
  }

  resetParams = () => {
    this.setSavedPageXValue(0)
    this.setCursorStyleValue('grab')
  }
  mouseUp = () => {
    this.resetParams()
    this.setElementChildrenPointerEvents()
  }
  mouseMove = event => {
    if (!this.#saved_page_x) return

    this.setCursorStyleValue('grabbing')
    this.setElementChildrenPointerEvents('none')
    this.setScrollLeftValue(this.#saved_scroll_left + this.#saved_page_x - event.pageX)
  }
  init = () => {
    this.setCursorStyleValue('grab')
    this.listeners.forEach(listener => this.element.addEventListener(...listener))
  }
  destroy = () => {
    this.setCursorStyleValue()
    this.listeners.forEach(listener => this.element.removeEventListener(...listener))
  }
}