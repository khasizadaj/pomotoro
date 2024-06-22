import { Database, Toro, RunDetails } from '$lib/db';

export const load = async () => {
    // Example usage
    const db = new Database();

    // Add a toro
    const toro1 = new Toro(1, 'Study Session #1', 5, 2, false, false);
    db.addToro(toro1);
    const toro2 = new Toro(2, 'Study Session #2', 4, 2, true, false);
    db.addToro(toro2);

    // Set the current timer
    const runDetails = new RunDetails(toro2.id, -1, 1, 8, 1);
    db.setRunDetails(runDetails);

    return {
        db
    }
}
