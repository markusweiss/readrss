
import { describe, test, expect } from 'vitest'
import React from 'react';
import { render, screen } from '@testing-library/react'
import App from '../App'


describe('<App />', () => {
    test('App mounts and should check text from h1', () => {
        const wrapper = render(<App />)
        expect(wrapper).toBeTruthy()

        const h1 = wrapper.container.querySelector('h1')
        expect(h1?.textContent).toBe('RSS FEED')
    })
});