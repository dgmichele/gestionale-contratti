import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

export function useContracts() {
  const queryClient = useQueryClient();

  // GET - Recupera i contratti dell’utente
  const { data: contratti = [], isLoading, error } = useQuery({
    queryKey: ['contratti'],
    queryFn: async () => {
      const res = await api.get('/contratti');
      return res.data;
    }
  });

  // POST - Aggiungi un nuovo contratto
  const addContract = useMutation({
    mutationFn: async (nuovoContratto) => {
      const res = await api.post('/contratti', nuovoContratto);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['contratti']);
    }
  });

  // PUT - Modifica un contratto esistente
  const updateContract = useMutation({
    mutationFn: async ({ id, ...dati }) => {
      const res = await api.put(`/contratti/${id}`, dati);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['contratti']);
    }
  });

  // DELETE - Elimina un contratto
  const deleteContract = useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/contratti/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['contratti']);
    }
  });

  return {
    contratti,
    isLoading,
    error,
    addContract,
    updateContract,
    deleteContract
  };
}
