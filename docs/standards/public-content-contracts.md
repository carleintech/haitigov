# Public content contracts

Public institution and service responses use explicit DTOs from
`@haitigov/contracts`. They do not expose Prisma models directly.

Every public service summary carries a stable service ID, owning institution ID,
publication status, and verification status. Detail responses also carry source
provenance. A UI may display a record only through a future API/repository that
enforces these contracts; this phase does not invent service or institution
records.

Haitian Creole (`ht`) is the default public query locale. French, English, and
Spanish are supported as explicit alternatives.
