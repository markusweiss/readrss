import { describe, test, expect } from 'vitest'
import { render } from '@testing-library/react'
import FeedBox from '../components/FeedBox/FeedBox';


describe('<FeedBox />', () => {
    test('Render FeedBox', () => {
        const wrapper = render(<FeedBox handleChange={undefined} handleKeyDown={undefined} handleUri={function (): void {
            throw new Error('Function not implemented.')
        }} defaultText={''} />)
        expect(wrapper).toBeTruthy()
    })
});