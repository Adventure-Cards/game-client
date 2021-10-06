import React, { useState, useRef, useEffect } from 'react'

/*
  useSmartHover returns a component definition and an instance of props for
  a trigger and a detail component:

  function CardWithDetailOnHover() {
    const { HoverTrigger, hoverTriggerProps, HoverDetail, hoverDetailProps } = useSmartHover()
  
    return (
      <>
        <HoverTrigger {...hoverTriggerProps}>
          <CardPreview />
        </HoverTrigger/>
        <HoverDetail {...hoverDetailProps}>
          <CardDetail />
        </HoverDetail>
      </>
    )
  }
*/
export function useSmartHover() {
  const triggerRef = useRef<HTMLDivElement>(null)
  const detailRef = useRef<HTMLDivElement>(null)

  const [visible, setVisible] = useState(false)

  function handleMouseEnter() {
    if (window && triggerRef.current && detailRef.current) {
      const newDetailCoords = getHoverPosition(triggerRef.current, detailRef.current)
      detailRef.current.style.top = `${newDetailCoords.top}px`
      detailRef.current.style.left = `${newDetailCoords.left}px`
    }
  }

  useEffect(() => {
    if (triggerRef.current) {
    }
  }, [triggerRef])

  return {
    hoverTriggerProps: { ref: triggerRef, setVisible, handleMouseEnter },
    HoverTrigger,
    hoverDetailProps: { ref: detailRef, visible },
    HoverDetail,
  }
}

interface HoverTriggerProps {
  setVisible: (visible: boolean) => void
  handleMouseEnter: () => void
}

const HoverTrigger = React.forwardRef<HTMLDivElement, HoverTriggerProps>(
  ({ setVisible, handleMouseEnter, ...props }, ref) => {
    // when the trigger unmounts, should set detail to invisible
    useEffect(() => {
      return () => {
        setVisible(false)
      }
    }, [])

    return (
      <div
        ref={ref}
        onMouseEnter={() => {
          setVisible(true)
          handleMouseEnter()
        }}
        onMouseLeave={() => {
          setVisible(false)
        }}
      >
        {props.children}
      </div>
    )
  }
)

interface HoverDetailProps {
  visible: boolean
}

const HoverDetail = React.forwardRef<HTMLDivElement, HoverDetailProps>(({ visible, ...props }, ref) => {
  return (
    <div ref={ref} className={`absolute z-50 p-2 ${visible ? 'visible' : 'invisible'}`}>
      {props.children}
    </div>
  )
})

interface ICoords {
  top: number
  left: number
  height: number
  width: number
}

function getHoverPosition(trigger: HTMLElement, detail: HTMLElement) {
  const triggerCoords = getCoords(trigger)
  const detailCoords = getCoords(detail)

  const midpointY = triggerCoords.top + triggerCoords.height / 2

  // try to put the detail on the right side of the trigger
  let newDetailTop = midpointY - detailCoords.height / 2
  if (newDetailTop < 0) {
    newDetailTop = 0
  }
  if (newDetailTop + detailCoords.height > window.innerHeight) {
    newDetailTop = window.innerHeight - detailCoords.height
  }
  let newDetailLeft = triggerCoords.left + triggerCoords.width

  // if the detail is going to overflow off the right side of the viewport,
  // put it on the left side of the trigger instead
  if (newDetailLeft + detailCoords.width > window.innerWidth) {
    newDetailLeft = triggerCoords.left - detailCoords.width
  }

  return {
    top: newDetailTop,
    left: newDetailLeft,
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
