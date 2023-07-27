
import { describe, test, expect } from 'vitest'
import { render, fireEvent, screen } from '@testing-library/react'
import App from '../App'


describe('<App />', () => {

    test('App mounts and should check text from h1', () => {
        const wrapper = render(<App />)
        expect(wrapper).toBeTruthy()

        const h1 = wrapper.container.querySelector('h1')
        expect(h1?.textContent).toBe('RSS FEED')
    }),

        it('Open search bar and click search button', async () => {
            const wrapper = render(<App />)
            const h1 = wrapper.container.querySelector('h1')
            await fireEvent.click(h1);

            const searchBt = screen.getByRole('button', {
                name: /search/i
            })

            fireEvent.click(searchBt);

            //screen.debug();
        }),
        it('Clicks day night button', async () => {
            const wrapper = render(<App />)
            const label = wrapper.container.querySelector('label')
            await fireEvent.click(label);

            fireEvent.click(label);

            screen.debug();
        })

});
