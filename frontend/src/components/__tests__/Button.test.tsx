import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from '../Button'

describe('Button', () => {
  it('renders children and responds to click', async () => {
    const user = userEvent.setup()
    const handle = vi.fn()
    render(<Button onClick={handle}>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
    await user.click(screen.getByText('Click me'))
    expect(handle).toHaveBeenCalled()
  })

  it('applies size classes', () => {
    const { container } = render(<Button size="sm">Small</Button>)
    expect(container.firstChild).toHaveClass('text-sm')
  })
})
