type GrabScrollMethodType = (...args: any) => InstanceType<typeof GrabScroll>
export default class GrabScroll {
  private saved_page_x: number = 0
  private saved_scroll_left: number = 0
  private $element: HTMLDivElement
  private readonly listeners: Parameters<HTMLDivElement['addEventListener']>[]

  constructor(el: HTMLDivElement) {
    this.$element = el
    this.listeners = [
      ['mouseup', this.mouseUp],
      ['mouseleave', this.resetParams],
      ['mousemove', <EventListener>this.mouseMove],
      ['mousedown', <EventListener>this.mouseDown],
      ['mousewheel', <EventListener>this.mousewheel]
    ]
  }

  getDelta = (value: number): number => {
    return Math.max(-1, Math.min(1, value)) * 100
  }

  setCursorStyleValue: GrabScrollMethodType = (value: string = 'default') => {
    this.$element.style.cursor = value
    return this
  }
  setScrollLeftValue: GrabScrollMethodType = (value: number) => {
    this.$element.scrollLeft = value
    return this
  }
  setSavedPageXValue: GrabScrollMethodType = (value: number) => {
    this.saved_page_x = value
    return this
  }
  saveScrollLeftValue: GrabScrollMethodType = () => {
    this.saved_scroll_left = this.$element.scrollLeft
    return this
  }

  setElementChildrenPointerEvents: GrabScrollMethodType = (value: string = 'auto') => {
    for (const child of <HTMLCollectionOf<HTMLDivElement>>this.$element.children) {
      child.style.pointerEvents = value
    }
    return this
  }

  mouseDown = (event: MouseEvent): void => {
    event.preventDefault()
    this.setSavedPageXValue(event.pageX).saveScrollLeftValue()
  }

  mousewheel = (event: WheelEvent & { wheelDelta: number }): void => {
    event.preventDefault()

    if (this.saved_page_x) return

    this.setScrollLeftValue(
      this.$element.scrollLeft - this.getDelta(event.wheelDelta || -event.detail)
    ).saveScrollLeftValue()
  }

  resetParams: GrabScrollMethodType = () => {
    this.setSavedPageXValue(0).setCursorStyleValue('grab')
    return this
  }
  mouseUp = (): void => {
    this.resetParams().setElementChildrenPointerEvents()
  }
  mouseMove = (event: MouseEvent): void => {
    if (!this.saved_page_x) return

    this.setCursorStyleValue('grabbing')
      .setElementChildrenPointerEvents('none')
      .setScrollLeftValue(this.saved_scroll_left + this.saved_page_x - event.pageX)
  }
  init = (): void => {
    this.setCursorStyleValue('grab')
    this.listeners.forEach((listener) => this.$element.addEventListener(...listener))
  }
  destroy = (): void => {
    this.setCursorStyleValue()
    this.listeners.forEach((listener) => this.$element.removeEventListener(...listener))
  }
}
