import sqlite3 from 'sqlite3';

const db = new sqlite3.Database(
    './chat-app.db',
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
        } else {
            console.log('Database opened successfully');
        }
    }
);

db.serialize(() => {
    db.run(
        `
        CREATE TABLE IF NOT EXISTS rooms (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            roomId TEXT UNIQUE NOT NULL
        )
    `,
        (err) => {
            if (err) {
                console.error('Error creating rooms table:', err.message);
            } else {
                console.log('Rooms table is ready');
            }
        }
    );

    db.run(
        `
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            roomId TEXT NOT NULL,
            sender TEXT NOT NULL,
            message TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (roomId) REFERENCES rooms(roomId)
        )
    `,
        (err) => {
            if (err) {
                console.error('Error creating messages table:', err.message);
            } else {
                console.log('Messages table is ready');
            }
        }
    );
});

export default db;
