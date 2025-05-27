import db from '../db.js';

// GET tutti i contratti dell’utente loggato
export async function getContratti(req, res) {
  const userId = req.user.id;

  try {
    const contratti = await db('contratti').where({ utente_id: userId });
    res.json(contratti);
  } catch (err) {
    res.status(500).json({ message: 'Errore nel recupero dei contratti' });
  }
}

// POST - Crea un nuovo contratto
export async function createContratto(req, res) {
  const userId = req.user.id;
  const { nome, cognome, data_scadenza } = req.body;

  if (!nome || !cognome || !data_scadenza) {
    return res.status(400).json({ message: 'Tutti i campi sono obbligatori' });
  }

  try {
    const [nuovoContratto] = await db('contratti')
      .insert({
        utente_id: userId,
        nome,
        cognome,
        data_scadenza
      })
      .returning('*'); // restituisce il contratto creato (PostgreSQL)

    res.status(201).json(nuovoContratto);
  } catch (err) {
    res.status(500).json({ message: 'Errore nella creazione del contratto' });
  }
}

// PUT - Modifica un contratto esistente
export async function updateContratto(req, res) {
  const userId = req.user.id;
  const { id } = req.params;
  const { nome, cognome, data_scadenza } = req.body;

  try {
    const contratto = await db('contratti').where({ id, utente_id: userId }).first();

    if (!contratto) {
      return res.status(404).json({ message: 'Contratto non trovato' });
    }

    const [contrattoAggiornato] = await db('contratti')
      .where({ id })
      .update({ nome, cognome, data_scadenza, updated_at: new Date() })
      .returning('*');

    res.json(contrattoAggiornato);
  } catch (err) {
    res.status(500).json({ message: 'Errore nell\'aggiornamento del contratto' });
  }
}

// DELETE - Elimina un contratto
export async function deleteContratto(req, res) {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const contratto = await db('contratti').where({ id, utente_id: userId }).first();

    if (!contratto) {
      return res.status(404).json({ message: 'Contratto non trovato' });
    }

    await db('contratti').where({ id }).del();
    res.json({ message: 'Contratto eliminato con successo' });
  } catch (err) {
    res.status(500).json({ message: 'Errore nell\'eliminazione del contratto' });
  }
}
