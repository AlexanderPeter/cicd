import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from './HomePage';

describe('HomePage Component', () => {
  it('renders the banner with correct title', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Terminumfragen');
  });

  it('renders a link to /create with the correct text', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    const link = screen.getByRole('link', { name: /Neue Terminumfrage erstellen/i });
    expect(link).toHaveAttribute('href', '/create');
  });
});
