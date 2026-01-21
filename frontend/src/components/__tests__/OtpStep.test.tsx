import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import OtpStep from '../OtpStep'

describe('OtpStep', () => {
  it('auto-submits when all digits are entered', async () => {
    const onVerify = vi.fn().mockResolvedValue(true)
    const onResend = vi.fn()
    const user = userEvent.setup()

    render(<OtpStep onVerify={onVerify} onResend={onResend} cooldown={0} />)

    const inputs = screen.getAllByLabelText(/OTP digit/i)
    await user.type(inputs[0], '1234')

    await waitFor(() => {
      expect(onVerify).toHaveBeenCalledWith('1234')
    })
  })
})
