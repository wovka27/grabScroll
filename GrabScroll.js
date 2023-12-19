class GrabScroll {
  #saved_page_x = 0
  #saved_scroll_left = 0

  constructor($el) {
    this.element = $el
    this.element.style.cursor = 'grab'
    this.listeners = [
      ['mouseup', this.mouseUp],
      ['mouseleave', this.resetParams],
      ['mousemove', this.mouseMove],
      ['mousedown', this.mouseDown],
      ['mousewheel', this.mousewheel]
    ]

    this.init()
  }

  setCursorStyleValue = (value) => {
    this.element.style.cursor = value
  }
  setScrollLeftValue = (value) => {
    this.element.scrollLeft = value
  }
  setSavedPageXValue = (value) => {
    this.#saved_page_x = value
  }
  saveScrollLeftValue = () => {
    this.#saved_scroll_left = this.element.scrollLeft
  }

  pointerEvents = (flag) => {
    for (const child of this.element.children) {
      if (flag) {
        child.style.pointerEvents = 'none'
      } else {
        child.style.pointerEvents = 'auto'
      }
    }
  }

  mouseDown = (event) => {
    event.preventDefault()
    this.setSavedPageXValue(event.pageX)
    this.saveScrollLeftValue()
  }

  mousewheel = (event) => {
    event.preventDefault()

    if (this.#saved_page_x) return

    const delta = Math.max(-1, Math.min(1, event.wheelDelta || -event.detail)) * 100
    this.setScrollLeftValue(this.element.scrollLeft - delta)
    this.saveScrollLeftValue()
  }

  resetParams = () => {
    this.setSavedPageXValue(0)
    this.setCursorStyleValue('grab')
  }
  mouseUp = () => {
    this.resetParams()
    this.pointerEvents()
  }
  mouseMove = (event) => {
    if (!this.#saved_page_x) return

    this.pointerEvents(true)
    this.setScrollLeftValue(this.#saved_scroll_left + this.#saved_page_x - event.pageX)
    this.setCursorStyleValue('grabbing')
  }
  init = () => {
    this.listeners.forEach((listener) => this.element.addEventListener(...listener))
  }
  destroy = () => {
    this.listeners.forEach((listener) => this.element.removeEventListener(...listener))
  }
}
