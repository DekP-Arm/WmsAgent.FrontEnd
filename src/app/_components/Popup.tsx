import { useEffect } from 'react';

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  content: React.ReactNode;
}

export function Popup({ isOpen, onClose, content }: PopupProps) {
  // Close the popup when the escape key is pressed
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Close the popup when clicking outside the popup content
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 " onClick={handleOverlayClick}>
      <div className="w-full max-w-screen-lg p-4 bg-white rounded-lg shadow-lg">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          &times;
        </button>
        {content}
      </div>
    </div>
  );
}
