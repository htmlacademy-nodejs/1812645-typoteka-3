  @echo on

  SET PGUSER=postgres
  SET PGPASSWORD=Jis69_sdfpo#
  SET BD=typoteka

  psql -a -f db.sql
  pause

  psql --dbname %BD% -a -f schema.sql
  pause
