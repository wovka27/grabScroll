class GrabScroll {
  #saved_page_x = 0
  #saved_scroll_left = 0

  constructor(options) {
    this.$element = options.el
    this.listeners = [
      ['mouseup', this.mouseUp],
      ['mouseleave', this.resetParams],
      ['mousemove', this.mouseMove],
      ['mousedown', this.mouseDown]
    ]

    this.addEventByCondition([
      [
        options.wheelEvent,
        [/Firefox/i.test(navigator.userAgent) ? 'DOMMouseScroll' : 'mousewheel', this.mousewheel]
      ]
    ])
  }

  addEventByCondition = (values) => {
    values.forEach(([flag, event]) => flag && this.listeners.push(event))
  }

  getDelta = (value) => {
    return Math.max(-1, Math.min(1, value)) * 100
  }

  setCursorStyleValue = (value = 'default') => {
    this.$element.style.cursor = value
    return this
  }
  setScrollLeftValue = (value) => {
    this.$element.scrollLeft = value
    return this
  }
  setSavedPageXValue = (value) => {
    this.#saved_page_x = value
    return this
  }
  saveScrollLeftValue = () => {
    this.#saved_scroll_left = this.$element.scrollLeft
    return this
  }
  resetParams = () => {
    this.setSavedPageXValue(0).setCursorStyleValue('grab')
    return this
  }

  setElementChildrenPointerEvents = (value = 'auto') => {
    for (const child of this.$element.children) {
      child.style.pointerEvents = value
    }
    return this
  }

  mouseDown = (event) => {
    event.preventDefault()
    this.setSavedPageXValue(event.pageX).saveScrollLeftValue()
  }

  mousewheel = (event) => {
    event.preventDefault()

    if (this.#saved_page_x) return

    this.setScrollLeftValue(
      this.$element.scrollLeft - this.getDelta(event.wheelDelta || -event.detail)
    ).saveScrollLeftValue()
  }

  mouseUp = () => {
    this.resetParams().setElementChildrenPointerEvents()
  }
  mouseMove = (event) => {
    if (!this.#saved_page_x) return

    this.setCursorStyleValue('grabbing')
      .setElementChildrenPointerEvents('none')
      .setScrollLeftValue(this.#saved_scroll_left + this.#saved_page_x - event.pageX)
  }
  init = () => {
    this.setCursorStyleValue('grab').listeners.forEach((listener) => this.$element.addEventListener(...listener))
  }
  destroy = () => {
    this.setCursorStyleValue().listeners.forEach((listener) => this.$element.removeEventListener(...listener))
  }
}
