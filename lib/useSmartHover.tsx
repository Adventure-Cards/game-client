import { useRef } from 'react'

export function useSmartHover() {
  const parentRef = useRef<HTMLDivElement>(null)
  const childRef = useRef<HTMLDivElement>(null)

  function handleMouseEnter() {
    if (window && parentRef.current && childRef.current) {
      const newChildCoords = getHoverPosition(parentRef.current, childRef.current)
      childRef.current.style.top = `${newChildCoords.top}px`
      childRef.current.style.left = `${newChildCoords.left}px`
    }
  }

  return { parentRef, childRef, handleMouseEnter }
}

interface ICoords {
  top: number
  left: number
  height: number
  width: number
}

function getHoverPosition(parent: HTMLElement, child: HTMLElement) {
  const parentCoords = getCoords(parent)
  const childCoords = getCoords(child)

  const midpointX = parentCoords.left + parentCoords.width / 2
  const midpointY = parentCoords.top + parentCoords.height / 2

  if (midpointY <= window.innerHeight * 0.15) {
    // parent in top 15% of screen, show child below parent
    let newChildLeft = parentCoords.left - parentCoords.width / 2
    newChildLeft = Math.max(newChildLeft, 0)
    if (newChildLeft + childCoords.width > window.innerWidth) {
      newChildLeft = window.innerWidth - childCoords.width
    }

    const newChildTop = parentCoords.top + parentCoords.height

    return {
      top: newChildTop,
      left: newChildLeft,
    }
  }

  if (midpointY >= window.innerHeight * 0.85) {
    // parent in bottom 15% of screen, show child above parent
    let newChildLeft = parentCoords.left - parentCoords.width / 2
    newChildLeft = Math.max(newChildLeft, 0)
    if (newChildLeft + childCoords.width > window.innerWidth) {
      newChildLeft = window.innerWidth - childCoords.width
    }

    const newChildTop = parentCoords.top - childCoords.height

    return {
      top: newChildTop,
      left: newChildLeft,
    }
  }

  if (midpointX <= window.innerWidth / 2) {
    // parent in left half of screen, show child on right of parent
    const newChildLeft = parentCoords.left + parentCoords.width

    let newChildTop = midpointY - childCoords.height / 2
    newChildTop = Math.max(newChildTop, 0)
    newChildTop = Math.min(newChildTop, window.innerHeight)

    return {
      top: newChildTop,
      left: newChildLeft,
    }
  } else {
    // parent in right half, render on left side of parent
    const newChildLeft = parentCoords.left - childCoords.width

    let newChildTop = midpointY - childCoords.height / 2
    newChildTop = Math.max(newChildTop, 0)
    newChildTop = Math.min(newChildTop, window.innerHeight)

    return {
      top: newChildTop,
      left: newChildLeft,
    }
  }
}

function getCoords(elem: HTMLElement): ICoords {
  const box = elem.getBoundingClientRect()

  const body = document.body
  const docEl = document.documentElement

  const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop
  const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft

  const clientTop = docEl.clientTop || body.clientTop || 0
  const clientLeft = docEl.clientLeft || body.clientLeft || 0

  const top = box.top + scrollTop - clientTop
  const left = box.left + scrollLeft - clientLeft

  const height = box.height
  const width = box.width

  return { top: Math.round(top), left: Math.round(left), height, width }
}
