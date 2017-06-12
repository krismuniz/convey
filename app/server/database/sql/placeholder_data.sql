-- type
insert into type (id, label, ingredient) values
  (1, 'Plato principal', false),
  (2, 'Ingrediente ', true),
  (3, 'Ingrediente de relleno', true),
  (4, 'Bebida', false),
  (5, 'Postre', false)
  on conflict (id) do nothing;

-- status
insert into status (id, label) values
  (1, 'Recibida'),
  (2, 'En proceso'),
  (3, 'De camino a entregar'),
  (4, 'Lista para recogido'),
  (5, 'Completada')
  on conflict (id) do nothing;

-- item
insert into item (id, type_id, children_type_id, name, price, description, image_url) values
  (1, 1, 2, 'Pizza personal', 499, 'Pizza personal de diez pulgadas con los toppings que quieras.', '/images/personal_pizza.jpg'),
  (2, 1, 2, 'Pizza mediana', 999, 'Pizza regular al estilo único de Rambitos. Doce pulgadas de diámetro dividida en 8 pedazos. Perfecta para grupos de 3 o 4 personas.', '/images/medium_pizza.png'),
  (3, 1, 2, 'Pizza familiar', 1199, 'Pizza enorme al estilo único de Rambitos. Nada más que 16 pulgadas de diámetro dividida en 12 pedazos con los toppings que quieras. ¡Ideal para familias!', '/images/family_pizza.jpg'),
  (4, 2, null, 'Pepperoni', 99, null, null),
  (5, 2, null, 'Chorizo', 99, null, null),
  (6, 2, null, 'Pollo', 199, null, null),
  (7, 4, null, 'Coca-Cola™', 199, null, '/images/coca_cola_2ltrs.jpeg'),
  (8, 4, null, 'Sprite™', 199, null, '/images/sprite_2ltrs.jpg'),
  (9, 1, 3, 'Calzone', 199, 'Estilo napolitano de pizza de queso mozarella, envuelta en masa de harina de alta calidad y horneada a la perfección. Con el relleno que desees.', '/images/calzone.jpg'),
  (10, 1, 2, 'Papa asada', 299, 'Papa 100% organica, horneada a la perfección. Acompáñala con los toppings que quieras.', '/images/baked_potato.jpg'),
  (11, 4, null, 'Fanta Orange™', 199, null, '/images/fanta_orange_2ltrs.jpeg'),
  (12, 4, null, 'Fanta Pineapple™', 199, null, '/images/fanta_pineapple_2ltrs.png')
  on conflict (id) do nothing;
