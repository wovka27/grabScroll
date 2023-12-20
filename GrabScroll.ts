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

    this.setCursorStyleValue('grab')
    this.init()
  }

  setCursorStyleValue = (value: string): void => {
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

  setElementChildrenPointerEvents = (flag?: boolean): void => {
    for (const child of <HTMLCollectionOf<HTMLDivElement>>this.element.children) {
      child.style.pointerEvents = flag ? 'none' : 'auto'
    }
  }

  mouseDown = (event: MouseEvent): void => {
    event.preventDefault()
    this.setSavedPageXValue(event.pageX)
    this.saveScrollLeftValue()
  }

  mousewheel = (event: WheelEvent & { wheelDelta: number }): void => {
    event.preventDefault()

    if (this.saved_page_x) return

    const delta: number = Math.max(-1, Math.min(1, event.wheelDelta || -event.detail)) * 100
    this.setScrollLeftValue(this.element.scrollLeft - delta)
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
    this.setElementChildrenPointerEvents(true)
    this.setScrollLeftValue(this.saved_scroll_left + this.saved_page_x - event.pageX)
  }
  init = (): void => {
    this.listeners.forEach((listener) => this.element.addEventListener(...listener))
  }
  destroy = (): void => {
    this.listeners.forEach((listener) => this.element.removeEventListener(...listener))
  }
}
