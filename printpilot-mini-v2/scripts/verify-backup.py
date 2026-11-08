#!/usr/bin/env python3
"""Offline D1 SQL restore proof. Reads a remote export without logging any records."""
import hashlib
import json
import os
import sqlite3
import sys
from pathlib import Path

EXPECTED = {"users", "jobs", "machines", "audit_log"}
source = Path(sys.argv[1])
if not source.is_file() or source.stat().st_size == 0:
    raise SystemExit("No nonempty D1 export produced")
sql = source.read_text("utf-8")
dbpath = source.with_suffix(".restored.sqlite")
if dbpath.exists():
    raise SystemExit("Refusing to overwrite existing restore database")
db = sqlite3.connect(str(dbpath))
try:
    db.executescript(sql)
    integrity = db.execute("PRAGMA integrity_check").fetchone()[0]
    if integrity != "ok":
        raise ValueError("SQLite integrity check failed")
    fk_errors = db.execute("PRAGMA foreign_key_check").fetchall()
    if fk_errors:
        raise ValueError("Foreign key check failed")
    tables = {row[0] for row in db.execute("SELECT name FROM sqlite_master WHERE type='table'")}
    missing = EXPECTED - tables
    if missing:
        raise ValueError("Missing tables: " + ",".join(sorted(missing)))
    # Verify ALL values in the restored tables survive another SQLite dump/restore.
    def fingerprint(conn, table):
        columns = conn.execute("PRAGMA table_info(" + json.dumps(table) + ")").fetchall()
        names = [r[1] for r in columns]
        if not names:
            raise ValueError("Empty table schema")
        values = conn.execute("SELECT * FROM " + json.dumps(table)).fetchall()
        hashed = hashlib.sha256()
        for row in sorted((json.dumps([v.hex() if isinstance(v, bytes) else v for v in vals],
                                      ensure_ascii=False, separators=(",", ":"), default=str)
                           for vals in values)):
            hashed.update(row.encode("utf8"))
            hashed.update(b"\n")
        return {"rows": len(values), "columns": names, "sha256": hashed.hexdigest()}
    a = {t: fingerprint(db, t) for t in sorted(EXPECTED)}
    dump = "\n".join(db.iterdump())
    clone = sqlite3.connect(":memory:")
    try:
        clone.executescript(dump)
        b = {t: fingerprint(clone, t) for t in sorted(EXPECTED)}
        if a != b:
            raise ValueError("Restored data differs during independent second restore")
    finally:
        clone.close()
    # Only non-sensitive summary, never SQL / raw user data / hashes of personal records.
    print(json.dumps({"kind": "printpilot-mini-v2-d1-offline-restore",
                      "result": "pass", "integrity": integrity,
                      "foreign_key_violations": len(fk_errors),
                      "tables_verified": sorted(EXPECTED),
                      "counts": {t: a[t]["rows"] for t in sorted(EXPECTED)},
                      "repeat_restore_identical": True,
                      "export_bytes": source.stat().st_size}, sort_keys=True))
finally:
    db.close()
