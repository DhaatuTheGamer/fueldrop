import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { AppProvider, useAppContext } from '../AppContext';
import { vi, describe, it, expect, beforeEach } from 'vitest';

const TestComponent = () => {
  const { user, setUser, vehicles, setVehicles, addNotification, notifications, logout } = useAppContext();

  return (
    <div>
      <div data-testid="user">{user ? user.name : 'No User'}</div>
      <button onClick={() => setUser({ id: '1', name: 'John Doe', phone: '1234567890', joinedDate: '2021-01-01' })}>
        Set User
      </button>

      <div data-testid="vehicles-count">{vehicles.length}</div>
      <button onClick={() => setVehicles([{ id: 'v1', make: 'Toyota', model: 'Corolla', licensePlate: 'ABC-1234', fuelType: 'petrol', color: 'red' }])}>
        Set Vehicles
      </button>

      <div data-testid="notifications-count">{notifications.length}</div>
      <button onClick={() => addNotification('Test', 'Test Message', 'info')}>
        Add Notification
      </button>

      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AppProvider', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('provides initial state and allows updates', () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    expect(screen.getByTestId('user').textContent).toBe('No User');
    act(() => {
      screen.getByText('Set User').click();
    });
    expect(screen.getByTestId('user').textContent).toBe('John Doe');

    expect(screen.getByTestId('vehicles-count').textContent).toBe('0');
    act(() => {
      screen.getByText('Set Vehicles').click();
    });
    expect(screen.getByTestId('vehicles-count').textContent).toBe('1');
  });

  it('handles notifications', () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    expect(screen.getByTestId('notifications-count').textContent).toBe('0');
    act(() => {
      screen.getByText('Add Notification').click();
    });
    expect(screen.getByTestId('notifications-count').textContent).toBe('1');
  });

  it('handles logout and clears state', () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    act(() => {
      screen.getByText('Set User').click();
      screen.getByText('Set Vehicles').click();
    });

    expect(screen.getByTestId('user').textContent).toBe('John Doe');
    expect(screen.getByTestId('vehicles-count').textContent).toBe('1');

    act(() => {
      screen.getByText('Logout').click();
    });

    expect(screen.getByTestId('user').textContent).toBe('No User');
    expect(screen.getByTestId('vehicles-count').textContent).toBe('0');
  });
});
