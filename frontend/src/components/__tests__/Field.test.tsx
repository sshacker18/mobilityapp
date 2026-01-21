import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Field from '../Field'

describe('Field', () => {
  it('renders label and input and calls onChange', async () => {
    const user = userEvent.setup()
    const handle = vi.fn()
    render(<Field label="Phone" value="" onChange={handle} />)
    expect(screen.getByText('Phone')).toBeInTheDocument()
    await user.type(screen.getByRole('textbox'), '9')
    expect(handle).toHaveBeenCalled()
  })
})
