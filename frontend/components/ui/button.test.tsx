/**
 * Unit tests for Button component
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { Button } from './button'

describe('Button Component', () => {
  it('should render button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('should render with default variant and size', () => {
    render(<Button>Default Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('data-variant', 'default')
    expect(button).toHaveAttribute('data-size', 'default')
  })

  it('should apply destructive variant', () => {
    render(<Button variant="destructive">Delete</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('data-variant', 'destructive')
  })

  it('should apply outline variant', () => {
    render(<Button variant="outline">Outline</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('data-variant', 'outline')
  })

  it('should apply secondary variant', () => {
    render(<Button variant="secondary">Secondary</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('data-variant', 'secondary')
  })

  it('should apply ghost variant', () => {
    render(<Button variant="ghost">Ghost</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('data-variant', 'ghost')
  })

  it('should apply link variant', () => {
    render(<Button variant="link">Link</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('data-variant', 'link')
  })

  it('should apply small size', () => {
    render(<Button size="sm">Small</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('data-size', 'sm')
  })

  it('should apply large size', () => {
    render(<Button size="lg">Large</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('data-size', 'lg')
  })

  it('should apply icon size', () => {
    render(<Button size="icon" aria-label="Icon button" />)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('data-size', 'icon')
  })

  it('should apply custom className', () => {
    render(<Button className="custom-class">Custom</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })

  it('should handle disabled state', () => {
    render(<Button disabled>Disabled</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('should handle onClick event', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    const button = screen.getByRole('button')
    button.click()
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should support button type attribute', () => {
    render(<Button type="submit">Submit</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('type', 'submit')
  })

  it('should render with data-slot attribute', () => {
    render(<Button>Test</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('data-slot', 'button')
  })

  it('should combine variant and size correctly', () => {
    render(<Button variant="destructive" size="lg">Large Destructive</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('data-variant', 'destructive')
    expect(button).toHaveAttribute('data-size', 'lg')
  })

  it('should render children elements', () => {
    render(
      <Button>
        <span>Icon</span>
        <span>Text</span>
      </Button>
    )
    expect(screen.getByText('Icon')).toBeInTheDocument()
    expect(screen.getByText('Text')).toBeInTheDocument()
  })

  it('should handle aria-label for accessibility', () => {
    render(<Button aria-label="Close dialog">×</Button>)
    expect(screen.getByLabelText('Close dialog')).toBeInTheDocument()
  })
})
