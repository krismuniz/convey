-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

/* customer */
create table if not exists customer (
  id serial primary key,
  google_id text unique not null,
  email varchar (256) unique not null,
  first_name text not null,
  last_name text not null,
  phone_number varchar (64) default null,
  is_admin boolean default false,
  avatar_url text default null,
  text_notifications boolean default true,
  creation_date timestamp with time zone default now(),
  last_login timestamp with time zone default now()
);

-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

/* customer_address */
create table if not exists customer_address (
  id serial primary key,
  customer_id integer references customer(id) on delete cascade,
  label text default null,
  line_1 text not null,
  line_2 text default null,
  city text not null,
  state text not null,
  zip text not null,
  creation_date timestamp with time zone default now()
);

-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

/* status */
create table if not exists status (
  id serial primary key,
  label text not null,
  creation_date timestamp with time zone default now()
);

-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

/* type */
create table if not exists type (
  id serial primary key,
  label text not null,
  ingredient boolean default false,
  creation_date timestamp with time zone default now()
);

-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

/* item */
create table if not exists item (
  id serial primary key,
  type_id integer references type(id) on delete set null,
  children_type_id integer default null references type(id) on delete set null,
  enabled boolean default true,
  name text not null,
  price numeric not null,
  description text default null,
  image_url text default null,
  creation_date timestamp with time zone default now(),
  constraint proper_price check (price >= 0)
);

-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

/* order */
create table if not exists customer_order (
  id serial primary key,
  customer_id integer references customer(id) on delete cascade,
  address_id integer references customer_address(id) on delete set null,
  status_id integer references status(id) on delete set null,
  delivery boolean default true,
  delivery_fee numeric default 0,
  tax_rate numeric default 0,
  paid boolean default false,
  stripe_token json default null,
  stripe_charge json default null,
  creation_date timestamp with time zone default now(),
  comment text default null
);

-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

/* order_group */
create table if not exists order_group (
  id serial primary key,
  customer_order_id integer references customer_order(id) on delete cascade,
  creation_date timestamp with time zone default now(),
  comment text default null
);

-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

/* group_item */
create table if not exists group_item (
  id serial primary key,
  order_group_id integer references order_group(id) on delete cascade,
  item_id integer references item(id) on delete set null,
  creation_date timestamp with time zone default now()
);

-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
