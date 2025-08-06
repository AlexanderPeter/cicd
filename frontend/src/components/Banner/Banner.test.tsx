import React from 'react';
import { render, screen } from '@testing-library/react';
import Banner from './Banner';

describe('Banner Component', () => {
  it('renders with default title', () => {
    render(<Banner />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Title');
  });

  it('renders with a custom title', () => {
    const customTitle = 'Mein Banner';
    render(<Banner title={customTitle} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(customTitle);
  });

  it('has the correct id and CSS class', () => {
    render(<Banner />);
    const bannerDiv = screen.getByRole('heading', { level: 1 }).parentElement;
    expect(bannerDiv).toHaveAttribute('id', 'banner');
    expect(bannerDiv?.className).toMatch(/banner/);
  });

  it('the banner link points to "/"', () => {
    render(<Banner />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/');
  });
});
