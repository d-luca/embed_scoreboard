import React, { useEffect, useRef, useState } from 'react'
import { HexColorInput, HexColorPicker } from 'react-colorful'
import { createPortal } from 'react-dom'

import { useDebouncedCallback } from 'use-debounce'

type ScreenCoordinates = {
  x: number
  y: number
}

export type ColorPickerProps = {
  colorPickerId?: string
  children: React.ReactNode
  color: string
  setColor: (newColor: string | undefined) => void
}

export function ColorPicker({ children, color, setColor, colorPickerId }: ColorPickerProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [childrenPosition, setChildrenPosition] = useState<ScreenCoordinates>({
    x: -1,
    y: -1
  })
  const [colorPickerPosition, setColorPickerPosition] = useState<ScreenCoordinates>({
    x: -1,
    y: -1
  })
  const [opacity, setOpacity] = useState(0)
  const componentContainerRef = useRef<HTMLDivElement | null>(null)

  // Debounce callback
  const debounced = useDebouncedCallback(
    // function
    (value) => {
      setColor(value)
    },
    // delay in ms
    10
  )

  useEffect(() => {
    document.addEventListener('click', (e) => {
      handleContainerComponentMouseDown(componentContainerRef, e)
    })
    return () => {
      document.removeEventListener('click', (e) => {
        handleContainerComponentMouseDown(componentContainerRef, e)
      })
    }
  }, [])

  useEffect(() => {
    const colorPickerPalette = document.getElementById('color_picker_palette')
    const colorPickerInput = document.getElementById('color_picker_input')

    if (isPickerOpen && colorPickerPalette && colorPickerInput) {
      let top = childrenPosition.y
      let left = childrenPosition.x
      const colorPickerHeight = colorPickerPalette.scrollHeight + colorPickerInput.scrollHeight

      // TOP POSITION
      if (childrenPosition.y - colorPickerHeight < 0) {
        top = 0
      } else {
        top = childrenPosition.y - colorPickerHeight
      }

      // LEFT POSITION
      if (childrenPosition.x - colorPickerPalette.scrollWidth < 0) {
        left = 0
      } else {
        if (childrenPosition.x + colorPickerPalette.scrollWidth > window.innerWidth) {
          left = window.innerWidth - colorPickerPalette.scrollWidth
        } else {
          left = childrenPosition.x
        }
      }

      setColorPickerPosition({ y: top, x: left })
      setOpacity(1)
    } else {
      setColorPickerPosition({ y: -1, x: -1 })
    }
  }, [childrenPosition, isPickerOpen])

  function handleComponentContainerClick() {
    setIsPickerOpen(!isPickerOpen)
    if (isPickerOpen) {
      setOpacity(0)
    }
  }

  function handlePickerClickCapture(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation()
  }

  function handleContainerComponentMouseDown(
    ref: React.MutableRefObject<HTMLDivElement | null>,
    event: MouseEvent
  ) {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setIsPickerOpen(false)
      setOpacity(0)
    }

    setChildrenPosition({
      x: event.clientX - event.offsetX,
      y: event.clientY - event.offsetY
    })
  }

  return (
    <div
      onClick={handleComponentContainerClick}
      ref={componentContainerRef}
      id={colorPickerId}
      className="relative flex size-fit border-none hover:cursor-pointer"
    >
      {children}
      {isPickerOpen &&
        createPortal(
          <div
            className="absolute flex size-fit flex-col items-center justify-center "
            style={{
              top: `${colorPickerPosition.y}px`,
              left: `${colorPickerPosition.x}px`
            }}
          >
            <HexColorPicker
              color={color}
              onChange={(e) => debounced(e)}
              onClickCapture={handlePickerClickCapture}
              id={'color_picker_palette'}
              style={{ opacity }}
            />
            <HexColorInput
              prefixed
              color={color}
              onChange={(e) => debounced(e)}
              onClickCapture={handlePickerClickCapture}
              id={'color_picker_input'}
              style={{
                boxSizing: 'border-box',
                width: '5.625rem',
                padding: '0.375rem',
                border: '0.063rem solid #ddd',
                borderRadius: '4px',
                background: 'white',
                outline: 'none',
                font: 'inherit',
                textTransform: 'uppercase',
                textAlign: 'center',
                opacity
              }}
            />
          </div>,
          document.body
        )}
    </div>
  )
}
