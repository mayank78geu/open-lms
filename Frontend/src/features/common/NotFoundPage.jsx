import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Home } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-page flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-extrabold text-2xl mb-4">
        404
      </div>
      <h1 className="text-3xl font-extrabold text-ink mb-2">Page Not Found</h1>
      <p className="text-sm text-ink-muted max-w-sm mb-6">
        The page you are looking for doesn't exist or has moved to another learning space.
      </p>
      <Link to="/">
        <Button variant="primary" size="md" icon={Home}>
          Return to CampusFlow
        </Button>
      </Link>
    </div>
  );
}
E