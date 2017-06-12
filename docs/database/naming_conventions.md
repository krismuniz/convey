## Naming Conventions

* Singular snake_case names for tables. E.g. `customer_address`
* Singular snake_case names for columns. E.g. `phone_number`
* Always use names that make sense and are descriptive of their purpose
* Single column primary key fields should *always* be named `id`
* Use the following pattern for constraints and indexes: `{tablename}_{columnname(s)}_{suffix}` where the suffix is one of the following:
  * `pkey` for a Primary Key constraint
  * `key` for a Unique constraint
  * `excl` for an Exclusion constraint
  * `idx` for any other kind of index
  * `fkey` for a Foreign key
  * `check` for a Check constraint
  * `seq` for all sequences
