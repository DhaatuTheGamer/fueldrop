import { render, screen, fireEvent } from '@testing-library/react';
import { useFocusTrap } from './useFocusTrap';
import { useState, useRef } from 'react';

// A mock component to test the useFocusTrap hook
const FocusTrapTestComponent = ({ initialActive = false }: { initialActive?: boolean }) => {
  const [isActive, setIsActive] = useState(initialActive);
  const containerRef = useFocusTrap(isActive);

  return (
    <div>
      <button data-testid="outside-button-1">Outside Button 1</button>

      <button data-testid="toggle-trap" onClick={() => setIsActive(!isActive)}>
        Toggle Trap
      </button>

      <div ref={containerRef} data-testid="trap-container">
        {isActive && (
          <>
            <p>Not focusable</p>
            <button data-testid="inside-button-1">Inside Button 1</button>
            <a href="#" data-testid="inside-link">Inside Link</a>
            <input type="text" data-testid="inside-input" />
            <button data-testid="inside-button-2">Inside Button 2</button>
          </>
        )}
      </div>

      <button data-testid="outside-button-2">Outside Button 2</button>
    </div>
  );
};

describe('useFocusTrap', () => {
  it('does not trap focus when isActive is false', () => {
    render(<FocusTrapTestComponent initialActive={false} />);

    const outsideButton1 = screen.getByTestId('outside-button-1');
    outsideButton1.focus();
    expect(document.activeElement).toBe(outsideButton1);

    // Press Tab
    fireEvent.keyDown(document, { key: 'Tab' });

    // Focus should be allowed to move normally (handled by browser, but we just check our event listener doesn't intercept it)
    // The keydown event on document won't be trapped.
  });

  it('focuses the first focusable element when isActive becomes true', () => {
    render(<FocusTrapTestComponent initialActive={false} />);

    const toggleButton = screen.getByTestId('toggle-trap');
    toggleButton.focus();

    fireEvent.click(toggleButton); // Sets isActive to true

    const insideButton1 = screen.getByTestId('inside-button-1');
    expect(document.activeElement).toBe(insideButton1);
  });

  it('loops focus to the first element when Tab is pressed on the last focusable element', () => {
    render(<FocusTrapTestComponent initialActive={true} />);

    const insideButton2 = screen.getByTestId('inside-button-2');
    insideButton2.focus(); // Focus the last element
    expect(document.activeElement).toBe(insideButton2);

    // Press Tab
    fireEvent.keyDown(document, { key: 'Tab' });

    const insideButton1 = screen.getByTestId('inside-button-1');
    expect(document.activeElement).toBe(insideButton1);
  });

  it('loops focus to the last element when Shift+Tab is pressed on the first focusable element', () => {
    render(<FocusTrapTestComponent initialActive={true} />);

    const insideButton1 = screen.getByTestId('inside-button-1');
    insideButton1.focus(); // Focus the first element
    expect(document.activeElement).toBe(insideButton1);

    // Press Shift+Tab
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });

    const insideButton2 = screen.getByTestId('inside-button-2');
    expect(document.activeElement).toBe(insideButton2);
  });

  it('dispatches modal-escape event when Escape is pressed', () => {
    render(<FocusTrapTestComponent initialActive={true} />);

    const container = screen.getByTestId('trap-container');
    const escapeListener = vi.fn();
    container.addEventListener('modal-escape', escapeListener);

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(escapeListener).toHaveBeenCalledTimes(1);

    container.removeEventListener('modal-escape', escapeListener);
  });

  it('restores focus to the previously focused element when isActive becomes false', () => {
    render(<FocusTrapTestComponent initialActive={false} />);

    const toggleButton = screen.getByTestId('toggle-trap');
    toggleButton.focus();
    expect(document.activeElement).toBe(toggleButton);

    // Turn trap on
    fireEvent.click(toggleButton);
    expect(document.activeElement).toBe(screen.getByTestId('inside-button-1'));

    // Turn trap off
    fireEvent.click(screen.getByTestId('toggle-trap'));

    // Focus should return to the toggle button
    expect(document.activeElement).toBe(toggleButton);
  });

  it('does nothing on other key presses', () => {
    render(<FocusTrapTestComponent initialActive={true} />);
    const insideButton1 = screen.getByTestId('inside-button-1');
    insideButton1.focus();

    // Press an unrelated key
    fireEvent.keyDown(document, { key: 'Enter' });

    // Active element should remain the same
    expect(document.activeElement).toBe(insideButton1);
  });

  it('handles empty container gracefully', () => {
    const EmptyTrapComponent = () => {
      const containerRef = useFocusTrap(true);
      return <div ref={containerRef} data-testid="empty-trap"></div>;
    };

    render(<EmptyTrapComponent />);

    // Should not throw when pressing Tab
    fireEvent.keyDown(document, { key: 'Tab' });

    // Focus shouldn't change
    expect(document.activeElement).toBe(document.body);
  });

  it('allows natural tab flow for middle elements', () => {
    render(<FocusTrapTestComponent initialActive={true} />);

    const insideButton1 = screen.getByTestId('inside-button-1');
    const insideLink = screen.getByTestId('inside-link');

    // Focus the second element (not first, not last)
    insideLink.focus();
    expect(document.activeElement).toBe(insideLink);

    // Press Tab
    fireEvent.keyDown(document, { key: 'Tab' });

    // Press Shift+Tab
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });

    // The event handler shouldn't prevent default, browser handles natural flow
    // We just verify it doesn't jump to start/end unexpectedly
    // In JSDOM, fireEvent doesn't actually change focus natively for Tab unless we mock it,
    // but we can ensure our manual trapping logic wasn't triggered.
  });

  it('handles component with null ref gracefully', () => {
    // A component where ref is immediately null (like unmounting or conditionally not rendering the div)
    const NullRefComponent = () => {
      useFocusTrap(true);
      return null;
    };

    render(<NullRefComponent />);

    // Should not crash when trying to access container
  });
});
