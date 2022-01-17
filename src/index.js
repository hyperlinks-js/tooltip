import { TEMPLATES } from './lib/_template.js'

export const tooltipInit = (tipOption) => {
  const CURRENTTOOLTIP = {
    isTooltipActive: false,
    tooltip: null
  }

  class Tooltip {
    constructor (imageLink, description, heading, siteURL, tipOption) {
      this.imageLink = imageLink
      this.description = description
      this.heading = heading
      this.siteURL = siteURL
      this.option = tipOption
    }

    getTooltipHTML () {
      const TEMPLATE_HTML = {
        all: `<div class=hyperlinks-container><div class=hyperlinks-img-container><img alt=temp-image src=${this.imageLink}></div><div class=hyperlinks-site-info-container><h2 class=hyperlinks-title>${this.heading}</h2><div class=hyperlinks-sub-title>${this.description}</div><div class=hyperlinks-site-url><span>${this.siteURL}</span></div></div></div>`
      }
      const TEMPLATE = TEMPLATES[this.option]
      if (!TEMPLATE) throw new Error('Template not found')
      return { TEMPLATE_HTML, TEMPLATE }
    }
  }

  document.addEventListener('mouseover', function (event) {
    if (!event.target.classList.contains('hyperlinks')) return

    showTooltip(event.target)
  })

  document.addEventListener('mouseout', function (e) {
    if (e.target.classList.contains('hyperlinks')) {
      CURRENTTOOLTIP.tooltip.remove()
      document.getElementById('hyperlinks-style').remove()
    }
  })

  const showTooltip = (elem) => {
    if (CURRENTTOOLTIP.isTooltipActive) CURRENTTOOLTIP.tooltip.remove()
    const PROPS = JSON.parse(localStorage.getItem(elem.href))
    const TOOLTIP = new Tooltip(
      PROPS['og:image'],
      PROPS['og:description'],
      PROPS['og:title'],
      PROPS['og:url'],
      tipOption
    )

    const HYPERTOOLTIP = document.createElement('div')
    HYPERTOOLTIP.className = 'hyperlinks-tooltip'
    HYPERTOOLTIP.innerHTML = TOOLTIP.getTooltipHTML().TEMPLATE_HTML.all
    document.body.append(HYPERTOOLTIP)
    const HYPERSTYLE = document.createElement('style')
    HYPERSTYLE.innerHTML = TOOLTIP.getTooltipHTML().TEMPLATE
    HYPERSTYLE.id = 'hyperlinks-style'
    document.head.append(HYPERSTYLE)

    // Tooltip positioning calculations start from here;

    const COORDS = elem.getBoundingClientRect()

    const modifiedCoords = {
      left: COORDS.left - HYPERTOOLTIP.clientWidth / 2 + COORDS.width / 2,
      top: COORDS.top + 25
    }

    if (COORDS.top > HYPERTOOLTIP.clientHeight + 25) {
      modifiedCoords.top = COORDS.top - HYPERTOOLTIP.clientHeight - 5
    }

    if (COORDS.left < HYPERTOOLTIP.clientWidth + 25) {
      modifiedCoords.left = COORDS.left
    }
    if (COORDS.right > HYPERTOOLTIP.clientWidth + 25) {
      modifiedCoords.left = COORDS.left - HYPERTOOLTIP.clientWidth + COORDS.width
    }

    HYPERTOOLTIP.style.left = modifiedCoords.left + 'px'
    HYPERTOOLTIP.style.top = modifiedCoords.top + 'px'

    CURRENTTOOLTIP.isTooltipActive = true
    CURRENTTOOLTIP.tooltip = HYPERTOOLTIP
  }
}
