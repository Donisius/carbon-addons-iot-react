import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import ImageTile from './ImageTile';

describe('ImageTile', () => {
  const mockDelete = jest.fn();
  const mockToggle = jest.fn();

  it('delete button', () => {
    render(
      <ImageTile
        id="my image"
        src=" src: 'path/to/image-a.jpg'"
        toggleImageSelection={mockToggle}
      />
    );
    expect(screen.queryByText('Delete')).toBeNull();

    render(
      <ImageTile
        id="my image"
        src=" src: 'path/to/image-a.jpg'"
        onDelete={mockDelete}
        toggleImageSelection={mockToggle}
      />
    );
    expect(screen.queryByText('Delete')).toBeDefined();
    expect(mockDelete).not.toHaveBeenCalled();
    fireEvent.click(screen.queryByText('Delete'));
    expect(mockDelete).toHaveBeenCalled();
  });
});
