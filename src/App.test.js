import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import Products from './components/body/products/products';
import App from './main/App';
import '@testing-library/jest-dom/extend-expect';
 
describe('App', () => {
  test('renders App components', () => {
    const initial = render(<Products />);
    render( <App />)
    waitFor(() => initial.toHaveBeenCalledTimes(1)).then(() => {
      expect(screen.getByTestId("card")).toBeTruthy()
      expect(screen.getByTestId("modal")).toBeTruthy()
    })
  });
});
