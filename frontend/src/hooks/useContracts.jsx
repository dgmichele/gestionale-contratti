import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

// const LIMIT = 11; // lato backend deve corrispondere a limit default

export function useContracts(limit) {
  const queryClient = useQueryClient();

  // GET - Recupera contratti paginati
 const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['contratti', limit],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await api.get(`/contratti?page=${pageParam}&limit=${limit}`);
      return res.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === limit ? allPages.length + 1 : undefined;
    }
  });

  // Trasformiamo i contratti da tutte le pagine in un unico array piatto
  const contracts = data ? data.pages.flat() : [];

  // POST - Aggiungi contratto
  const addContract = useMutation({
    mutationFn: async (newContract) => {
      const res = await api.post('/contratti', newContract);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['contratti']);
    }
  });

  // PUT - Modifica contratto
  const updateContract = useMutation({
    mutationFn: async ({ id, ...data }) => {
      const res = await api.put(`/contratti/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['contratti']);
    }
  });

  // DELETE - Elimina contratto
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
    contracts,
    isLoading,
    error,
    addContract,
    updateContract,
    deleteContract,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  };
}
