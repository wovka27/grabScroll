export default class GrabScroll {
  private saved_page_x: number = 0
  private saved_scroll_left: number = 0
  private element: HTMLDivElement
  private readonly listeners: Parameters<HTMLDivElement['addEventListener']>[]

  constructor($el: HTMLDivElement) {
    this.element = $el
    this.listeners = [
      ['mouseup', this.mouseUp],
      ['mouseleave', this.resetParams],
      ['mousemove', <EventListener>this.mouseMove],
      ['mousedown', <EventListener>this.mouseDown],
      ['mousewheel', <EventListener>this.mousewheel]
    ]
  }

  setCursorStyleValue = (value: string = 'default'): void => {
    this.element.style.cursor = value
  }
  setScrollLeftValue = (value: number): void => {
    this.element.scrollLeft = value
  }
  setSavedPageXValue = (value: number): void => {
    this.saved_page_x = value
  }
  saveScrollLeftValue = (): void => {
    this.saved_scroll_left = this.element.scrollLeft
  }

  setElementChildrenPointerEvents = (value: string = 'auto'): void => {
    for (const child of <HTMLCollectionOf<HTMLDivElement>>this.element.children) {
      child.style.pointerEvents = value
    }
  }

  mouseDown = (event: MouseEvent): void => {
    event.preventDefault()
    this.setSavedPageXValue(event.pageX)
    this.saveScrollLeftValue()
  }

  getDelta = (value: number): number => {
    return Math.max(-1, Math.min(1, value)) * 100
  }

  mousewheel = (event: WheelEvent & { wheelDelta: number }): void => {
    event.preventDefault()

    if (this.saved_page_x) return

    this.setScrollLeftValue(this.element.scrollLeft - this.getDelta(event.wheelDelta || -event.detail))
    this.saveScrollLeftValue()
  }

  resetParams = (): void => {
    this.setSavedPageXValue(0)
    this.setCursorStyleValue('grab')
  }
  mouseUp = (): void => {
    this.resetParams()
    this.setElementChildrenPointerEvents()
  }
  mouseMove = (event: MouseEvent): void => {
    if (!this.saved_page_x) return

    this.setCursorStyleValue('grabbing')
    this.setElementChildrenPointerEvents('none')
    this.setScrollLeftValue(this.saved_scroll_left + this.saved_page_x - event.pageX)
  }
  init = (): void => {
    this.setCursorStyleValue('grab')
    this.listeners.forEach((listener) => this.element.addEventListener(...listener))
  }
  destroy = (): void => {
    this.setCursorStyleValue()
    this.listeners.forEach((listener) => this.element.removeEventListener(...listener))
  }
}
