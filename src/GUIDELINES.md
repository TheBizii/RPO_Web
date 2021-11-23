# When creating API endpoints and their logic use following rules:

- write all new code using typescript (`*.ts` files) and don't use the `any` type anywhere.  
- use typesafe database access from one file (define the database model class in one place not in multiple).  
- use as little `as` casts as possible.  
- use standard (ts-standard) to check if everything is correct and follow their style
  (camelCase, no one line if statements, ...)
- use ES Modules (import / export) not CommonJS modules (require / module.exports) and import only
  the functions you need, never the default object. Don't export a default object. These helps with
  finding dead code.  
- don't duplicate (copy paste) code but share it beetween files.
- keep functions < 50 lines long. max 70 lines.
- use await / async syntax when possible.
- error handling: Don't catch and rethrow without added value. On error conditions throw Error() or
  throw Error("debug info (some state variables)") (don't use return codes or similar), keep in mind
  the one debugging the error will see the whole stacktrace so don't duplicate information.
