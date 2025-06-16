import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from './Navbar';

describe('Navbar', () => {
  test.skip('renders navbar', () => {
    render(<Navbar />);
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  test.skip('renders logo', () => {
    render(<Navbar />);
    expect(screen.getByTestId('logo')).toBeInTheDocument();
  });

  test.skip('renders navigation links', () => {
    render(<Navbar />);
    expect(screen.getByTestId('nav-links')).toBeInTheDocument();
  });

  test.skip('renders home link', () => {
    render(<Navbar />);
    expect(screen.getByTestId('home-link')).toBeInTheDocument();
  });

  test.skip('renders about link', () => {
    render(<Navbar />);
    expect(screen.getByTestId('about-link')).toBeInTheDocument();
  });

  test.skip('renders contact link', () => {
    render(<Navbar />);
    expect(screen.getByTestId('contact-link')).toBeInTheDocument();
  });

  test.skip('renders theme toggle', () => {
    render(<Navbar />);
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
  });

  test.skip('toggles theme when theme toggle is clicked', () => {
    render(<Navbar />);
    const themeToggle = screen.getByTestId('theme-toggle');
    fireEvent.click(themeToggle);
    expect(document.documentElement).toHaveClass('dark');
  });

  test.skip('renders mobile menu button', () => {
    render(<Navbar />);
    expect(screen.getByTestId('mobile-menu-button')).toBeInTheDocument();
  });

  test.skip('toggles mobile menu when button is clicked', () => {
    render(<Navbar />);
    const mobileMenuButton = screen.getByTestId('mobile-menu-button');
    fireEvent.click(mobileMenuButton);
    expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
  });

  test.skip('closes mobile menu when link is clicked', () => {
    render(<Navbar />);
    const mobileMenuButton = screen.getByTestId('mobile-menu-button');
    fireEvent.click(mobileMenuButton);
    const homeLink = screen.getByTestId('home-link');
    fireEvent.click(homeLink);
    expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
  });
}); 