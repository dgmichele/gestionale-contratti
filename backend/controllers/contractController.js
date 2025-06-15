import db from '../db.js';

// GET tutti i contratti dell’utente loggato
export async function getContracts(req, res) {
  const userId = req.user.id;

  // Paginazione risultati
  const page = parseInt(req.query.page) || 1; // recupera pagina
  const limit = parseInt(req.query.limit) || 11; // recupera max risultati
  const offset = (page - 1) * limit; // calcolo offset

  try {
    const contract = await db('contratti')
      .where({ utente_id: userId })
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);

    res.json(contract);
  } catch (err) {
    res.status(500).json({ message: 'Errore nel recupero dei contratti' });
  }
}

// POST - Crea un nuovo contratto
export async function createContract(req, res) {
  const userId = req.user.id;
  const { nome, cognome, data_scadenza } = req.body;

  if (!nome || !cognome || !data_scadenza) {
    return res.status(400).json({ message: 'Tutti i campi sono obbligatori' });
  }

  try {
    const [newContract] = await db('contratti')
      .insert({
        utente_id: userId,
        nome,
        cognome,
        data_scadenza
      })
      .returning('*'); // restituisce il contratto creato (PostgreSQL)

    res.status(201).json(newContract);
  } catch (err) {
    res.status(500).json({ message: 'Errore nella creazione del contratto' });
  }
}

// PUT - Modifica un contratto esistente
export async function updateContract(req, res) {
  const userId = req.user.id;
  const { id } = req.params;
  const { nome, cognome, data_scadenza } = req.body;

  try {
    const contract = await db('contratti').where({ id, utente_id: userId }).first();

    if (!contract) {
      return res.status(404).json({ message: 'Contratto non trovato' });
    }

    const [updatedContract] = await db('contratti')
      .where({ id })
      .update({ nome, cognome, data_scadenza, updated_at: new Date() })
      .returning('*');

    res.json(updatedContract);
  } catch (err) {
    res.status(500).json({ message: 'Errore nell\'aggiornamento del contratto' });
  }
}

// DELETE - Elimina un contratto
export async function deleteContract(req, res) {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const contract = await db('contratti').where({ id, utente_id: userId }).first();

    if (!contract) {
      return res.status(404).json({ message: 'Contratto non trovato' });
    }

    await db('contratti').where({ id }).del();
    res.json({ message: 'Contratto eliminato con successo' });
  } catch (err) {
    res.status(500).json({ message: 'Errore nell\'eliminazione del contratto' });
  }
}
