DROP TABLE IF EXISTS vote;
DROP TABLE IF EXISTS slot;
DROP TABLE IF EXISTS poll;

CREATE TABLE poll (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    code VARCHAR(10) NOT NULL UNIQUE
);

CREATE TABLE slot (
    id SERIAL PRIMARY KEY,
    poll_id INTEGER NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,

    CONSTRAINT fk_poll FOREIGN KEY (poll_id)
        REFERENCES poll (id)
        ON DELETE CASCADE
);

CREATE TABLE vote (
    id SERIAL PRIMARY KEY,
    slot_id INTEGER NOT NULL,
    participant_name TEXT NOT NULL,
    choice VARCHAR(10) NOT NULL,

    CONSTRAINT fk_slot FOREIGN KEY (slot_id)
        REFERENCES slot (id)
        ON DELETE CASCADE,

    CONSTRAINT unique_vote_per_slot UNIQUE (slot_id, participant_name)
);
