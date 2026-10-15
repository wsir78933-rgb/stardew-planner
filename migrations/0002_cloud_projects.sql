CREATE TABLE cloud_projects (
  user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  id TEXT NOT NULL,
  title TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 100),
  revision INTEGER NOT NULL CHECK (revision BETWEEN 1 AND 9007199254740991),
  updated_at TEXT NOT NULL,
  map_count INTEGER NOT NULL CHECK (map_count >= 0),
  project_document_json TEXT NOT NULL
    CHECK (length(CAST(project_document_json AS BLOB)) <= 1048576),
  PRIMARY KEY (user_id, id)
) WITHOUT ROWID;
