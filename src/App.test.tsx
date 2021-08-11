import { render, screen, within } from '@testing-library/react';
import App from './App';

test('Smoke Tests', () => {
  render(<App />);
  //Expect titlebar to be there
  expect(screen.getByText('m e m e scene')).toBeInTheDocument();
  //Expect main section to be there
  expect(screen.getByRole('main')).toBeInTheDocument();
});

test('Browse Screen', () => {
  render(<App />);
  const main = screen.getByRole('main');
  //Expect main section to be there
  expect(main).toBeInTheDocument();
});


