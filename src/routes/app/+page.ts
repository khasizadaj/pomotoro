import { Database, Toro, RunDetails } from '$lib/db';

export const load = async () => {
    const db = new Database();

    const toro1 = new Toro(1, 'Study Session #1', 5, 3, true, false);
    db.addToro(toro1);
    const toro2 = new Toro(2, 'Study Session #2', 2, 1, false, false);
    db.addToro(toro2);

    const runDetails = new RunDetails(toro1.id, null, 1, 10, 0);
    db.setRunDetails(runDetails);

    return {
        db
    }
}
