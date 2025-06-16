import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('Header', () => {
  test.skip('renders header', () => {
    render(<Header />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  test.skip('renders logo', () => {
    render(<Header />);
    expect(screen.getByTestId('header-logo')).toBeInTheDocument();
  });

  test.skip('renders title', () => {
    render(<Header />);
    expect(screen.getByTestId('header-title')).toBeInTheDocument();
  });

  test.skip('renders description', () => {
    render(<Header />);
    expect(screen.getByTestId('header-description')).toBeInTheDocument();
  });

  test.skip('renders call to action button', () => {
    render(<Header />);
    expect(screen.getByTestId('cta-button')).toBeInTheDocument();
  });

  test.skip('renders hero image', () => {
    render(<Header />);
    expect(screen.getByTestId('hero-image')).toBeInTheDocument();
  });
}); 