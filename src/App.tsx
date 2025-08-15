import React, { useState, useEffect } from 'react';
import RegistrationForm from './components/RegistrationForm';
import ParticipantTable from './components/ParticipantTable';
import { supabase } from './lib/supabase';

interface Competition {
  id: string;
  name: string;
  category: string;
  description?: string;
  max_participants?: number;
  created_at?: string;
}

interface Participant {
  id: string;
  block: string;
  house_number: string;
  registration_date?: string;
  created_at?: string;
}

function App() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch competitions
      const { data: competitionsData, error: competitionsError } = await supabase
        .from('competitions')
        .select('*')
        .order('created_at', { ascending: false });

      if (competitionsError) {
        console.error('Error fetching competitions:', competitionsError);
      } else {
        setCompetitions(competitionsData || []);
      }

      // Fetch participants
      const { data: participantsData, error: participantsError } = await supabase
        .from('participants')
        .select('*')
        .order('created_at', { ascending: false });

      if (participantsError) {
        console.error('Error fetching participants:', participantsError);
      } else {
        setParticipants(participantsData || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrationSuccess = () => {
    fetchData(); // Refresh data after successful registration
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Competition Registration System
          </h1>
          <p className="text-lg text-gray-600">
            Register for competitions and view participants
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Register for Competition
            </h2>
            <RegistrationForm 
              competitions={competitions}
              onSuccess={handleRegistrationSuccess}
            />
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Registered Participants
            </h2>
            <ParticipantTable participants={participants} />
          </div>
        </div>

        {competitions.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Available Competitions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {competitions.map((competition) => (
                <div key={competition.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">
                    {competition.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Category: <span className="capitalize">{competition.category.replace('_', ' ')}</span>
                  </p>
                  {competition.description && (
                    <p className="text-sm text-gray-600 mb-2">
                      {competition.description}
                    </p>
                  )}
                  {competition.max_participants && (
                    <p className="text-sm text-gray-500">
                      Max participants: {competition.max_participants}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;