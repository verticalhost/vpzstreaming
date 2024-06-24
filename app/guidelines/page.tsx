import React from 'react';
import { Separator } from '@/components/ui/separator'; // Assurez-vous que le chemin est correct

const GuidelinesPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">Guidelines</h1>
      <Separator />
      <div className="mt-4 space-y-4">
        <p>Bienvenue sur notre site. Voici les règlements que vous devez suivre :</p>
        <ul className="list-disc list-inside">
          <li>Règle 1</li>
          <li>Règle 2</li>
          <li>Règle 3</li>
          {/* Ajoutez autant de règles que nécessaire */}
        </ul>
      </div>
    </div>
  );
};

export default GuidelinesPage;
